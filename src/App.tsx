import DisableChat from "./components/DisbableChat";
import DownLoadAttachement from "./components/DowloadClassNote";
import OpenBatch from "./components/OpenLakshya";
import OpenRecentLecture from "./components/OpenRecentLeacture";
import DarkThemScriptForPw from "./components/DarkTheme"
const MainPlayGround = () => {
  return (
    <div>
      <DisableChat />
      <DownLoadAttachement />
      <OpenBatch name="Lakshya Batch" id="6779345c20fa0756e4a7fd08" />
      <OpenBatch name="Arjuna Batch" id="676e4dee1ec923bc192f38c9" />
      <OpenRecentLecture/>
      <DarkThemScriptForPw/>
    </div>
  );
};

export default MainPlayGround;
