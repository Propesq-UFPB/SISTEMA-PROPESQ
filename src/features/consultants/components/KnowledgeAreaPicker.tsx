import { useEffect, useState } from "react"
import { projectService } from "@/features/projects/api/projectService"
import type { KnowledgeAreaLookup } from "@/features/projects/types/project"
import type { KnowledgeArea, KnowledgeAreaPath } from "../types/consultant"
import { SearchableSelect } from "./SearchableSelect"

const LEVELS = [
  { key: "grandeArea", label: "Grande área" },
  { key: "area", label: "Área" },
  { key: "subArea", label: "Subárea" },
  { key: "especialidade", label: "Especialidade" },
] as const

type LevelOptions = Record<keyof KnowledgeAreaPath, KnowledgeAreaLookup[] | null>

// Cache compartilhado entre os pickers: as opções de cada nível dependem só dos níveis acima.
const lookupCache = new Map<string, Promise<KnowledgeAreaLookup[]>>()

function lookup(levelIndex: number, path: KnowledgeAreaPath) {
  const params = {
    grande_area: levelIndex >= 1 ? path.grandeArea : undefined,
    area: levelIndex >= 2 ? path.area : undefined,
    sub_area: levelIndex >= 3 ? path.subArea : undefined,
  }
  const key = JSON.stringify(params)

  let request = lookupCache.get(key)
  if (!request) {
    request = projectService.knowledgeAreaLookup(params)
    request.catch(() => lookupCache.delete(key))
    lookupCache.set(key, request)
  }
  return request
}

// O registro mais específico selecionado; exige ao menos grande área e área.
function resolveArea(path: KnowledgeAreaPath, options: LevelOptions): KnowledgeArea | null {
  if (!path.grandeArea || !path.area) return null

  for (let index = LEVELS.length - 1; index >= 0; index--) {
    const key = LEVELS[index].key
    if (!path[key]) continue
    const option = options[key]?.find((item) => item.name === path[key])
    return option ? { id: option.id, ...path } : null
  }
  return null
}

// Opções de um nível; recarrega apenas quando os níveis acima mudam.
function useLevelOptions(levelIndex: number, path: KnowledgeAreaPath) {
  const [options, setOptions] = useState<KnowledgeAreaLookup[] | null>(null)
  const [error, setError] = useState(false)
  const parentMissing = levelIndex > 0 && !path[LEVELS[levelIndex - 1].key]
  const deps = LEVELS.slice(0, levelIndex).map((level) => path[level.key])

  useEffect(() => {
    if (parentMissing) {
      setOptions([])
      return
    }

    let cancelled = false
    setOptions(null)
    setError(false)
    lookup(levelIndex, path)
      .then((items) => {
        if (!cancelled) setOptions(items)
      })
      .catch(() => {
        if (!cancelled) {
          setOptions([])
          setError(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [parentMissing, ...deps]) // eslint-disable-line react-hooks/exhaustive-deps

  return { options, error }
}

export function KnowledgeAreaPicker({
  value,
  onChange,
  required = false,
}: Readonly<{
  value: KnowledgeAreaPath
  onChange: (path: KnowledgeAreaPath, area: KnowledgeArea | null) => void
  required?: boolean
}>) {
  const levels = [
    useLevelOptions(0, value),
    useLevelOptions(1, value),
    useLevelOptions(2, value),
    useLevelOptions(3, value),
  ]
  const options = Object.fromEntries(
    LEVELS.map((level, index) => [level.key, levels[index].options]),
  ) as LevelOptions
  const error = levels.some((level) => level.error)

  function change(levelIndex: number, selected: string) {
    const next = { ...value }
    LEVELS.forEach((level, index) => {
      if (index === levelIndex) next[level.key] = selected
      if (index > levelIndex) next[level.key] = ""
    })
    onChange(next, resolveArea(next, options))
  }

  return (
    <div className="space-y-2">
      <div className="grid gap-3 md:grid-cols-2">
        {LEVELS.map((level, index) => {
          const parentMissing = index > 0 && !value[LEVELS[index - 1].key]
          const levelOptions = options[level.key]
          const loading = levelOptions === null
          const disabled = parentMissing || loading || levelOptions.length === 0
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
                  loading
                    ? "Carregando..."
                    : !parentMissing && levelOptions.length === 0
                      ? "Não se aplica"
                      : `Pesquisar ${level.label.toLowerCase()}...`
                }
                options={(levelOptions ?? []).map((option) => ({
                  value: option.name,
                  label: option.name,
                }))}
              />
            </div>
          )
        })}
      </div>
      {error && (
        <p className="text-xs text-red-600">
          Não foi possível carregar as áreas de conhecimento.
        </p>
      )}
    </div>
  )
}
