import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        background: "linear-gradient(135deg, #F97316 0%, #C2410C 100%)",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
        <path
          d="M10 10v12M22 10v12M10 16h12"
          stroke="white"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </svg>
    </div>,
    { ...size }
  );
}
