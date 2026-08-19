const ActivityLogs = ({ logs }) => {
  return (
    <div className="logs-section">
      <h2>Admin Activity Logs</h2>

      <div className="logs-table">
        <table>
          <thead>
            <tr>
              <th>Admin</th>
              <th>Action</th>
              <th>Target</th>
              <th>Description</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td>{log.adminId?.name || 'Unknown'}</td>

                <td>
                  <span className={`action-badge ${log.action}`}>
                    {log.action.replace(/_/g, ' ')}
                  </span>
                </td>

                <td>{log.targetModel}</td>
                <td>{log.description || '-'}</td>
                <td>
                  {new Date(log.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ActivityLogs