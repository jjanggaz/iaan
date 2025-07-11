import { DTDon } from '../../dtdon.js';

import { DTDonVideoPopup } from '../popup/dtdon.videopopup.js';

class DTDonUserControlPanel {
    constructor(dtdon) {
        this._DTDon = dtdon;

        this._panelContainer = undefined;

        this._roomInfoContainer = undefined;
        this._userCountText = undefined;

        this._userListContainer = undefined; // 나, Separator, 다른 사용자
        this._remoteUserListContainer = undefined; // 다른 사용자(상위: this._userListContainer)

        this._userDictionary = {};

        this._micControlButton = undefined;
        this._isMicOn = false;
    }

    get panelContainer() {
        return this._panelContainer;
    }

    createPanel() {
        if (this._panelContainer) {
            this.closePanel();
        }

        const playerListText = document.createElement('div');
        playerListText.className = 'player-list-text';
        playerListText.innerHTML = '접속자목록';

        const buddyImage = document.createElement('img');
        buddyImage.className = 'buddy-img';
        buddyImage.src = `${DTDonPlayer.IMAGE_DIRECTORY}/buddy-icon.png`;

        this._userCountText = document.createElement('div');
        this._userCountText.className = 'user-count-text';
        this._userCountText.innerHTML = '0';

        this._roomInfoContainer = document.createElement('div');
        this._roomInfoContainer.className = 'room-info-container';
        this._roomInfoContainer.appendChild(playerListText);
        this._roomInfoContainer.appendChild(buddyImage);
        this._roomInfoContainer.appendChild(this._userCountText);

        this._remoteUserListContainer = document.createElement('div');
        this._remoteUserListContainer.className = 'remote-user-list-container';

        const verticalSeparator = document.createElement('div');
        verticalSeparator.className = 'user-list-vertical-separator';
        verticalSeparator.style.position = 'absolute';
        verticalSeparator.style.left = '215px';
        verticalSeparator.style.top = '5px';
        verticalSeparator.style.width = '3px';
        verticalSeparator.style.height = '140px';
        verticalSeparator.style.background = 'rgb(50, 50, 50)';

        this._userListContainer = document.createElement('div');
        this._userListContainer.className = 'user-list-container';
        this._userListContainer.appendChild(verticalSeparator);
        this._userListContainer.appendChild(this._remoteUserListContainer);

        this._panelContainer = document.createElement('div');
        this._panelContainer.className = 'user-control-panel-container';
        this._panelContainer.appendChild(this._roomInfoContainer);
        this._panelContainer.appendChild(this._userListContainer);
    }

    closePanel() {
        if (this._panelContainer === undefined) {
            return;
        }

        for (const chatSessionId in this._userDictionary) {
            const videoPopup = this._userDictionary[chatSessionId].videoPopup;
            if (videoPopup) {
                videoPopup.hidePopup();
                this._userDictionary[chatSessionId].videoPopup = undefined;
            }
        }

        this._userDictionary = {};

        this._micControlButton = undefined;

        this.updateUserCountText();
    }

