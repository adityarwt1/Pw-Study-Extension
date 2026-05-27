(async ()=>{
    const respose = await fetch("https://api.penpencil.co/v1/batches/6779345c20fa0756e4a7fd08/subject/688dda487a8db636a2b1f750/schedule/6a15e27a4c450d279cd99e3c/slides", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9,hi;q=0.8,ne;q=0.7",
    "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3ODA0MTE3ODYuMDI3LCJkYXRhIjp7Il9pZCI6IjY1NjVkYWZlZWU0M2I1YmIwYzU5MDc1YyIsInVzZXJuYW1lIjoiOTI0NDUyNDU2NSIsImZpcnN0TmFtZSI6IkFkaXR5YSIsImxhc3ROYW1lIjoiUmF3YXQiLCJvcmdhbml6YXRpb24iOnsiX2lkIjoiNWViMzkzZWU5NWZhYjc0NjhhNzlkMTg5Iiwid2Vic2l0ZSI6InBoeXNpY3N3YWxsYWguY29tIiwibmFtZSI6IlBoeXNpY3N3YWxsYWgifSwiZW1haWwiOiJhZGl0eWFyYXdhdG5ldzI0ODdAZ21haWwuY29tIiwicm9sZXMiOlsiNWIyN2JkOTY1ODQyZjk1MGE3NzhjNmVmIiwiNWNjOTVhMmU4YmRlNGQ2NmRlNDAwYjM3Il0sImNvdW50cnlHcm91cCI6IklOIiwidHlwZSI6IlVTRVIifSwianRpIjoib1RjSENJRHpSc09Yem5sMnF4bWk4d182NTY1ZGFmZWVlNDNiNWJiMGM1OTA3NWMiLCJpYXQiOjE3Nzk4MDY5ODZ9.ZAm1PScIPN6a65X_dWYl3np2Qzod6xagGUus2KfmK8w",
    "client-id": "5eb393ee95fab7468a79d189",
    "client-type": "WEB",
    "client-version": "200",
    "content-type": "application/json",
    "priority": "u=1, i",
    "randomid": "ffe242de-e651-4d78-bb1c-5a52c5d30ec7",
    "sec-ch-ua": "\"Chromium\";v=\"148\", \"Google Chrome\";v=\"148\", \"Not/A)Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "x-sdk-version": "0.0.20",
    "Referer": "https://www.pw.live/"
  },
  "body": null,
  "method": "GET"
});
const data = await respose.json();
// console.log(data);
const slides = data.data.slides
console.log(slides);
})()

