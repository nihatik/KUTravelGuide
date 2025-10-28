import { useEffect, useMemo, useState } from "react";
import { BuildingsHttp, type ServerBuildingDTO } from "@/services/api/BuildingsHttp";
import { BuildingType } from "@/types/building/BuildingType";
import "./BuildingsAdminPage.css";

type FormState = {
  id?: number;
  name: string;
  description: string;
  buildingType: string;
  street: string;
  lat?: number;
  lng?: number;
  openTime?: string;
  closeTime?: string;
  floorCount: number;
};

const initialForm: FormState = {
  name: "",
  description: "",
  buildingType: BuildingType.Campus,
  street: "",
  lat: undefined,
  lng: undefined,
  openTime: undefined,
  closeTime: undefined,
  floorCount: 0,
};

export default function BuildingsAdminPage() {
  const [items, setItems] = useState<ServerBuildingDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);

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
      console.log(data)
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
    const latlng = Array.isArray(b.position)
      ? { lat: b.position[0], lng: b.position[1] }
      : (b.position as any);
    setForm({
      id: b.id,
      name: b.name,
      description: b.description || "",
      buildingType: b.buildingType,
      street: b.street || "",
      lat: latlng?.lat,
      lng: latlng?.lng,
      floorCount: 0,
    });
    setIsModalOpen(true);
  }

  async function save() {
    const payload: ServerBuildingDTO = {
      name: form.name.trim(),
      description: form.description?.trim() || "",
      buildingType: form.buildingType,
      street: form.street?.trim() || "",
      position:
        form.lat != null && form.lng != null
          ? { lat: form.lat, lng: form.lng }
          : undefined
    };

    try {
      setLoading(true);
      setError(null);
      if (form.id) {
        await BuildingsHttp.update(form.id, payload);
      } else {
        await BuildingsHttp.create(payload);
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
          const latlng = Array.isArray(b.position)
            ? { lat: b.position[0], lng: b.position[1] }
            : (b.position as any);
          return (
            <div key={b.id} className="building-admin-card">
              <div className="title-row">
                <div className="title">{b.name}</div>
                <div className="type">{b.buildingType}</div>
              </div>
              <div className="meta">
                <div><b>Адрес:</b> {b.street || "—"}</div>
                <div><b>Координаты:</b> {latlng ? `${latlng.lat}, ${latlng.lng}` : "—"}</div>
                <div><b>Этажей:</b> {/* отображаем только количество этажей на клиенте */}
                  {Array.isArray((b as any).floors) ? (b as any).floors.length : (b as any).floorCount ?? "—"}
                </div>
              </div>
              <div className="actions">
                <button onClick={() => openEdit(b)}>Изменить</button>
                <button className="danger" onClick={() => remove(b.id)}>Удалить</button>
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
                  <input value={form.street} onChange={e => setForm(v => ({ ...v, street: e.target.value }))} />
                </label>
                <label>
                  <span>Широта</span>
                  <input type="number" step="any" value={form.lat ?? ""} onChange={e => setForm(v => ({ ...v, lat: e.target.value === "" ? undefined : Number(e.target.value) }))} />
                </label>
                <label>
                  <span>Долгота</span>
                  <input type="number" step="any" value={form.lng ?? ""} onChange={e => setForm(v => ({ ...v, lng: e.target.value === "" ? undefined : Number(e.target.value) }))} />
                </label>
                <label>
                  <span>Время открытия</span>
                  <input type="datetime-local" value={form.openTime ?? ""} onChange={e => setForm(v => ({ ...v, openTime: e.target.value }))} />
                </label>
                <label>
                  <span>Время закрытия</span>
                  <input type="datetime-local" value={form.closeTime ?? ""} onChange={e => setForm(v => ({ ...v, closeTime: e.target.value }))} />
                </label>
                <label>
                  <span>Кол-во этажей (только отображение)</span>
                  <input type="number" min={0} value={form.floorCount} onChange={e => setForm(v => ({ ...v, floorCount: Number(e.target.value) }))} />
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