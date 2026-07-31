import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32, height: 32,
          background: "#3fbf6b",
          border: "2.5px solid #1a1a1a",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui",
          fontWeight: 800,
          fontSize: 16,
          color: "#1a1a1a",
        }}
      >
        CB
      </div>
    ),
    { ...size }
  );
}
"// v1.0"  
