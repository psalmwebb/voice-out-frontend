import Head from "next/head";
import Image from "next/image";
import { NextRouter, useRouter } from "next/router";
import {useEffect, useState} from "react";
import { useDispatch,useSelector } from "react-redux";
import { addRoomDetailsObj, addUserObj } from "../actions";
import {findAllRooms, findUser, saveRoomDetailsToDB} from "../utils";


type stateType = {
    RootReducer:{
      messages:Array<Object>;
      socketObj:Object,
      userObj:any,
      peerObj:any,
      roomDetailsObj:any
    }
}

export default function Dashboard(){

    const [showCreateRoomForm,setShowCreateRoomForm] =  useState<boolean>(false);

    const dispatch = useDispatch();

    const [formData,setFormData] = useState<object>({context:"science",topic:""});

    const [rooms,setRooms] = useState<Array<any>>([]);

    const {userObj} = useSelector((state:stateType)=> state.RootReducer);

    const router:NextRouter = useRouter();

    function handleChange(e:any){
      
       setFormData((prevFormData:object)=>{

          return {...prevFormData,[e.target.name]:e.target.value}
       })
    }

    function handleCreateRoom(e:any){
       e.preventDefault();

       let parseForDB = {...formData,host:userObj.username,roomId:`v-room-${Math.floor(Math.random() * 10E10)}`};

       console.log(parseForDB);

       dispatch(addRoomDetailsObj(parseForDB));

       router.push("/room");

       saveRoomDetailsToDB(parseForDB);
    }

    function handleJoinRoom(e:any){
      
        const {id} = e.target;
          
        const roomtoEnter:any = rooms.find((room:any)=> room.roomId === id);

        dispatch(addRoomDetailsObj(roomtoEnter));

        router.push("/room");
    }


    useEffect(()=>{


        ( async ()=>{

            const userObj = await findUser();

            const roomsFound:Array<Object> = await findAllRooms();

            if(userObj.error){
                return router.push("/");
            }

            dispatch(addUserObj(userObj));

            if(!(roomsFound as any).error){
                setRooms(roomsFound)
            }
        })()

    },[])

    return (
        <div>
            <Head>
                <title>Dashboard</title>
            </Head>

            <main className="dashboard">

            <nav>
                <span className="text-light d-flex align-items-center p-3">Welcome , {userObj.username}</span>
                <img src={userObj.avatar} className="rounded-circle img-fluid"/>
            </nav>

              { showCreateRoomForm && <div className="cover"></div>}

            
            { Object.keys(userObj).length ?  
              <div className="row container-fluid">


               <div className="col-12 col-md-8 offset-md-2 border p-3 content">

                <div className="m-3">
                    <input type="text" className="form-control" placeholder="Search for room..."/>
                    <button className="btn btn-warning btn-sm mt-2 col-3 offset-9" 
                      onClick={()=> setShowCreateRoomForm(true)}>
                        New Room
                    </button>
                </div>

                 <div>
                     <h3 className="text-center">Feeds</h3>
                   {
                     rooms.length ? rooms.map(room=>(
                        <div id={room.roomId} key={Math.random()} className="room-found p-3 m-3 border rounded" onClick={handleJoinRoom}>
                            {room.topic}
                        </div>
                     ))
                     : <h2 className="text-center">No room found</h2>
                   }
                 </div>
               </div>

              { showCreateRoomForm && <form onSubmit={handleCreateRoom} className="new-room-form col-md-5 offset-md-3 border p-3 mt-5">
                  <span onClick={()=> setShowCreateRoomForm(false)}>Close</span>
                  <div className="mt-2">
                      <label>Topic</label>
                      <input type="text" className="form-control" placeholder="Type here" name="topic" onChange={handleChange}/>
                  </div>
                  <div className="mt-2">
                      <label>Context</label>
                      <select className="form-control" onChange={handleChange} name="context">
                          <option value="history">History</option>
                          <option value="science">Science</option>
                          <option value="Technology">Technology</option>
                          <option value="business">Business</option>
                          <option value="others">Others</option>
                      </select>
                  </div>

                  <div className="mt-3">
                    <button className="btn btn-secondary btn-sm">CREATE ROOM</button>
                  </div>
               </form>
            }

             </div>
              : <div className="loader"></div>}

            </main>

        </div>
    )
}