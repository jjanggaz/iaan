import { DTDonRTCSignaler } from './dtdon.rtcsignaler.js';

class DTDonRTCPeerReceiver extends DTDonRTCSignaler {
    constructor(dtdon, chatSessionId, streamId) {
        super();

        this._DTDon = dtdon;

        this._sessionId = chatSessionId;
        this._streamId = streamId;

        this._onConnected = this.onConnected;
        this._onConsume = this.onConsume;

        this._videoTrack = undefined;
        this._audioTrack = undefined;
    }

    get sessionId() {
        return this._sessionId;
    }

    onConnected() {
        this._peerConnection = new RTCPeerConnection();
        this._peerConnection.onconnectionstatechange = (event) => {
            console.log(`DTDonRTCPeerSender onConnectionStateChange: ${event.target.connectionState}`);
        };

        this._peerConnection.oniceconnectionstatechange = (event) => {
            console.log(`DTDonRTCPeerSender onIceConnectionStateChange: ${event.target.iceConnectionState}`);
        }

        this._peerConnection.onicegatheringstatechange = (event) => {
            console.log(`DTDonRTCPeerSender onIceGatheringStateChange: ${event.target.iceGatheringState}`);
        };

        this._peerConnection.onicecandidate = (peerConnectionIceEvent) => {
            if (peerConnectionIceEvent.candidate) {
                this._peerConnection.addIceCandidate(new RTCIceCandidate(peerConnectionIceEvent.candidate));
            }
        };

        this._peerConnection.ontrack = (trackEvent) => {
            if (this._DTDon.chatManager === undefined) {
                return;
            }

            if (trackEvent && trackEvent.track) {
                if (trackEvent.track.kind === 'video') {
                    this._DTDon.rtcManager.addVideoElement(this._streamId, trackEvent);
                }
                else if (trackEvent.track.kind === 'audio') {
                    this._DTDon.rtcManager.addAudioElement(this._streamId, trackEvent);
                }
            }
        };

        this.consume(this._streamId);
    }

    async onConsume(offer) {
        const sessionDescription = new RTCSessionDescription({
            type: 'offer',
            sdp: offer
        });

        await this._peerConnection.setRemoteDescription(sessionDescription);

        if (this._peerConnection.remoteDescription.type === 'offer') {
            const answer = await this._peerConnection.createAnswer();
            this._peerConnection.setLocalDescription(answer);

            this.processConsume(this._streamId, answer.sdp);
        }
    }

    onError(error) {
        console.error('DTDonRTCPeerReceiver ERROR:', error);
    }
}

export { DTDonRTCPeerReceiver };