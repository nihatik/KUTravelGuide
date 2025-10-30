import { useEffect, useState } from "react";
import { HistoryCard } from "@/pages/main/leftcontent/buildings/features/HistoryCard";
import BuildingService from "@/services/api/BuildingService";
import KUTGTabHeader from "../../features/KUTGTabHeader";
import { BookmarkCard } from "./features/BookmarkCard";

type SimpleBuilding = { id: number; name: string; address: string };

const LOCAL_STORAGE_KEY = "bookmarks";

export default function Bookmarks() {
    const [bookmarks, setBookmarks] = useState<SimpleBuilding[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
            setBookmarks(JSON.parse(stored));
        }
    }, []);

    const handleRemove = (id: number) => {
        const updated = bookmarks.filter(b => b.id !== id);
        setBookmarks(updated);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    };

    const handleClick = (id: number) => {
        BuildingService.setActiveById(id);
    };

    if (bookmarks.length === 0) {
        return <p>У вас пока нет закладок.</p>;
    }

    return (
        <div>
            <KUTGTabHeader title="Ваши закладки" />
            {bookmarks.map((b) => (
                <BookmarkCard
                    name={b.name}
                    address={b.address}
                    onClick={() => handleClick(b.id)}
                    onRemove={() => handleRemove(b.id)}
                />
            ))}
        </div>
    );
}
