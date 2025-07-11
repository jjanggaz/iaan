import { DTDon } from '../dtdon.js';

class DTDonLobbyManager {
    constructor(dtdon) {
        this._DTDon = dtdon;

        this._lobbyRoom = undefined;
        this._lobbyRoomState = undefined;
        this._lobbyRoomPlayerDictionary = {};

        this._chatRoomDictionary = {}; // Unused

        this._lastRequestCallCommandSchema = undefined;

        this._sessionId = undefined;
        this._player = undefined; // 나

        this._addUserToGroupPopup = undefined;
    }

    get sessionId() {
        return this._sessionId;
    }

    set sessionId(sessionId) {
        this._sessionId = sessionId;
    }

    get lobbyRoomPlayerDictionary() {
        return this._lobbyRoomPlayerDictionary;
    }

    async joinLobby() {
        const userProfile = this._DTDon.userProfile;

        const options = {
            playerName: userProfile.name,
            playerNickName: userProfile.nickname,
            companyName: userProfile.company,
            deviceName: userProfile.deviceIndex,
            isSharingLocation: false,
            isTalking: false,
            workingAction: '',
            isAniState: false
        };

        const lobbyRoom = await this._DTDon.colyseusClient.joinOrCreate('lobby_room', options).catch((error) => {
            console.error('JOIN ERROR: ', error);
        });

        if (lobbyRoom) {
            this._DTDon.uiManager.showChatPanel(DTDon.UI.CHAT_PANEL_TYPE.USER_LIST);
            this._DTDon.popupManager.createAddUserToGroupPopup();

            this._addUserToGroupPopup = this._DTDon.popupManager.addUserToGroupPopup;

            this.initializeLobbyRoom(lobbyRoom);
        }
    }

