import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"

type DocItem = {
  id: string
  nome: string
  status: "ENVIADO" | "PENDENTE" | "REJEITADO"
}

const MOCK_DOCS: DocItem[] = [
  { id: "1", nome: "Comprovante de matrícula", status: "ENVIADO" },
  { id: "2", nome: "Documento de identidade", status: "PENDENTE" },
  { id: "3", nome: "Comprovante de conta bancária", status: "REJEITADO" },
]

function statusClass(status: DocItem["status"]) {
  if (status === "ENVIADO") return "border-primary/30 bg-primary/10 text-primary"
  if (status === "REJEITADO") return "border-danger/30 bg-danger/10 text-danger"
  return "border-warning/30 bg-warning/10 text-warning"
}

export default function DocumentsUpload() {
  const [docs] = useState(MOCK_DOCS)
  const [message, setMessage] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Documentos • PROPESQ</title>
      </Helmet>

      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <div className="space-y-6">
          <header className="w-full rounded-2xl border border-neutral/30 bg-white px-6 py-6">
            <h1 className="text-2xl font-bold text-primary">Documentos</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral">
              Envie e acompanhe os documentos exigidos para manutenção do vínculo
              e pagamento de bolsa.
            </p>
          </header>

          <section className="rounded-2xl border border-neutral/30 bg-white p-6">
            <label className="block text-sm">
              <span className="text-neutral">Anexar arquivo (protótipo)</span>
              <input
                type="file"
                className="mt-2 block w-full text-sm text-primary"
                onChange={() => setMessage("Arquivo registrado localmente (protótipo).")}
              />
            </label>
            {message && <p className="mt-3 text-sm text-primary">{message}</p>}
          </section>

          <section className="rounded-2xl border border-neutral/30 bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold text-primary">Situação</h2>
            <ul className="space-y-3">
              {docs.map((doc) => (
                <li
                  key={doc.id}
                  className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral/20 pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-sm font-medium text-primary">{doc.nome}</span>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${statusClass(doc.status)}`}
                  >
                    {doc.status}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <Link
                to="/discente/perfil"
                className="rounded-lg border border-neutral/30 px-4 py-2 text-sm text-primary"
              >
                Voltar ao perfil
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