// const slides = [
//   {
//     _id: "6a16cb2f2a62d83fdc7951c1",
//     scheduleId: "6a15e27a4c450d279cd99e3c",
//     scheduleIds: [],
//     serialNumber: 1,
//     name: "slide-1",
//     img: {
//       _id: "6a16ccfae2ecde82a0836fa8",
//       name: "file.png",
//       baseUrl: "https://static.pw.live/",
//       key: "5eb393ee95fab7468a79d189/49ab6b6e-7612-4acf-a055-05d40377a554.png",
//     },
//     imageUrl:
//       "cdn5/5eb393ee95fab7468a79d189/49ab6b6e-7612-4acf-a055-05d40377a554.png",
//     solutionUrls: [],
//     solutionVerified: false,
//     isCompleted: true,
//     timeStamp: "1",
//     slug: "slide-1-309289",
//     status: "Active",
//     slideVisited: false,
//     slideForTimeline: true,
//     createdAt: "2026-05-27T10:45:03.965Z",
//     updatedAt: "2026-05-27T10:52:42.852Z",
//     __v: 0,
//     updatedBy: "65056a7ebeafc0001835af80",
//   },
//   {
//     _id: "6a16cb52042a3a6bb9b30024",
//     scheduleId: "6a15e27a4c450d279cd99e3c",
//     scheduleIds: [],
//     serialNumber: 2,
//     name: "slide-4",
//     img: {
//       _id: "6a16cf8e9d078d472242d862",
//       name: "file.png",
//       baseUrl: "https://static.pw.live/",
//       key: "5eb393ee95fab7468a79d189/9d5940ae-e10f-4b25-80cf-c1cdae4bf303.png",
//     },
//     imageUrl:
//       "cdn5/5eb393ee95fab7468a79d189/9d5940ae-e10f-4b25-80cf-c1cdae4bf303.png",
//     solutionUrls: [],
//     solutionVerified: false,
//     isCompleted: true,
//     timeStamp: "35",
//     slug: "slide-4-869599",
//     status: "Active",
//     slideVisited: false,
//     slideForTimeline: true,
//     createdAt: "2026-05-27T10:45:38.282Z",
//     updatedAt: "2026-05-27T11:04:42.189Z",
//     __v: 0,
//     updatedBy: "65056a7ebeafc0001835af80",
//   },
//   {
//     _id: "6a16cbd1e85dc706d58874c4",
//     scheduleId: "6a15e27a4c450d279cd99e3c",
//     scheduleIds: [],
//     serialNumber: 4,
//     name: "slide-37",
//     img: {
//       _id: "6a16cbd1748b9ae03d377cdc",
//       name: "file.png",
//       baseUrl: "https://static.pw.live/",
//       key: "5eb393ee95fab7468a79d189/5cae97d2-52df-4710-b930-8bc9bf8ff9f7.png",
//     },
//     imageUrl:
//       "cdn5/5eb393ee95fab7468a79d189/5cae97d2-52df-4710-b930-8bc9bf8ff9f7.png",
//     solutionUrls: [],
//     solutionVerified: false,
//     isCompleted: true,
//     timeStamp: "161",
//     slug: "slide-37-880359",
//     status: "Active",
//     slideVisited: false,
//     slideForTimeline: true,
//     createdAt: "2026-05-27T10:47:45.299Z",
//     updatedAt: "2026-05-27T11:04:42.105Z",
//     __v: 0,
//     updatedBy: "65056a7ebeafc0001835af80",
//   },
//   {
//     _id: "6a16cfcab57f20933546e036",
//     scheduleId: "6a15e27a4c450d279cd99e3c",
//     scheduleIds: [],
//     serialNumber: 7,
//     name: "slide-6",
//     img: {
//       _id: "6a16cfca0953c563886490e0",
//       name: "file.png",
//       baseUrl: "https://static.pw.live/",
//       key: "5eb393ee95fab7468a79d189/3b6fd325-318d-4fa5-af75-01fef2942370.png",
//     },
//     imageUrl:
//       "cdn5/5eb393ee95fab7468a79d189/3b6fd325-318d-4fa5-af75-01fef2942370.png",
//     solutionUrls: [],
//     solutionVerified: false,
//     isCompleted: true,
//     timeStamp: "1180",
//     slug: "slide-6-524130",
//     status: "Active",
//     slideVisited: false,
//     slideForTimeline: true,
//     createdAt: "2026-05-27T11:04:42.110Z",
//     updatedAt: "2026-05-27T11:06:42.297Z",
//     __v: 0,
//     updatedBy: "65056a7ebeafc0001835af80",
//   },
//   {
//     _id: "6a16d042084495a8a138e4f9",
//     scheduleId: "6a15e27a4c450d279cd99e3c",
//     scheduleIds: [],
//     serialNumber: 8,
//     name: "slide-8",
//     img: {
//       _id: "6a16d1321f510f765424a6f5",
//       name: "file.png",
//       baseUrl: "https://static.pw.live/",
//       key: "5eb393ee95fab7468a79d189/7ba45559-b972-4a12-bcc5-eaea842c3475.png",
//     },
//     imageUrl:
//       "cdn5/5eb393ee95fab7468a79d189/7ba45559-b972-4a12-bcc5-eaea842c3475.png",
//     solutionUrls: [],
//     solutionVerified: false,
//     isCompleted: true,
//     timeStamp: "1300",
//     slug: "slide-8-659814",
//     status: "Active",
//     slideVisited: false,
//     slideForTimeline: true,
//     createdAt: "2026-05-27T11:06:42.253Z",
//     updatedAt: "2026-05-27T11:11:42.289Z",
//     __v: 0,
//     updatedBy: "65056a7ebeafc0001835af80",
//   },
//   {
//     _id: "6a16d16e656f7fc56f4e4f25",
//     scheduleId: "6a15e27a4c450d279cd99e3c",
//     scheduleIds: [],
//     serialNumber: 9,
//     name: "slide-9",
//     img: {
//       _id: "6a16d3121f510f765424af46",
//       name: "file.png",
//       baseUrl: "https://static.pw.live/",
//       key: "5eb393ee95fab7468a79d189/52605b6c-a933-42f7-82c5-ce2746718b92.png",
//     },
//     imageUrl:
//       "cdn5/5eb393ee95fab7468a79d189/52605b6c-a933-42f7-82c5-ce2746718b92.png",
//     solutionUrls: [],
//     solutionVerified: false,
//     isCompleted: true,
//     timeStamp: "1600",
//     slug: "slide-9-715219",
//     status: "Active",
//     slideVisited: false,
//     slideForTimeline: true,
//     createdAt: "2026-05-27T11:11:42.200Z",
//     updatedAt: "2026-05-27T11:19:42.087Z",
//     __v: 0,
//     updatedBy: "65056a7ebeafc0001835af80",
//   },
//   {
//     _id: "6a16d34db13fea12ee5da7b6",
//     scheduleId: "6a15e27a4c450d279cd99e3c",
//     scheduleIds: [],
//     serialNumber: 10,
//     name: "slide-10",
//     img: {
//       _id: "6a16d4f2e2ecde82a0838dd7",
//       name: "file.png",
//       baseUrl: "https://static.pw.live/",
//       key: "5eb393ee95fab7468a79d189/c26401ad-652d-443c-8482-fbb48ac0cdbb.png",
//     },
//     imageUrl:
//       "cdn5/5eb393ee95fab7468a79d189/c26401ad-652d-443c-8482-fbb48ac0cdbb.png",
//     solutionUrls: [],
//     solutionVerified: false,
//     isCompleted: true,
//     timeStamp: "2080",
//     slug: "slide-10-782502",
//     status: "Active",
//     slideVisited: false,
//     slideForTimeline: true,
//     createdAt: "2026-05-27T11:19:41.993Z",
//     updatedAt: "2026-05-27T11:27:42.126Z",
//     __v: 0,
//     updatedBy: "65056a7ebeafc0001835af80",
//   },
//   {
//     _id: "6a16d3c61c5200eb7cdc2370",
//     scheduleId: "6a15e27a4c450d279cd99e3c",
//     scheduleIds: [],
//     serialNumber: 11,
//     name: "slide-16",
//     img: {
//       _id: "6a16d3c6910f710406a5c191",
//       name: "file.png",
//       baseUrl: "https://static.pw.live/",
//       key: "5eb393ee95fab7468a79d189/a93968c8-316f-4dc6-b789-ed86535fd032.png",
//     },
//     imageUrl:
//       "cdn5/5eb393ee95fab7468a79d189/a93968c8-316f-4dc6-b789-ed86535fd032.png",
//     solutionUrls: [],
//     solutionVerified: false,
//     isCompleted: true,
//     timeStamp: "2200",
//     slug: "slide-16-062624",
//     status: "Active",
//     slideVisited: false,
//     slideForTimeline: true,
//     createdAt: "2026-05-27T11:21:42.413Z",
//     updatedAt: "2026-05-27T11:27:42.075Z",
//     __v: 0,
//     updatedBy: "65056a7ebeafc0001835af80",
//   },
//   {
//     _id: "6a16d52ed2ee18c6a0f5a96f",
//     scheduleId: "6a15e27a4c450d279cd99e3c",
//     scheduleIds: [],
//     serialNumber: 13,
//     name: "slide-11",
//     img: {
//       _id: "6a16d61e0953c5638864a918",
//       name: "file.png",
//       baseUrl: "https://static.pw.live/",
//       key: "5eb393ee95fab7468a79d189/5337674e-8824-4295-9458-ef23720a62e1.png",
//     },
//     imageUrl:
//       "cdn5/5eb393ee95fab7468a79d189/5337674e-8824-4295-9458-ef23720a62e1.png",
//     solutionUrls: [],
//     solutionVerified: false,
//     isCompleted: true,
//     timeStamp: "2560",
//     slug: "slide-11-144274",
//     status: "Active",
//     slideVisited: false,
//     slideForTimeline: true,
//     createdAt: "2026-05-27T11:27:42.080Z",
//     updatedAt: "2026-05-27T11:32:42.580Z",
//     __v: 0,
//     updatedBy: "65056a7ebeafc0001835af80",
//   },
//   {
//     _id: "6a16d65a27eb520f508c554e",
//     scheduleId: "6a15e27a4c450d279cd99e3c",
//     scheduleIds: [],
//     serialNumber: 14,
//     name: "slide-12",
//     img: {
//       _id: "6a16d7854fa7cc0e68f8d6d4",
//       name: "file.png",
//       baseUrl: "https://static.pw.live/",
//       key: "5eb393ee95fab7468a79d189/72445ab4-ee61-4270-976e-4adb96b007e5.png",
//     },
//     imageUrl:
//       "cdn5/5eb393ee95fab7468a79d189/72445ab4-ee61-4270-976e-4adb96b007e5.png",
//     solutionUrls: [],
//     solutionVerified: false,
//     isCompleted: true,
//     timeStamp: "2860",
//     slug: "slide-12-765414",
//     status: "Active",
//     slideVisited: false,
//     slideForTimeline: true,
//     createdAt: "2026-05-27T11:32:42.008Z",
//     updatedAt: "2026-05-27T11:38:42.485Z",
//     __v: 0,
//     updatedBy: "65056a7ebeafc0001835af80",
//   },
//   {
//     _id: "6a16d7c25b53e4f8e71f5f6f",
//     scheduleId: "6a15e27a4c450d279cd99e3c",
//     scheduleIds: [],
//     serialNumber: 15,
//     name: "slide-13",
//     img: {
//       _id: "6a16d83a2abadf3da16a5541",
//       name: "file.png",
//       baseUrl: "https://static.pw.live/",
//       key: "5eb393ee95fab7468a79d189/efb4d69a-9fc4-4300-958a-7c121176f2b7.png",
//     },
//     imageUrl:
//       "cdn5/5eb393ee95fab7468a79d189/efb4d69a-9fc4-4300-958a-7c121176f2b7.png",
//     solutionUrls: [],
//     solutionVerified: false,
//     isCompleted: false,
//     timeStamp: "3220",
//     slug: "slide-13-676276",
//     status: "Active",
//     slideVisited: false,
//     slideForTimeline: true,
//     createdAt: "2026-05-27T11:38:42.444Z",
//     updatedAt: "2026-05-27T11:40:42.211Z",
//     __v: 0,
//     updatedBy: "65056a7ebeafc0001835af80",
//   },
// ];
// function getSlideNumber(slides) {
//   // const videoElement = document.querySelector("video");
//   const currentTimeInSeconds = parseInt(3272.384382);

