package com.whiteboard.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignalMessage {
    private String sender;
    private String target;
    private String roomId;
    private String type; // 'offer', 'answer', 'ice'
    private Object payload; // The SDP or ICE candidate data
}
