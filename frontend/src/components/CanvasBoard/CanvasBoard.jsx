import React, { useRef, useState, useEffect } from "react";
import "./CanvasBoard.css";

const CanvasBoard = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("#000000");
    const [size, setSize] = useState(5);

    // Dynamic sizing logic
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

    const startDrawing = (e) => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
    };

    const stopDrawing = () => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.beginPath(); // Important fix: prevents unwanted lines from connecting
        setIsDrawing(false);
    };

    const draw = (e) => {
        if (!isDrawing) return;

        const ctx = canvasRef.current.getContext("2d");

        ctx.lineWidth = size;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = color; 

        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
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
