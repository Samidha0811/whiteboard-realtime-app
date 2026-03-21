import React, { useRef, useState, useEffect } from "react";
import { sendMessage, subscribe } from "../../services/socket";
import "./CanvasBoard.css";

const CanvasBoard = ({ roomId }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("#000000");
    const [size, setSize] = useState(5);

    // 📐 Dynamic Sizing Logic
    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current && canvasRef.current) {
                const { clientWidth, clientHeight } = containerRef.current;
                canvasRef.current.width = clientWidth;
                canvasRef.current.height = clientHeight;
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // 👂 Subscribe to other players' drawing dots
    useEffect(() => {
        if (roomId) {
            const subscription = subscribe(`/topic/draw/${roomId}`, (data) => {
                drawOnCanvas(data.x, data.y, data.type, false); 
            });
            return () => subscription && subscription.unsubscribe();
        }
    }, [roomId]);

    const drawOnCanvas = (x, y, type, shouldBroadcast) => {
        const ctx = canvasRef.current.getContext("2d");
        
        ctx.lineWidth = size;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = color; 

        if (type === 'start') {
            ctx.beginPath();
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
            ctx.stroke();
        }

        if (shouldBroadcast) {
            sendMessage("/app/draw", { x, y, type, roomId });
        }
    };

    const startDrawing = (e) => {
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;
        drawOnCanvas(x, y, 'start', true);
        setIsDrawing(true);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;
        drawOnCanvas(x, y, 'draw', true);
    };



    const clearCanvas = () => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    return (
        <div className="canvas-board-wrapper" ref={containerRef}>
            <div className="canvas-toolbar">
                <div className="tool-group">
                    <label>Color</label>
                    <input 
                        type="color" 
                        value={color} 
                        onChange={(e) => setColor(e.target.value)} 
                        className="color-picker"
                    />
                </div>
                <div className="tool-group">
                    <label>Size: {size}</label>
                    <input 
                        type="range" 
                        min="1" 
                        max="50" 
                        value={size} 
                        onChange={(e) => setSize(e.target.value)} 
                        className="size-slider"
                    />
                </div>
                <button onClick={clearCanvas} className="clear-btn">
                    Clear Canvas
                </button>
            </div>
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                onMouseMove={draw}
                className="whiteboard-canvas"
            />
        </div>
    );
};



export default CanvasBoard;
