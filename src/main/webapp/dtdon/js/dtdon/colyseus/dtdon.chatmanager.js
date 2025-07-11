import { DTDon } from '../dtdon.js';

class DTDonChatManager {
    constructor(dtdon) {
        this._DTDon = dtdon;

        this._chatRoom = undefined;
        this._chatRoomState = undefined;
        this._chatRoomPlayerDictionary = {};

        this._roomId = undefined;

        this._sessionId = undefined;
        this._player = undefined;

        this._chatPanel = undefined;
    }

    get hasJoined() {
        return this._chatRoom && this._chatRoom.hasJoined;
    }

    get roomId() {
        return this._roomId;
    }

    get sessionId() {
        return this._sessionId;
    }

    get playerDictionary() {
        return this._chatRoomPlayerDictionary;
    }

    async createChatRoom(lobbySessionId) {
        const options = this.getDefaultChatRoomOptions(lobbySessionId);
        const chatRoom = await this._DTDon.colyseusClient.create('chat_room', options).catch((error) => {
            console.error('CREATE CHAT ROOM ERROR:', error);
        });

        if (chatRoom) {
            this.initializeChatRoom(chatRoom);
        }

        return chatRoom;
    }

    async joinChatRoom(roomId, lobbySessionId) {
        const options = this.getDefaultChatRoomOptions(lobbySessionId);
        const chatRoom = await this._DTDon.colyseusClient.joinById(roomId, options).catch((error) => {
            console.error('JOIN CHAT ROOM ERROR:', error);
        });

        if (chatRoom) {
            this.initializeChatRoom(chatRoom);
        }

        return chatRoom;
    }

    initializeChatRoom(chatRoom) {
        this._chatRoom = chatRoom;

        this._roomId = this._chatRoom.roomId;

        this._sessionId = this._chatRoom.sessionId;

        this._chatPanel = this._DTDon.uiManager.getChatPanel(DTDon.UI.CHAT_PANEL_TYPE.CHAT);
        this._chatPanel.clearChatPanel();

        this._DTDon.uiManager.showUserControlPanel();

        this._chatRoom.onStateChange((state) => {
            this._chatRoomState = state;

            state.players.onAdd((player, sessionId) => {
                if (this._chatRoomPlayerDictionary[sessionId]) {
                    return;
                }

                if (this._sessionId === sessionId) {
                    this._player = player;
                }
                else {
                    player.listen('isSharingScreen', (isSharingScreen, previous) => {
                        if (isSharingScreen) {
                            const streamId = player.screenInfo.streamId;
                            const videoWidth = player.screenInfo.videoWidth;
                            const videoHeight = player.screenInfo.videoHeight;
                            let signalServerHost = player.screenInfo.signalingApi;
                            // 웹 브라우저에서 5060포트로 접속이 불가능.
                            if (signalServerHost.includes(':5060')) {
                                signalServerHost = signalServerHost.replace(':5060', ':5059');
                            }

                            this._DTDon.rtcManager.createPeerReceiver(
                                sessionId, signalServerHost, this._roomId, streamId, videoWidth, videoHeight);
                        }
                        else {
                            if (previous === undefined) {
                                return;
                            }

                            this._DTDon.uiManager.userControlPanel.setVideoSource(sessionId, undefined);
                            this._DTDon.uiManager.userControlPanel.setAudioSource(sessionId, undefined);

                            const streamId = player.screenInfo.streamId;

                            this._DTDon.rtcManager.closePeerReceiver(streamId);
                        }
                    });

                    player.listen('screenInfo', (screenInfo, previousScreenInfo) => {
                        // TODO: 비디오 리사이즈
                    });

                    this._chatPanel?.addUser(sessionId, player);
                    this._chatPanel?.addSystemMessage(`${player.playerName}님이 입장했습니다.`);
                }

                this._chatRoomPlayerDictionary[sessionId] = player;

                this._DTDon.uiManager.userControlPanel.addUserContainer(player, this._sessionId === sessionId);
            });

            state.players.onRemove((player, sessionId) => {
                if (this._chatRoomPlayerDictionary[sessionId] === undefined) {
                    return;
                }

                if (player.isSharingScreen && player.screenInfo.streamId) {
                    const streamId = player.screenInfo.streamId;
                    this._DTDon.rtcManager.closePeerReceiver(streamId);
                }

                this._DTDon.uiManager.userControlPanel.removeUserContainer(sessionId);
                this._chatPanel?.removeUser(sessionId);
                this._chatPanel?.addSystemMessage(`${player.playerName}님이 대화방을 나갔습니다.`);

                delete this._chatRoomPlayerDictionary[sessionId];
            });
        });

        this._chatRoom.onMessage('chatroomTalkMessage', (talkMessage) => {
            this.onTalkMessageReceived(talkMessage);
        });
        this._chatRoom.onMessage('chatroomShareMessage', (shareMessage) => {
            // this.onShareMessageReceived(shareMessage)
        });
        this._chatRoom.onMessage('roomKickOutMessage', (kickOutMessage) => {
            this.onKickOutMessageReceived(kickOutMessage);
        });
        this._chatRoom.onMessage('screenPinToolMessage', (screenPinToolMessage) => {
            this.onScreenPinToolMessageReceived(screenPinToolMessage);
        });
        this._chatRoom.onMessage('chatroomMarkUpMessage', (markupMessage) => {
            this.onMarkupMessageReceived(markupMessage);
        });
        this._chatRoom.onError((code, message) => {
            console.error(`CHATROOM ERROR(${code}): ${message}`);
        });
        this._chatRoom.onLeave((code) => {
            this._chatRoom = undefined;
            this._chatRoomState = undefined;
            this._chatRoomPlayerDictionary = {};

            this._roomId = undefined;

            this._sessionId = undefined;
            this._player = undefined;

            this._DTDon.rtcManager.closeAllPeers();

            this._DTDon.lobbyManager.sendTalking(false);

            this._DTDon.uiManager.hideUserControlPanel();
            this._DTDon.uiManager.showChatPanel(DTDon.UI.CHAT_PANEL_TYPE.USER_LIST);

            // DTDWeb에 채팅 퇴장 알림
            this._DTDon.DTDPlayer.SetJoinedDTDonChatRoom(false);
        });

        // DTDWeb에 채팅 입장 알림
        this._DTDon.DTDPlayer.SetJoinedDTDonChatRoom(true);
    }

