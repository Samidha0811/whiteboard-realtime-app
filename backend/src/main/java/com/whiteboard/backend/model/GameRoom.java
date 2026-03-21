package com.whiteboard.backend.model;

import lombok.Data;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
public class GameRoom {
    private List<Player> players = new ArrayList<>();
    private Map<String, Integer> scores = new HashMap<>();
    private String currentWord;
    private int currentTurnIndex = 0;
}
