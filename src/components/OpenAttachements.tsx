import { useEffect, useState } from "react";
import { getAcitveWindow } from "../utils/chromeApis/getCurrentAcitivewindow";
import { excuteScript } from "../utils/chromeApis/runScriptOn";

const BASE_URL =
  "https://api.penpencil.co/ott/v1/ott/video/details";

const OpenAttachments = () => {
  const [currentTabId, setCurrentTabId] = useState<number>(0);
  const [status, setStatus] = useState("");

  const handleOpenAttachments = async () => {
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

      setStatus("Fetching attachments...");

      const attachments = await excuteScript<
        [string],
        { baseUrl: string; key: string }[]
      >(
        tabId,
        async (baseUrl: string) => {
          const url = new URL(window.location.href);
          const childId = url.searchParams.get("childId");

          if (!childId) {
            throw new Error("childId not found.");
          }

          const token = localStorage.getItem("TOKEN");

          if (!token) {
            throw new Error("TOKEN not found.");
          }

          const response = await fetch(`${baseUrl}/${childId}`, {
            headers: {
              authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
          }

          const json = await response.json();

          return json.data.attachments;
        },
        [BASE_URL]
      );

      if (!attachments?.length) {
        setStatus("No attachments found.");
        return;
      }

      setStatus(`Opening ${attachments.length} attachments...`);

      // Recommended for Chrome extensions
      for (const attachment of attachments) {
        chrome.tabs.create({
          url: `${attachment.baseUrl}${attachment.key}`,
          active: false,
        });
      }

      setStatus("Done.");
    } catch (err) {
      console.error(err);

      setStatus(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  };

  useEffect(() => {
    const load = async () => {
      const tab = await getAcitveWindow();

      if (tab && typeof tab.id === "number") {
        setCurrentTabId(tab.id);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (!status) return;

    const timer = setTimeout(() => setStatus(""), 3000);

    return () => clearTimeout(timer);
  }, [status]);

  return (
    <button onClick={handleOpenAttachments}>
      {status || "Open Attachments"}
    </button>
  );
};

export default OpenAttachments;