    getDefaultChatRoomOptions(lobbySessionId) {
        const userProfile = this._DTDon.userProfile;

        return {
            playerLobbyId: lobbySessionId,
            playerName: userProfile.name,
            playerNickName: userProfile.nickname,
            companyName: userProfile.company,
            deviceName: 0,
            isSharingLocation: false,
            isSharingScreen: false
        };
    }

    sendTalkMessage(message) {
        for (const sessionId in this._chatRoomPlayerDictionary) {
            const talkMessage = {
                msgType: DTDon.Colyseus.CHAT_ROOM_TALK_TYPE.MESSAGE,
                talkMessage: message,
                shareType: DTDon.Colyseus.SHARE_TYPE.TEXT,
                toPlayerChatRoomId: sessionId,
                fromPlayerChatRoomId: this._sessionId,
                fromPlayerNickname: this._player.playerNickName
            };

            this.sendToChatRoom('chatroomTalkMessage', talkMessage);
        }
    }

    onTalkMessageReceived(talkMessage) {
        const messageType = talkMessage.msgType;
        switch (messageType) {
            case DTDon.Colyseus.CHAT_ROOM_TALK_TYPE.NOTICE:
                this.onNoticeMessageReceived(talkMessage);
                break;
            case DTDon.Colyseus.CHAT_ROOM_TALK_TYPE.MESSAGE:
                this.onPlainMessageReceived(talkMessage);
                break;
            case DTDon.Colyseus.CHAT_ROOM_TALK_TYPE.SHARE:
                if (talkMessage.shareType === DTDon.Colyseus.SHARE_TYPE.FILE) {
                    this.onShareMessageReceived(talkMessage);
                }
                else if (talkMessage.shareType === DTDon.Colyseus.SHARE_TYPE.SCREEN) {
                }
                break;
        }
    }

    onShareMessageReceived(shareMessage) {
        const fromSessionId = shareMessage.fromPlayerChatRoomId;

        if (fromSessionId === this._sessionId) {
            this._chatPanel?.addSendFileMessage(shareMessage);
        }
        else {
            this._chatPanel?.addReceiveFileMessage(fromSessionId, shareMessage);
        }
    }

    onKickOutMessageReceived(kickOutMessage) {

    }

    onScreenPinToolMessageReceived(screenPinToolMessage) {

    }

    onMarkupMessageReceived(markupMessage) {

    }

    onNoticeMessageReceived(talkMessage) {
        if (talkMessage.shareType !== DTDon.Colyseus.SHARE_TYPE.NONE ||
            talkMessage.shareType !== DTDon.Colyseus.SHARE_TYPE.TEXT) {
            if (talkMessage.shareType === DTDon.Colyseus.SHARE_TYPE.LOCATION) {

            }
            else if (talkMessage.shareType === DTDon.Colyseus.SHARE_TYPE.SCREEN) {

            }
        }
    }

