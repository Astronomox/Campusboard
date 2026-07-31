import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180, height: 180,
          background: "#3fbf6b",
          border: "8px solid #1a1a1a",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui",
          fontWeight: 900,
          fontSize: 72,
          color: "#1a1a1a",
        }}
      >
        CB
      </div>
    ),
    { ...size }
  );
}
