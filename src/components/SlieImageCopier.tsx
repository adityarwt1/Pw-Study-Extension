import { useState, useCallback } from "react";

interface SlideImg {
  _id: string;
  name: string;
  baseUrl: string;
  key: string;
}

interface Slide {
  _id: string;
  scheduleId: string;
  scheduleIds: string[];
  serialNumber: number;
  name: string;
  img: SlideImg;
  imageUrl: string;
  solutionUrls: string[];
  solutionVerified: boolean;
  isCompleted: boolean;
  timeStamp: string;
  slug: string;
  status: string;
  slideVisited: boolean;
  slideForTimeline: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  updatedBy: string;
}

const slides: Slide[] = [
  {
    _id: "6a16cb2f2a62d83fdc7951c1",
    scheduleId: "6a15e27a4c450d279cd99e3c",
    scheduleIds: [],
    serialNumber: 1,
    name: "slide-1",
    img: {
      _id: "6a16ccfae2ecde82a0836fa8",
      name: "file.png",
      baseUrl: "https://static.pw.live/",
      key: "5eb393ee95fab7468a79d189/49ab6b6e-7612-4acf-a055-05d40377a554.png",
    },
    imageUrl: "cdn5/5eb393ee95fab7468a79d189/49ab6b6e-7612-4acf-a055-05d40377a554.png",
    solutionUrls: [],
    solutionVerified: false,
    isCompleted: true,
    timeStamp: "1",
    slug: "slide-1-309289",
    status: "Active",
    slideVisited: false,
    slideForTimeline: true,
    createdAt: "2026-05-27T10:45:03.965Z",
    updatedAt: "2026-05-27T10:52:42.852Z",
    __v: 0,
    updatedBy: "65056a7ebeafc0001835af80",
  },
  {
    _id: "6a16cb52042a3a6bb9b30024",
    scheduleId: "6a15e27a4c450d279cd99e3c",
    scheduleIds: [],
    serialNumber: 2,
    name: "slide-4",
    img: {
      _id: "6a16cf8e9d078d472242d862",
      name: "file.png",
      baseUrl: "https://static.pw.live/",
      key: "5eb393ee95fab7468a79d189/9d5940ae-e10f-4b25-80cf-c1cdae4bf303.png",
    },
    imageUrl: "cdn5/5eb393ee95fab7468a79d189/9d5940ae-e10f-4b25-80cf-c1cdae4bf303.png",
    solutionUrls: [],
    solutionVerified: false,
    isCompleted: true,
    timeStamp: "35",
    slug: "slide-4-869599",
    status: "Active",
    slideVisited: false,
    slideForTimeline: true,
    createdAt: "2026-05-27T10:45:38.282Z",
    updatedAt: "2026-05-27T11:04:42.189Z",
    __v: 0,
    updatedBy: "65056a7ebeafc0001835af80",
  },
  {
    _id: "6a16cbd1e85dc706d58874c4",
    scheduleId: "6a15e27a4c450d279cd99e3c",
    scheduleIds: [],
    serialNumber: 4,
    name: "slide-37",
    img: {
      _id: "6a16cbd1748b9ae03d377cdc",
      name: "file.png",
      baseUrl: "https://static.pw.live/",
      key: "5eb393ee95fab7468a79d189/5cae97d2-52df-4710-b930-8bc9bf8ff9f7.png",
    },
    imageUrl: "cdn5/5eb393ee95fab7468a79d189/5cae97d2-52df-4710-b930-8bc9bf8ff9f7.png",
    solutionUrls: [],
    solutionVerified: false,
    isCompleted: true,
    timeStamp: "161",
    slug: "slide-37-880359",
    status: "Active",
    slideVisited: false,
    slideForTimeline: true,
    createdAt: "2026-05-27T10:47:45.299Z",
    updatedAt: "2026-05-27T11:04:42.105Z",
    __v: 0,
    updatedBy: "65056a7ebeafc0001835af80",
  },
  {
    _id: "6a16cfcab57f20933546e036",
    scheduleId: "6a15e27a4c450d279cd99e3c",
    scheduleIds: [],
    serialNumber: 7,
    name: "slide-6",
    img: {
      _id: "6a16cfca0953c563886490e0",
      name: "file.png",
      baseUrl: "https://static.pw.live/",
      key: "5eb393ee95fab7468a79d189/3b6fd325-318d-4fa5-af75-01fef2942370.png",
    },
    imageUrl: "cdn5/5eb393ee95fab7468a79d189/3b6fd325-318d-4fa5-af75-01fef2942370.png",
    solutionUrls: [],
    solutionVerified: false,
    isCompleted: true,
    timeStamp: "1180",
    slug: "slide-6-524130",
    status: "Active",
    slideVisited: false,
    slideForTimeline: true,
    createdAt: "2026-05-27T11:04:42.110Z",
    updatedAt: "2026-05-27T11:06:42.297Z",
    __v: 0,
    updatedBy: "65056a7ebeafc0001835af80",
  },
  {
    _id: "6a16d042084495a8a138e4f9",
    scheduleId: "6a15e27a4c450d279cd99e3c",
    scheduleIds: [],
    serialNumber: 8,
    name: "slide-8",
    img: {
      _id: "6a16d1321f510f765424a6f5",
      name: "file.png",
      baseUrl: "https://static.pw.live/",
      key: "5eb393ee95fab7468a79d189/7ba45559-b972-4a12-bcc5-eaea842c3475.png",
    },
    imageUrl: "cdn5/5eb393ee95fab7468a79d189/7ba45559-b972-4a12-bcc5-eaea842c3475.png",
    solutionUrls: [],
    solutionVerified: false,
    isCompleted: true,
    timeStamp: "1300",
    slug: "slide-8-659814",
    status: "Active",
    slideVisited: false,
    slideForTimeline: true,
    createdAt: "2026-05-27T11:06:42.253Z",
    updatedAt: "2026-05-27T11:11:42.289Z",
    __v: 0,
    updatedBy: "65056a7ebeafc0001835af80",
  },
  {
    _id: "6a16d16e656f7fc56f4e4f25",
    scheduleId: "6a15e27a4c450d279cd99e3c",
    scheduleIds: [],
    serialNumber: 9,
    name: "slide-9",
    img: {
      _id: "6a16d3121f510f765424af46",
      name: "file.png",
      baseUrl: "https://static.pw.live/",
      key: "5eb393ee95fab7468a79d189/52605b6c-a933-42f7-82c5-ce2746718b92.png",
    },
    imageUrl: "cdn5/5eb393ee95fab7468a79d189/52605b6c-a933-42f7-82c5-ce2746718b92.png",
    solutionUrls: [],
    solutionVerified: false,
    isCompleted: true,
    timeStamp: "1600",
    slug: "slide-9-715219",
    status: "Active",
    slideVisited: false,
    slideForTimeline: true,
    createdAt: "2026-05-27T11:11:42.200Z",
    updatedAt: "2026-05-27T11:19:42.087Z",
    __v: 0,
    updatedBy: "65056a7ebeafc0001835af80",
  },
  {
    _id: "6a16d34db13fea12ee5da7b6",
    scheduleId: "6a15e27a4c450d279cd99e3c",
    scheduleIds: [],
    serialNumber: 10,
    name: "slide-10",
    img: {
      _id: "6a16d4f2e2ecde82a0838dd7",
      name: "file.png",
      baseUrl: "https://static.pw.live/",
      key: "5eb393ee95fab7468a79d189/c26401ad-652d-443c-8482-fbb48ac0cdbb.png",
    },
    imageUrl: "cdn5/5eb393ee95fab7468a79d189/c26401ad-652d-443c-8482-fbb48ac0cdbb.png",
    solutionUrls: [],
    solutionVerified: false,
    isCompleted: true,
    timeStamp: "2080",
    slug: "slide-10-782502",
    status: "Active",
    slideVisited: false,
    slideForTimeline: true,
    createdAt: "2026-05-27T11:19:41.993Z",
    updatedAt: "2026-05-27T11:27:42.126Z",
    __v: 0,
    updatedBy: "65056a7ebeafc0001835af80",
  },
  {
    _id: "6a16d3c61c5200eb7cdc2370",
    scheduleId: "6a15e27a4c450d279cd99e3c",
    scheduleIds: [],
    serialNumber: 11,
    name: "slide-16",
    img: {
      _id: "6a16d3c6910f710406a5c191",
      name: "file.png",
      baseUrl: "https://static.pw.live/",
      key: "5eb393ee95fab7468a79d189/a93968c8-316f-4dc6-b789-ed86535fd032.png",
    },
    imageUrl: "cdn5/5eb393ee95fab7468a79d189/a93968c8-316f-4dc6-b789-ed86535fd032.png",
    solutionUrls: [],
    solutionVerified: false,
    isCompleted: true,
    timeStamp: "2200",
    slug: "slide-16-062624",
    status: "Active",
    slideVisited: false,
    slideForTimeline: true,
    createdAt: "2026-05-27T11:21:42.413Z",
    updatedAt: "2026-05-27T11:27:42.075Z",
    __v: 0,
    updatedBy: "65056a7ebeafc0001835af80",
  },
  {
    _id: "6a16d52ed2ee18c6a0f5a96f",
    scheduleId: "6a15e27a4c450d279cd99e3c",
    scheduleIds: [],
    serialNumber: 13,
    name: "slide-11",
    img: {
      _id: "6a16d61e0953c5638864a918",
      name: "file.png",
      baseUrl: "https://static.pw.live/",
      key: "5eb393ee95fab7468a79d189/5337674e-8824-4295-9458-ef23720a62e1.png",
    },
    imageUrl: "cdn5/5eb393ee95fab7468a79d189/5337674e-8824-4295-9458-ef23720a62e1.png",
    solutionUrls: [],
    solutionVerified: false,
    isCompleted: true,
    timeStamp: "2560",
    slug: "slide-11-144274",
    status: "Active",
    slideVisited: false,
    slideForTimeline: true,
    createdAt: "2026-05-27T11:27:42.080Z",
    updatedAt: "2026-05-27T11:32:42.580Z",
    __v: 0,
    updatedBy: "65056a7ebeafc0001835af80",
  },
  {
    _id: "6a16d65a27eb520f508c554e",
    scheduleId: "6a15e27a4c450d279cd99e3c",
    scheduleIds: [],
    serialNumber: 14,
    name: "slide-12",
    img: {
      _id: "6a16d7854fa7cc0e68f8d6d4",
      name: "file.png",
      baseUrl: "https://static.pw.live/",
      key: "5eb393ee95fab7468a79d189/72445ab4-ee61-4270-976e-4adb96b007e5.png",
    },
    imageUrl: "cdn5/5eb393ee95fab7468a79d189/72445ab4-ee61-4270-976e-4adb96b007e5.png",
    solutionUrls: [],
    solutionVerified: false,
    isCompleted: true,
    timeStamp: "2860",
    slug: "slide-12-765414",
    status: "Active",
    slideVisited: false,
    slideForTimeline: true,
    createdAt: "2026-05-27T11:32:42.008Z",
    updatedAt: "2026-05-27T11:38:42.485Z",
    __v: 0,
    updatedBy: "65056a7ebeafc0001835af80",
  },
  {
    _id: "6a16d7c25b53e4f8e71f5f6f",
    scheduleId: "6a15e27a4c450d279cd99e3c",
    scheduleIds: [],
    serialNumber: 15,
    name: "slide-13",
    img: {
      _id: "6a16d83a2abadf3da16a5541",
      name: "file.png",
      baseUrl: "https://static.pw.live/",
      key: "5eb393ee95fab7468a79d189/efb4d69a-9fc4-4300-958a-7c121176f2b7.png",
    },
    imageUrl: "cdn5/5eb393ee95fab7468a79d189/efb4d69a-9fc4-4300-958a-7c121176f2b7.png",
    solutionUrls: [],
    solutionVerified: false,
    isCompleted: false,
    timeStamp: "3220",
    slug: "slide-13-676276",
    status: "Active",
    slideVisited: false,
    slideForTimeline: true,
    createdAt: "2026-05-27T11:38:42.444Z",
    updatedAt: "2026-05-27T11:40:42.211Z",
    __v: 0,
    updatedBy: "65056a7ebeafc0001835af80",
  },
];

