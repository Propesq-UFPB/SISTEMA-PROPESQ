import {
  ApiError,
  apiRequest,
  buildQuery,
  type ApiErrorPayload,
} from "@/services/apiClient";
import type {
  CreateEditalPayload,
  CotaBolsaLookup,
  Edital,
  EditalAttachmentResponse,
  EditalListItem,
  EditalListParams,
  EditalLookup,
  EditalTypeLookup,
  PaginatedResponse,
  UpdateEditalPayload,
} from "../types/edital";

const ENDPOINT = "/editais";
const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

function getAccessToken() {
  return localStorage.getItem("access_token");
}

async function uploadPdf(
  path: string,
  file: File,
): Promise<EditalAttachmentResponse> {
  const body = new FormData();
  body.append("arquivo", file);

  const headers = new Headers();
  const token = getAccessToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers,
    body,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const payload =
      typeof data === "object" ? (data as ApiErrorPayload) : undefined;
    const message =
      payload?.message ??
      payload?.error ??
      String(data || "Erro ao enviar anexo do edital");
    throw new ApiError(response.status, message, payload);
  }

  return data as EditalAttachmentResponse;
}

export const editalService = {
  list(params: EditalListParams = {}) {
    return apiRequest<PaginatedResponse<EditalListItem>>(
      `${ENDPOINT}${buildQuery({ limit: params.limit ?? 10, offset: params.offset ?? 0 })}`,
    );
  },

  lookup() {
    return apiRequest<EditalLookup[]>(`${ENDPOINT}/lookup`);
  },

  typeLookup() {
    return apiRequest<EditalTypeLookup[]>(`${ENDPOINT}/tipo/lookup`);
  },

  cotaBolsaLookup() {
    return apiRequest<CotaBolsaLookup[]>("/cota-bolsa/lookup");
  },

  getById(id: string | number) {
    return apiRequest<Edital>(`${ENDPOINT}/${id}`);
  },

  create(payload: CreateEditalPayload) {
    return apiRequest<Edital>(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update(id: string | number, payload: UpdateEditalPayload) {
    return apiRequest<void>(`${ENDPOINT}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  remove(id: string | number) {
    return apiRequest<void>(`${ENDPOINT}/${id}`, { method: "DELETE" });
  },

  uploadAttachment(id: string | number, file: File) {
    return uploadPdf(`${ENDPOINT}/${id}/anexo`, file);
  },
};
