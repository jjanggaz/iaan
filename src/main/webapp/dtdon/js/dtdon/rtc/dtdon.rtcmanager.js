import { DTDon } from '../dtdon.js';

import { DTDonRTCPeerSender } from './dtdon.rtcpeersender.js';
import { DTDonRTCPeerReceiver } from './dtdon.rtcpeerreceiver.js';

class DTDonRTCManager {
    constructor(dtdon) {
        this._DTDon = dtdon;

        this._senderStreamId = undefined;

        this._senderVideoType = DTDon.RTC.VIDEO_TYPE.NONE;
        this._senderAudioType = DTDon.RTC.AUDIO_TYPE.NONE;

        this._senderVideoStream = undefined;
        this._senderAudioStream = undefined;

        this._senderVideoWidth = DTDon.RTC.VIDEO_WIDTH;
        this._senderVideoHeight = DTDon.RTC.VIDEO_HEIGHT;

        this._peerSender = undefined;
        this._peerReceiverDictionary = {};
    }

    get senderStreamId() {
        return this._senderStreamId;
    }

    get senderVideoType() {
        return this._senderVideoType;
    }

    get senderAudioType() {
        return this._senderAudioType;
    }

    get senderVideoStream() {
        return this._senderVideoStream;
    }

    get senderAudioStream() {
        return this._senderAudioStream;
    }

    get senderVideoWidth() {
        return this._senderVideoWidth;
    }

    get senderVideoHeight() {
        return this._senderVideoHeight;
    }

