// não to usando

import { ArrowLeft, Download, ExternalLink, FileText, Info } from "lucide-react";
import { Link } from "react-router-dom";

export default function DownloadWorkModel() {
  const sigaaLink = "src\public\XXXIII-ENIC-NORMAS.pdf";

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* BOTÃO VOLTAR */}
          <div className="flex items-center justify-between">
            <Link
              to="/discente/enic/submissions"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
            >
              <ArrowLeft size={16} />
              Voltar para submissões
            </Link>
          </div>

          {/* CABEÇALHO */}
          <section className="w-full rounded-3xl border border-neutral/20 bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <FileText size={14} />
                  Modelo institucional
                </div>

                <h1 className="text-2xl font-bold text-primary sm:text-3xl">
                  Baixar Modelo de Trabalho
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-7 text-neutral sm:text-base">
                  Acesse e baixe o modelo oficial de trabalho disponibilizado
                  para orientação e padronização do documento.
                </p>
              </div>

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Download size={26} />
              </div>
            </div>
          </section>

          {/* CONTEÚDO PRINCIPAL */}
          <section className="w-full rounded-3xl border border-neutral/20 bg-white p-6 sm:p-7">
            <div className="space-y-5">
              <div className="rounded-2xl border border-neutral/20 bg-neutral-light p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-primary">
                      Modelo de Trabalho
                    </h3>

                    <p className="mt-1 text-sm text-neutral">
                      Arquivo em PDF com as orientações do modelo institucional.
                    </p>
                  </div>

                  <a
                    href={sigaaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
                  >
                    <Download size={16} />
                    Baixar modelo
                    <ExternalLink size={15} />
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}