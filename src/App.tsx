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
import SlideImageCopier from "./components/SlieImageCopierV2";
// import MultiplicationTables from "./components/MulitipleTable";

const MainPlayGround = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <DisableChat />

      <DownLoadAttachement />

      <OpenBatch
        name="Lakshya Batch"
        id="6779345c20fa0756e4a7fd08"
      />

      <OpenBatch
        name="Arjuna Batch"
        id="676e4dee1ec923bc192f38c9"
      />

      <OpenBatch
        name="JEE One Revision"
        id="64e4c8338149b2001892a969"
      />

      <OpenRecentLecture />

      <DarkThemScriptForPw />

      <WebsiteOpener
        name="Exam Goal"
        url="https://room.examgoal.com/"
      />

      <WebsiteOpener
        name="Manjil Physical Chemistery"
        url="https://www.pw.live/watch/?categoryId=68d4e946703add795fe1d8e3&widgetId=6899cf046c4844a03edc43f5&vType=OTT&type=penpencilvdo&childId=69535f62c17f7ff7ac3b41ff&playlistId=69275e714f137fb50d33a5e2"
      />

      <WebsiteOpener
        name="Manjil Physical Chemistery"
        url="https://www.pw.live/watch/?categoryId=68d4e946703add795fe1d8e3&widgetId=6899cf046c4844a03edc43f5&vType=OTT&type=penpencilvdo&childId=69535f62c17f7ff7ac3b41ff&playlistId=69275e714f137fb50d33a5e2"
      />

      <WebsiteOpener
        name="Manjil 2025"
        url="https://www.pw.live/study-v2/batches/671f5ea96059088394262c30/batch-overview"
      />

      <WebsiteOpener
        name="PW Mentorshipt"
        url="https://www.pw.live/study-v2/mentorship/chat/6779345c20fa0756e4a7fd08"
      />

      <HideStamps />

      {/* <MultiplicationTables/> */}

      <TimeTravel />
      <ProvideToken/>
      <EnabledRightClick />
      {/* <SlideImageCopier /> */}
      <SlideImageCopier/>
    </div>
  );
};

export default MainPlayGround;