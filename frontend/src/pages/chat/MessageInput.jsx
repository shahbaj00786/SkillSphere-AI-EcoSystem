const MessageInput = ({
  messageInput,
  setMessageInput,
  handleTyping,
  sendMessage,
}) => {
  return (
    <form
      className="message-input-form"
      onSubmit={sendMessage}
    >
      <input
        type="text"
        placeholder="Type a message..."
        value={messageInput}
        onChange={(e) => {
          setMessageInput(e.target.value)
          handleTyping()
        }}
        className="message-input"
      />

      <button
        type="submit"
        className="send-btn"
      >
        Send
      </button>
    </form>
  )
}

export default MessageInput