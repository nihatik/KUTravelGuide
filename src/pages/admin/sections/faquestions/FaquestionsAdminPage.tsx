import { useEffect, useState } from "react";
import { QuestionsHttp, type QuestionDTO } from "@/services/api/QuestionsHttp";
import "./FaquestionsAdminPage.css";
// TODO: вынести css если нужно

export default function FaquestionsAdminPage() {
  const [items, setItems] = useState<QuestionDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<QuestionDTO> | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const data = await QuestionsHttp.list();
      setItems(data);
    } catch (e: any) {
      setError(e?.message || "Не удалось загрузить FAQ");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm({ question: "", answer: "", category: "", destination: null });
    setModalOpen(true);
  }
  function openEdit(q: QuestionDTO) {
    setForm({ ...q });
    setModalOpen(true);
  }
  async function save() {
    if (!form?.question || !form.answer) return;
    try {
      setLoading(true);
      setError(null);
      if (form.id) {
        await QuestionsHttp.update(form.id, form as QuestionDTO);
      } else {
        await QuestionsHttp.create(form as QuestionDTO);
      }
      setModalOpen(false);
      await load();
    } catch (e: any) {
      setError(e?.message || "Не удалось сохранить вопрос");
    } finally {
      setLoading(false);
    }
  }
  async function remove(id?: number) {
    if (!id || !confirm("Удалить запись?")) return;
    try {
      setLoading(true);
      setError(null);
      await QuestionsHttp.remove(id);
      await load();
    } catch (e: any) {
      setError(e?.message || "Не удалось удалить вопрос");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="faquestions-admin feedback-admin" style={{padding: 16}}>
      <div className="header">FAQ</div>
      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Загрузка...</div>}
      <div className="list">
        {items.map((q) => (
          <div className="card" key={q.id}>
            <div style={{fontWeight: 600, fontSize: '17px', marginBottom: 6}}>{q.question}</div>
            <div className="answer-text"><b>Ответ:</b> {q.answer}</div>
            <div className="meta"><b>Категория:</b> {q.category || "—"} &nbsp; <b>Назначение:</b> {q.destination || "—"}</div>
            <div className="actions">
              <button onClick={() => openEdit(q)}>Изменить</button>
              <button className="danger" onClick={() => remove(q.id)}>Удалить</button>
            </div>
          </div>
        ))}
      </div>
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">{form?.id ? "Изменить запись" : "Добавить вопрос"}
              <button className="icon" onClick={()=>setModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <label style={{display:'block', marginBottom:9}}>Вопрос<input className="full" value={form?.question||""} onChange={e => setForm(v => ({...v!, question: e.target.value }))} /></label>
              <label style={{display:'block', marginBottom:9}}>Ответ<textarea className="full" value={form?.answer||""} onChange={e => setForm(v => ({...v!, answer: e.target.value }))} /></label>
              <label style={{display:'block', marginBottom:9}}>Категория<input className="full" value={form?.category||""} onChange={e => setForm(v => ({...v!, category: e.target.value }))} /></label>
              <label style={{display:'block', marginBottom:9}}>Назначение<input className="full" value={form?.destination||""} onChange={e => setForm(v => ({...v!, destination: e.target.value }))} /></label>
            </div>
            <div className="modal-footer">
              <button onClick={()=>setModalOpen(false)}>Отмена</button>
              <button className="primary" onClick={save}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
