import { Database, Gauge, ReceiptText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { tx } from "@/i18n/xo";

function getSurfaces() {
  return [
  {
    title: tx("Inference ledger"),
    description: tx("Request-scoped usage and billed runs from cost_events."),
    icon: Database,
    points: [tx("tokens + billed dollars"), tx("provider, biller, model"), tx("subscription and overage aware")],
    tone: "from-sky-500/12 via-sky-500/6 to-transparent",
  },
  {
    title: tx("Finance ledger"),
    description: tx("Account-level charges that are not one prompt-response pair."),
    icon: ReceiptText,
    points: [tx("top-ups, refunds, fees"), tx("Bedrock provisioned or training charges"), tx("credit expiries and adjustments")],
    tone: "from-amber-500/14 via-amber-500/6 to-transparent",
  },
  {
    title: tx("Live quotas"),
    description: tx("Provider or biller windows that can stop traffic in real time."),
    icon: Gauge,
    points: [tx("provider quota windows"), tx("biller credit systems"), tx("errors surfaced directly")],
    tone: "from-emerald-500/14 via-emerald-500/6 to-transparent",
  },
] as const;
}

export function AccountingModelCard() {
  return (
    <Card className="relative overflow-hidden border-border/70">
      <div className="absolute inset-0 bg-(image:--gradient-extract-3)" />
      <CardHeader className="relative px-5 pt-5 pb-2">
        <CardTitle className="text-sm font-semibold uppercase tracking-(--tracking-caps) text-muted-foreground">
          Accounting model
        </CardTitle>
        <CardDescription className="max-w-2xl text-sm leading-6">
          Paperclip now separates request-level inference usage from account-level finance events.
          That keeps provider reporting honest when the biller is OpenRouter, Cloudflare, Bedrock, or another intermediary.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative grid gap-3 px-5 pb-5 md:grid-cols-3">
        {getSurfaces().map((surface) => {
          const Icon = surface.icon;
          return (
            <div
              key={surface.title}
              className={`rounded-2xl border border-border/70 bg-gradient-to-br ${surface.tone} p-4 shadow-sm`}
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/80">
                  <Icon className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{surface.title}</div>
                  <div className="text-xs text-muted-foreground">{surface.description}</div>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                {surface.points.map((point) => (
                  <div key={point}>{point}</div>
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
