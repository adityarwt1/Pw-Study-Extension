import { getAcitveWindow } from "../utils/chromeApis/getCurrentAcitivewindow";
import { excuteScript } from "../utils/chromeApis/runScriptOn";

const WebsiteOpener = ({ name, url }: { name: string; url: string }) => {
  const handleOpenWebsiteUrl = async () => {
    const tabInformation = await getAcitveWindow();
    if (!tabInformation?.id) return;

    await excuteScript(tabInformation.id, (injectedUrl: string) => {
      window.location.href = injectedUrl;
    }, [url]);
  };

  return <button onClick={handleOpenWebsiteUrl}>{name}</button>;
};

export default WebsiteOpener;