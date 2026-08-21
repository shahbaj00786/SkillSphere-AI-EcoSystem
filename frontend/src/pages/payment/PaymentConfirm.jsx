const PaymentConfirm = ({
  payData,
  paymentMethod,
  setPaymentMethod,
  submitting,
  submitPayment,
}) => {
  return (
    <div className="payment-confirm-box">

      <h3>💳 Confirm Payment</h3>

      <div className="payment-confirm-details">

        <div className="payment-confirm-row">
          <span>Gig ID</span>

          <span>
            {payData.gigId?.substring(0, 12)}...
          </span>
        </div>

        <div className="payment-confirm-row">
          <span>Freelancer</span>

          <span>
            {payData.freelancerId?.substring(
              0,
              12
            )}
            ...
          </span>
        </div>

        <div className="payment-confirm-row total">
          <span>Amount</span>

          <span>
            ${payData.amount}
          </span>
        </div>

      </div>

      <div className="payment-method-select">

        <label>
          Payment Method
        </label>

        <select
          value={paymentMethod}
          onChange={(e) =>
            setPaymentMethod(e.target.value)
          }
        >
          <option value="stripe">
            Stripe
          </option>

          <option value="razorpay">
            Razorpay
          </option>
        </select>

      </div>

      <form onSubmit={submitPayment}>

        <button
          type="submit"
          className="btn-pay-confirm"
          disabled={submitting}
        >
          {submitting
            ? 'Processing...'
            : `Pay $${payData.amount} Now`}
        </button>

      </form>

    </div>
  );
};

export default PaymentConfirm;