export interface ServerBuildingDTO {
  id: number;
  name: string;
  description: string;
  buildingType: string;
  street: string;
  position?: { latitude: number; longitude: number } | [number, number];
  floors: any[];
}

const BASE_URL = "/api/buildings";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with ${res.status}`);
  }
  return (await res.json()) as T;
}

export const BuildingsHttp = {
  async list(): Promise<ServerBuildingDTO[]> {
    const res = await fetch(BASE_URL, { credentials: "include" });
    return handleResponse<ServerBuildingDTO[]>(res);
  },

  async create(payload: ServerBuildingDTO): Promise<ServerBuildingDTO> {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    return handleResponse<ServerBuildingDTO>(res);
  },

  async update(id: number, payload: ServerBuildingDTO): Promise<ServerBuildingDTO> {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
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


