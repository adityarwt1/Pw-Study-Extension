import { useState } from "react";
import { getAcitveWindow } from "../utils/chromeApis/getCurrentAcitivewindow";
import { excuteScript } from "../utils/chromeApis/runScriptOn";

const DisableChat = () => {
    const [isChatDisabled, setisChatDibaled] = useState<boolean>(false)
    const disableChatPw = async () => {
        const tab = await getAcitveWindow();
    
        if (!tab?.id) return;
    
        const newState = !isChatDisabled;
        setisChatDibaled(newState);
    
        await excuteScript(tab.id, (isDisabled) => {
            const footerElement = document.querySelector("#footer-right-section");
    
            if (footerElement) {
                const children = footerElement.children;
    
                for (let i = 0; i < 2; i++) {
                    const el = children[i];
                    if (el instanceof HTMLElement) {
                        el.style.opacity = isDisabled ? "0" : "1";
                        el.style.pointerEvents = isDisabled ? "none" : "auto"; // optional (click disable)
                    }
                }
            }
        }, [newState]); // 👈 pass state here
    };
   
    return (
        <div style={{
            width:"100%",
            marginRight:"4px",
            marginLeft:"4px",
            marginTop:"2px",
            marginBottom:"2px",
            border:1,
            borderColor:"white"
        }}>
        <button onClick={disableChatPw}>{isChatDisabled ? "Enable Chat":"Disable Chat"}</button>
        </div>
    )
}
export default DisableChat