import { KeyboardEvent, useEffect, useState } from "react"
import { useDispatch,useSelector } from "react-redux";
import { addMessage } from "../actions";


type stateType = {
  RootReducer:{
    messages:Array<Object>;
    socketObj:any,
    userObj:any
  }
}

export default function Chatspace()
{

    const [text,setText] = useState<string>("");

    const {messages,socketObj,userObj} = useSelector((state:stateType)=> state.RootReducer);

    // console.log(messages);

    const dispatch = useDispatch();

    function handleSend(){
      
        if(!text) return 

        let payload = {
            sender:userObj.username ? userObj.username : "Anonymous",
            content:text
        }

        dispatch(addMessage(payload));
        setText("");
        socketObj.emit("chat",payload);
    }

    function handleChange(e:any)
    {
      setText(e.target.value)
    }


    return (
        <div className="chatspace position-absolute position-relative col-md-4 col-12 border">
          <div className="chats">
            {
              messages.map((message:any)=>(
                <div className="message p-3" key={Math.random()}>
                  <span className="payload">{message.content}</span>
                  <div className="sender">{message.sender}</div>
                </div>
              ))
            }

          </div>

          <div className="send-message-div p-2 position-absolute bottom-0">
             <input type="text" placeholder="Type message" value={text} onChange={handleChange}/>
             <button onClick={handleSend}>Send</button>
          </div>
        </div>
    )
}