function DonationSubmitButton({ loading }) {
  return (
    <button
      type="submit"
      className="dp-submit-btn"
      disabled={loading}
    >
      {loading ? <span className="dp-spinner" /> : "إرسال طلب التبرع"}
    </button>
  );
}

export default DonationSubmitButton;
