import { useMemo, useState } from "react"
import type {
  Consultant,
  ConsultantFormValues,
  ConsultantStatusFilter,
  ConsultantTypeFilter,
} from "../types/consultant"
import {
  areaPathParts,
  consultantsMock,
  internalUsersMock,
  knowledgeAreasMock,
} from "../utils/consultantHelpers"

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase()
}

export function useConsultants() {
  const [consultants, setConsultants] = useState<Consultant[]>(consultantsMock)
  const [users] = useState(internalUsersMock)
  const [areas] = useState(knowledgeAreasMock)
  const [query, setQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<ConsultantTypeFilter>("ALL")
  const [statusFilter, setStatusFilter] = useState<ConsultantStatusFilter>("ACTIVE")

  const usersById = useMemo(
    () => new Map(users.map((user) => [user.id, user])),
    [users],
  )

  const areasById = useMemo(
    () => new Map(areas.map((area) => [area.id, area])),
    [areas],
  )

  const filtered = useMemo(() => {
    const q = normalize(query)

    return consultants
      .filter((consultant) => typeFilter === "ALL" || consultant.tipo === typeFilter)
      .filter((consultant) => {
        if (statusFilter === "ACTIVE") return consultant.ativo
        if (statusFilter === "INACTIVE") return !consultant.ativo
        return true
      })
      .filter((consultant) => {
        if (!q) return true

        const user = usersById.get(consultant.userId)
        const areaNames = [consultant.areaPrincipalId, ...consultant.areasAdicionaisIds]
          .map((id) => areaPathParts(areasById.get(id)).join(" "))
          .join(" ")

        return normalize(`${user?.nome ?? ""} ${user?.email ?? ""} ${areaNames}`).includes(q)
      })
      .sort((a, b) => {
        if (a.ativo !== b.ativo) return a.ativo ? -1 : 1

        const aName = usersById.get(a.userId)?.nome ?? ""
        const bName = usersById.get(b.userId)?.nome ?? ""
        return aName.localeCompare(bName, "pt-BR")
      })
  }, [consultants, query, typeFilter, statusFilter, usersById, areasById])

  const stats = useMemo(
    () => ({
      total: consultants.length,
      ativos: consultants.filter((consultant) => consultant.ativo).length,
      propesq: consultants.filter((consultant) => consultant.isPropesq).length,
      voluntarios: consultants.filter((consultant) => consultant.isVoluntario).length,
    }),
    [consultants],
  )

  function availableUsersFor(editingId: number | null) {
    const taken = new Set(
      consultants
        .filter((consultant) => consultant.id !== editingId)
        .map((consultant) => consultant.userId),
    )

    return users
      .filter((user) => !taken.has(user.id))
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
  }

  function saveConsultant(values: ConsultantFormValues, editingId: number | null) {
    if (values.userId === null || values.areaPrincipalId === null) return

    const data = {
      ...values,
      userId: values.userId,
      areaPrincipalId: values.areaPrincipalId,
      areasAdicionaisIds: values.areasAdicionaisIds.filter(
        (id) => id !== values.areaPrincipalId,
      ),
    }

    if (editingId !== null) {
      setConsultants((current) =>
        current.map((consultant) =>
          consultant.id === editingId ? { ...data, id: editingId } : consultant,
        ),
      )
      return
    }

    setConsultants((current) => [{ ...data, id: Date.now() }, ...current])
  }

  function toggleActive(id: number) {
    setConsultants((current) =>
      current.map((consultant) =>
        consultant.id === id ? { ...consultant, ativo: !consultant.ativo } : consultant,
      ),
    )
  }

  function removeConsultant(id: number) {
    setConsultants((current) => current.filter((consultant) => consultant.id !== id))
  }

  return {
    consultants,
    filtered,
    stats,
    areas,
    usersById,
    areasById,
    query,
    setQuery,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    availableUsersFor,
    saveConsultant,
    toggleActive,
    removeConsultant,
  }
}
