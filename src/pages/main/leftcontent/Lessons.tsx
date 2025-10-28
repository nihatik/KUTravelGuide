import { LessonCard } from '@/pages/main/leftcontent/features/LessonCard';
import { useEffect, useState } from 'react';
import "./Lessons.css"


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
        console.log("Stored user:", stored);
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

            // Определяем сегодняшний день недели
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

    if (!lessons) {
        return (
            <div className="flex flex-col items-center text-gray-400 mt-8">
                <svg
                    fill="#03BFD366"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 animate-spin mb-2"
                >
                    <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z">
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            dur="0.75s"
                            values="0 12 12;360 12 12"
                            repeatCount="indefinite"
                        />
                    </path>
                </svg>
                <p>Загрузка расписания...</p>
            </div>
        );
    }

    const schedule = lessons ?? {};

    const selectedLessons = selectedDay ? schedule[selectedDay] ?? [] : [];

    return (
        <>
            {selectedDay && (
                <>
                    <div className='centerX column lessons-top'>
                        <span>Расписание на сегодня</span>
                    </div>

                    {selectedLessons.map((lesson: any, i: number) => {
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
            )}</>
    );
}
