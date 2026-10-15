import type { KnowledgeArea, KnowledgeAreaPath } from "../types/consultant"
import { SearchableSelect } from "./SearchableSelect"

function distinct(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  )
}

const LEVELS = [
  { key: "grandeArea", label: "Grande área" },
  { key: "area", label: "Área" },
  { key: "subArea", label: "Subárea" },
  { key: "especialidade", label: "Especialidade" },
] as const

export function KnowledgeAreaPicker({
  areas,
  value,
  onChange,
  required = false,
}: Readonly<{
  areas: KnowledgeArea[]
  value: KnowledgeAreaPath
  onChange: (value: KnowledgeAreaPath) => void
  required?: boolean
}>) {
  const options: Record<keyof KnowledgeAreaPath, string[]> = {
    grandeArea: distinct(areas.map((row) => row.grandeArea)),
    area: distinct(
      areas.filter((row) => row.grandeArea === value.grandeArea).map((row) => row.area),
    ),
    subArea: distinct(
      areas
        .filter((row) => row.grandeArea === value.grandeArea && row.area === value.area)
        .map((row) => row.subArea),
    ),
    especialidade: distinct(
      areas
        .filter(
          (row) =>
            row.grandeArea === value.grandeArea &&
            row.area === value.area &&
            row.subArea === value.subArea,
        )
        .map((row) => row.especialidade),
    ),
  }

  function change(levelIndex: number, selected: string) {
    const next = { ...value }
    LEVELS.forEach((level, index) => {
      if (index === levelIndex) next[level.key] = selected
      if (index > levelIndex) next[level.key] = ""
    })
    onChange(next)
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {LEVELS.map((level, index) => {
        const parentMissing = index > 0 && !value[LEVELS[index - 1].key]
        const levelOptions = options[level.key]
        const disabled = parentMissing || levelOptions.length === 0
        const isRequired = required && index < 2

        return (
          <div key={level.key} className="space-y-1">
            <label className="text-xs text-neutral">
              {level.label}
              {isRequired && " *"}
            </label>
            <SearchableSelect
              value={value[level.key]}
              disabled={disabled}
              onChange={(selected) => change(index, selected)}
              placeholder={
                !parentMissing && levelOptions.length === 0
                  ? "Não se aplica"
                  : `Pesquisar ${level.label.toLowerCase()}...`
              }
              options={levelOptions.map((option) => ({ value: option, label: option }))}
            />
          </div>
        )
      })}
    </div>
  )
}
