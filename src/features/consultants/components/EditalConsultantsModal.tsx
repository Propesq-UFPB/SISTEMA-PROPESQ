import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Trash2, Users, X } from "lucide-react"
import type { useEditalConsultants } from "../hooks/useEditalConsultants"
import { areaLabel, consultantTags } from "../utils/consultantHelpers"
import { SearchableSelect } from "./SearchableSelect"

// Recebe o estado do hook pela página, que o compartilha com a distribuição
export function EditalConsultantsModal({
  state,
  editalLabel,
  onClose,
}: Readonly<{
  state: ReturnType<typeof useEditalConsultants>
  editalLabel: string
  onClose: () => void
}>) {
  const { linked, available, loading, saving, error, add, addAll, remove } =
    state
  const [selected, setSelected] = useState("")

  async function handleAdd() {
    if (!selected) return
    await add(Number(selected))
    setSelected("")
  }

  // Esc fecha o modal, exceto quando já foi usado para fechar a lista do seletor
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !event.defaultPrevented) onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  function handleRemove(consultantId: number, nome: string) {
    if (!window.confirm(`Desvincular ${nome} deste edital?`)) return
    void remove(consultantId)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edital-consultants-title"
        className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-neutral/10 p-5">
          <div>
            <div className="flex items-center gap-2">
              <Users size={18} className="text-primary" />
              <h2
                id="edital-consultants-title"
                className="text-base font-semibold text-primary"
              >
                Consultores do edital
              </h2>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                {linked.length}
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral">{editalLabel}</p>
            <p className="mt-1 text-xs text-neutral">
              Somente os consultores vinculados participam da distribuição.{" "}
              <Link
                to="/gestor/settings/consultants"
                className="font-semibold text-primary hover:underline"
              >
                Gerenciar cadastro
              </Link>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-lg p-1.5 text-neutral transition hover:bg-neutral-light hover:text-primary"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto p-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="flex-1">
              <SearchableSelect
                value={selected}
                onChange={setSelected}
                disabled={saving || loading}
                placeholder={
                  available.length === 0
                    ? "Todos os consultores ativos já estão vinculados"
                    : "Pesquise um consultor ativo para vincular..."
                }
                emptyMessage="Nenhum consultor disponível."
                options={available.map((consultant) => ({
                  value: String(consultant.id),
                  label: consultant.user.nome,
                  description: areaLabel(consultant.areaPrincipal),
                }))}
              />
            </div>
            <button
              type="button"
              onClick={() => void handleAdd()}
              disabled={!selected || saving}
              className="inline-flex items-center justify-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:bg-primary/40"
            >
              <Plus size={16} />
              Vincular
            </button>
            <button
              type="button"
              onClick={() => void addAll()}
              disabled={available.length === 0 || saving}
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-neutral-light px-3 py-2 text-sm font-semibold text-primary hover:bg-neutral-50 disabled:opacity-50"
            >
              Vincular todos os ativos ({available.length})
            </button>
          </div>

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </p>
          )}

          <div className="overflow-x-auto rounded-xl border border-neutral-light">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-neutral-50 text-neutral">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">
                    Consultor
                  </th>
                  <th className="px-4 py-2 text-left font-semibold">
                    Área principal
                  </th>
                  <th className="px-4 py-2 text-left font-semibold w-[110px]">
                    Projetos
                  </th>
                  <th className="px-4 py-2 text-right font-semibold w-[140px]">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-neutral">
                      Carregando consultores...
                    </td>
                  </tr>
                ) : linked.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-neutral">
                      Nenhum consultor vinculado a este edital.
                    </td>
                  </tr>
                ) : (
                  linked.map((consultant) => (
                    <tr
                      key={consultant.id}
                      className="border-t border-neutral-light align-top"
                    >
                      <td className="px-4 py-2">
                        <p className="font-semibold text-primary">
                          {consultant.user.nome}
                        </p>
                        <p className="text-xs text-neutral">
                          {[
                            consultant.user.email,
                            ...consultantTags(consultant),
                          ].join(" • ")}
                          {!consultant.ativo && " • Inativo"}
                        </p>
                      </td>
                      <td className="px-4 py-2 text-neutral-dark">
                        {areaLabel(consultant.areaPrincipal)}
                        {consultant.areasAdicionais.length > 0 && (
                          <span className="block text-xs text-neutral">
                            +{consultant.areasAdicionais.length} área(s)
                            adicional(is)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-neutral-dark">
                        {consultant.carga}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            handleRemove(consultant.id, consultant.user.nome)
                          }
                          disabled={saving || consultant.carga > 0}
                          title={
                            consultant.carga > 0
                              ? "Consultor com projetos atribuídos neste edital"
                              : undefined
                          }
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2 size={14} />
                          Desvincular
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
