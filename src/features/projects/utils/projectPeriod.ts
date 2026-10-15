export function getEditalExecutionPeriod(
  edital: {
    periodo_execucao_rel: {
      inicio: string
      fim: string
    }
  },
) {
  return {
    periodoIni: edital.periodo_execucao_rel.inicio.slice(0, 10),
    periodoFim: edital.periodo_execucao_rel.fim.slice(0, 10),
  }
}
