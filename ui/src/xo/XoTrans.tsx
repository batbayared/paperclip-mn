import type { ReactElement } from "react";
import { Trans } from "react-i18next";
import { i18n } from "@/i18n";
import { XO_NS } from "@/i18n/xo";

type TransComponents = readonly ReactElement[] | Readonly<Record<string, ReactElement>>;

export function XoTrans({
  i18nKey,
  values,
  components,
}: {
  i18nKey: string;
  values?: Record<string, unknown>;
  components?: TransComponents;
}) {
  return (
    <Trans
      i18n={i18n}
      ns={XO_NS}
      i18nKey={i18nKey}
      defaults={i18nKey}
      values={values}
      components={components}
      tOptions={{ keySeparator: false, nsSeparator: false }}
    />
  );
}