    addUserContainer(playerSchema, itsMe) {
        const chatSessionId = playerSchema.playerChatRoomId;

        let userContainer = undefined;
        if (itsMe) {
            userContainer = document.createElement('div');
            userContainer.className = 'user-container';
            userContainer.style.left = '0';
            userContainer.style.top = '5px';
            userContainer.style.border = '1px solid rgb(237, 218, 139)';

            this._userListContainer.appendChild(userContainer);
        }
        else {
            userContainer = document.createElement('li');
            userContainer.className = 'user-container';
            userContainer.style.position = 'relative';
            userContainer.style.border = '1px solid black';
            this._remoteUserListContainer.appendChild(userContainer);
        }

        const videoElement = document.createElement('video');
        videoElement.className = 'user-rtc-video';
        videoElement.style.display = 'none';

        const videoPoster = document.createElement('img');
        videoPoster.className = 'user-rtc-video-poster';
        videoPoster.src = `${DTDonPlayer.IMAGE_DIRECTORY}/poster-icon.png`;

        const audioElement = document.createElement('audio');
        audioElement.className = 'user-rtc-audio';
        audioElement.autoplay = false;
        audioElement.controls = false;

        const userNameElement = document.createElement('div');
        userNameElement.className = 'user-name-text';
        userNameElement.innerHTML = playerSchema.playerName;

        userContainer.appendChild(videoElement);
        userContainer.appendChild(videoPoster);
        userContainer.appendChild(audioElement);
        userContainer.appendChild(userNameElement);

        // 화면 레이어 때문에 비디오 태그 추가 후 버튼 추가
        if (itsMe) {
            let isWebCamOn = false;
            let isScreenSharingOn = false;

            this._isMicOn = false;
            this._micControlButton = document.createElement('input');
            this._micControlButton.className = 'user-control-button';
            this._micControlButton.type = 'button';
            this._micControlButton.style.left = '0px';
            this._micControlButton.style.background = `url(${DTDonPlayer.IMAGE_DIRECTORY}/mic-off-icon.png) no-repeat`;
            this._micControlButton.style.backgroundSize = 'cover';
            this._micControlButton.style.display = 'none';
            this._micControlButton.onclick = () => {
                this._isMicOn = !this._isMicOn;

                this._DTDon.rtcManager.setLocalAudioTrackEnabled(this._isMicOn);

                if (this._isMicOn) {
                    this._micControlButton.style.background = `url(${DTDonPlayer.IMAGE_DIRECTORY}/mic-off-icon.png) no-repeat`;
                }
                else {
                    this._micControlButton.style.background = `url(${DTDonPlayer.IMAGE_DIRECTORY}/mic-on-icon.png) no-repeat`;
                }

                this._micControlButton.style.backgroundSize = 'cover';
            };

            const webcamButton = document.createElement('input');
            webcamButton.className = 'user-control-button';
            webcamButton.type = 'button';
            webcamButton.style.left = '35px';
            webcamButton.style.background = `url(${DTDonPlayer.IMAGE_DIRECTORY}/webcam-icon.png) no-repeat`;
            webcamButton.style.backgroundSize = 'cover';
            webcamButton.onclick = () => {
                isWebCamOn = !isWebCamOn;
                isScreenSharingOn = false;

                screenSharingButton.style.borderColor = 'black';

                if (isWebCamOn) {
                    this._DTDon.rtcManager.startScreenSharing(DTDon.RTC.VIDEO_TYPE.WEBCAM);
                    webcamButton.style.borderColor = 'red';

                    isScreenSharingOn = false;
                }
                else {
                    webcamButton.style.borderColor = 'black';

                    this.setVideoSource(chatSessionId, undefined);
                    this.setAudioSource(chatSessionId, undefined);

                    this._DTDon.rtcManager.closePeerSender();
                }
            };

            const screenSharingButton = document.createElement('input');
            screenSharingButton.className = 'user-control-button';
            screenSharingButton.type = 'button';
            screenSharingButton.style.left = '70px';
            screenSharingButton.style.background = `url(${DTDonPlayer.IMAGE_DIRECTORY}/screen-sharing-icon.png) no-repeat`;
            screenSharingButton.style.backgroundSize = 'cover';
            screenSharingButton.onclick = () => {
                isWebCamOn = false;
                isScreenSharingOn = !isScreenSharingOn;

                webcamButton.style.borderColor = 'black';

                if (isScreenSharingOn) {
                    screenSharingButton.style.borderColor = 'red';

                    this._DTDon.rtcManager.startScreenSharing(DTDon.RTC.VIDEO_TYPE.CANVAS);

                }
                else {
                    screenSharingButton.style.borderColor = 'black';

                    this.setVideoSource(chatSessionId, undefined);
                    this.setAudioSource(chatSessionId, undefined);

                    this._DTDon.rtcManager.closePeerSender();
                }
            };

            const userControlButtonContainer = document.createElement('div');
            userControlButtonContainer.className = 'user-control-button-container';
            userControlButtonContainer.appendChild(this._micControlButton);
            userControlButtonContainer.appendChild(webcamButton);
            userControlButtonContainer.appendChild(screenSharingButton);

            userContainer.appendChild(userControlButtonContainer);
        }
        else {
            userContainer.onclick = () => {
                const user = this._userDictionary[chatSessionId];
                if (user.videoPopup) {
                    user.videoPopup.hidePopup();
                    user.videoPopup = undefined;
                }
                else {
                    const videoStream = videoElement.srcObject;
                    if (!videoStream) {
                        return;
                    }

                    const videoTracks = videoStream.getVideoTracks();
                    if (videoTracks === undefined || videoTracks.length === 0) {
                        return;
                    }

                    const videoTrack = videoTracks[0];
                    const videoSettings = videoTrack.getSettings();
                    const videoWidth = videoSettings.width;
                    const videoHeight = videoSettings.height;

                    const userName = user.playerSchema.playerName;

                    const videoPopup = new DTDonVideoPopup(this._DTDon);
                    videoPopup.createPopup(userName, videoWidth, videoHeight, () => {
                        user.videoPopup.hidePopup();
                        user.videoPopup = undefined;
                    });
                    videoPopup.showPopup();

                    const videoPopupElement = videoPopup.videoElement;
                    videoPopupElement.srcObject = videoStream;
                    videoPopupElement.autoplay = true;
                    videoPopupElement.playsInline = true;

                    user.videoPopup = videoPopup;
                }
            };
        }

        this._userDictionary[chatSessionId] = {
            playerSchema,
            userContainer,
            videoPopup: undefined,
            hasVideo: false,
            hasAudio: false
        };

        this.updateUserCountText();
    }

