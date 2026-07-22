import DisableChat from "./components/DisbableChat";
import DownLoadAttachement from "./components/DowloadClassNote";
import OpenBatch from "./components/OpenLakshya";
import OpenRecentLecture from "./components/OpenRecentLeacture";
import DarkThemScriptForPw from "./components/DarkTheme";
import WebsiteOpener from "./components/WebsiteOpener";
import HideStamps from "./components/HideTimeStamps";
import TimeTravel from "./components/TimeTravel";
import EnabledRightClick from "./components/EnabledRightClick";
import ProvideToken from "./components/ProivideToken";
// import SlideImageCopier from "./components/SlieImageCopierV2";
// import MultiplicationTables from "./components/MulitipleTable";

const MainPlayGround = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 gap-2">
      <DisableChat />
      <OpenRecentLecture />

      <DarkThemScriptForPw />

      <DownLoadAttachement />

      <HideStamps />

      <OpenBatch
        name="Lakshya 2027"
        id="6779345c20fa0756e4a7fd08"
      />
      <OpenBatch
        name="Lakshya 2026"
        id="65dc6fbabb55350018d555b7"
      />

      <OpenBatch
        name="Arjuna 2026"
        id="676e4dee1ec923bc192f38c9"
      />

      <OpenBatch
        name="JEE One Shot Revision"
        id="64e4c8338149b2001892a969"
      />
      <WebsiteOpener
        name="Lakshya 2026 Test"
        url="https://www.pw.live/study-v2/batches/65dc6fbabb55350018d555b7/batch-overview?isNewPpjFlow=true&pageName=ALL_TESTS#Tests_6"
      />


      <WebsiteOpener
        name="Exam Goal"
        url="https://room.examgoal.com/"
      />


      <WebsiteOpener
        name="Manjil 2025"
        url="https://www.pw.live/study-v2/batches/671f5ea96059088394262c30/batch-overview"
      />


      <WebsiteOpener
        name="PW Mentorship"
        url="https://www.pw.live/study-v2/mentorship/chat/6779345c20fa0756e4a7fd08"
      />

      {/* <MultiplicationTables/> */}

      <TimeTravel />
      <ProvideToken />
      <EnabledRightClick />
      {/* <SlideImageCopier /> */}
      {/* <SlideImageCopier /> */}
    </div>
  );
};

export default MainPlayGround;