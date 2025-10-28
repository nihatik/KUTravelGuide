import { useEffect, useState } from "react";
import { UsersHttp, type UserDTO } from "@/services/api/UsersHttp";
import "./UsersAdminPage.css";

export default function UsersAdminPage() {
  const [items, setItems] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const data = await UsersHttp.list();
      setItems(data);
    } catch (e: any) {
      setError(e?.message || "Не удалось загрузить пользователей");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="users-admin">
      <div className="header"><h2>Пользователи</h2></div>
      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Загрузка...</div>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Логин</th>
              <th>Имя</th>
              <th>Email</th>
              <th>Группа</th>
              <th>Роль</th>
            </tr>
          </thead>
          <tbody>
            {items.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.login}</td>
                <td>{u.name}</td>
                <td>{u.email || "—"}</td>
                <td>{u.group || "—"}</td>
                <td>{u.role || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}