

export function getUserMedia()
{
    return navigator.mediaDevices.getUserMedia({video:false,audio:true});
}



export function addAudioObj(audioDivRef:any,stream:any,remoteUserObj:any,mute:boolean){
 
    let audio:HTMLAudioElement = document.createElement("audio");
    let div:HTMLDivElement = document.createElement("div");
    let label:HTMLLabelElement = document.createElement("label");
    let span:HTMLSpanElement = document.createElement("span");
    let i = document.createElement("i");

    i.classList.add("fa");
    i.classList.add("fa-microphone");
    div.classList.add("border");
    div.classList.add("rounded-circle");
    div.classList.add("mt-3");
    div.classList.add("p-3");
    div.id = remoteUserObj.id

    label.textContent = remoteUserObj.username ? remoteUserObj.username : "Anonymous";

    div.style.backgroundImage = remoteUserObj.avatar ? `url(${remoteUserObj.avatar})` : "";

    audio.srcObject = stream;

    audio.autoplay = mute ? true : false;

    div.append(audio);
    div.append(label);
    span.appendChild(i);
    div.append(span);

    audioDivRef.current.appendChild(div);
}


export function removeAudioObj(audioDivRef:any,remoteUserId:string){

    let div:HTMLDivElement = audioDivRef.current.querySelector(`#${remoteUserId}`)
    
    div.remove();
}


const URL = "https://voice-out-backend.herokuapp.com";

export async function saveRoomDetailsToDB(roomDetails:Object)
{
   const res = await fetch(`${URL}/create-room`,{
       
       method:"post",
       headers:{
         "Content-Type":"application/json"
       },
       body:JSON.stringify(roomDetails)
   })

   const data = await res.json();

   console.log(data);
}


export async function removeRoomDetailsFromDB(roomId:string){
 
    const res = await fetch(`${URL}/delete-room/${roomId}`,{
        method:"delete"
    })
 
    const data = await res.json();
 
    console.log(data);
}


export async function findAllRooms()
{

    const res = await fetch(`${URL}/rooms`,{
        method:"get"
    })

    return await res.json();
}

export async function findRoom(roomId:string)
{
    const res = await fetch(`${URL}/room/${roomId}`,{
        method:"get"
    })

    return await res.json();
}


export async function findUser()
{
    const res = await fetch(`${URL}/find-user`,{
        method:"get",
        credentials:"include"
    })

    return await res.json();
}