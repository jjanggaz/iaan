import { DTDon } from '../dtdon.js';

import { DTDonRTCSignaler } from './dtdon.rtcsignaler.js';

class DTDonRTCPeerSender extends DTDonRTCSignaler {
    constructor(dtdon, chatSessionId) {
        super();

        this._DTDon = dtdon;

        this._sessionId = chatSessionId;
        this._streamId = this._DTDon.rtcManager.senderStreamId;

        this._videoSender = undefined;
        this._audioSender = undefined;

        this._onConnected = this.onConnected;
        this._onProduce = this.onProduce;
        this._onError = this.onError;
    }

    get videoSender() {
        return this._videoSender;
    }

    get audioSender() {
        return this._audioSender;
    }

    onConnected() {
        this._peerConnection = new RTCPeerConnection();
        this._peerConnection.onnegotiationneeded = async (event) => {
            const offer = await this._peerConnection.createOffer();
            await this._peerConnection.setLocalDescription(offer);

            this.produce(this._streamId, offer.sdp);

        };
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
            if (this._peerConnection.remoteDescription && peerConnectionIceEvent.candidate) {
                this._peerConnection.addIceCandidate(new RTCIceCandidate(peerConnectionIceEvent.candidate));
            }
        };

        const videoStream = this._DTDon.rtcManager.senderVideoStream;
        if (videoStream) {
            const videoTracks = videoStream.getVideoTracks();
            if (videoTracks.length > 0) {
                this._peerConnection.addTransceiver('video', {
                    direction: 'sendonly',
                });

                this._videoSender = this._peerConnection.addTrack(videoTracks[0]);

                if (DTDon.RTC.VIDEO_CODEC === 'H.264') {
                    const h264Codecs = [];
                    const codecCapacibilities = RTCRtpSender.getCapabilities('video').codecs;
                    for (const codec of codecCapacibilities) {
                        if (codec.mimeType.includes('H264') && codec.sdpFmtpLine.includes('profile-level-id=42e0')) {
                            h264Codecs.push(codec);
                        }
                    }

                    const videoTransceiver = this._peerConnection.getTransceivers()[0];
                    videoTransceiver.setCodecPreferences(h264Codecs.length > 0 ? h264Codecs : codecCapacibilities);
                }
            }
        }

        const audioStream = this._DTDon.rtcManager.senderAudioStream;
        if (audioStream) {
            const audioTracks = audioStream.getAudioTracks();
            if (audioTracks.length > 0) {
                this._peerConnection.addTransceiver('audio', {
                    direction: 'sendonly',
                });

                this._audioSender = this._peerConnection.addTrack(audioTracks[0]);
            }
        }
    }

    async onProduce(answer) {
        const sessionDescription = new RTCSessionDescription({
            type: 'answer',
            sdp: answer
        });

        await this._peerConnection.setRemoteDescription(sessionDescription);

        this._DTDon.chatManager.sendScreenInfo({
            isSharingScreen: true,
            streamId: this._streamId,
            videoWidth: this._DTDon.rtcManager.senderVideoWidth,
            videoHeight: this._DTDon.rtcManager.senderVideoHeight,
            isAudio: this._audioSender !== undefined
        });
    }

    onError(error) {
        console.error('DTDonRTCPeerSender ERROR:', error);
    }
}

export { DTDonRTCPeerSender };