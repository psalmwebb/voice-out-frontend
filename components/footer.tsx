import {useState} from "react";
import Chatspace from "./chatspace";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";


type stateType = {
    RootReducer:{
      messages:Array<Object>;
      socketObj:Object,
      userObj:Object,
      peerObj:Object,
      roomDetailsObj:Object,
      userStreamObj:MediaStream
    }
}

export default function Footer()
{
    const [audioEnabled,setAudioEnabled] = useState<Boolean>(true);

    const [showChat,setShowChat] = useState(false);

    const {userStreamObj} = useSelector((state:stateType)=> state.RootReducer);

    const router = useRouter();

    function handleLeaveRoom(){
       
        router.push("/dashboard");
    }

    function handleAudio(){
        userStreamObj.getAudioTracks()[0].enabled = !audioEnabled;
        setAudioEnabled(!audioEnabled);
    }

    return (
        
        <>
        <footer className="position-fixed border bottom-0">
        <div className="d-flex justify-content-around col-md-6 offset-md-3">
            <div className="controls" onClick={handleLeaveRoom}>
                <i className="fa fa-phone-slash"></i>
            </div>
            <div className="controls" onClick={handleAudio}>
                <i className={audioEnabled ? "fa fa-microphone":"fas fa-microphone-slash"}></i>
            </div>
            <div className="controls" onClick={()=> setShowChat(!showChat)}>
                <i className="fa fa-comment-alt"></i>
            </div>
        </div>
    </footer>

        { showChat && <Chatspace/>}
        </>
    )
}