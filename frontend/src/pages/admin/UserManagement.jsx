import UserDetailModal from './UserDetailModal.jsx'

const UserManagement = ({
  users,
  selectedUser,
  setSelectedUser,
  suspendReason,
  setSuspendReason,
  suspendUser,
  activateUser,
  verifyFreelancer
}) => {
  return (
    <div className="users-section">
      <h2>Manage Users</h2>

      {selectedUser ? (
        <UserDetailModal
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          suspendReason={suspendReason}
          setSuspendReason={setSuspendReason}
          suspendUser={suspendUser}
          activateUser={activateUser}
          verifyFreelancer={verifyFreelancer}
        />
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Verified</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>

                <td>
                  <span
                    className={`status ${
                      user.isSuspended ? 'suspended' : 'active'
                    }`}
                  >
                    {user.isSuspended ? 'Suspended' : 'Active'}
                  </span>
                </td>

                <td>{user.isVerified ? '✓' : '✗'}</td>

                <td>
                  <button
                    className="btn-manage"
                    onClick={() => setSelectedUser(user)}
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default UserManagement