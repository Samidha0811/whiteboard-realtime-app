import { useLocation } from "react-router-dom";

const GamePage = () => {
    const location = useLocation();
    const { username, roomId } = location.state || {};

    return (
        <div>
            <h3>Room Code: {roomId}</h3>
            <h4>Player: {username}</h4>
        </div>
    );
};