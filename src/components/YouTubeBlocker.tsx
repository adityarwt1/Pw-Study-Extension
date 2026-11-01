import { useEffect, useState } from "react";

const YOUTUBE_BLOCKED_KEY = "youtubeBlocked";
const YOUTUBE_TOPICS_KEY = "youtubeTopics";

const YouTubeBlocker = () => {
  const [youtubeBlocked, setYoutubeBlocked] = useState(true);
  const [youtubeTopics, setYoutubeTopics] = useState("");
  const [topicsSaved, setTopicsSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    chrome.storage.local
      .get([YOUTUBE_BLOCKED_KEY, YOUTUBE_TOPICS_KEY])
      .then((data) => {
        setYoutubeBlocked(Boolean(data[YOUTUBE_BLOCKED_KEY] ?? true));
        const savedTopics = data[YOUTUBE_TOPICS_KEY];
        setYoutubeTopics(typeof savedTopics === "string" ? savedTopics : "");
      })
      .catch((loadError: unknown) => {
        console.error("Failed to load YouTube settings:", loadError);
        setError("Could not load YouTube settings.");
      });
  }, []);

  const toggleYouTubeBlock = async () => {
    const nextValue = !youtubeBlocked;
    await chrome.storage.local.set({ [YOUTUBE_BLOCKED_KEY]: nextValue });
    setYoutubeBlocked(nextValue);
  };

  const saveTopics = async () => {
    try {
      await chrome.storage.local.set({ [YOUTUBE_TOPICS_KEY]: youtubeTopics });
      setTopicsSaved(true);
      setError("");
    } catch (saveError: unknown) {
      console.error("Failed to save YouTube topics:", saveError);
      setTopicsSaved(false);
      setError("Could not save topics. Please try again.");
    }
  };

  return (
    <section className="youtube-topic-filter">
      <label htmlFor="youtube-topics">YouTube topics to show</label>
      <input
        id="youtube-topics"
        type="text"
        value={youtubeTopics}
        onChange={(event) => {
          setYoutubeTopics(event.target.value);
          setTopicsSaved(false);
        }}
        placeholder="e.g. jee, coding"
      />
      <p>Separate topics with commas. Cards matching any topic will be shown.</p>
      <button onClick={saveTopics}>Save topics</button>
      {topicsSaved && <p role="status">Topics saved.</p>}
      {error && <p role="alert">{error}</p>}
      <button
        onClick={toggleYouTubeBlock}
        title={youtubeBlocked ? "Allow YouTube" : "Block YouTube"}
      >
        {youtubeBlocked ? "Allow YouTube" : "Block YouTube"}
      </button>
    </section>
  );
};

export default YouTubeBlocker;