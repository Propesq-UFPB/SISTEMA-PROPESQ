import React from "react";
import { AlertCircle } from "lucide-react";
import { Card } from "@/features/work-plans/components/formPrimitives";

export function NoProjectSelectedCard() {
  return (
    <Card
      title="Nenhum projeto selecionado"
      subtitle="Selecione um projeto aprovado ou validado na lista acima para liberar o formulário."
      icon={<AlertCircle size={18} className="text-primary" />}
    >
      <div className="rounded-2xl border border-dashed border-neutral/30 bg-neutral/5 p-6 text-center">
        <p className="text-sm font-semibold text-primary">
          O formulário de plano de trabalho será exibido após a seleção do
          projeto.
        </p>

        <p className="mt-1 text-xs text-neutral">
          A vinculação do novo plano será feita com base no projeto
          selecionado nesta página.
        </p>
      </div>
    </Card>
  );
}
