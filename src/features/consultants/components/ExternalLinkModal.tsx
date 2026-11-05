import { useCallback, useEffect, useState } from "react"
import { AlertTriangle, Ban, Check, Copy, Link2, RefreshCw, X } from "lucide-react"
import { externalConsultantService } from "../api/consultantService"
import type { ExternalLink, ExternalLinkStatus } from "../types/consultant"
import { apiErrorMessage } from "../utils/consultantHelpers"
import { endOfDayIso, formatDateTime, linkStatusLabel } from "../utils/externalHelpers"

function CopyableLink({ link }: Readonly<{ link: ExternalLink }>) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(link.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Sem permissão de área de transferência: o campo continua selecionável
    }
  }

  return (
    <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <p className="flex gap-2 text-xs font-semibold text-amber-800">
        <AlertTriangle size={14} className="mt-0.5 shrink-0" />
        Copie o link agora: por segurança ele não será exibido de novo. Se perder, gere outro.
      </p>
      <div className="flex gap-2">
        <input
          readOnly
          value={link.url}
          onFocus={(event) => event.target.select()}
          aria-label="Link de acesso"
          className="min-w-0 flex-1 rounded-lg border border-neutral-light bg-white px-3 py-2 font-mono text-xs"
        />
        <button
          type="button"
          onClick={() => void copy()}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <p className="text-xs text-amber-800">
        {link.expiraEm ? `Válido até ${formatDateTime(link.expiraEm)}.` : "Válido até ser revogado."}
      </p>
    </div>
  )
}

/**
 * Link de acesso de um avaliador externo: mostra a situação, gera um novo (revogando o
 * anterior) e revoga. `initialLink` é o link recém-criado no cadastro.
 */
export function ExternalLinkModal({
  consultant,
  initialLink,
  onClose,
}: Readonly<{
  consultant: { id: number; name: string; email: string }
  initialLink?: ExternalLink
  onClose: () => void
}>) {
  const [status, setStatus] = useState<ExternalLinkStatus | null>(null)
  const [link, setLink] = useState<ExternalLink | null>(initialLink ?? null)
  const [expiraEm, setExpiraEm] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadStatus = useCallback(async () => {
    try {
      setStatus((await externalConsultantService.get(consultant.id)).link)
    } catch (err) {
      setError(apiErrorMessage(err, "Não foi possível carregar a situação do link."))
    }
  }, [consultant.id])

  useEffect(() => {
    void loadStatus()
  }, [loadStatus])

  async function generate() {
    if (status?.ativo && !window.confirm("Gerar um novo link? O link atual deixará de funcionar.")) {
      return
    }
    setBusy(true)
    setError(null)
    try {
      setLink(
        await externalConsultantService.generateLink(
          consultant.id,
          expiraEm ? endOfDayIso(expiraEm) : undefined,
        ),
      )
      setExpiraEm("")
      await loadStatus()
    } catch (err) {
      setError(apiErrorMessage(err, "Não foi possível gerar o link."))
    } finally {
      setBusy(false)
    }
  }

  async function revoke() {
    if (!window.confirm(`Revogar o link de ${consultant.name}? O acesso é encerrado na hora.`)) {
      return
    }
    setBusy(true)
    setError(null)
    try {
      await externalConsultantService.revokeLink(consultant.id)
      setLink(null)
      await loadStatus()
    } catch (err) {
      setError(apiErrorMessage(err, "Não foi possível revogar o link."))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-neutral-light bg-white p-5 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
              <Link2 size={16} />
              Link de acesso
            </h3>
            <p className="mt-1 text-xs text-neutral">
              {consultant.name} • {consultant.email}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-neutral-light p-2 hover:bg-neutral-50"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {link && <CopyableLink link={link} />}

          <dl className="grid grid-cols-2 gap-3 rounded-xl border border-neutral-light bg-neutral-50 p-4 text-xs">
            <div className="col-span-2">
              <dt className="text-neutral">Situação</dt>
              <dd
                className={`font-semibold ${status?.ativo ? "text-green-700" : "text-neutral-dark"}`}
              >
                {status ? linkStatusLabel(status) : "Carregando..."}
              </dd>
            </div>
            <div>
              <dt className="text-neutral">Gerado em</dt>
              <dd className="text-neutral-dark">{formatDateTime(status?.criadoEm ?? null)}</dd>
            </div>
            <div>
              <dt className="text-neutral">Último acesso</dt>
              <dd className="text-neutral-dark">
                {formatDateTime(status?.ultimoAcessoEm ?? null)}
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap items-end gap-2">
            <div className="flex-1">
              <label className="text-xs text-neutral">Validade do novo link</label>
              <input
                type="date"
                value={expiraEm}
                onChange={(event) => setExpiraEm(event.target.value)}
                className="mt-1 block w-full rounded-lg border border-neutral-light px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              type="button"
              onClick={() => void generate()}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:bg-primary/40"
            >
              <RefreshCw size={16} />
              Gerar novo link
            </button>
            <button
              type="button"
              onClick={() => void revoke()}
              disabled={busy || !status?.ativo}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Ban size={16} />
              Revogar
            </button>
          </div>
          <p className="text-xs text-neutral">
            Gerar um novo link invalida o anterior. Sem validade, o link vale até ser revogado ou
            o avaliador ser desativado.
          </p>

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