    initializeLobbyRoom(lobbyRoom) {
        this._lobbyRoom = lobbyRoom;

        this._sessionId = this._lobbyRoom.sessionId;

        // 로비의 상태가 바뀌었을때(플레이어 추가, 삭제)
        this._lobbyRoom.onStateChange((state) => {
            this._lobbyRoomState = state;

            state.lobbyPlayers.onAdd((player, sessionId) => {
                if (this._lobbyRoomPlayerDictionary[sessionId]) {
                    return;
                }

                if (this._sessionId === sessionId) {
                    this._player = player;
                }
                else {
                    this._DTDon.uiManager.addUserCell(player);
                    this._DTDon.uiManager.setUserTalking(sessionId, player.isTalking);

                    this._addUserToGroupPopup.setUserTalking(sessionId, player.isTalking);

                    this._addUserToGroupPopup.addUserCellBySessionId(sessionId);

                    player.listen('isTalking', (isTalking, _) => {
                        this._DTDon.uiManager.setUserTalking(sessionId, isTalking);
                        this._addUserToGroupPopup.setUserTalking(sessionId, player.isTalking);
                    });

                    player.listen('isSharingLocation', (isSharingLocation, _) => {
                        if (isSharingLocation) {
                            this._DTDon.DTDPlayer.AddDTDonPlayer(sessionId);
                        }
                        else {
                            this._DTDon.DTDPlayer.RemoveDTDonPlayer(sessionId);
                        }
                    });

                    player.position.onChange(() => {
                        if (player.isSharingLocation) {
                            this._DTDon.DTDPlayer.UpdateDTDonPlayerPosition(sessionId, {
                                x: player.position.x,
                                y: player.position.y,
                                z: player.position.z
                            });
                        }
                    });

                    player.rotation.onChange(() => {
                        if (player.isSharingLocation) {
                            this._DTDon.DTDPlayer.UpdateDTDonPlayerRotation(sessionId, {
                                x: player.rotation.x,
                                y: player.rotation.y,
                                z: player.rotation.z,
                                w: player.rotation.w
                            });
                        }
                    })
                }

                this._lobbyRoomPlayerDictionary[sessionId] = player;
            });

            state.lobbyPlayers.onRemove((_, sessionId) => {
                if (this._lobbyRoomPlayerDictionary[sessionId] === undefined) {
                    return;
                }

                delete this._lobbyRoomPlayerDictionary[sessionId];

                this._DTDon.uiManager.removeUserCell(sessionId);

                this._addUserToGroupPopup.removeUserBySessionId(sessionId);

                this._DTDon.DTDPlayer.RemoveDTDonPlayer(sessionId);
            });
        });

        // 뭐였는지 까먹음
        this._lobbyRoom.onMessage('rooms', (roomInfos) => {
        });

        // 방이 개설 됐을때
        this._lobbyRoom.onMessage('+', (roomInfos) => {
            const roomId = roomInfos[0];
            if (this._chatRoomDictionary[roomId] === undefined) {
                this._chatRoomDictionary[roomId] = roomInfos[1];
            }
        });

        // 방이 삭제 됐을때
        this._lobbyRoom.onMessage('-', (roomId) => {
            if (this._chatRoomDictionary[roomId]) {
                delete this._chatRoomDictionary[roomId];
            }
        });

        // 명령 메시지
        this._lobbyRoom.onMessage('commandMessage', (commandSchema) => {
            switch (commandSchema.commandType) {
                case DTDon.Colyseus.COMMAND_TYPE.REQUEST:
                case DTDon.Colyseus.COMMAND_TYPE.REQUEST_GROUP:
                    this.onCallReceived(commandSchema);
                    break;
                case DTDon.Colyseus.COMMAND_TYPE.REQUEST_CANCEL:
                case DTDon.Colyseus.COMMAND_TYPE.REQUEST_GROUP_CANCEL:
                    this.onCallCanceled(commandSchema);
                    break;
                // 상대방이 초대 수락한 경우
                case DTDon.Colyseus.COMMAND_TYPE.INVITE:
                case DTDon.Colyseus.COMMAND_TYPE.INVITE_GROUP:
                    if (commandSchema.commandType === DTDon.Colyseus.COMMAND_TYPE.INVITE) {
                        this.onCallAccepted(commandSchema);
                    }
                    else {
                        console.log('CommandType(INVITE_GROUP): ', commandSchema);
                    }

                    break;
                case DTDon.Colyseus.COMMAND_TYPE.LOBBY_ROOM:
                    console.log('CommandType(LOBBY_ROOM): ', commandSchema);
                    break;
                case DTDon.Colyseus.COMMAND_TYPE.CHAT_ROOM:
                    console.log('CommandType(CHAT_ROOM): ', commandSchema);
                    break;
            }
        });

        // 받은 메시지(예: isTalking=true일 때 보내는 메시지)
        this._lobbyRoom.onMessage('commandMessageBox', (message) => {
            console.log(this._lobbyRoom.name, 'onMessage(commandMessageBox)');
            console.log(message);
        });

        this._lobbyRoom.onError((code, message) => {
            console.error(`LOBBYROOM ERROR(${code}): ${message}`);
        });

        // 내가 떠났을 때
        this._lobbyRoom.onLeave((code) => {
        });
    }

    async sendRequestCall(toSessionId) {
        await this._DTDon.chatManager.createChatRoom(this._sessionId);
        if (!this._DTDon.chatManager.hasJoined) {
            console.error('ERROR: 방 개설에 실패함');
            return;
        }

        const toPlayer = this._lobbyRoomPlayerDictionary[toSessionId];
        if (toPlayer === undefined) {
            console.error(`ERROR: 사용자 정보를 찾을 수 없음(${toSessionId}).`);
            return;
        }

        const toPlayerLobbyRoomId = toSessionId;
        const fromPlayerNickName = this._player.playerNickName;
        const fromPlayerLobbyRoomId = this._sessionId;

        this.sendToLobbyRoom('commandMessage', {
            commandType: DTDon.Colyseus.COMMAND_TYPE.REQUEST,
            toPlayerLobbyRoomId,
            fromPlayerLobbyRoomId,
            fromPlayerNickName,
            roomTitle: '1:1 대화방입니다.',
            creator: fromPlayerLobbyRoomId,
            userList: toSessionId,
            roomMaster: fromPlayerLobbyRoomId,
            roomId: this._DTDon.chatManager.roomId
        });

        this.sendTalking(true);

        this._DTDon.uiManager.showChatPanel(DTDon.UI.CHAT_PANEL_TYPE.REQUEST_CALL);
        this._DTDon.uiManager.setCaller(toPlayer);
    }

