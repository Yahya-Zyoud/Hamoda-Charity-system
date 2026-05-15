// components/DonationSubmitButton.jsx
// ─────────────────────────────────────────────────────────────────────────────
// The final submit button for the donation form.
// When isPending is true:
//   - Button is disabled (no double-submit)
//   - CSS spinner appears
//   - Text changes to Arabic loading message
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @param {boolean}  isPending - true while the API call is in progress
 * @param {function} onClick   - called when the button is clicked
 */
function DonationSubmitButton({ isPending, onClick }) {
  return (
    <button
      type="button"
      className="dp-submit-btn"
      onClick={onClick}
      disabled={isPending}
    >
      {isPending ? (
        /* Loading state */
        <>
          <span className="dp-spinner" />
          جاري معالجة التبرع...
        </>
      ) : (
        /* Normal state */
        <>
          ❤️ تبرع الآن
        </>
      )}
    </button>
  );
}

export default DonationSubmitButton;
