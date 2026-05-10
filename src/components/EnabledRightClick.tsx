import { getAcitveWindow } from "../utils/chromeApis/getCurrentAcitivewindow";
import { excuteScript } from "../utils/chromeApis/runScriptOn";

// import React from "react";
const EnabledRightClick = () => {
  const handleEnabledRightClick = async () => {
    const tabInfo = await getAcitveWindow();

    if (!tabInfo || !tabInfo.id) return;
    await excuteScript(tabInfo.id, enableRightClickScript);
  };

  const enableRightClickScript = () => {
    // Remove context menu restrictions
    document.oncontextmenu = null;
    document.body.oncontextmenu = null;

    // Allow selection and copying
    document.onselectstart = null;
    document.body.onselectstart = null;
    document.oncopy = null;
    document.body.oncopy = null;

    // Add a capturing event listener to ensure right-click works
    document.addEventListener(
      "contextmenu",
      (e) => {
        e.stopPropagation();
      },
      true
    );

    console.log("Right-click enabled!");
  };

  return <button onClick={handleEnabledRightClick}>Enable Right Click</button>;
};

export default EnabledRightClick;
