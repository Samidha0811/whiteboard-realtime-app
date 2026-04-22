import { useEffect, useRef, useState, useCallback } from 'react';
import { subscribe, sendMessage } from '../services/socket';

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
    ]
};

export const useWebRTC = (roomId, currentUsername, players) => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState({}); // { username: MediaStream }
    const peerConnections = useRef({}); // { username: RTCPeerConnection }
    const mediaStreamRef = useRef(null);

    // Get local media
    const initLocalStream = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: true, 
                audio: true 
            });
            setLocalStream(stream);
            mediaStreamRef.current = stream;
            return stream;
        } catch (err) {
            console.error('Error accessing media devices:', err);
            return null;
        }
    }, []);

    const createPeerConnection = useCallback((targetUsername, isInitiator) => {
        if (peerConnections.current[targetUsername]) {
            return peerConnections.current[targetUsername];
        }

        const pc = new RTCPeerConnection(ICE_SERVERS);
        peerConnections.current[targetUsername] = pc;

        // Add local tracks
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => {
                pc.addTrack(track, mediaStreamRef.current);
            });
        }

        // Handle remote tracks
        pc.ontrack = (event) => {
            setRemoteStreams(prev => ({
                ...prev,
                [targetUsername]: event.streams[0]
            }));
        };

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                sendMessage('/app/signal/ice', {
                    sender: currentUsername,
                    target: targetUsername,
                    roomId: roomId,
                    type: 'ice',
                    payload: event.candidate
                });
            }
        };

        return pc;
    }, [roomId, currentUsername]);

    const handleOffer = useCallback(async (signal) => {
        const pc = createPeerConnection(signal.sender, false);
        await pc.setRemoteDescription(new RTCSessionDescription(signal.payload));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        
        sendMessage('/app/signal/answer', {
            sender: currentUsername,
            target: signal.sender,
            roomId: roomId,
            type: 'answer',
            payload: answer
        });
    }, [roomId, currentUsername, createPeerConnection]);

    const handleAnswer = useCallback(async (signal) => {
        const pc = peerConnections.current[signal.sender];
        if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(signal.payload));
        }
    }, []);

    const handleIce = useCallback(async (signal) => {
        const pc = peerConnections.current[signal.sender];
        if (pc) {
            await pc.addIceCandidate(new RTCIceCandidate(signal.payload));
        }
    }, []);

    // Initiation logic: When a new player joins, I (as an existing player) stay quiet of the new player initiates
    // Or rather: When I join, I initiate connections to all existing players.
    const initiateConnections = useCallback(async (currentPlayers) => {
        for (const player of currentPlayers) {
            if (player.username !== currentUsername && !peerConnections.current[player.username]) {
                const pc = createPeerConnection(player.username, true);
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                
                sendMessage('/app/signal/offer', {
                    sender: currentUsername,
                    target: player.username,
                    roomId: roomId,
                    type: 'offer',
                    payload: offer
                });
            }
        }
    }, [roomId, currentUsername, createPeerConnection]);

    useEffect(() => {
        if (!roomId || !currentUsername) return;

        initLocalStream();

        const subscription = subscribe(`/topic/signal/${roomId}`, (signal) => {
            if (signal.target === currentUsername) {
                if (signal.type === 'offer') handleOffer(signal);
                else if (signal.type === 'answer') handleAnswer(signal);
                else if (signal.type === 'ice') handleIce(signal);
            }
        });

        // Cleanup
        return () => {
            subscription?.unsubscribe();
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
            }
            Object.values(peerConnections.current).forEach(pc => pc.close());
        };
    }, [roomId, currentUsername, handleOffer, handleAnswer, handleIce, initLocalStream]);

    // Track players list to clean up disconnected peers
    useEffect(() => {
        const playerNames = players.map(p => p.username);
        Object.keys(peerConnections.current).forEach(username => {
            if (!playerNames.includes(username)) {
                peerConnections.current[username].close();
                delete peerConnections.current[username];
                setRemoteStreams(prev => {
                    const next = { ...prev };
                    delete next[username];
                    return next;
                });
            }
        });

        // If I just joined, I might need to initiate to others
        // This is tricky because "players" changes frequently.
        // Let's rely on the fact that existing players will initiate to the new joiner.
        // Actually, let's check if there are people I don't have a connection to yet.
        initiateConnections(players);
    }, [players, currentUsername, initiateConnections]);

    const toggleVideo = useCallback(async () => {
        if (mediaStreamRef.current) {
            const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
            if (videoTrack && videoTrack.enabled) {
                // Turn OFF: Stop the track completely to turn off hardware light
                videoTrack.stop();
                videoTrack.enabled = false;
                setLocalStream(new MediaStream(mediaStreamRef.current.getTracks()));
            } else {
                // Turn ON: Re-acquire video track
                try {
                    const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
                    const newVideoTrack = newStream.getVideoTracks()[0];
                    
                    // Replace in local stream
                    const oldVideoTrack = mediaStreamRef.current.getVideoTracks()[0];
                    if (oldVideoTrack) mediaStreamRef.current.removeTrack(oldVideoTrack);
                    mediaStreamRef.current.addTrack(newVideoTrack);
                    
                    // Replace in all PeerConnections
                    Object.values(peerConnections.current).forEach(pc => {
                        const sender = pc.getSenders().find(s => s.track?.kind === 'video');
                        if (sender) sender.replaceTrack(newVideoTrack);
                    });
                    
                    setLocalStream(new MediaStream(mediaStreamRef.current.getTracks()));
                } catch (err) {
                    console.error("Error re-enabling video:", err);
                }
            }
        }
    }, [peerConnections]);

    const toggleAudio = useCallback(async () => {
        if (mediaStreamRef.current) {
            const audioTrack = mediaStreamRef.current.getAudioTracks()[0];
            if (audioTrack && audioTrack.enabled) {
                // Turn OFF: Stop track
                audioTrack.stop();
                audioTrack.enabled = false;
                setLocalStream(new MediaStream(mediaStreamRef.current.getTracks()));
            } else {
                // Turn ON: Re-acquire audio track
                try {
                    const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    const newAudioTrack = newStream.getAudioTracks()[0];
                    
                    // Replace in local stream
                    const oldAudioTrack = mediaStreamRef.current.getAudioTracks()[0];
                    if (oldAudioTrack) mediaStreamRef.current.removeTrack(oldAudioTrack);
                    mediaStreamRef.current.addTrack(newAudioTrack);
                    
                    // Replace in all PeerConnections
                    Object.values(peerConnections.current).forEach(pc => {
                        const sender = pc.getSenders().find(s => s.track?.kind === 'audio');
                        if (sender) sender.replaceTrack(newAudioTrack);
                    });
                    
                    setLocalStream(new MediaStream(mediaStreamRef.current.getTracks()));
                } catch (err) {
                    console.error("Error re-enabling audio:", err);
                }
            }
        }
    }, [peerConnections]);

    return {
        localStream,
        remoteStreams,
        toggleVideo,
        toggleAudio,
        isCameraOff: localStream ? (localStream.getVideoTracks().length === 0 || !localStream.getVideoTracks()[0].enabled) : true,
        isMuted: localStream ? (localStream.getAudioTracks().length === 0 || !localStream.getAudioTracks()[0].enabled) : true
    };
};
