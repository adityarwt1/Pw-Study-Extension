import { getAcitveWindow } from "../utils/chromeApis/getCurrentAcitivewindow";
import { excuteScript } from "../utils/chromeApis/runScriptOn";

const OpenRecentLecture = () => {
  const handleOpenRecentBatch = async () => {
    const tabId = await getAcitveWindow();
    if (!tabId?.id) return;

    // exculate script
    await excuteScript(tabId.id, async () => {
      const fetchUrl = new URL(
        "https://api.penpencil.co/v3/video-stats/recent-watch",
      );
      const date = new Date();
      const daysDiff = 5;
      date.setDate(date.getDate() - daysDiff);

      const modifiedAt = date.toISOString().replace("Z", "");
      fetchUrl.searchParams.append("modifiedAt", modifiedAt);
      const response = await fetch(fetchUrl, {
        headers: {
          authorization: `Bearer ${window.localStorage.getItem("TOKEN")}`,
        },
        method: "GET",
      });
      const res = await response.json();
      console.log(res);
      const lecture = res.data[0];
      console.log(lecture);
      const url = new URL("https://www.pw.live/watch/");

      // Use set() to avoid duplicates
      url.searchParams.set("batchSubjectId", lecture.batchSubjectId);
      url.searchParams.set("scheduleId", lecture.scheduleId);
      url.searchParams.set("type", "penpencilvdo");
      url.searchParams.set("doubtTime", lecture.lastWatchedPointInSec);
      url.searchParams.set("learn2Earn", "true");
      url.searchParams.set("parentId", lecture.batchId);
      url.searchParams.set("vType", "BATCHES");
      url.searchParams.set("childId", lecture._id);

      // Open in new tab
      window.open(url.toString(), "_blank");
    });
  };
  return <button onClick={handleOpenRecentBatch}>Recent Lecture</button>;
};
export default OpenRecentLecture;
