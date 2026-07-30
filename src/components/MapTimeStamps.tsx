import { useEffect, useState } from "react";
import { getAcitveWindow } from "../utils/chromeApis/getCurrentAcitivewindow";
import { excuteScript } from "../utils/chromeApis/runScriptOn";

const BASE_URL = "https://api.penpencil.co/ott/v1/ott/video/details";

type Subtopic = {
  name: string;
  startTime: string;
  endTime?: string;
  _id: string;
};

type Timeline = {
  name: string;
  subtopics: Subtopic[];
};

const MapTimeStamps = () => {
  const [currentTabId, setCurrentTabId] = useState<number>(0);
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [status, setStatus] = useState("");

  const timeToSeconds = (t: string) => {
    const parts = t.split(":").map((p) => parseInt(p, 10));
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return parts[0] || 0;
  };

  const loadTimelines = async () => {
    try {
      setStatus("Loading timelines...");

      let tabId = currentTabId;
      if (!tabId) {
        const tab = await getAcitveWindow();
        if (!tab || typeof tab.id !== "number") {
          setStatus("No active tab found.");
          return;
        }
        tabId = tab.id;
        setCurrentTabId(tab.id);
      }

      const remoteTimelines = await excuteScript<[string], Timeline[]>(
        tabId,
        async (baseUrl: string) => {
          const url = new URL(window.location.href);
          const childId = url.searchParams.get("childId");

          if (!childId) throw new Error("childId not found.");

          const token = localStorage.getItem("TOKEN");
          if (!token) throw new Error("TOKEN not found.");

          const response = await fetch(`${baseUrl}/${childId}`, {
            headers: { authorization: `Bearer ${token}` },
          });

          if (!response.ok) throw new Error(`API Error: ${response.status}`);

          const json = await response.json();
          return json.data.timelines as Timeline[];
        },
        [BASE_URL]
      );

      if (!remoteTimelines || !remoteTimelines.length) {
        setStatus("No timelines found.");
        return;
      }

      setTimelines(remoteTimelines);
      setStatus("");
    } catch (err) {
      console.error(err);
      setStatus(err instanceof Error ? err.message : "Failed to load timelines.");
    }
  };

  const seekTo = async (seconds: number) => {
    try {
      let tabId = currentTabId;
      if (!tabId) {
        const tab = await getAcitveWindow();
        if (!tab || typeof tab.id !== "number") {
          setStatus("No active tab found.");
          return;
        }
        tabId = tab.id;
        setCurrentTabId(tab.id);
      }

      await excuteScript<[number]>(tabId, (s: number) => {
        const v = document.querySelector("video");
        if (!v) throw new Error("Video element not found on page.");
        // @ts-ignore - running in page context
        v.currentTime = s;
      }, [seconds]);
    } catch (err) {
      console.error(err);
      setStatus(err instanceof Error ? err.message : "Failed to seek video.");
    }
  };

  useEffect(() => {
    const load = async () => {
      const tab = await getAcitveWindow();
      if (tab && typeof tab.id === "number") setCurrentTabId(tab.id);
    };
    load();
  }, []);

  return (
    <div>
      <div>
        <button onClick={loadTimelines}>{status || "Load TimeStamps"}</button>
      </div>

      {timelines.map((tl) => (
        <div key={tl.name}>
          <div>{tl.name}</div>
          {tl.subtopics.map((s) => (
            <button key={s._id} onClick={() => seekTo(timeToSeconds(s.startTime))}>
              {s.name}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MapTimeStamps;