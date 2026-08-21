import MessageList from './MessageList.jsx'
import MessageInput from './MessageInput.jsx'

const ChatWindow = ({
  activeConversation,
  messages,
  messageInput,
  setMessageInput,
  handleTyping,
  sendMessage,
  isTyping,
  messagesEndRef,
}) => {
  if (!activeConversation) {
    return (
      <div className="chat-main">
        <div className="chat-placeholder">
          <p>Select a conversation to start chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-main">
      <div className="chat-header">
        <h3>
          {activeConversation.user[0]?.name}
        </h3>

        <p className="chat-status">
          Active now
        </p>
      </div>

      <MessageList
        messages={messages}
        isTyping={isTyping}
        userId={localStorage.getItem('userId')}
        messagesEndRef={messagesEndRef}
      />

      <MessageInput
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        handleTyping={handleTyping}
        sendMessage={sendMessage}
      />
    </div>
  )
}

export default ChatWindow