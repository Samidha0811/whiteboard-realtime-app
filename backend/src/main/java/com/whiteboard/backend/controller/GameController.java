package com.whiteboard.backend.controller;

import com.whiteboard.backend.model.ChatMessage;
import com.whiteboard.backend.model.DrawingMessage;
import com.whiteboard.backend.model.Player;
import com.whiteboard.backend.service.RoomService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class GameController {

    private final RoomService roomService;
    private final SimpMessagingTemplate messagingTemplate;

    public GameController(RoomService roomService,
            SimpMessagingTemplate messagingTemplate) {
        this.roomService = roomService;
        this.messagingTemplate = messagingTemplate;
    }

    // 🟢 JOIN ROOM
    @MessageMapping("/join")
    public void join(Player player) {
        roomService.addPlayer(player.getRoomId(), player);

        messagingTemplate.convertAndSend(
                "/topic/players/" + player.getRoomId(),
                roomService.getPlayers(player.getRoomId()));

        // Broadcast arrival in chat
        ChatMessage joinMessage = new ChatMessage();
        joinMessage.setSender("System");
        joinMessage.setMessage(player.getUsername() + " has joined the room!");
        joinMessage.setRoomId(player.getRoomId());

        messagingTemplate.convertAndSend(
                "/topic/chat/" + player.getRoomId(),
                joinMessage);
    }

    // 🎨 DRAWING
    @MessageMapping("/draw")
    public void draw(DrawingMessage message) {
        messagingTemplate.convertAndSend(
                "/topic/draw/" + message.getRoomId(),
                message);
    }

    // 💬 CHAT
    @MessageMapping("/chat")
    public void chat(ChatMessage message) {
        messagingTemplate.convertAndSend(
                "/topic/chat/" + message.getRoomId(),
                message);
    }
}
