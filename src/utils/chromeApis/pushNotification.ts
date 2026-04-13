export const pushNotification  =async (title:string, message:string)=>{
    await chrome.notifications.create({
        type:"basic",
        iconUrl:"pw.png",
        title,
        message
    })
}