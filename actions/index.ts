import { ADD_MESSAGE, ADD_PEER_OBJ, ADD_ROOM_DETAILS, ADD_SOCKET_OBJ, ADD_USER_OBJ, REMOVE_PEER_OBJ, ADD_USER_STREAM,REMOVE_SOCKET_OBJ } from "../constants";

export function addUserObj(userObj:Object){

    return {type:ADD_USER_OBJ,payload:userObj};
}

export function addSocketObj(socketObj:Object){

    return {type:ADD_SOCKET_OBJ,payload:socketObj};
}

export function removeSocketObj(){
    return {type:REMOVE_SOCKET_OBJ};
}


export function addMessage(messageObj:object){

    return {type:ADD_MESSAGE,payload:messageObj};
}

export function addPeerObj(peerObj:object){
    return {type:ADD_PEER_OBJ,payload:peerObj}
}

export function removePeerObj(){

    return {type:REMOVE_PEER_OBJ};
}


export function addRoomDetailsObj(roomDetailsObj:Object){

    return {type:ADD_ROOM_DETAILS,payload:roomDetailsObj};
}

export function addUserStream(userStream:Object){

    return {type:ADD_USER_STREAM,payload:userStream};
}