import "./FeedbackForm.css"

export default function FeedbackForm() {
    return (
        <div className="form">
            <div className="feedback-form">
                <label htmlFor="feedback">Обратная связь</label>
                <textarea id="feedback" name="feedback" rows={4} />
                <button type="submit">Отправить</button>
            </div>
        </div>
    )
}