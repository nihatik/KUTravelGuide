import { useEffect, useState } from "react";
import { FeedbackHttp, type FeedbackDTO } from "@/services/api/FeedbackHttp";
import "./FeedbackAdminPage.css";

export default function FeedbackAdminPage() {
  const [items, setItems] = useState<FeedbackDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replyMap, setReplyMap] = useState<Record<number, string>>({});

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const data = await FeedbackHttp.list();
      setItems(data);
    } catch (e: any) {
      setError(e?.message || "Не удалось загрузить сообщения");
    } finally {
      setLoading(false);
    }
  }

  async function sendReply(id: number) {
    const value = replyMap[id];
    if (!value || value.trim() === "") return;
    try {
      setLoading(true);
      await FeedbackHttp.reply(id, value.trim());
      setReplyMap(prev => ({ ...prev, [id]: "" }));
      await load();
    } catch (e: any) {
      setError(e?.message || "Не удалось отправить ответ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="feedback-admin">
      <div className="header"><h2>Сообщения обратной связи</h2></div>
      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Загрузка...</div>}
      <div className="list">
        {items.map(m => (
          <div key={m.id} className="card">
            <div className="meta">
              <div><b>От:</b> {m.senderLogin}</div>
              <div><b>Вопрос:</b> {new Date(m.askedAt).toLocaleString()}</div>
              <div><b>Ответ:</b> {m.answeredAt ? new Date(m.answeredAt).toLocaleString() : "—"}</div>
            </div>
            <div className="message">{m.message}</div>
            <div className="answer">
              {m.answer ? (
                <div className="answer-text"><b>Ответ:</b> {m.answer}</div>
              ) : (
                <div className="reply-row">
                  <input
                    placeholder="Ваш ответ..."
                    value={replyMap[m.id! ] ?? ""}
                    onChange={e => setReplyMap(prev => ({ ...prev, [m.id!]: e.target.value }))}
                  />
                  <button className="primary" onClick={() => sendReply(m.id!)}>Ответить</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


