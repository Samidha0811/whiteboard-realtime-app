import SockJS from "sockjs-client";
import Stomp from "stompjs";

let stompClient = null;

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

export const connectSocket = (onConnect) => {
    const socket = new SockJS(`${BACKEND_URL}/ws`);
    stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
        console.log("Connected to Socket at", BACKEND_URL);
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