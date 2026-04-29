import { useEffect } from "react";
import { getAcitveWindow } from "../utils/chromeApis/getCurrentAcitivewindow";
import { excuteScript } from "../utils/chromeApis/runScriptOn";

const HideStamps = () => {
    // const [isShow, setisshow]
  // 1. Injected function: This runs inside the WEB PAGE, not the extension popup.
  const handleHideTimeStams = () => {
    const timeDiv = document.getElementById("current-time-placeholder") as HTMLElement;
    const timePleaseFol = document.querySelector("#progress-placeholder") as  HTMLElement
    const vjsElement = document.querySelector(".vjs-progress-holder") as HTMLElement;

    // Logic: Agar element mil jaye (if timeDiv exists), tabhi opacity change karo.
    if (timeDiv && timePleaseFol || vjsElement) {
      timeDiv.style.opacity = "0";
      timeDiv.style.pointerEvents = "none"; // Takki click bhi na ho sake
      timePleaseFol.style.opacity = "0";
      timePleaseFol.style.pointerEvents = "none"; // Takki click bhi na ho sake
      vjsElement.style.opacity = "0";
    } else {
      console.log("Timestamp element not found on this page.");
    }
  };

  // 2. Handler function: To bridge the extension and the tab.
  const handleOnClickFunction = async () => {
    try {
      const tabId = await getAcitveWindow();

      // Check if tabId exists to avoid errors
      if (!tabId || !tabId.id) {
        console.error("No active tab found");
        return;
      }

      // Injecting the script into the active tab
      await excuteScript(tabId.id, handleHideTimeStams);
    } catch (error) {
      console.error("Failed to execute script:", error);
    }
  };

  // 3. Auto-run on mount (Optional): Runs when the component loads
  useEffect(() => {
    handleOnClickFunction();
  }, []); // Empty dependency array means it runs once on load

  return (
    
      <button 
        onClick={handleOnClickFunction}
        // style={{ cursor: "pointer", padding: "5px 10px" }}
      >
        Hide Timestamps
      </button>
   
  );
};

export default HideStamps;