// ── Utilities ──────────────────────────────────────────────────────────────────

function getSlideAtTime(slides: Slide[], currentTimeInSeconds: number): Slide {
  let low = 0;
  let high = slides.length - 1;
  let result = 0;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const slideTimestamp = parseInt(slides[mid].timeStamp, 10);

    if (slideTimestamp <= currentTimeInSeconds) {
      result = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return slides[result];
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

async function convertToPng(blob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Canvas toBlob failed"))), "image/png");
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = URL.createObjectURL(blob);
  });
}

// ── Types ──────────────────────────────────────────────────────────────────────

type CopyStatus = "idle" | "loading" | "success" | "error";

// ── Sub-components ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status, error }: { status: CopyStatus; error: string | null }) => {
  const config: Record<CopyStatus, { label: string; color: string; bg: string }> = {
    idle:    { label: "Ready",    color: "#64748b", bg: "#f1f5f9" },
    loading: { label: "Copying…", color: "#d97706", bg: "#fffbeb" },
    success: { label: "Copied!",  color: "#059669", bg: "#ecfdf5" },
    error:   { label: "Failed",   color: "#dc2626", bg: "#fef2f2" },
  };
  const { label, color, bg } = config[status];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 99,
        fontSize: 12,
        fontWeight: 600,
        fontFamily: "monospace",
        background: bg,
        color,
        letterSpacing: "0.03em",
        transition: "all 0.2s",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: color,
          display: "inline-block",
          animation: status === "loading" ? "pulse 1s infinite" : "none",
        }}
      />
      {status === "error" && error ? error : label}
    </span>
  );
};

