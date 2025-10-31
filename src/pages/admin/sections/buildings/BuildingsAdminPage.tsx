import { useEffect, useMemo, useState } from "react";
import { BuildingsHttp, type ServerBuildingDTO } from "@/services/api/BuildingsHttp";
import { BuildingType } from "@/types/building/BuildingType";
import "./BuildingsAdminPage.css";

const initialForm: ServerBuildingDTO = {
  id: null,
  name: "",
  description: "",
  buildingType: BuildingType.Campus,
  address: "",
  latitude: 0,
  longitude: 0,
  floors: null,
  previewImages: [],
};

export default function BuildingsAdminPage() {
  const [items, setItems] = useState<ServerBuildingDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<ServerBuildingDTO>(initialForm);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const buildingTypeOptions = useMemo(
    () => [
      BuildingType.Campus,
      BuildingType.Eatery,
      BuildingType.Coffee,
      BuildingType.Gym,
      BuildingType.Dormitory,
      BuildingType.Hospital,
      BuildingType.Station,
    ],
    []
  );

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const data = await BuildingsHttp.list();
      setItems(data);
    } catch (e: any) {
      setError(e?.message || "Не удалось загрузить здания");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm(initialForm);
    setIsModalOpen(true);
  }

  function openEdit(b: ServerBuildingDTO) {
    setForm(b);
    setIsModalOpen(true);
  }

  async function save() {

    try {
      setLoading(true);
      setError(null);
      if (form.id) {
        await BuildingsHttp.update(form.id, form, imageFile ?? undefined);
      } else {
        await BuildingsHttp.create(form, imageFile ?? undefined);
      }
      setIsModalOpen(false);
      await load();
    } catch (e: any) {
      setError(e?.message || "Не удалось сохранить здание");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id?: number) {
    if (!id) return;
    if (!confirm("Удалить здание?")) return;
    try {
      setLoading(true);
      setError(null);
      await BuildingsHttp.remove(id);
      await load();
    } catch (e: any) {
      setError(e?.message || "Не удалось удалить здание");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="buildings-admin">
      <div className="header">
        <h2>Здания</h2>
        <button className="primary" onClick={openCreate}>+ Добавить</button>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Загрузка...</div>}

      <div className="list">
        {items.map((b) => {
          return (
            <div key={b.id} className="building-admin-card">
              <div className="title-row">
                <div className="title">{b.name}</div>
                <div className="type">{b.buildingType}</div>
              </div>
              <div className="meta">
                <div><b>Адрес:</b> {b.address || "—"}</div>
                <div><b>Координаты:</b> {`${b.latitude}, ${b.longitude}`}</div>
                <div><b>Этажей:</b> {/* отображаем только количество этажей на клиенте */}
                  {Array.isArray((b as any).floors) ? (b as any).floors.length : (b as any).floorCount ?? "—"}
                </div>
              </div>
              <div className="actions">
                <button onClick={() => openEdit(b)}>Изменить</button>
                <button className="danger" onClick={() => remove(b.id ? b.id : -1)}>Удалить</button>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{form.id ? "Изменить здание" : "Добавить здание"}</h3>
              <button className="icon" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="grid">
                <label>
                  <span>Название</span>
                  <input value={form.name} onChange={e => setForm(v => ({ ...v, name: e.target.value }))} />
                </label>
                <label>
                  <span>Тип</span>
                  <select value={form.buildingType} onChange={e => setForm(v => ({ ...v, buildingType: e.target.value }))}>
                    {buildingTypeOptions.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label className="full">
                  <span>Описание</span>
                  <textarea value={form.description} onChange={e => setForm(v => ({ ...v, description: e.target.value }))} />
                </label>
                <label className="full">
                  <span>Адрес</span>
                  <input value={form.address} onChange={e => setForm(v => ({ ...v, address: e.target.value }))} />
                </label>
                <label>
                  <span>Широта</span>
                  <input type="number" step="any" value={form.latitude ?? ""} onChange={e => setForm(v => ({ ...v, latitude: e.target.value === "" ? 0 : Number(e.target.value) }))} />
                </label>
                <label>
                  <span>Долгота</span>
                  <input type="number" step="any" value={form.longitude ?? ""} onChange={e => setForm(v => ({ ...v, longitude: e.target.value === "" ? 0 : Number(e.target.value) }))} />
                </label>
                <label>
                  <span>Кол-во этажей (только отображение)</span>
                  <input type="number" min={0} value={form.floors?.length ?? 0} onChange={e => setForm(v => ({ ...v, floors: Array.from({ length: Number(e.target.value) }) }))} />
                </label>
                <label className="full">
                  <span>Изображение (превью)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)}
                  />
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setIsModalOpen(false)}>Отмена</button>
              <button className="primary" onClick={save}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}