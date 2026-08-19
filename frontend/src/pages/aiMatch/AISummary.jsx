const AISummary = ({ summary }) => {
  return (
    <div className="ai-summary">
      <p className="ai-summary-label">
        Gemini AI Assessment
      </p>

      <p className="ai-summary-text">
        💡 {summary}
      </p>
    </div>
  )
}

export default AISummary