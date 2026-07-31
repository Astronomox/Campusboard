import { Backdrop } from "@/components/Backdrop";

export default function Loading() {
  return (
    <>
      <Backdrop />
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            border: "4px solid rgba(26,26,26,0.12)",
            borderTop: "4px solid var(--accent)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
      </div>
    </>
  );
}
