import ConversationItem from './ConversationItem.jsx'

const ConversationList = ({
  conversations,
  activeConversation,
  selectConversation,
  loading,
}) => {
  return (
    <div className="chat-sidebar">
      <h2>Messages</h2>

      {loading ? (
        <p className="loading">Loading conversations...</p>
      ) : conversations.length === 0 ? (
        <p className="no-conversations">
          No conversations yet
        </p>
      ) : (
        <div className="conversations-list">
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation._id}
              conversation={conversation}
              activeConversation={activeConversation}
              selectConversation={selectConversation}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ConversationList