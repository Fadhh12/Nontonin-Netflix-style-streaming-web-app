import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Favicon, generated with next/og so no binary asset needs to be committed. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0B0F",
          borderRadius: 6,
        }}
      >
        <div
          style={{
            color: "#FF6B35",
            fontSize: 22,
            fontWeight: 800,
            fontFamily: "sans-serif",
          }}
        >
          N
        </div>
      </div>
    ),
    { ...size },
  );
}