    setMicControlButtonVisible(isVisible) {
        if (this._micControlButton) {
            this._micControlButton.style.display = isVisible ? 'block' : 'none';

            if (isVisible) {
                this._isMicOn = true;
                this._micControlButton.style.background = `url(${DTDonPlayer.IMAGE_DIRECTORY}/mic-off-icon.png) no-repeat`;
                this._micControlButton.style.backgroundSize = 'cover';
            }
        }
    }

    removeUserContainer(chatSessionId) {
        if (this._userDictionary[chatSessionId] === undefined) {
            return;
        }

        const userContainer = this._userDictionary[chatSessionId].userContainer;
        if (chatSessionId === this._DTDon.chatManager.sessionId) {
            this._userListContainer.removeChild(userContainer);
        }
        else {
            this._remoteUserListContainer.removeChild(userContainer);
        }

        const videoPopup = this._userDictionary[chatSessionId].videoPopup;
        if (videoPopup) {
            videoPopup.hidePopup();
            this._userDictionary[chatSessionId].videoPopup = undefined;
        }

        delete this._userDictionary[chatSessionId];

        this.updateUserCountText();
    }

    getUserContainerBySessionId(chatSessionId) {
        if (this._userDictionary[chatSessionId] === undefined) {
            console.error(`ERROR: ${chatSessionId} UserContainer를 찾을 수 없음`);
            return;
        }

        return this._userDictionary[chatSessionId].userContainer;
    }

    setVideoSource(chatSessionId, videoTrack) {
        if (this._userDictionary[chatSessionId] === undefined) {
            console.error(`ERROR: ${chatSessionId} UserContainer를 찾을 수 없음`);
            return;
        }

        const hasVideo = videoTrack !== undefined;
        if (!hasVideo && this._userDictionary[chatSessionId].videoPopup) {
            this._userDictionary[chatSessionId].videoPopup.hidePopup();
            this._userDictionary[chatSessionId].videoPopup = undefined;
        }

        const userContainer = this._userDictionary[chatSessionId].userContainer;
        const videoElement = userContainer.querySelector('.user-rtc-video');
        videoElement.style.display = hasVideo ? 'block' : 'none';
        videoElement.autoplay = hasVideo;
        videoElement.playsInline = hasVideo;
        videoElement.srcObject = hasVideo ? videoTrack.streams[0] : undefined;

        const videoPoster = userContainer.querySelector('.user-rtc-video-poster');
        videoPoster.style.display = hasVideo ? 'none' : 'block';

        this._userDictionary[chatSessionId].hasVideo = hasVideo;
    }

    setAudioSource(chatSessionId, audioTrack) {
        if (this._userDictionary[chatSessionId] === undefined) {
            console.error(`ERROR: ${chatSessionId} UserContainer를 찾을 수 없음`);
            return;
        }

        const hasAudio = audioTrack !== undefined;

        const userContainer = this._userDictionary[chatSessionId].userContainer;
        const audioElement = userContainer.querySelector('.user-rtc-audio');
        audioElement.autoplay = hasAudio;
        audioElement.controls = false;
        audioElement.srcObject = hasAudio ? audioTrack.streams[0] : undefined;

        this._userDictionary[chatSessionId].hasAudio = hasAudio;
    }

    updateUserCountText() {
        const keys = Object.keys(this._userDictionary);
        this._userCountText.innerHTML = keys.length.toString();
    }
}

export { DTDonUserControlPanel };