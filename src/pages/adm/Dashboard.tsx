import React from "react"
import Card from "@/components/Card"
import { Helmet } from "react-helmet"

/* ================= INDICADORES ================= */

const indicadores = [
  { title: "Projetos ativos", value: "120+" },
  { title: "Editais em andamento", value: "5" },
  { title: "Bolsistas vinculados", value: "28" },
  { title: "Relatórios pendentes", value: "11" },
  { title: "Certificados emitidos", value: "120" },
]

const prazos = [
  { titulo: "Encerramento do Edital PIBIC 2025", data: "15/11/2025" },
  { titulo: "Prazo final para relatórios parciais", data: "20/11/2025" },
  { titulo: "Homologação de bolsistas (Extensão)", data: "30/11/2025" },
]

/* ================= COMPONENTE ================= */

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Dashboard • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
        <header>
          <h1 className="text-2xl font-bold text-primary">
            Painel Administrativo
          </h1>
          <p className="mt-1 text-base text-neutral">
            Olá, Admistrador.
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

        {/* PRAZOS*/}
        <section className="grid grid-cols-1">
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
                    "
                  >
                    {prazo.data}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      </div>
    </div>
  )
}
