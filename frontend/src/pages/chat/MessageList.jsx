const MessageList = ({
  messages,
  isTyping,
  userId,
  messagesEndRef,
}) => {
  return (
    <div className="messages-container">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`message ${
            (msg.senderId?._id || msg.senderId)?.toString() === userId
              ? 'sent'
              : 'received'
          }`}
        >
          <div className="message-content">
            <p>{msg.content}</p>

            <span className="message-time">
              {new Date(
                msg.createdAt
              ).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}

      {isTyping && (
        <div className="message typing-indicator">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList