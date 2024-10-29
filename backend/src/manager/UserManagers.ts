import {Socket} from "socket.io"
import { RoomManager } from "./RoomManagers";

export interface User {
    socket : Socket;
    name : string
}

export class UserManager {
    private users: User[];
    private queue: String[];
    private roomManager: RoomManager;

    constructor() {
        this.users = [];
        this.queue = [];
        this.roomManager = new RoomManager;
    }
    addUser(name : string, socket: Socket){
        this.users.push({
            socket, name
        })
        this.queue.push(socket.id);
        socket.send("lobby");
        this.clearQueue();
        this.initHandlers(socket);
    }

    removeUser(socketId:string){
        const user = this.users.find(x => x.socket.id === socketId);
        // if(!user){
        // }
        this.users = this.users.filter(x => x.socket.id !== socketId)
        this.queue = this.queue.filter(x => x === socketId)
    }

    clearQueue(){
        // console.log("inside clear queue")
        // console.log(this.queue.length)
        // this.queue.pop();
        console.log(this.queue)
        if(this.queue.length < 2){
            // console.log("queue is short")
            return;
        }
        console.log("creating room usermanager")
        console.log(this.queue)
        const id1 = this.queue.pop();
        const id2 = this.queue.pop();
        const user1 = this.users.find(x => x.socket.id === id1);
        const user2 = this.users.find(x => x.socket.id === id2);
        if(!user1 || !user2){
            return;
        }
        // console.log("user1",user1," user2",user2)
        // console.log("first")
        if(user1 != user2){
            console.log("id1 " + id1 +" id2 "+id2);
            const room = this.roomManager.createRoom(user1,user2); 
            console.log("room :" , room);
        }
        this.clearQueue();
        console.log("queue cleared")  
    }

    initHandlers(socket:Socket){
        socket.on("offer",({sdp,roomId}: {sdp:string,roomId:string}) => {
            this.roomManager.onOffer(roomId, sdp);
        })
        socket.on("offer",({sdp,roomId}: {sdp:string,roomId:string}) => {
            this.roomManager.onAnswer(roomId, sdp);
        })
    }

}