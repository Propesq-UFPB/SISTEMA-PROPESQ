import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { editalService } from "../api/editalService";
import type { EditalLookup } from "../types/edital";

// Lista de editais + edital selecionado, guardado em ?edital= para sobreviver
// à navegação entre as telas que dependem dele (distribuição, consultores)
export function useEditalSelection() {
  const [editais, setEditais] = useState<EditalLookup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    let active = true;

    editalService
      .lookup()
      .then((options) => {
        if (active) setEditais(options);
      })
      .catch(() => {
        if (active) setError("Não foi possível carregar os editais.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const selectedEditalId = searchParams.get("edital") ?? "";
  const selectedEdital =
    editais.find((edital) => String(edital.id) === selectedEditalId) ?? null;

  function selectEdital(id: string) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (id) next.set("edital", id);
        else next.delete("edital");
        return next;
      },
      { replace: true },
    );
  }

  return { editais, loading, error, selectedEditalId, selectedEdital, selectEdital };
}
