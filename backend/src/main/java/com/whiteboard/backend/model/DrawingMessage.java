package com.whiteboard.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DrawingMessage {
    private int x;
    private int y;
    private String type; // 'start', 'draw'
    private String roomId;
}


