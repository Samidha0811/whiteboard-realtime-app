package com.whiteboard.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DrawingMessage {
    private double x;
    private double y;
    private String type; // 'start', 'draw'
    private String roomId;
    private String color;
    private int size;
    private String tool; // 'pen', 'eraser'
}