//   let low = 0;
//   let high = slides.length - 1;
//   let result = 0; // default to first slide

//   while (low <= high) {
//     let mid = Math.floor((low + high) / 2);
//     const slideTimestamp = parseInt(slides[mid].timeStamp); // timeStamp is a string

//     if (slideTimestamp <= currentTimeInSeconds) {
//       result = mid; // this slide is a valid candidate
//       low = mid + 1; // try to find a later matching slide
//     } else {
//       high = mid - 1;
//     }
//   }

//   return slides[result]; // return the full slide object
// }

// console.log(getSlideNumber(slides));

// const convertToPng = (blob) => new Promise((resolve) => {
//   const img = new Image();
//   img.onload = () => {
//     const canvas = document.createElement("canvas");
//     canvas.width = img.width;
//     canvas.height = img.height;
//     canvas.getContext("2d").drawImage(img, 0, 0);
//     canvas.toBlob(resolve, "image/png");
//   };
//   img.src = URL.createObjectURL(blob);
// });

// const copyImage = async () => {
//   const getSlide = getSlideNumber(slides);
//   const imageUrl = "https://static.pw.live/"+"5eb393ee95fab7468a79d189/49ab6b6e-7612-4acf-a055-05d40377a554.png";


//   const response = await fetch(imageUrl);
//   const blob = await response.blob();
  
//   // const pngBlob = await convertToPng(blob);

//   // const item = new ClipboardItem({ "image/png": pngBlob });
//   await navigator.clipboard.writeText(blob);

//   console.log("Image copied to clipboard!");
// };
// copyImage();