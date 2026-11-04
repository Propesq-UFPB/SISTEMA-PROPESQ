import { useState } from "react"
import { Plus, X } from "lucide-react"
import type { KnowledgeArea, KnowledgeAreaPath } from "../types/consultant"
import { areaLabel, EMPTY_AREA_PATH } from "../utils/consultantHelpers"
import { KnowledgeAreaPicker } from "./KnowledgeAreaPicker"

export function AdditionalAreasField({
  label,
  areas,
  excludedId,
  onChange,
}: Readonly<{
  label: string
  areas: KnowledgeArea[]
  excludedId?: number
  onChange: (areas: KnowledgeArea[]) => void
}>) {
  const [path, setPath] = useState<KnowledgeAreaPath>(EMPTY_AREA_PATH)
  const [selected, setSelected] = useState<KnowledgeArea | null>(null)

  const duplicate =
    selected !== null &&
    (selected.id === excludedId || areas.some((area) => area.id === selected.id))

  function change(nextPath: KnowledgeAreaPath, area: KnowledgeArea | null) {
    setPath(nextPath)
    setSelected(area)
  }

  function add() {
    if (selected === null || duplicate) return
    onChange([...areas, selected])
    change(EMPTY_AREA_PATH, null)
  }

  return (
    <div className="space-y-3 rounded-xl border border-neutral-light p-4">
      <p className="text-xs font-semibold text-primary">{label}</p>
      <KnowledgeAreaPicker value={path} onChange={change} />
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-red-600">{duplicate && "Essa área já foi selecionada."}</p>
        <button
          type="button"
          onClick={add}
          disabled={selected === null || duplicate}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-neutral-light px-3 py-2 text-sm font-semibold text-primary hover:bg-neutral-50 disabled:opacity-50"
        >
          <Plus size={16} />
          Adicionar área
        </button>
      </div>

      {areas.length === 0 ? (
        <p className="text-xs text-neutral/70">Nenhuma área adicional.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {areas.map((area) => (
            <span
              key={area.id}
              className="inline-flex items-center gap-1 rounded-full border border-neutral-light bg-neutral-50 py-1 pl-3 pr-1 text-xs text-neutral-dark"
            >
              {areaLabel(area)}
              <button
                type="button"
                onClick={() => onChange(areas.filter((item) => item.id !== area.id))}
                className="rounded-full p-0.5 hover:bg-neutral-light"
                aria-label="Remover área"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
