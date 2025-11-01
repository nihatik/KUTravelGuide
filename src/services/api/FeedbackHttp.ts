export interface FeedbackDTO {
  id?: number;
  senderLogin: string;
  message: string;
  answer?: string;
  askedAt: string;
  answeredAt?: string;
}

const BASE_URL = "/api/feedback";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with ${res.status}`);
  }
  return (await res.json()) as T;
}

export const FeedbackHttp = {
  async list(): Promise<FeedbackDTO[]> {
    const res = await fetch(BASE_URL, { credentials: "include" });
    return handleResponse<FeedbackDTO[]>(res);
  },

  async reply(id: number, answer: string): Promise<FeedbackDTO> {
    const res = await fetch(`${BASE_URL}/${id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ answer }),
    });
    return handleResponse<FeedbackDTO>(res);
  },

  async send(payload: { senderLogin: string; message: string }): Promise<FeedbackDTO> {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    return handleResponse<FeedbackDTO>(res);
  },
};