const SlideCard = ({
  slide,
  isCurrent,
  onCopy,
  copyStatus,
}: {
  slide: Slide;
  isCurrent: boolean;
  onCopy: (slide: Slide) => void;
  copyStatus: CopyStatus;
}) => {
  const imageUrl = slide.img.baseUrl + slide.img.key;
  const ts = parseInt(slide.timeStamp, 10);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 16px",
        borderRadius: 10,
        border: isCurrent ? "2px solid #6366f1" : "1px solid #e2e8f0",
        background: isCurrent ? "#eef2ff" : "#fff",
        transition: "all 0.15s",
        position: "relative",
      }}
    >
      {/* Thumbnail */}
      <img
        src={imageUrl}
        alt={slide.name}
        style={{
          width: 72,
          height: 48,
          objectFit: "cover",
          borderRadius: 6,
          border: "1px solid #e2e8f0",
          flexShrink: 0,
          background: "#f8fafc",
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.background = "#e2e8f0";
        }}
      />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: "#1e293b" }}>
            {slide.name}
          </span>
          {isCurrent && (
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#6366f1",
              background: "#e0e7ff",
              padding: "1px 7px",
              borderRadius: 99,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              Current
            </span>
          )}
          {slide.isCompleted && (
            <span style={{ color: "#10b981", fontSize: 13 }}>✓</span>
          )}
        </div>
        <div style={{ fontSize: 12, color: "#64748b", fontFamily: "monospace" }}>
          {formatTime(ts)} &nbsp;·&nbsp; #{slide.serialNumber}
        </div>
      </div>

      {/* Copy button */}
      <button
        onClick={() => onCopy(slide)}
        disabled={copyStatus === "loading"}
        style={{
          flexShrink: 0,
          padding: "7px 14px",
          borderRadius: 7,
          border: "none",
          background: isCurrent ? "#6366f1" : "#f1f5f9",
          color: isCurrent ? "#fff" : "#475569",
          fontWeight: 600,
          fontSize: 13,
          cursor: copyStatus === "loading" ? "not-allowed" : "pointer",
          opacity: copyStatus === "loading" ? 0.6 : 1,
          transition: "all 0.15s",
        }}
      >
        Copy
      </button>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────

