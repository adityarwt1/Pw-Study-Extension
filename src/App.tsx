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
import OpenAttachements from "./components/OpenAttachements";
import MapTimeStamps from "./components/MapTimeStamps";
// import SlideImageCopier from "./components/SlieImageCopierV2";
// import MultiplicationTables from "./components/MulitipleTable";

const MainPlayGround = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 gap-2">
      <DisableChat />
      <OpenAttachements/>
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
        name="Manzil 2026 Physics"
        url="https://www.pw.live/watch/?categoryId=68d4e946703add795fe1d8e3&widgetId=6899cf046c4844a03edc43f5&vType=OTT&type=vmeo&childId=6932785d4f137fb50d3ab547&playlistId=691d653a8758bdda113b4c10&default_enabled_feature=PLAYLIST"
      />
      <WebsiteOpener
        name="Manzil 2026 Chemistry"
        url="https://www.pw.live/watch/?categoryId=68d4e946703add795fe1d8e3&widgetId=6899cf046c4844a03edc43f5&vType=OTT&type=vmo&childId=693feb092a7bf8cd0c926986&playlistId=69275e714f137fb50d33a5e2&default_enabled_feature=PLAYLIST"
      />
      <WebsiteOpener
        name="Manzil 2026 Math"
        url="https://www.pw.live/watch/?categoryId=68d4e946703add795fe1d8e3&widgetId=693ab6d6b080f598087ce251&vType=OTT&type=vmeo&playlistId=691e02648758bdda113bec7e&childId=691c13f68758bdda113a2747&default_enabled_feature=PLAYLIST"
      />
      <WebsiteOpener
        name="Manzil 2026 Physics C11"
        url="https://www.pw.live/watch/?categoryId=68d4e946703add795fe1d8e3&widgetId=693ab6d6b080f598087ce251&vType=OTT&type=vmeo&playlistId=6918c7612f10515bf13051cc&childId=6915d45f2f10515bf12e665d&default_enabled_feature=PLAYLIST"
      />
      <WebsiteOpener
        name="Manzil 2026 Chemistry C11"
        url="https://www.pw.live/watch/?categoryId=68d4e946703add795fe1d8e3&widgetId=693ab6d6b080f598087ce251&vType=OTT&type=vmeo&playlistId=691a1de22f10515bf132264a&childId=6915d4682f10515bf12e6660&default_enabled_feature=PLAYLIST"
      />
      <WebsiteOpener
        name="Manzil 2026 Math C11"
        url="https://www.pw.live/watch/?categoryId=68d4e946703add795fe1d8e3&widgetId=693ab6d6b080f598087ce251&vType=OTT&type=vmeo&playlistId=691b6d678758bdda1139a90b&childId=6915d46d2f10515bf12e6663&default_enabled_feature=PLAYLIST"
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
      <MapTimeStamps/>
      {/* <SlideImageCopier /> */}
      {/* <SlideImageCopier /> */}
    </div>
  );
};

export default MainPlayGround;