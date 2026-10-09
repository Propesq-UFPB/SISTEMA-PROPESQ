import { useEffect, useId, useMemo, useRef, useState } from "react"
import { ChevronDown, X } from "lucide-react"

export type SearchableOption = {
  value: string
  label: string
  description?: string
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase()
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Digite para pesquisar...",
  disabled = false,
  emptyMessage = "Nenhum resultado encontrado.",
}: Readonly<{
  options: SearchableOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  emptyMessage?: string
}>) {
  const listId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [highlighted, setHighlighted] = useState(0)

  const selected = options.find((option) => option.value === value) ?? null

  const filtered = useMemo(() => {
    const q = normalize(query)
    if (!q) return options

    return options.filter((option) =>
      normalize(`${option.label} ${option.description ?? ""}`).includes(q),
    )
  }, [options, query])

  useEffect(() => {
    if (!open) return

    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) close()
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${highlighted}"]`)
      ?.scrollIntoView({ block: "nearest" })
  }, [highlighted])

  function openList() {
    if (disabled) return
    setOpen(true)
    setHighlighted(0)
  }

  function close() {
    setOpen(false)
    setQuery("")
  }

  function select(option: SearchableOption) {
    onChange(option.value)
    close()
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (!open) return openList()
      setHighlighted((current) => Math.min(current + 1, filtered.length - 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setHighlighted((current) => Math.max(current - 1, 0))
    } else if (event.key === "Enter") {
      if (!open) return
      event.preventDefault()
      const option = filtered[highlighted]
      if (option) select(option)
    } else if (event.key === "Escape" || event.key === "Tab") {
      close()
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        value={open ? query : (selected?.label ?? "")}
        placeholder={selected && open ? selected.label : placeholder}
        disabled={disabled}
        onFocus={openList}
        onClick={openList}
        onChange={(event) => {
          setQuery(event.target.value)
          setHighlighted(0)
          setOpen(true)
        }}
        onKeyDown={handleKeyDown}
        className="w-full rounded-lg border border-neutral-light bg-white py-2 pl-3 pr-16 text-sm outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral/60"
      />

      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 text-neutral">
        {selected && !disabled && (
          <button
            type="button"
            onClick={() => {
              onChange("")
              close()
            }}
            className="rounded p-0.5 hover:bg-neutral-50"
            aria-label="Limpar seleção"
          >
            <X size={14} />
          </button>
        )}
        <ChevronDown size={16} className="pointer-events-none" />
      </div>

      {open && (
        <ul
          id={listId}
          ref={listRef}
          role="listbox"
          className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-neutral-light bg-white py-1 shadow-lg"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-neutral">{emptyMessage}</li>
          ) : (
            filtered.map((option, index) => (
              <li
                key={option.value}
                data-index={index}
                role="option"
                aria-selected={option.value === value}
                onMouseDown={(event) => {
                  event.preventDefault()
                  select(option)
                }}
                onMouseEnter={() => setHighlighted(index)}
                className={`cursor-pointer px-3 py-2 text-sm ${
                  index === highlighted ? "bg-primary/10" : ""
                } ${option.value === value ? "font-semibold text-primary" : "text-neutral-dark"}`}
              >
                {option.label}
                {option.description && (
                  <span className="block text-xs font-normal text-neutral">
                    {option.description}
                  </span>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