export default function SlideImageCopier() {
  const [currentTime, setCurrentTime] = useState<number>(3272);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const [copiedSlideId, setCopiedSlideId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentSlide = getSlideAtTime(slides, currentTime);

  const copyImage = useCallback(async (slide: Slide) => {
    setCopyStatus("loading");
    setCopiedSlideId(slide._id);
    setErrorMsg(null);

    try {
      const imageUrl = slide.img.baseUrl + slide.img.key;
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);

      const blob = await response.blob();
      const pngBlob = await convertToPng(blob);
      const item = new ClipboardItem({ "image/png": pngBlob });
      await navigator.clipboard.write([item]);

      setCopyStatus("success");
      setTimeout(() => {
        setCopyStatus("idle");
        setCopiedSlideId(null);
      }, 2000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setErrorMsg(msg.length > 30 ? msg.slice(0, 30) + "…" : msg);
      setCopyStatus("error");
      setTimeout(() => {
        setCopyStatus("idle");
        setCopiedSlideId(null);
        setErrorMsg(null);
      }, 3000);
    }
  }, []);

  const copyCurrentSlide = useCallback(() => {
    copyImage(currentSlide);
  }, [copyImage, currentSlide]);

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        maxWidth: 560,
        margin: "0 auto",
        padding: 24,
        background: "#f8fafc",
        minHeight: "100vh",
      }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a" }}>
            Slide Image Copier
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "#64748b" }}>
            {slides.length} slides · binary search by timestamp
          </p>
        </div>

        {/* Video time scrubber (simulates video.currentTime) */}
        <div style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: "#1e293b" }}>
              🎬 Video Time
            </span>
            <span style={{
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: 16,
              color: "#6366f1",
            }}>
              {formatTime(currentTime)}
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={parseInt(slides[slides.length - 1].timeStamp, 10) + 300}
            value={currentTime}
            onChange={(e) => setCurrentTime(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#6366f1", cursor: "pointer" }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
            <span>0:00</span>
            <span>{formatTime(parseInt(slides[slides.length - 1].timeStamp, 10) + 300)}</span>
          </div>
        </div>

        {/* Current slide hero */}
        <div style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: "#1e293b" }}>
              Current Slide
            </span>
            <StatusBadge
              status={copiedSlideId === currentSlide._id ? copyStatus : "idle"}
              error={errorMsg}
            />
          </div>

          <img
            src={currentSlide.img.baseUrl + currentSlide.img.key}
            alt={currentSlide.name}
            style={{
              width: "100%",
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              background: "#f1f5f9",
              display: "block",
              marginBottom: 14,
              maxHeight: 220,
              objectFit: "contain",
            }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 600, color: "#1e293b" }}>{currentSlide.name}</div>
              <div style={{ fontSize: 12, color: "#64748b", fontFamily: "monospace" }}>
                @ {formatTime(parseInt(currentSlide.timeStamp, 10))} · #{currentSlide.serialNumber}
              </div>
            </div>

            <button
              onClick={copyCurrentSlide}
              disabled={copyStatus === "loading"}
              style={{
                padding: "10px 22px",
                borderRadius: 8,
                border: "none",
                background: "#6366f1",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                cursor: copyStatus === "loading" ? "not-allowed" : "pointer",
                opacity: copyStatus === "loading" ? 0.7 : 1,
                transition: "all 0.15s",
              }}
            >
              {copiedSlideId === currentSlide._id && copyStatus === "loading"
                ? "Copying…"
                : copiedSlideId === currentSlide._id && copyStatus === "success"
                ? "✓ Copied!"
                : "Copy Image"}
            </button>
          </div>
        </div>

        {/* All slides list */}
        <div style={{ fontWeight: 600, fontSize: 14, color: "#475569", marginBottom: 10 }}>
          All Slides
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {slides.map((slide) => (
            <SlideCard
              key={slide._id}
              slide={slide}
              isCurrent={slide._id === currentSlide._id}
              onCopy={copyImage}
              copyStatus={copiedSlideId === slide._id ? copyStatus : "idle"}
            />
          ))}
        </div>
      </div>
    </>
  );
}