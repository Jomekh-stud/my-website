import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#faf9f6",
          color: "#ffffff",
          fontSize: 72,
          fontWeight: 800,
          letterSpacing: -2,
          borderRadius: 42,
          fontFamily: "Arial",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 122,
            height: 122,
            left: -20,
            top: -18,
            background: "rgba(108, 63, 197, 0.28)",
            borderRadius: "58% 42% 54% 46% / 45% 58% 42% 55%",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 112,
            height: 112,
            right: -16,
            top: 20,
            background: "rgba(255, 107, 107, 0.26)",
            borderRadius: "48% 52% 44% 56% / 58% 44% 56% 42%",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 98,
            height: 98,
            right: 18,
            bottom: -18,
            background: "rgba(255, 217, 61, 0.32)",
            borderRadius: "52% 48% 60% 40% / 45% 60% 40% 55%",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 92,
            height: 92,
            left: 18,
            bottom: -15,
            background: "rgba(107, 203, 119, 0.3)",
            borderRadius: "60% 40% 47% 53% / 44% 56% 44% 56%",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            color: "#241634",
            fontSize: 92,
            lineHeight: 1,
            letterSpacing: -4,
            fontWeight: 900,
          }}
        >
          JQ
        </div>
      </div>
    ),
    size,
  );
}
