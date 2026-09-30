import { ImageResponse } from "next/og";

export const contentType = "image/png";

/** 512x512 PWA install icon (app/manifest.ts), generated with next/og. */
export function GET() {
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
        }}
      >
        <div
          style={{
            color: "#FF6B35",
            fontSize: 290,
            fontWeight: 800,
            fontFamily: "sans-serif",
          }}
        >
          N
        </div>
      </div>
    ),
    { width: 512, height: 512 },
  );
}
