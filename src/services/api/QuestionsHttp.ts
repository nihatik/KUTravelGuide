export interface QuestionDTO {
  id: number;
  question: string;
  answer: string;
  category: string;
  destination: string | null
}

const BASE_URL = "/api/faquestions";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with ${res.status}`);
  }
  return (await res.json()) as T;
}

export const QuestionsHttp = {
  async list(): Promise<QuestionDTO[]> {
    const res = await fetch(BASE_URL, { credentials: "include" });
    return handleResponse<QuestionDTO[]>(res);
  },

  async create(payload: QuestionDTO): Promise<QuestionDTO> {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      return handleResponse<QuestionDTO>(res);
    },
  
    async update(id: number, payload: QuestionDTO): Promise<QuestionDTO> {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      return handleResponse<QuestionDTO>(res);
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