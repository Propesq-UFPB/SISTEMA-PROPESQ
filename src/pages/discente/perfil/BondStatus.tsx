import React from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"

const vinculo = {
  status: "VINCULADO",
  projeto: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
  edital: "PIBIC 2026",
  orientador: "Prof. André Silva",
  inicio: "01/03/2026",
  fim: "28/02/2027",
  bolsa: "PIBIC / CNPq",
}

export default function BondStatus() {
  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Status do Vínculo • PROPESQ</title>
      </Helmet>

      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <div className="space-y-6">
          <header className="w-full rounded-2xl border border-neutral/30 bg-white px-6 py-6">
            <h1 className="text-2xl font-bold text-primary">Status do Vínculo</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral">
              Consulte a situação do seu vínculo com o projeto de iniciação
              científica e a vigência da bolsa.
            </p>
          </header>

          <section className="rounded-2xl border border-neutral/30 bg-white p-6">
            <div className="mb-5">
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {vinculo.status}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div>
                <div className="text-neutral">Projeto</div>
                <div className="mt-1 font-medium text-primary">{vinculo.projeto}</div>
              </div>
              <div>
                <div className="text-neutral">Edital</div>
                <div className="mt-1 font-medium text-primary">{vinculo.edital}</div>
              </div>
              <div>
                <div className="text-neutral">Orientador</div>
                <div className="mt-1 font-medium text-primary">{vinculo.orientador}</div>
              </div>
              <div>
                <div className="text-neutral">Modalidade de bolsa</div>
                <div className="mt-1 font-medium text-primary">{vinculo.bolsa}</div>
              </div>
              <div>
                <div className="text-neutral">Início</div>
                <div className="mt-1 font-medium text-primary">{vinculo.inicio}</div>
              </div>
              <div>
                <div className="text-neutral">Fim</div>
                <div className="mt-1 font-medium text-primary">{vinculo.fim}</div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/discente/projetos"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
              >
                Ver projetos
              </Link>
              <Link
                to="/discente/perfil"
                className="rounded-lg border border-neutral/30 px-4 py-2 text-sm text-primary"
              >
                Ir ao perfil
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
