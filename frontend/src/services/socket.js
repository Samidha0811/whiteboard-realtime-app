import SockJS from "sockjs-client";
import Stomp from "stompjs";

let stompClient = null;

export const connectSocket = (onConnect) => {
    const socket = new SockJS("http://localhost:8080/ws");
    stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
        console.log("Connected");
        onConnect();
    });
};

export const sendMessage = (destination, message) => {
    stompClient.send(destination, {}, JSON.stringify(message));
};

export const subscribe = (topic, callback) => {
    stompClient.subscribe(topic, (msg) => {
        callback(JSON.parse(msg.body));
    });
};