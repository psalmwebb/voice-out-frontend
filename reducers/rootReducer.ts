import { ADD_MESSAGE, 
    ADD_SOCKET_OBJ, ADD_USER_OBJ, 
    DROP_STORE,ADD_PEER_OBJ, REMOVE_SOCKET_OBJ, 
    REMOVE_PEER_OBJ, ADD_ROOM_DETAILS, REMOVE_ROOM_DETAILS,ADD_ROOMS,REMOVE_ROOMS, ADD_USER_STREAM} from "../constants"


const initState = {
    socketObj:{},
    messages:[
        {sender:"Psalmy Webb",content:"Hi"},
        {sender:"James Barnes",content:"Am fine, You?"},
        {sender:"Peter Smith",content:"We good"}
    ],
    userObj:{},
    peerObj:{},
    roomDetailsObj:{},
    rooms:[],
    userStreamObj:{}
}

type actionType = {
    type:string;
    payload:any
}


export default function RootReducer(state=initState,action:actionType){

    switch(action.type){
        case ADD_SOCKET_OBJ:
            return {...state,socketObj:action.payload};
        case REMOVE_SOCKET_OBJ:
            return {...state,socketObj:{}}
        case ADD_MESSAGE:
            return {...state,messages:[...state.messages,action.payload]};
        case ADD_USER_OBJ:
            return {...state,userObj:action.payload};
        case DROP_STORE:
            return initState
        case ADD_PEER_OBJ:
            return {...state,peerObj:action.payload}
        case REMOVE_PEER_OBJ:
            return {...state,peerObj:{}}
        case ADD_ROOM_DETAILS:
            return {...state,roomDetailsObj:action.payload}
        case REMOVE_ROOM_DETAILS:
            return {...state,roomDetailsObj:{}}
        case ADD_ROOMS:
            return {...state,rooms:action.payload}
        case REMOVE_ROOMS:
            return {...state,rooms:[]}
        case ADD_USER_STREAM:
            return {...state,userStreamObj:action.payload};
        default:
            return initState
    }
}