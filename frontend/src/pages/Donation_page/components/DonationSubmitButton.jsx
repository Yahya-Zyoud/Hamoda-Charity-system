function DonationSubmitButton({ loading, paymentMethod }) {
  const label = paymentMethod === "stripe" ? "انتقل إلى الدفع" : "إرسال طلب التبرع";

  return (
    <button
      type="submit"
      className="dp-submit-btn"
      disabled={loading}
    >
      {loading ? (
        <span className="dp-spinner" />
      ) : (
        label
      )}
    </button>
  );
}

export default DonationSubmitButton;
