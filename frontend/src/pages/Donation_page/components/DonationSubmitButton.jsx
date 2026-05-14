// components/DonationSubmitButton.jsx
// Full-width submit button.
// When isPending = true: button is disabled, spinner shows, text changes.
// When isPending = false: normal "تبرع الآن" state.

function DonationSubmitButton({ isPending, onClick }) {
  return (
    <button
      type="button"
      className="dp-submit-btn"
      onClick={onClick}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <span className="dp-spinner" />
          جاري معالجة التبرع...
        </>
      ) : (
        <>❤️ تبرع الآن</>
      )}
    </button>
  );
}

export default DonationSubmitButton;
