//! XO brand environment fallback (mirrors `packages/shared/src/xo-brand-env.ts`):
//! `XO_<NAME>` is preferred when set to a non-blank value, otherwise the legacy
//! `PAPERCLIP_<NAME>` is honored.

use std::ffi::{OsStr, OsString};

pub(crate) const XO_PREFIX: &str = "XO_";
pub(crate) const LEGACY_PREFIX: &str = "PAPERCLIP_";

fn is_non_blank(value: &OsStr) -> bool {
    match value.to_str() {
        Some(text) => !text.trim().is_empty(),
        None => !value.is_empty(),
    }
}

/// Returns the environment key that holds the effective value for `name`.
fn resolve_brand_env_key(
    name: &str,
    lookup: impl Fn(&str) -> Option<OsString>,
) -> Option<(String, OsString)> {
    let xo_key = format!("{XO_PREFIX}{name}");
    if let Some(value) = lookup(&xo_key).filter(|value| is_non_blank(value)) {
        return Some((xo_key, value));
    }
    let legacy_key = format!("{LEGACY_PREFIX}{name}");
    lookup(&legacy_key).map(|value| (legacy_key, value))
}

/// Process-environment key holding the effective value for `name`, if any.
pub(crate) fn brand_env_key(name: &str) -> Option<String> {
    resolve_brand_env_key(name, |key| std::env::var_os(key)).map(|(key, _)| key)
}

pub(crate) fn read_brand_env_os(name: &str) -> Option<OsString> {
    resolve_brand_env_key(name, |key| std::env::var_os(key)).map(|(_, value)| value)
}

pub(crate) fn read_brand_env(name: &str) -> Option<String> {
    read_brand_env_os(name).and_then(|value| value.into_string().ok())
}

/// For a legacy `PAPERCLIP_<NAME>` key, reads `XO_<NAME>` first; other keys are
/// read as-is.
pub(crate) fn read_env_with_brand_fallback(key: &str) -> Option<OsString> {
    match key.strip_prefix(LEGACY_PREFIX) {
        Some(name) if !name.is_empty() => read_brand_env_os(name),
        _ => std::env::var_os(key),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashMap;

    fn lookup(pairs: &[(&str, &str)]) -> impl Fn(&str) -> Option<OsString> {
        let map: HashMap<String, OsString> = pairs
            .iter()
            .map(|(key, value)| (key.to_string(), OsString::from(value)))
            .collect();
        move |key| map.get(key).cloned()
    }

    #[test]
    fn prefers_xo_value() {
        let env = lookup(&[("XO_RUN_ID", "xo"), ("PAPERCLIP_RUN_ID", "legacy")]);
        assert_eq!(
            resolve_brand_env_key("RUN_ID", env),
            Some(("XO_RUN_ID".to_string(), OsString::from("xo")))
        );
    }

    #[test]
    fn falls_back_to_legacy_value() {
        let env = lookup(&[("PAPERCLIP_RUN_ID", "legacy")]);
        assert_eq!(
            resolve_brand_env_key("RUN_ID", env),
            Some(("PAPERCLIP_RUN_ID".to_string(), OsString::from("legacy")))
        );
    }

    #[test]
    fn blank_xo_value_falls_back_to_legacy() {
        let env = lookup(&[("XO_RUN_ID", "  "), ("PAPERCLIP_RUN_ID", "legacy")]);
        assert_eq!(
            resolve_brand_env_key("RUN_ID", env).map(|(_, value)| value),
            Some(OsString::from("legacy"))
        );
    }

    #[test]
    fn missing_in_both_is_none() {
        assert_eq!(resolve_brand_env_key("RUN_ID", lookup(&[])), None);
    }
}
