import { LessonCard } from '@/pages/main/leftcontent/lessons/features/LessonCard';
import { useEffect, useState } from 'react';
import "./Lessons.css"
import KUTGLoading from '../../features/KUTGLoading';
import KUTGTabHeader from '../../features/KUTGTabHeader';


export default function Lessons() {
    const [lessons, setLessons] = useState<any>("");
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [userLoaded, setUserLoaded] = useState(false);

    const [user, setUser] = useState({
        name: "Гость",
        group: null as string | null,
        admin: null as boolean | null,
        login: null as string | null,
        pass: null as string | null,
    });

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                console.log("Parsed user:", parsed);
                if (parsed.name) setUser(parsed);
            } catch (e) {
                console.error("Ошибка парса юзера:", e);
            }
        }
        setUserLoaded(true);
    }, []);

    const getLessons = async (): Promise<any> => {
        const userLogin = user.login;
        console.log("Получение расписания!!!");
        if (!userLogin) {
            console.warn("❌ user login отсутствует");
            return "";
        }

        try {
            console.log("📤 Отправляю запрос:", { userLogin });
            const response = await fetch("/api/lessons/today", {
                method: "POST",
                credentials: "include",
            });

            console.log("📥 Ответ сервера:", response.status);

            if (!response.ok) {
                const msg = await response.text();
                console.error("❌ Ошибка ответа:", msg);
                throw new Error(msg);
            }

            const data = await response.json();
            console.log("✅ Успешно получили:", data);
            return data;
        } catch (e) {
            console.error("⚠️ Ошибка запроса:", e);
            return "";
        }
    };

    useEffect(() => {
        console.log(">>> Проверка перед getLessons():", {
            userLoaded,
            login: user.login,
        });

        if (!userLoaded || !user.login) {
            console.log("❌ Условия не выполнены, getLessons не вызван");
            return;
        }

        console.log("🚀 Вызываю getLessons()");
        getLessons().then((res) => {
            setLessons(res);

            const today = new Date();
            const daysMap: Record<number, string> = {
                0: "воскресенье",
                1: "понедельник",
                2: "вторник",
                3: "среда",
                4: "четверг",
                5: "пятница",
                6: "суббота",
            };

            const todayName = daysMap[today.getDay()];
            const dayKeys = Object.keys(res ?? {});
            const foundDay = dayKeys.find(
                (day) => day.toLowerCase().includes(todayName)
            );

            if (foundDay) {
                setSelectedDay(foundDay);
                console.log("✅ Выбран день:", foundDay);
            } else {
                console.warn("❌ Сегодняшний день не найден в расписании");
            }
        });
    }, [userLoaded, user.login, user.pass]);


    const schedule = lessons ?? {};

    const selectedLessons = selectedDay ? schedule[selectedDay] ?? [] : [];

    return (
        <>
            <> 
                <KUTGTabHeader title='Расписание на сегодня' />
                {
                    !lessons && (
                        <KUTGLoading />
                    )
                }
                {lessons && selectedLessons.map((lesson: any, i: number) => {
                    const [rawStart, rawEnd] = (lesson.time || "").split(" - ");
                    const startTime = rawStart?.replace(".", ":") ?? "";
                    const endTime = rawEnd?.replace(".", ":") ?? "";

                    return (
                        <LessonCard
                            key={i}
                            lesson={{
                                name: `${lesson.subject} (${lesson.type})`,
                                startTime: startTime,
                                endTime: endTime,
                                room: lesson.cabinet,
                                teacher: lesson.teacher,
                            }}
                        />
                    );
                })}
            </>
        </>
    );
}
