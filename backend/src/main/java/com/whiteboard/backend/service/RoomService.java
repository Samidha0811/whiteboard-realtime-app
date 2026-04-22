package com.whiteboard.backend.service;

import com.whiteboard.backend.model.DrawingMessage;
import com.whiteboard.backend.model.GameRoom;
import com.whiteboard.backend.model.Player;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RoomService {

    private Map<String, GameRoom> rooms = new HashMap<>();

    public GameRoom getOrCreateRoom(String roomId) {
        return rooms.computeIfAbsent(roomId, id -> new GameRoom());
    }

    public void addPlayer(String roomId, Player player) {
        GameRoom room = getOrCreateRoom(roomId);
        // Only add if not already present
        boolean exists = room.getPlayers().stream()
                .anyMatch(p -> p.getUsername().equals(player.getUsername()));

        if (!exists) {
            room.getPlayers().add(player);
            room.getScores().put(player.getUsername(), 0);
        }
    }

    public List<Player> getPlayers(String roomId) {
        GameRoom room = rooms.get(roomId);
        return room != null ? room.getPlayers() : new ArrayList<>();
    }

    public void addDrawing(String roomId, DrawingMessage message) {
        GameRoom room = getOrCreateRoom(roomId);
        room.getDrawingHistory().add(message);
    }

    public List<DrawingMessage> getDrawingHistory(String roomId) {
        GameRoom room = rooms.get(roomId);
        return room != null ? room.getDrawingHistory() : new ArrayList<>();
    }

    public void clearDrawingHistory(String roomId) {
        GameRoom room = rooms.get(roomId);
        if (room != null) {
            room.getDrawingHistory().clear();
        }
    }

    public void updateScore(String roomId, String username) {
        GameRoom room = rooms.get(roomId);
        if (room != null) {
            room.getScores().put(username,
                    room.getScores().getOrDefault(username, 0) + 10);
        }
    }
}
