const ConversationItem = ({
  conversation,
  activeConversation,
  selectConversation,
}) => {
  const user = conversation.user[0]

  return (
    <div
      className={`conversation-item ${
        activeConversation?._id === conversation._id
          ? 'active'
          : ''
      }`}
      onClick={() => selectConversation(conversation)}
    >
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt="avatar"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      ) : (
        <div className="conversation-avatar">
          {user?.name?.charAt(0).toUpperCase() || '?'}
        </div>
      )}

      <div className="conv-info">
        <p className="conv-name">
          {user?.name}
        </p>

        <p className="last-message">
          {conversation.lastMessage}
        </p>
      </div>
    </div>
  )
}

export default ConversationItem