    async setSenderVideoType(videoType) {
        if (this._senderVideoType === videoType) {
            return;
        }

        this._senderVideoType = videoType;

        try {
            if (this._senderVideoStream) {
                for (const track of this._senderVideoStream.getTracks()) {
                    track.stop();
                }
                this._senderVideoStream = undefined;
            }

            switch (videoType) {
                case DTDon.RTC.VIDEO_TYPE.WEBCAM:
                    this._senderVideoStream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: false
                    });
                    this._senderVideoWidth = DTDon.RTC.VIDEO_WIDTH;
                    this._senderVideoHeight = DTDon.RTC.VIDEO_HEIGHT;
                    break;
                case DTDon.RTC.VIDEO_TYPE.CANVAS:
                    const renderCanvas = this._DTDon.DTDPlayerCanvas;
                    if (renderCanvas) {
                        this._senderVideoStream = renderCanvas.captureStream(DTDon.RTC.VIDEO_FRAMERATE);
                        this._senderVideoWidth = renderCanvas.width;
                        this._senderVideoHeight = renderCanvas.height;
                    }
                    break;
            }
        }
        catch (error) {
            console.error('ERROR: Unable to retrieve the video.');
        }
    }

    async setSenderAudioType(audioType) {
        if (this._senderAudioType === audioType) {
            return;
        }

        this._senderAudioType = audioType;

        try {
            if (this._senderAudioStream) {
                for (const track of this._senderAudioStream.getTracks()) {
                    track.stop();
                }
                this._senderAudioStream = undefined;

                this._DTDon.uiManager.userControlPanel.setMicControlButtonVisible(false);
            }

            switch (audioType) {
                case DTDon.RTC.AUDIO_TYPE.MICROPHONE:
                    this._senderAudioStream = await navigator.mediaDevices.getUserMedia({
                        video: false,
                        audio: true
                    });
                    if (this._senderAudioStream) {
                        this._DTDon.uiManager.userControlPanel.setMicControlButtonVisible(true);
                    }
                    break;
            }
        }
        catch {
            console.error('ERROR: Unable to retrieve the audio.');
        }
    }

    setLocalAudioTrackEnabled(isEnabled) {
        try {
            if (this._senderAudioStream && this._senderAudioStream.getAudioTracks() && this._senderAudioStream.getAudioTracks().length > 0) {
                const localAudioTrack = this._senderAudioStream.getAudioTracks()[0];
                localAudioTrack.enabled = isEnabled;
            }
        }
        catch {
        }
    }

    generateSenderStreamId() {
        this._senderStreamId = DTDon.Utility.GetUUID();
    }

    createPeerSender(chatSessionId, signalServerHost, roomId) {
        if (this._peerSender) {
            this.closePeerSender();
        }

        this.generateSenderStreamId();

        this._peerSender = new DTDonRTCPeerSender(this._DTDon, chatSessionId);
        this._peerSender.connect(signalServerHost, roomId);
    }

    closePeerSender() {
        if (this._peerSender === undefined) {
            return;
        }

        this._peerSender.disconnect();
        this._peerSender = undefined;

        this.setSenderVideoType(DTDon.RTC.VIDEO_TYPE.NONE);
        this.setSenderAudioType(DTDon.RTC.AUDIO_TYPE.NONE);

        this._DTDon.chatManager.sendScreenInfo({
            isSharingScreen: false
        });
    }

    createPeerReceiver(chatSessionId, signalServerHost, roomId, streamId, videoWidth, videoHeight) {
        if (this._peerReceiverDictionary[streamId]) {
            return;
        }

        const peerReceiver = new DTDonRTCPeerReceiver(this._DTDon, chatSessionId, streamId);
        peerReceiver.connect(signalServerHost, roomId);

        this._peerReceiverDictionary[streamId] = {
            peerReceiver,
            videoWidth,
            videoHeight
        };
    }

    closePeerReceiver(streamId) {
        if (this._peerReceiverDictionary[streamId] === undefined) {
            return;
        }

        const peerReceiver = this._peerReceiverDictionary[streamId].peerReceiver;
        peerReceiver.disconnect();

        delete this._peerReceiverDictionary[streamId];
    }

    closeAllPeers() {
        this.closePeerSender();

        for (const streamId in this._peerReceiverDictionary) {
            this.closePeerReceiver(streamId);
        }
    }

    addVideoElement(streamId, videoTrack) {
        if (this._peerReceiverDictionary[streamId] === undefined) {
            console.error('ERROR: RTC Peer를 찾을 수 없음');
        }

        const peerReceiver = this._peerReceiverDictionary[streamId].peerReceiver;
        if (peerReceiver === undefined) {
            console.error('ERROR: RTC Peer를 찾을 수 없음');
        }

        const chatSessionId = peerReceiver.sessionId;
        this._DTDon.uiManager.userControlPanel.setVideoSource(chatSessionId, videoTrack);
    }

    addAudioElement(streamId, audioTrack) {
        if (this._peerReceiverDictionary[streamId] === undefined) {
            console.error('ERROR: RTC Peer를 찾을 수 없음');
        }

        const peerReceiver = this._peerReceiverDictionary[streamId].peerReceiver;
        if (peerReceiver === undefined) {
            console.error('ERROR: RTC Peer를 찾을 수 없음');
        }

        const chatSessionId = peerReceiver.sessionId;
        this._DTDon.uiManager.userControlPanel.setAudioSource(chatSessionId, audioTrack);
    }

    async startScreenSharing(videoType) {
        if (this._senderVideoType === videoType) {
            return;
        }

        const chatSessionId = this._DTDon.chatManager.sessionId;
        const roomId = this._DTDon.chatManager.roomId;

        this._DTDon.uiManager.userControlPanel.setVideoSource(chatSessionId, undefined);

        await this.setSenderVideoType(videoType);
        await this.setSenderAudioType(DTDon.RTC.AUDIO_TYPE.MICROPHONE);

        if (this._senderVideoStream && videoType !== DTDon.RTC.VIDEO_TYPE.NONE) {
            if (this._peerSender) {
                const videoTracks = this._senderVideoStream.getVideoTracks();
                if (videoTracks.length > 0) {
                    this._peerSender.videoSender.replaceTrack(videoTracks[0]);
                    this.sendVideoSizeToChatRoom();
                }
            }
            else {
                this.createPeerSender(chatSessionId, DTDonPlayer.RTC_SIGNAL_SERVER_HOST, roomId);
            }

            this._DTDon.uiManager.userControlPanel.setVideoSource(chatSessionId, {
                streams: [
                    this._senderVideoStream
                ]
            });
        }
    }

    sendVideoSizeToChatRoom() {
        // TODO: 비디오 리사이즈 관련해 다른 클라이언트(예: 유니티)들과 맞추는 작업 필요
        // 현재는 아래 정보 보내면 타 클라이언트들에서 비디오 팝업이 중복 생성됨
        // this._DTDon.chatManager.sendScreenInfo({
        //     streamId: this._senderStreamId,
        //     videoWidth: this._senderVideoWidth,
        //     videoHeight: this._senderVideoHeight
        // });
    }

    onDTDPlayerCanvasResized(width, height) {
        if (this._senderVideoType !== DTDon.RTC.VIDEO_TYPE.CANVAS) {
            return;
        }

        this._senderVideoWidth = width;
        this._senderVideoHeight = height;

        this.sendVideoSizeToChatRoom();
    }
}

export { DTDonRTCManager };