import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: -1,
          borderRadius: 16,
          fontFamily: "Arial",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 42,
            height: 42,
            left: -10,
            top: -8,
            background: "rgba(108, 63, 197, 0.28)",
            borderRadius: "58% 42% 54% 46% / 45% 58% 42% 55%",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 38,
            height: 38,
            right: -8,
            top: 7,
            background: "rgba(255, 107, 107, 0.26)",
            borderRadius: "48% 52% 44% 56% / 58% 44% 56% 42%",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 32,
            height: 32,
            right: 10,
            bottom: -7,
            background: "rgba(255, 217, 61, 0.32)",
            borderRadius: "52% 48% 60% 40% / 45% 60% 40% 55%",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 30,
            height: 30,
            left: 10,
            bottom: -6,
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
            fontSize: 34,
            lineHeight: 1,
            letterSpacing: -1.6,
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
