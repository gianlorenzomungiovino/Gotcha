export function BackButton({ onClick, children }) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
      className="back-button"
      title={children || "Torna indietro"}
      aria-label="Torna indietro"
      style={{ width: "45px", height: "45px", borderRadius: "50%" }}
    >
      <img
        src="/left-arrow-svgrepo-com.svg"
        alt=""
        style={{ width: "24px", height: "24px", objectFit: "contain" }}
      />
    </button>
  );
}
