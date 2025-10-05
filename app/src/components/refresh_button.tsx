export default function RefreshButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: 1000,
        background: "rgba(255,255,255,0.9)",
        border: "1px solid #ccc",
        borderRadius: 4,
        padding: "6px 12px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Reset Globe
    </button>
  );
}
