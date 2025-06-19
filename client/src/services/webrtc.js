const configuration = {
    iceServers: [
        {
            urls: [
                'stun:stun.l.google.com:19302',
                'stun:stun1.l.google.com:19302'
            ]
        },

    ],
    iceCandidatePoolSize: 10
};

class WebRTCService {
    constructor(socket) {
        this.socket = socket;
        this.peerConnections = new Map();
        this.localStream = null;
        this.onTrack = null;

        // Bind socket event handlers
        this.socket.on('offer', this.handleOffer.bind(this));
        this.socket.on('answer', this.handleAnswer.bind(this));
        this.socket.on('ice-candidate', this.handleIceCandidate.bind(this));
        this.socket.on('user-left', this.handleUserLeft.bind(this));
    }

    async getLocalStream({ audio = true, video = true } = {}) {
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({
                video,
                audio: audio && {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                  },
            });
            return this.localStream;
        } catch (error) {
            console.error('Error accessing media devices:', error);
            throw error;
        }
    }

    async createPeerConnection(remoteUserId) {
        try {
            const peerConnection = new RTCPeerConnection(configuration);

            // Add local stream tracks to peer connection
            this.localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, this.localStream);
            });

            // Handle ICE candidates
            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    this.socket.emit('ice-candidate', {
                        candidate: event.candidate,
                        to: remoteUserId
                    });
                }
            };

            // Handle incoming tracks
            peerConnection.ontrack = (event) => {
                if (this.onTrack) {
                    this.onTrack(event.streams[0], remoteUserId);
                }
            };

            this.peerConnections.set(remoteUserId, peerConnection);
            return peerConnection;
        } catch (error) {
            console.error('Error creating peer connection:', error);
            throw error;
        }
    }

    async initiateCall(remoteUserId) {
        try {
            const peerConnection = await this.createPeerConnection(remoteUserId);
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            this.socket.emit('offer', {
                offer: offer,
                to: remoteUserId
            });
        } catch (error) {
            console.error('Error initiating call:', error);
            throw error;
        }
    }

    async handleOffer({ offer, from }) {
        try {
            const peerConnection = await this.createPeerConnection(from);
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            this.socket.emit('answer', {
                answer: answer,
                to: from
            });
        } catch (error) {
            console.error('Error handling offer:', error);
        }
    }

    async handleAnswer({ answer, from }) {
        try {
            const peerConnection = this.peerConnections.get(from);
            if (peerConnection) {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
            }
        } catch (error) {
            console.error('Error handling answer:', error);
        }
    }

    async handleIceCandidate({ candidate, from }) {
        try {
            const peerConnection = this.peerConnections.get(from);
            if (peerConnection) {
                await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            }
        } catch (error) {
            console.error('Error handling ICE candidate:', error);
        }
    }

    handleUserLeft(userId) {
        const peerConnection = this.peerConnections.get(userId);
        if (peerConnection) {
            peerConnection.close();
            this.peerConnections.delete(userId);
        }
    }

    closeAllConnections() {
        this.peerConnections.forEach(connection => {
            connection.close();
        });
        this.peerConnections.clear();

        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
        }
    }

    async replaceVideoTrack(newTrack) {
        try {
            const senders = this.peerConnections.values();
            for (const pc of senders) {
                const sender = pc.getSenders().find(s => s.track.kind === 'video');
                if (sender) {
                    await sender.replaceTrack(newTrack);
                }
            }
        } catch (error) {
            console.error('Error replacing video track:', error);
            throw error;
        }
    }
}

export default WebRTCService;