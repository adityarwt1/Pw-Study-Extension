import { getAcitveWindow } from "../utils/chromeApis/getCurrentAcitivewindow"
import { excuteScript } from "../utils/chromeApis/runScriptOn";

const OpenBatch = ({ name, id }: { name: string; id: string }) => {
  const openBatch = async () => {
    const tabInfor = await getAcitveWindow();
    if (!tabInfor?.id) return;

    // Pass 'id' as the third argument here
    await excuteScript(
      tabInfor.id,
      (batchId) => {
        // Now 'batchId' is available inside the tab context
        const pathName = `/study-v2/batches/${batchId}/batch-overview`;
        window.location.pathname = pathName;
      },
      [id] // The 'id' from props is sent here
    );
  };

  return <button onClick={openBatch}>{name}</button>;
};

export default OpenBatch