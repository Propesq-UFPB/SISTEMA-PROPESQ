import React from "react"
import Card from "@/components/Card"
import { Helmet } from "react-helmet"

/* ================= INDICADORES ================= */

const indicadores = [
  { title: "Inscrições ativas", value: "2" },
  { title: "Projetos vinculados", value: "1" },
  { title: "Relatórios pendentes", value: "1" },
  { title: "Certificados disponíveis", value: "3" },
  { title: "Notificações novas", value: "4" },
]

const prazos = [
  { titulo: "Prazo final para inscrição no PIBIC 2026", data: "15/04/2026" },
  { titulo: "Entrega do relatório parcial", data: "30/04/2026" },
  { titulo: "Submissão de trabalho para o ENIC", data: "10/05/2026" },
]

const avisos = [
  "Seu vínculo no projeto 'Plataforma Digital PROPESQ' está ativo.",
  "Há um relatório parcial aguardando envio.",
  "Um novo edital de iniciação científica foi publicado.",
]

/* ================= COMPONENTE ================= */

export default function DisDashboard() {
  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Dashboard do Discente • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
        <header>
          <h1 className="text-2xl font-bold text-primary">
            Painel do Discente
          </h1>
          <p className="mt-1 text-base text-neutral">
            Olá, estudante. Acompanhe aqui sua participação no PROPESQ.
          </p>
        </header>

        {/* INDICADORES */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {indicadores.map((ind) => (
            <Card
              key={ind.title}
              title=""
              className="
                bg-white
                border-2
                border-primary
                rounded-3xl
                py-3
                text-center
              "
            >
              <div className="space-y-1">
                <div className="text-base font-bold text-primary">
                  {ind.value}
                </div>

                <div className="text-base font-medium text-primary">
                  {ind.title}
                </div>
              </div>
            </Card>
          ))}
        </section>

        {/* CONTEÚDO INFERIOR */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* PRÓXIMOS PRAZOS */}
          <Card
            title={
              <h2 className="text-sm font-semibold text-primary">
                Próximos prazos
              </h2>
            }
            className="bg-white border border-neutral/30 rounded-2xl p-8"
          >
            <ul className="space-y-4">
              {prazos.map((prazo, i) => (
                <li
                  key={i}
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    border-b
                    border-neutral/20
                    pb-3
                    text-sm
                  "
                >
                  <span className="text-neutral">
                    {prazo.titulo}
                  </span>

                  <span
                    className="
                      px-4
                      py-1.5
                      rounded-full
                      text-sm
                      font-semibold
                      border
                      border-primary
                      text-primary
                      min-w-[110px]
                      text-center
                      shrink-0
                    "
                  >
                    {prazo.data}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {/* AVISOS / STATUS */}
          <Card
            title={
              <h2 className="text-sm font-semibold text-primary">
                Avisos importantes
              </h2>
            }
            className="bg-white border border-neutral/30 rounded-2xl p-8"
          >
            <ul className="space-y-4">
              {avisos.map((aviso, i) => (
                <li
                  key={i}
                  className="
                    border-b
                    border-neutral/20
                    pb-3
                    text-sm
                    text-neutral
                  "
                >
                  {aviso}
                </li>
              ))}
            </ul>
          </Card>
        </section>
      </div>
    </div>
  )
}