import { useEffect, useState } from "react";

const YOUTUBE_BLOCKED_KEY = "youtubeBlocked";
const YOUTUBE_TOPICS_KEY = "youtubeTopics";

const YouTubeBlocker = () => {
  const [youtubeBlocked, setYoutubeBlocked] = useState(true);
  const [youtubeTopics, setYoutubeTopics] = useState("");
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [topicsChanged, setTopicsChanged] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    chrome.storage.local
      .get([YOUTUBE_BLOCKED_KEY, YOUTUBE_TOPICS_KEY])
      .then((data) => {
        setYoutubeBlocked(Boolean(data[YOUTUBE_BLOCKED_KEY] ?? true));
        const savedTopics = data[YOUTUBE_TOPICS_KEY];
        setYoutubeTopics(typeof savedTopics === "string" ? savedTopics : "");
        setSettingsLoaded(true);
      })
      .catch((loadError: unknown) => {
        console.error("Failed to load YouTube settings:", loadError);
        setError("Could not load YouTube settings.");
      });
  }, []);

  useEffect(() => {
    if (!settingsLoaded || !topicsChanged) return;

    const timeoutId = window.setTimeout(() => {
      chrome.storage.local
        .set({ [YOUTUBE_TOPICS_KEY]: youtubeTopics })
        .then(() => setError(""))
        .catch((saveError: unknown) => {
          console.error("Failed to save YouTube topics:", saveError);
          setError("Could not save topics. Please try again.");
        });
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [settingsLoaded, topicsChanged, youtubeTopics]);

  const toggleYouTubeBlock = async () => {
    const nextValue = !youtubeBlocked;
    await chrome.storage.local.set({ [YOUTUBE_BLOCKED_KEY]: nextValue });
    setYoutubeBlocked(nextValue);
  };

  return (
    <>
      <input
        id="youtube-topics"
        className="youtube-topic-input"
        type="text"
        aria-label="YouTube topics to show"
        value={youtubeTopics}
        disabled={!settingsLoaded}
        onChange={(event) => {
          setYoutubeTopics(event.target.value);
          setTopicsChanged(true);
        }}
        placeholder="YouTube topics (e.g. jee, coding)"
        title={error || "Topics save automatically"}
      />
      <button
        onClick={toggleYouTubeBlock}
        title={youtubeBlocked ? "Allow YouTube" : "Block YouTube"}
      >
        {youtubeBlocked ? "Allow YouTube" : "Block YouTube"}
      </button>
      {error && <p role="alert">{error}</p>}
    </>
  );
};

export default YouTubeBlocker;