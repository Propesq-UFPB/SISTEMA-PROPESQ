import { apiRequest } from "@/services/apiClient";

export type CategoryLookup = {
  id: number;
  name: string;
};

export const categorySettingsService = {
  lookup() {
    return apiRequest<CategoryLookup[]>("/categories/lookup");
  },
};
