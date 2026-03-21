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
    if (stompClient && stompClient.connected) {
        stompClient.send(destination, {}, JSON.stringify(message));
    }
};

export const subscribe = (topic, callback) => {
    if (stompClient && stompClient.connected) {
        return stompClient.subscribe(topic, (msg) => {
            callback(JSON.parse(msg.body));
        });
    }
};