    onPlainMessageReceived(talkMessage) {
        const fromSessionId = talkMessage.fromPlayerChatRoomId;
        const toSessionId = talkMessage.toPlayerChatRoomId;
        const message = talkMessage.talkMessage;

        if (toSessionId !== this._sessionId) {
            return;
        }

        if (fromSessionId === this._sessionId) {
            this._chatPanel?.addSendMessage(message);
        }
        else {
            this._chatPanel?.addReceiveMessage(fromSessionId, message);
        }
    }

    sendToChatRoom(type, message) {
        if (this._chatRoom === undefined) {
            return;
        }

        this._chatRoom.send(type, message);
    }

    leaveChatRoom() {
        if (this._chatRoom === undefined) {
            return;
        }

        this._chatRoom.leave();
    }

    sendScreenInfo(screenInfo) {
        for (const sessionId in this._chatRoomPlayerDictionary) {
            if (this._sessionId === sessionId) {
                continue;
            }

            const player = this._chatRoomPlayerDictionary[sessionId];

            this.sendToChatRoom('isSharingScreen', {
                clientType: 0,
                msgType: DTDon.Colyseus.CHAT_ROOM_TALK_TYPE.SHARE,
                shareType: DTDon.Colyseus.SHARE_TYPE.SCREEN,
                toPlayerChatRoomId: sessionId,
                toPlayerLobbyRoomId: player.playerLobbyId,
                fromPlayerChatRoomId: this._sessionId,
                fromPlayerLobbyRoomId: this._player.playerLobbyId,
                fromPlayerNickName: this._player.playerNickName,
                isSharingScreen: screenInfo.isSharingScreen,
                streamId: screenInfo.streamId,
                videoName: this._player.playerNickName,
                videoWidth: screenInfo.videoWidth,
                videoHeight: screenInfo.videoHeight,
                signalingApi: DTDonPlayer.RTC_SIGNAL_SERVER_HOST,
                isAudio: screenInfo.isAudio
            });
        }
    }

    sendShareMessage(fileName, fileSize, newAtchFileSeq) {
        const extension = DTDon.Utility.GetFileExtension(fileName);

        const shareMessage = {
            msgType: DTDon.Colyseus.CHAT_ROOM_TALK_TYPE.SHARE,
            shareType: DTDon.Colyseus.SHARE_TYPE.FILE,
            base64: DTDon.Utility.GetBase64FromString(fileName),
            byteLens: fileSize,
            ext: extension,
            file: fileName,
            fromPlayerChatRoomId: this._sessionId,
            fromPlayerLobbyRoomId: this._DTDon.lobbyManager.sessionId,
            fromPlayerNickName: this._player.playerNickName,
            toPlayerChatRoomId: '',
            localpath: '',
            remotepath: DTDonPlayer.FILE_DOWNLOAD_API_URL,
            newAtchFileSeq: newAtchFileSeq,
        };

        for (const sessionId in this._chatRoomPlayerDictionary) {
            shareMessage.toPlayerChatRoomId = sessionId;

            this.sendToChatRoom('chatroomTalkMessage', shareMessage);
        }
    }

    async sendAttachmentByFiles(files) {
        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch(DTDonPlayer.FILE_UPLOAD_API_URL, {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                if (response.ok) {
                    this.sendShareMessage(file.name, file.size, result.data.newAtchFileSeq);
                }
                else {
                    console.error('ERROR: 파일 업로드 실패');
                }
            }
            catch (error) {
                console.error('ERROR: 파일 업로드 실패', error);
            }
        }
    }

    // 마크업 공유 시 Base64에서 업로드
    async sendAttachmentByBase64(base64String) {
        if (!this.hasJoined) {
            return;
        }

        const mimeType = 'image/jpeg';
        const blob = DTDon.Utility.GetBlobFromBase64(base64String, mimeType);
        if (blob === undefined) {
            console.error('ERROR: 파일 변환 실패');
        }

        const fileName = `markup_${DTDon.Utility.GetFormattedNowDateTime('yyyyMMddHHmmss')}.jpg`;

        const formData = new FormData();
        formData.append('file', blob, fileName);

        try {
            const response = await fetch(DTDonPlayer.FILE_UPLOAD_API_URL, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (response.ok) {
                this.sendShareMessage(fileName, blob.size, result.data.newAtchFileSeq);
            }
            else {
                console.error('ERROR: 파일 업로드 실패');
            }
        }
        catch (error) {
            console.error('ERROR: 파일 업로드 실패', error);
        }
    }
}

export { DTDonChatManager };