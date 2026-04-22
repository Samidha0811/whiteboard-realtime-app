package com.whiteboard.backend.controller;

import com.whiteboard.backend.model.ChatMessage;
import com.whiteboard.backend.model.DrawingMessage;
import com.whiteboard.backend.model.Player;
import com.whiteboard.backend.service.RoomService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@CrossOrigin(origins = "*")
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

    // 🎨 DRAWING (WebSocket)
    @MessageMapping("/draw")
    public void draw(DrawingMessage message) {
        // Store drawing in history
        roomService.addDrawing(message.getRoomId(), message);

        // Broadcast to all clients in the room
        messagingTemplate.convertAndSend(
                "/topic/draw/" + message.getRoomId(),
                message);
    }

    // 🗑️ CLEAR CANVAS (WebSocket)
    @MessageMapping("/clear")
    public void clearCanvas(DrawingMessage message) {
        roomService.clearDrawingHistory(message.getRoomId());

        // Broadcast clear event to all clients
        messagingTemplate.convertAndSend(
                "/topic/clear/" + message.getRoomId(),
                "clear");
    }

    // 📜 GET DRAWING HISTORY (REST - used on page refresh)
    @GetMapping("/api/history/{roomId}")
    @ResponseBody
    public List<DrawingMessage> getDrawingHistory(@PathVariable String roomId) {
        return roomService.getDrawingHistory(roomId);
    }

    // 💬 CHAT (WebSocket)
    @MessageMapping("/chat")
    public void chat(ChatMessage message) {
        messagingTemplate.convertAndSend(
                "/topic/chat/" + message.getRoomId(),
                message);
    }
}
