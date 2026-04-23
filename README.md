# 🎨 Real-Time Whiteboard Game

A multiplayer drawing and guessing game like Skribbl.io.

## 🚀 Features
- Real-time drawing (WebSockets)
- Multiplayer rooms
- Chat & guessing system
- Turn-based gameplay

## 🖼️ Project Preview

### Hero Preview
![Hero](docs/images/hero.png)

### Landing Page
![Landing Page](docs/images/landing_page.png)

### Whiteboard Interface
![Whiteboard UI](docs/images/whiteboard_ui.png)

### Real-Time Drawing Flow
![Whiteboard Flow](docs/images/whiteboard_flow.png)

## 🔄 Working Flow

1.  **Join/Create Room**: Users can enter their display name and either create a new room or join an existing one using a unique Room Code.
2.  **Real-Time Collaboration**: Once in the room, the host and participants can draw on the whiteboard simultaneously.
3.  **Drawing Tools**: Users have access to various colors and stroke sizes to express their ideas.
4.  **Live Interaction**: The app supports real-time synchronization, so every stroke made by one user is instantly visible to all other participants in the room.
5.  **Chat & Status**: Users can see who is online and communicate through the integrated chat system.

## 🛠️ Tech Stack
- Frontend: React.js
- Backend: Spring Boot
- WebSocket for real-time communication

## ▶️ How to Run the code

### Backend
cd backend
mvn spring-boot:run

### Frontend
cd frontend
npm install
npm run dev