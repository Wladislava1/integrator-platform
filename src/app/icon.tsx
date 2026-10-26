import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: "#1f8a55",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: -0.5,
          flexDirection: "column",
          lineHeight: 1.05,
        }}
      >
        <span>Св</span>
        <span>ID</span>
      </div>
    ),
    size,
  );
}
