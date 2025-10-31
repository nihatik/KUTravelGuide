export interface ServerBuildingDTO {
  id: number | null;
  name: string;
  description: string;
  buildingType: string;
  address: string;
  latitude: number;
  longitude: number;
  floors: any[] | null;
  previewImages: string[];
}

const BASE_URL = "/api/buildings";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with ${res.status}`);
  }
  return (await res.json()) as T;
}
function getFormData(payload: ServerBuildingDTO, imageFile?: File): FormData {
  const formData = new FormData();
  formData.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));
  if (imageFile) formData.append("image", imageFile);
  return formData;
}

export const BuildingsHttp = {
  async list(): Promise<ServerBuildingDTO[]> {
    const res = await fetch(BASE_URL, { credentials: "include" });
    return handleResponse<ServerBuildingDTO[]>(res);
  },

  async create(payload: ServerBuildingDTO, imageFile?: File): Promise<ServerBuildingDTO> {
    const formData = getFormData(payload, imageFile);
    const res = await fetch(BASE_URL, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    return handleResponse<ServerBuildingDTO>(res);
  },

  async update(id: number, payload: ServerBuildingDTO, imageFile?: File): Promise<ServerBuildingDTO> {
    const formData = getFormData(payload, imageFile);
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: formData,
      credentials: "include",
    });
    return handleResponse<ServerBuildingDTO>(res);
  },

  async remove(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Delete failed with ${res.status}`);
    }
  },
};


