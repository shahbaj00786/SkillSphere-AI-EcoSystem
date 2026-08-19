const UserDetailModal = ({
  selectedUser,
  setSelectedUser,
  suspendReason,
  setSuspendReason,
  suspendUser,
  activateUser,
  verifyFreelancer
}) => {
  return (
    <div className="user-detail-modal">
      <div className="modal-content">
        <button
          className="close-btn"
          onClick={() => setSelectedUser(null)}
        >
          ×
        </button>

        <h3>Manage User: {selectedUser.name}</h3>

        <p>Email: {selectedUser.email}</p>

        <p>
          Status: {selectedUser.isSuspended ? 'Suspended' : 'Active'}
        </p>

        {selectedUser.isSuspended ? (
          <button
            className="btn-activate"
            onClick={() => activateUser(selectedUser._id)}
          >
            Activate User
          </button>
        ) : (
          <div className="suspend-form">
            <textarea
              placeholder="Reason for suspension..."
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              rows="3"
            />

            <button
              className="btn-suspend"
              onClick={() => suspendUser(selectedUser._id)}
            >
              Suspend User
            </button>
          </div>
        )}

        {!selectedUser.isVerified && (
          <button
            className="btn-verify"
            onClick={() => verifyFreelancer(selectedUser._id)}
          >
            Verify as Freelancer
          </button>
        )}
      </div>
    </div>
  )
}

export default UserDetailModal