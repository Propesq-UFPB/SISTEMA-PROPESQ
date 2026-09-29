import { afterEach, expect, it, vi } from "vitest";
import { workPlanService } from "../api/workPlanService";
import { fetchProjectsAndPlans } from "./workPlanFormHelpers";

vi.mock("../api/workPlanService", () => ({ workPlanService: { creationProjects: vi.fn(), list: vi.fn() } }));
afterEach(() => vi.resetAllMocks());

it("carrega todas as páginas de projetos elegíveis e exibe edital e limite reais", async () => {
  const project = { id: 1, codigo: "P1", titulo: "Pesquisa", situacao: "APROVADO", data_inicio: null, data_fim: null, edital_rel: { id: 2, descricao: "Edital 2026", limite_planos_orientador: 3 } };
  vi.mocked(workPlanService.creationProjects)
    .mockResolvedValueOnce({ results: [project], total: 2, limit: 100, offset: 0 })
    .mockResolvedValueOnce({ results: [{ ...project, id: 2 }], total: 2, limit: 100, offset: 1 });
  vi.mocked(workPlanService.list).mockResolvedValue({ results: [], total: 0, limit: 100, offset: 0 });
  const result = await fetchProjectsAndPlans();
  expect(result.projects).toHaveLength(2);
  expect(result.projects[0]).toMatchObject({ id: "1", edital: "Edital 2026", limitePlanos: 3 });
  expect(workPlanService.creationProjects).toHaveBeenNthCalledWith(2, { limit: 100, offset: 1 });
});

it("não exibe projetos se o backend não retornar vínculos elegíveis", async () => {
  vi.mocked(workPlanService.creationProjects).mockResolvedValue({ results: [], total: 0, limit: 100, offset: 0 });
  vi.mocked(workPlanService.list).mockResolvedValue({ results: [], total: 0, limit: 100, offset: 0 });
  expect((await fetchProjectsAndPlans()).projects).toEqual([]);
});
