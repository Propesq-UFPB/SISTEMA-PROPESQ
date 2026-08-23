import { useState } from "react";
import { Helmet } from "react-helmet";
import { RotateCcw } from "lucide-react";
import { EditalForm } from "@/features/editais";
import type { StatusEdital } from "@/features/editais";

function submitSuccessMessage(
  nextStatus: StatusEdital,
  created: boolean,
): string {
  if (nextStatus === "PUBLICADO") {
    if (!created) return "Edital publicado com sucesso.";
    return "Edital cadastrado e publicado com sucesso.";
  }

  if (!created) return "Rascunho atualizado com sucesso.";
  return "Rascunho cadastrado com sucesso. A publicação nesta aba reutilizará este registro.";
}

export default function CreateCall() {
  const [formKey, setFormKey] = useState(0);
  const [readOnly, setReadOnly] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <Helmet>
        <title>Criar Edital • PROPESQ</title>
      </Helmet>

      <div className="rounded-2xl border border-neutral-light bg-white p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3">
            <div>
              <h1 className="text-2xl font-bold text-primary">Criar Edital</h1>
              <p className="text-sm text-neutral mt-1 max-w-2xl">
                Registre um novo edital, envie o PDF oficial e informe os campos
                obrigatórios do cadastro para controle de cotas, vigência,
                publicação e acompanhamento administrativo.
              </p>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setFormKey(current => current + 1);
                setReadOnly(false);
                setSuccessMessage(null);
              }}
              disabled={readOnly}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-neutral-light text-primary hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw size={16} />
              Limpar
            </button>
          </div>
        </div>
      </div>

      {successMessage && (
        <output className="block rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </output>
      )}

      <EditalForm
        key={formKey}
        mode="create"
        readOnly={readOnly}
        onSaved={({ status, created }) => {
          setSuccessMessage(submitSuccessMessage(status, created));
          if (status === "PUBLICADO") setReadOnly(true);
        }}
      />
    </div>
  );
}
