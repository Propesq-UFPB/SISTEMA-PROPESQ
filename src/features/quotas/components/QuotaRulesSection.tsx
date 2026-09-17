import { ShieldCheck } from "lucide-react"

export function QuotaRulesSection() {
  return (
    <div className="rounded-3xl border border-neutral-light bg-white p-6 shadow-card">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl border border-primary/10 bg-primary/5 p-3 text-primary">
          <ShieldCheck size={22} />
        </div>

        <div>
          <h2 className="text-base font-semibold text-primary">
            Regras aplicadas na distribuição
          </h2>
          <p className="mt-1 text-sm text-neutral/70">
            A distribuição usa o ranking final como base e aplica a ordem CNPq
            → UFPB.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-neutral-light bg-neutral-light/50 p-4">
          <p className="text-sm font-semibold text-primary">
            Pesquisador com IFC ≥ 7
          </p>
          <p className="mt-1 text-sm text-neutral/70">
            Pode receber até 2 cotas, desde que tenha planos aprovados e
            discentes indicados.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-light bg-neutral-light/50 p-4">
          <p className="text-sm font-semibold text-primary">
            Pesquisador com IFC menor que 7
          </p>
          <p className="mt-1 text-sm text-neutral/70">
            Pode receber 1 cota somente se houver disponibilidade após a distribuição
            principal.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-light bg-neutral-light/50 p-4">
          <p className="text-sm font-semibold text-primary">Ordem das fontes</p>
          <p className="mt-1 text-sm text-neutral/70">
            Primeiro são atribuídas as cotas CNPq. Depois são atribuídas as
            cotas UFPB.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-light bg-neutral-light/50 p-4">
          <p className="text-sm font-semibold text-primary">Planos sem bolsa</p>
          <p className="mt-1 text-sm text-neutral/70">
            Planos aprovados não contemplados são mantidos como voluntários.
          </p>
        </div>
      </div>
    </div>
  )
}
