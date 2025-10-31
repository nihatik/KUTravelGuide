export interface UserDTO {
  id: number;
  name: string;
  login: string;
  email: string;
  group: string;
  role: string;
}

const BASE_URL = "/api/users";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with ${res.status}`);
  }
  return (await res.json()) as T;
}

export const UsersHttp = {
  async list(): Promise<UserDTO[]> {
    const res = await fetch(BASE_URL, { credentials: "include" });
    return handleResponse<UserDTO[]>(res);
  },

  async login(login: string, password: string): Promise<UserDTO[]> {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login, password }),
    });
    return handleResponse<UserDTO[]>(res);
  },
};


