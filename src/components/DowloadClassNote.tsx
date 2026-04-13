import { getAcitveWindow } from "../utils/chromeApis/getCurrentAcitivewindow";
import { excuteScript } from "../utils/chromeApis/runScriptOn";

const DownLoadAttachement = ()=>{
    const downloadAttachement = async ()=>{
        
        
          const tabInfor = await getAcitveWindow();
          if (!tabInfor?.id) return;

          await excuteScript(
            tabInfor.id,
            () => {
                const url = new URL(window.location.href)
                const parentId = url.searchParams.get("parentId")
                const batchSubjectId = url.searchParams.get("batchSubjectId")
                const scheduleId = url.searchParams.get("scheduleId")
                const fetchUrl = `https://api.penpencil.co/v1/batches/${parentId}/subject/${batchSubjectId}/schedule/${scheduleId}/schedule-details`;
                (async()=>{
                    const response = await fetch(fetchUrl, {
                        method:'GET',
                        headers:{
                            "Authorization":`Bearer ${window.localStorage.getItem("TOKEN")}`
                        }
                    })
                    const {data} = await response.json()
                    const defaultAcess = data.homeworkIds[0].attachmentIds[0]
                    const pdfAccessUrl = defaultAcess.baseUrl+defaultAcess.key
                    window.open(pdfAccessUrl, "blank")
                })()
                console.log(window.localStorage)
                // console.log(window.location.href)

            },
            [],
          );
    }
    return (
        <button onClick={downloadAttachement}>Class Note</button>
    )
}

export default DownLoadAttachement