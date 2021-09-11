import Head from 'next/head';
import Image from "next/image";
import { NextRouter, useRouter } from 'next/router';
import PWIMG from "../img/pw.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPhoneSlash,
    faMicrophone,
    faMicrophoneSlash,
    faCommentAlt }   from '@fortawesome/free-solid-svg-icons'
import Chatspace from '../components/chatspace';
import {useState,useEffect,useRef,useLayoutEffect} from "react";
import { useDispatch, useSelector} from 'react-redux';
import {addMessage, addPeerObj, addSocketObj, addUserObj, addUserStream, removePeerObj, removeSocketObj} from "../actions";
import io from "socket.io-client";
import {getUserMedia,addAudioObj, removeAudioObj,removeRoomDetailsFromDB} from "../utils";
import Footer from "../components/footer";


type stateType = {
    RootReducer:{
      messages:Array<Object>;
      socketObj:Object,
      userObj:any,
      peerObj:Object,
      roomDetailsObj:any,
      userStream:Object
    }
}

const URL:any = "https://voice-out-backend.herokuapp.com";

// const URL:any = 'http://localhost:5000';

export default function Room(){

    const dispatch = useDispatch();

    const {socketObj,userObj,roomDetailsObj} = useSelector((state:stateType)=> state.RootReducer);

    const audioDivRef:any = useRef();

    const router:NextRouter = useRouter();

    const [showCover,setShowCover] = useState(true);

    useEffect(() : any =>{

        if(!Object.keys(roomDetailsObj).length) return router.push("/dashboard");

        let socket:any = {}
        let peer:any = {}
        let userStream:any;

        const userId = `voice-out-${Math.floor(Math.random() * 10E13).toString()}`;
       
       if(!Object.keys(socketObj).length){

         socket = io(URL,{query:{roomId:(roomDetailsObj as any).roomId,userId}});

         dispatch(addSocketObj(socket));

         socket.on("connect", async ()=>{

            peer = new (await import ("peerjs")).default(userId);

            let allPeers:any = {};

            peer.on("open", async ()=>{

                userStream = await getUserMedia();

                setShowCover(false);

                dispatch(addUserStream(userStream));

                let obj = {username:"You",avatar:userObj.avatar,id:userId}

                addAudioObj(audioDivRef,userStream,obj,false);

                console.log("connected to peer server...");

                dispatch(addPeerObj(peer))
                

                socket.emit("user-joined",userId);

                socket.on("user-joined",(remoteUserId:string)=>{
            
                   console.log("User has joined the room :",remoteUserId);

                   const options:object = {
                     metadata:{
                         username:userObj.username ? userObj.username : "Anonymous",
                         avatar:userObj.avatar
                    }
                   }

                   const call:any = peer.call(remoteUserId,userStream,options);

                   allPeers[remoteUserId] = call;
 
                 socket.on("remote-user-details",(remoteUserDetails:any)=>{
                    
                      call.on("stream",(remoteUserStream:any)=>{
                      
                      console.log(remoteUserStream);
                      let obj = {
                          username:remoteUserDetails.username,
                          avatar:remoteUserDetails.avatar,
                          id:remoteUserId
                      };

                      addAudioObj(audioDivRef,remoteUserStream,obj,true);
                   })
                 })

                   call.on("close",()=>{
                       console.log("call closed");
                       
                       allPeers[remoteUserId].close()
                       removeAudioObj(audioDivRef,remoteUserId);
                   })
                })

                socket.on("user-leave",(remoteUserId:string)=>{

                   console.log("User has left the room",remoteUserId);
                   removeAudioObj(audioDivRef,remoteUserId);
                })

                socket.on("user-disconnected",(remoteUserId:string)=>{

                    console.log("user-disconnected");
                    removeAudioObj(audioDivRef,remoteUserId);
                })

                peer.on("call", async (call:any)=>{
                   
                    console.log(call);

                    socket.emit("remote-user-details",
                           {receiver:call.peer,username:userObj.username,avatar:userObj.avatar});

                    call.answer(userStream);

                    call.on("stream",(remoteUserStream:MediaStream)=>{

                        let obj = {
                            username:call.metadata.username,
                            avatar:call.metadata.avatar,
                            id:call.peer
                        };
                       
                        addAudioObj(audioDivRef,remoteUserStream,obj,true);
                    })
                })
            })
         })

          socket.on("chat",(messageObj:object)=>{
        
            dispatch(addMessage(messageObj));
    
          })
       }

       return ()=>{

          if(roomDetailsObj.host === userObj.username){
             removeRoomDetailsFromDB(roomDetailsObj.roomId);
          }
          
          Object.keys(socket).length && socket.close();
          dispatch(removeSocketObj());
          dispatch(removePeerObj());

          socket.emit("user-disconnected",userId);
       }
    },[])

 
    return (
        <div>
            <Head>
                <title>Room</title>
            </Head>

   
            <main className="container-fluid p-0 room">

                {showCover && <div className="cover"><div className="loader"></div></div>}


                <nav className="d-flex border p-2 justify-content-between position-absolute top-0">
                   <span>{userObj.username ? userObj.username.toUpperCase() : "Anonymous"}</span>
                   <span><big>{roomDetailsObj.topic}</big></span>
                   <Image src={userObj.avatar ? userObj.avatar : PWIMG} width={40} height={40} className="rounded-circle"/>
                </nav>

                <div className="p-2 speakers-div col-12 border">
                   <div className="speakers d-flex justify-content-around flex-wrap" ref={audioDivRef}>
                 
                   </div>
                </div>
                 
                 <Footer/>
            </main>
        </div>
    )
}