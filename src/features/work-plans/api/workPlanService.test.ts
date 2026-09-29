import { afterEach, describe, expect, it, vi } from "vitest"
import { workPlanService } from "./workPlanService"

vi.mock("@/services/apiClient", async importOriginal => {
  const original = await importOriginal<typeof import("@/services/apiClient")>()
  return { ...original, apiRequest: vi.fn() }
})
import { apiRequest, ApiError } from "@/services/apiClient"

const request = vi.mocked(apiRequest)
afterEach(() => vi.resetAllMocks())

describe("interesse em planos", () => {
  it("carrega o lookup de bolsas com seus IDs e descrições", async () => {
    request.mockResolvedValue([{ id: 4, descricao: "PIBIC" }]);
    expect(await workPlanService.scholarshipLookup()).toEqual([{ id: 4, descricao: "PIBIC" }]);
    expect(request).toHaveBeenCalledWith("/scholarships/lookup");
  });
  it("consulta a rota de editais publicados com paginação e filtro por projeto", async () => {
    request.mockResolvedValue({ results: [], total: 0, limit: 10, offset: 20 })
    await workPlanService.availableForInterest({ limit: 10, offset: 20, pesquisa_id: 7 })
    expect(request).toHaveBeenCalledWith("/work-plans/available-for-interest?limit=10&offset=20&pesquisa_id=7")
  })

  it("registra interesse usando a identidade autenticada, sem enviar discente_id", async () => {
    request.mockResolvedValue({ id: 3, plano_trabalho_id: 12, status: "INTERESSE_REGISTRADO" })
    expect(await workPlanService.registerInterest(12)).toMatchObject({ plano_trabalho_id: 12 })
    expect(request).toHaveBeenCalledWith("/work-plans/12/interesses", { method: "POST", body: "{}" })
  })

  it.each([400, 409, 500])("preserva erro %s para feedback na tela", async status => {
    const error = new ApiError(status, "Não foi possível registrar")
    request.mockRejectedValue(error)
    await expect(workPlanService.registerInterest(12)).rejects.toBe(error)
  })
})
