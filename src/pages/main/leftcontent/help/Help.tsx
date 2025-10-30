import KUTGSearch from '../../features/KUTGSearch';
import { QuestionCategory } from './features/QuestionCategory';
import { useEffect, useMemo, useState } from 'react';
import { QuestionsHttp, type QuestionDTO } from '@/services/api/QuestionsHttp';
import KUTGLoading from '../../features/KUTGLoading';
import { QuestionCard } from './features/QuestionCard';

export default function Help() {
    const [items, setItems] = useState<QuestionDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value.toLowerCase());
    };

    useEffect(() => {
        void load();
    }, []);

    const filteredIds = useMemo(() => {
        if (!searchValue.trim()) return items.map(b => b.id);

        return items
            .filter(b =>
                b.question.toLowerCase().includes(searchValue) ||
                b.answer?.toLowerCase().includes(searchValue)
            )
            .map(b => b.id);
    }, [searchValue, items]);

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(prev => (prev === category ? "" : category));
    };
    const removeSelectedCategory = () => {
        setSelectedCategory("");
    };

    async function load() {
        try {
            setLoading(true);
            setError(null);
            const data = await QuestionsHttp.list();
            setItems(data);
        } catch (e: any) {
            setError(e?.message || "Не удалось загрузить вопросы");
        } finally {
            setLoading(false);
        }
    }

    const categories = useMemo(() => {
        const set = new Set(items.map(q => q.category));
        return Array.from(set);
    }, [items]);

    return (
        <>
            <KUTGSearch onChange={handleInput} />
            <div>
                <div className='category-filter'>
                    {searchValue === "" && selectedCategory === "" && (
                        <p className='hint'>Выберите категорию или введите интересующий вас вопрос</p>
                    )}

                    {selectedCategory && (
                        <div
                            className="selected-questions-category"
                            onClick={removeSelectedCategory}
                        >
                            {selectedCategory}
                        </div>
                    )}

                    {searchValue && !selectedCategory && (
                        <p className='hint'>Результаты поиска по запросу: "{searchValue}"</p>
                    )}
                </div>
                {error && <div className="error">{error}</div>}
                {loading && <KUTGLoading />}
                {!loading && !error && searchValue == "" && selectedCategory == "" && categories.map(category => (
                    <QuestionCategory key={category} category={category}
                        onClick={() => handleCategoryClick(category)} />
                ))}

                {(searchValue !== "" || selectedCategory !== "") && items.map((item: QuestionDTO) => (
                    filteredIds.includes(item.id) &&
                    (selectedCategory === "" || item.category === selectedCategory) &&
                    <QuestionCard
                        key={"question-" + item.id}
                        question={item.question}
                        answer={item.answer}
                    />
                ))}
            </div>
        </>
    );
}
