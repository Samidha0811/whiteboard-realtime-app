import React, { useRef, useState, useEffect, useCallback } from "react";
import { sendMessage, subscribe } from "../../services/socket";
import "./CanvasBoard.css";

const PRESET_COLORS = [
    "#1a1a2e", "#e74c3c", "#e67e22", "#f1c40f",
    "#2ecc71", "#3498db", "#9b59b6", "#ffffff"
];

const CanvasBoard = ({ roomId }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("#1a1a2e");
    const [size, setSize] = useState(5);
    const [tool, setTool] = useState("pen"); // 'pen' | 'eraser'
    const [history, setHistory] = useState([]);
    const ctxRef = useRef(null);

    // Get the canvas background color for eraser
    const getCanvasBg = useCallback(() => {
        return getComputedStyle(document.documentElement).getPropertyValue('--canvas-bg').trim() || '#ffffff';
    }, []);

    // 📐 Dynamic Sizing Logic
    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current && canvasRef.current) {
                const { clientWidth, clientHeight } = containerRef.current;
                const ctx = canvasRef.current.getContext("2d");
                
                // Save current content
                const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
                
                canvasRef.current.width = clientWidth;
                canvasRef.current.height = clientHeight;
                
                // Restore content
                ctx.putImageData(imageData, 0, 0);
                ctxRef.current = ctx;
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // Draw a single stroke segment on canvas using provided data
    const drawStroke = useCallback((data) => {
        const ctx = ctxRef.current || canvasRef.current?.getContext("2d");
        if (!ctx) return;

        const strokeColor = data.tool === 'eraser' ? getCanvasBg() : (data.color || '#000000');
        const strokeSize = data.tool === 'eraser' ? (data.size || 5) * 3 : (data.size || 5);

        ctx.lineWidth = strokeSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = strokeColor;

        if (data.type === 'start') {
            ctx.beginPath();
            ctx.moveTo(data.x, data.y);
        } else {
            ctx.lineTo(data.x, data.y);
            ctx.stroke();
        }
    }, [getCanvasBg]);

    // Replay full drawing history on the canvas
    const replayHistory = useCallback((historyData) => {
        const ctx = ctxRef.current || canvasRef.current?.getContext("2d");
        if (!ctx) return;

        // Clear canvas first
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Replay each stroke
        historyData.forEach(data => {
            drawStroke(data);
        });
    }, [drawStroke]);

    // 👂 Subscribe to real-time drawing, history, and clear events
    useEffect(() => {
        if (roomId) {
            // Fetch existing drawing history via REST (reliable on refresh)
            fetch(`http://localhost:8080/api/history/${roomId}`)
                .then(res => res.json())
                .then(historyData => {
                    if (Array.isArray(historyData) && historyData.length > 0) {
                        // Small delay to ensure canvas is sized
                        setTimeout(() => replayHistory(historyData), 100);
                    }
                })
                .catch(err => console.warn('Could not load drawing history:', err));

            // Real-time drawing from other players
            const drawSub = subscribe(`/topic/draw/${roomId}`, (data) => {
                drawStroke(data);
            });

            // Clear canvas event
            const clearSub = subscribe(`/topic/clear/${roomId}`, () => {
                const ctx = ctxRef.current || canvasRef.current?.getContext("2d");
                if (ctx) {
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                }
            });

            return () => {
                drawSub && drawSub.unsubscribe();
                clearSub && clearSub.unsubscribe();
            };
        }
    }, [roomId, drawStroke, replayHistory]);

    const saveState = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        setHistory(prev => [...prev.slice(-20), ctx.getImageData(0, 0, canvas.width, canvas.height)]);
    };

    const startDrawing = (e) => {
        saveState();
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;

        // Draw locally
        drawStroke({ x, y, type: 'start', color, size, tool });

        // Broadcast to others
        sendMessage("/app/draw", { x, y, type: 'start', roomId, color, size, tool });
        setIsDrawing(true);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;

        // Draw locally
        drawStroke({ x, y, type: 'draw', color, size, tool });

        // Broadcast to others
        sendMessage("/app/draw", { x, y, type: 'draw', roomId, color, size, tool });
    };

    const clearCanvas = () => {
        saveState();
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Broadcast clear to all clients
        sendMessage("/app/clear", { roomId });
    };

    const undoLast = () => {
        if (history.length === 0) return;
        const ctx = canvasRef.current.getContext("2d");
        const lastState = history[history.length - 1];
        ctx.putImageData(lastState, 0, 0);
        setHistory(prev => prev.slice(0, -1));
    };

    const downloadCanvas = () => {
        const link = document.createElement('a');
        link.download = `drawsync-${Date.now()}.png`;
        link.href = canvasRef.current.toDataURL();
        link.click();
    };

    return (
        <div className="canvas-board-wrapper" ref={containerRef}>
            {/* Floating Toolbar */}
            <div className="canvas-toolbar glass" id="canvas-toolbar">
                {/* Tool Buttons */}
                <div className="tool-group tool-buttons">
                    <button
                        className={`tool-btn ${tool === 'pen' ? 'active' : ''}`}
                        onClick={() => setTool('pen')}
                        title="Pen"
                        id="tool-pen"
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M2 14.5l9.5-9.5 2.5 2.5-9.5 9.5H2v-2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10 6.5l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    </button>
                    <button
                        className={`tool-btn ${tool === 'eraser' ? 'active' : ''}`}
                        onClick={() => setTool('eraser')}
                        title="Eraser"
                        id="tool-eraser"
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M6 16h8M3.5 11l5-7.5 5 3.5-5 7.5-3.5-1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>

                <div className="toolbar-divider" />

                {/* Color Swatches */}
                <div className="tool-group color-swatches">
                    {PRESET_COLORS.map((c) => (
                        <button
                            key={c}
                            className={`color-swatch ${color === c && tool === 'pen' ? 'active' : ''}`}
                            style={{ background: c }}
                            onClick={() => { setColor(c); setTool('pen'); }}
                            title={c}
                        >
                            {color === c && tool === 'pen' && (
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                    <path d="M2 5l2.5 2.5L8 3" stroke={c === '#ffffff' || c === '#f1c40f' ? '#333' : '#fff'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                        </button>
                    ))}
                    <div className="custom-color-wrapper">
                        <input 
                            type="color" 
                            value={color} 
                            onChange={(e) => { setColor(e.target.value); setTool('pen'); }}
                            className="color-picker-hidden"
                            id="custom-color-picker"
                        />
                        <div className="custom-color-btn" title="Custom color">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2"/>
                                <path d="M7 4v6M4 7h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="toolbar-divider" />

                {/* Size Slider */}
                <div className="tool-group size-group">
                    <span className="size-label">{size}px</span>
                    <input 
                        type="range" 
                        min="1" 
                        max="50" 
                        value={size} 
                        onChange={(e) => setSize(Number(e.target.value))} 
                        className="size-slider"
                        id="brush-size-slider"
                    />
                </div>

                <div className="toolbar-divider" />

                {/* Action Buttons */}
                <div className="tool-group action-buttons">
                    <button onClick={undoLast} className="tool-btn" title="Undo" disabled={history.length === 0} id="tool-undo">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M4 7l3-3M4 7l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M4 7h8a4 4 0 010 8H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    </button>
                    <button onClick={downloadCanvas} className="tool-btn" title="Download" id="tool-download">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M9 3v9M5 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 14h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    </button>
                    <button onClick={clearCanvas} className="tool-btn danger" title="Clear All" id="tool-clear">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M4 5h10M7 5V4a1 1 0 011-1h2a1 1 0 011 1v1M5 5l.5 9a2 2 0 002 2h3a2 2 0 002-2L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>

            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                onMouseMove={draw}
                className="whiteboard-canvas"
                id="whiteboard-canvas"
            />
        </div>
    );
};

export default CanvasBoard;