    async sendRequestGroupCall(toSessionIds) {
        if (toSessionIds === undefined || toSessionIds.length === 0) {
            return;
        }

        if (!this._DTDon.chatManager.hasJoined) {
            await this._DTDon.chatManager.createChatRoom(this._sessionId);
            if (!this._DTDon.chatManager.hasJoined) {
                console.error('ERROR: 방 개설에 실패함');
                return;
            }
        }

        const fromPlayerNickName = this._player.playerNickName;
        const fromPlayerLobbyRoomId = this._sessionId;

        let userList = '';
        for (const toSessionId of toSessionIds) {
            if (userList) {
                userList += `,${toSessionId}`;
            }
            else {
                userList += toSessionId;
            }
        }

        for (const toSessionId of toSessionIds) {
            const toPlayer = this._lobbyRoomPlayerDictionary[toSessionId];
            if (toPlayer === undefined) {
                console.error(`ERROR: 사용자 정보를 찾을 수 없음(${toSessionId}).`);
                return;
            }

            if (toPlayer.isTalking) {
                continue;
            }

            const toPlayerLobbyRoomId = toSessionId;

            this.sendToLobbyRoom('commandMessage', {
                commandType: DTDon.Colyseus.COMMAND_TYPE.REQUEST_GROUP,
                toPlayerLobbyRoomId,
                fromPlayerLobbyRoomId,
                fromPlayerNickName,
                roomTitle: '회의룸에 초대합니다.',
                creator: fromPlayerLobbyRoomId,
                userList,
                roomMaster: fromPlayerLobbyRoomId,
                roomId: this._DTDon.chatManager.roomId
            });
        }

        this.sendTalking(true);

        this._DTDon.uiManager.showChatPanel(DTDon.UI.CHAT_PANEL_TYPE.CHAT);
    }

    // sendRejectCall과 차이는 sendCancelCall은 내가 보낸 Request를 취소함.
    sendCancelCall(toSessionId) {
        this.sendToLobbyRoom('commandMessage', {
            commandType: DTDon.Colyseus.COMMAND_TYPE.REQUEST_CANCEL,
            toPlayerLobbyRoomId: toSessionId,
            fromPlayerLobbyRoomId: this._sessionId,
            fromPlayerNickName: this._player.playerNickName,
            roomId: this._DTDon.chatManager.roomId,
            roomTitle: '',
            creator: '',
            userList: '',
            roomMaster: ''
        });

        this.onCallCanceled();
    }

    async sendAcceptCall() {
        if (this._lastRequestCallCommandSchema === undefined) {
            console.error('ERROR: 받은 Call이 없음.');
            return;
        }

        const commandSchema = this._lastRequestCallCommandSchema;
        const commandType = commandSchema.commandType === DTDon.Colyseus.COMMAND_TYPE.REQUEST ?
            DTDon.Colyseus.COMMAND_TYPE.INVITE : DTDon.Colyseus.COMMAND_TYPE.INVITE_GROUP;

        const roomId = commandSchema.roomId;

        this.sendToLobbyRoom('commandMessage', {
            commandType,
            toPlayerLobbyRoomId: commandSchema.fromPlayerLobbyRoomId,
            fromPlayerLobbyRoomId: this._sessionId,
            fromPlayerNickName: this._player.playerNickName,
            roomId,
            roomTitle: commandSchema.roomTitle,
            creator: commandSchema.creator,
            userList: commandSchema.userList,
            roomMaster: commandSchema.roomMaster
        });

        await this._DTDon.chatManager.joinChatRoom(roomId, this._sessionId);
        if (this._DTDon.chatManager.hasJoined) {
            this.sendTalking(true);
        }
        else {
            console.error('ERROR: 방 입장에 실패함');
        }

        this._DTDon.uiManager.showChatPanel(DTDon.UI.CHAT_PANEL_TYPE.CHAT);
    }

