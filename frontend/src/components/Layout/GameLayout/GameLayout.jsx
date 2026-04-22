import React from 'react';
import LeftBar from '../LeftBar/LeftBar';
import RightBar from '../RightBar/RightBar';
import Center from '../Center/Center';
import BottomBar from '../BottomBar/BottomBar';
import './GameLayout.css';

const GameLayout = ({ left, center, right, bottom, video }) => {
    return (
        <div className="game-layout">
            <LeftBar>{left}</LeftBar>
            <Center>
                {video}
                {center}
            </Center>
            <RightBar>{right}</RightBar>
            <BottomBar>{bottom}</BottomBar>
        </div>
    );
};

export default GameLayout;
