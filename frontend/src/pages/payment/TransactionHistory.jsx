const TransactionHistory = ({
  payments,
  loading,
}) => {
  const getStatusClass = (status) => {
    const map = {
      pending: 'pending',
      completed: 'completed',
      refunded: 'refunded',
      escrow: 'escrow',
    };

    return map[status] || 'pending';
  };

  return (
    <div className="transactions-card">

      <h3>Transaction History</h3>

      {loading ? (
        <div className="payment-loading">
          Loading...
        </div>
      ) : payments.length === 0 ? (
        <div className="empty-transactions">

          <div className="empty-icon">
            💳
          </div>

          <p>No transactions found</p>

        </div>
      ) : (
        <div className="transactions-table-wrapper">

          <table className="transactions-table">

            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Method</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>

            <tbody>

              {payments.map((payment) => (
                <tr key={payment._id}>

                  <td className="tx-id">
                    {payment._id.substring(0, 8)}...
                  </td>

                  <td className="tx-amount">
                    $
                    {payment.amount?.toFixed(2)}
                  </td>

                  <td>
                    <span
                      className={`tx-status ${getStatusClass(
                        payment.status
                      )}`}
                    >
                      {payment.status}
                    </span>
                  </td>

                  <td>
                    {payment.paymentMethod}
                  </td>

                  <td>
                    {new Date(
                      payment.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td></td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
};

export default TransactionHistory;