    // 받은 Call을 거절.
    sendRejectCall() {
        if (this._lastRequestCallCommandSchema === undefined) {
            console.error('ERROR: 받은 Call이 없음.');
            return;
        }

        const commandSchema = this._lastRequestCallCommandSchema;
        const commandType = commandSchema.commandType === DTDon.Colyseus.COMMAND_TYPE.REQUEST ?
            DTDon.Colyseus.COMMAND_TYPE.REQUEST_CANCEL : DTDon.Colyseus.COMMAND_TYPE.REQUEST_GROUP_CANCEL;

        this.sendToLobbyRoom('commandMessage', {
            commandType,
            toPlayerLobbyRoomId: commandSchema.fromPlayerLobbyRoomId,
            fromPlayerLobbyRoomId: this._sessionId,
            fromPlayerNickName: this._player.playerNickName,
            roomId: commandSchema.roomId,
            roomTitle: '',
            creator: '',
            userList: '',
            roomMaster: ''
        });

        this.sendTalking(false);

        this._DTDon.uiManager.showChatPanel(DTDon.UI.CHAT_PANEL_TYPE.USER_LIST);
    }

    sendTalking(isTalking) {
        this.sendToLobbyRoom('isTalking', isTalking);
    }

    onCallReceived(commandSchema) {
        if (this._player.isTalking) {
            this.sendRejectCall(commandSchema);
            return;
        }

        this._lastRequestCallCommandSchema = commandSchema;

        let fromPlayerSessionId = commandSchema.fromPlayerLobbyRoomId;
        let fromPlayer = this._lobbyRoomPlayerDictionary[fromPlayerSessionId];

        this._DTDon.uiManager.showChatPanel(DTDon.UI.CHAT_PANEL_TYPE.RECEIVED_CALL);
        this._DTDon.uiManager.setCaller(fromPlayer);

        this.sendTalking(true);
    }

    onCallCanceled(commandSchema) {
        const chatRoomPlayerIds = Object.keys(this._DTDon.chatManager.playerDictionary);
        if (chatRoomPlayerIds.length > 1) {
            console.log(commandSchema);

            const fromSessionId = commandSchema.fromPlayerLobbyRoomId;
            const fromPlayer = this._lobbyRoomPlayerDictionary[fromSessionId];
            if (fromPlayer) {
                const chatPanel = this._DTDon.uiManager.getChatPanel(DTDon.UI.CHAT_PANEL_TYPE.CHAT);
                chatPanel?.addSystemMessage(`${fromPlayer.playerName} 님이 대화를 거부했습니다.`);
            }
        }
        else {
            if (this._DTDon.chatManager.hasJoined) {
                this._DTDon.chatManager.leaveChatRoom();
            }

            this.sendTalking(false);

            this._DTDon.uiManager.showChatPanel(DTDon.UI.CHAT_PANEL_TYPE.USER_LIST);
        }
    }

    onCallAccepted(commandSchema) {
        this._DTDon.uiManager.showChatPanel(DTDon.UI.CHAT_PANEL_TYPE.CHAT);
    }

    sendToLobbyRoom(type, message) {
        if (this._lobbyRoom === undefined) {
            return;
        }

        this._lobbyRoom.send(type, message);
    }
}

export { DTDonLobbyManager };