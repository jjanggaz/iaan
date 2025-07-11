import { DTDon } from '../../dtdon.js';

import { DTDonChatBasePanel } from './dtdon.chatbasepanel.js';

class DTDonChatPanel extends DTDonChatBasePanel {
    constructor(dtdon) {
        super(dtdon);

        this._panelType = DTDon.UI.CHAT_PANEL_TYPE.CHAT;

        this._chatListContainer = undefined;

        this._chatInputText = undefined;
        this._chatSendButton = undefined;

        this._userDictionary = {};
    }

    createPanel() {
        if (this._panelContainer) {
            return;
        }

        this._panelContainer = this.createBasePanel('chat-panel');

        this._chatListContainer = document.createElement('div');
        this._chatListContainer.className = 'chat-panel-list-container';

        this._chatSendButton = document.createElement('input');
        this._chatSendButton.type = 'button';
        this._chatSendButton.className = 'chat-panel-send-button';
        this._chatSendButton.style.background = `url(${DTDonPlayer.IMAGE_DIRECTORY}/send-chat-icon.png) no-repeat`;
        this._chatSendButton.style.backgroundSize = 'cover';
        this._chatSendButton.onclick = () => {
            this.sendChatMessage();
        };

        this._chatInputText = document.createElement('input');
        this._chatInputText.className = 'chat-panel-input-text';
        this._chatInputText.type = 'text';
        this._chatInputText.spellcheck = false;
        this._chatInputText.autocomplete = 'off';
        this._chatInputText.onkeydown = (event) => {
            if (event.key === 'Enter') {
                this.sendChatMessage();
            }
        };

        this._panelContainer.appendChild(this._chatListContainer);
        this._panelContainer.appendChild(this._chatInputText);
        this._panelContainer.appendChild(this._chatSendButton);
    }

    showPanel() {
        super.showPanel();
    }

    hidePanel() {
        super.hidePanel();
    }

    addUser(chatSessionId, playerSchema) {
        const lobbySessionId = playerSchema.playerLobbyId;
        const user = this._DTDon.uiManager.getLobbyUserBySessionId(lobbySessionId);
        if (user === undefined) {
            console.error(`ERROR: ${playerSchema.playerName} 사용자 정보를 불러올 수 없음`);
            return;
        }

        this._userDictionary[chatSessionId] = user;
    }

    removeUser(chatSessionId) {
        if (this._userDictionary[chatSessionId]) {
            delete this._userDictionary[chatSessionId];
        }
    }

    clearChatPanel() {
        this._userDictionary = {};

        this._chatListContainer?.replaceChildren();
    }

    addSystemMessage(systemMessage) {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'chat-panel-system-message';
        messageContainer.innerHTML = systemMessage;

        this._chatListContainer.appendChild(messageContainer);

        this._chatListContainer.scrollTo({
            top: this._chatListContainer.scrollHeight
        });
    }

    addSendMessage(message) {
        const timeTextContainer = document.createElement('div');
        timeTextContainer.className = 'chat-panel-time-text';
        timeTextContainer.innerHTML = this.getFormattedNow();

        const messageTextContainer = document.createElement('div');
        messageTextContainer.className = 'chat-panel-message-text';
        messageTextContainer.innerHTML = message;

        const messageContainer = document.createElement('div');
        messageContainer.className = 'chat-panel-send-message-container';
        messageContainer.appendChild(messageTextContainer);
        messageContainer.appendChild(timeTextContainer);

        this._chatListContainer.appendChild(messageContainer);

        // DOM 추가 후 가변 사이즈 계산
        timeTextContainer.style.right = `${messageTextContainer.offsetWidth + 5}px`;

        const messageContainerHeight = messageTextContainer.offsetHeight;
        messageContainer.style.height = `${messageContainerHeight}px`;

        this._chatListContainer.scrollTo({
            top: this._chatListContainer.scrollHeight
        });
    }

    addReceiveMessage(fromSessionId, message) {
        const fromUser = this._userDictionary[fromSessionId];

        const initialContainer = document.createElement('div');
        initialContainer.className = 'chat-panel-initial';
        initialContainer.style.background = fromUser.personalColor;
        initialContainer.innerHTML = fromUser.initial;

        const userNameContainer = document.createElement('div');
        userNameContainer.className = 'chat-panel-user-name';
        userNameContainer.innerHTML = fromUser.name;

        const messageTextContainer = document.createElement('div');
        messageTextContainer.className = 'chat-panel-message-text';
        messageTextContainer.innerHTML = message;

        const timeTextContainer = document.createElement('div');
        timeTextContainer.className = 'chat-panel-time-text';
        timeTextContainer.innerHTML = this.getFormattedNow();

        const messageContainer = document.createElement('div');
        messageContainer.className = 'chat-panel-receive-message-container';
        messageContainer.appendChild(initialContainer);
        messageContainer.appendChild(userNameContainer);
        messageContainer.appendChild(messageTextContainer);
        messageContainer.appendChild(timeTextContainer);

        this._chatListContainer.appendChild(messageContainer);

        // DOM 추가 후 가변 사이즈 계산
        timeTextContainer.style.left = `${55 + messageTextContainer.offsetWidth + 5}px`;

        const messageContainerHeight = userNameContainer.offsetHeight + messageTextContainer.offsetHeight;
        messageContainer.style.height = `${messageContainerHeight}px`;

        this._chatListContainer.scrollTo({
            top: this._chatListContainer.scrollHeight
        });
    }

    addSendFileMessage(shareMessage) {
        const timeTextContainer = document.createElement('div');
        timeTextContainer.className = 'chat-panel-time-text';
        timeTextContainer.innerHTML = this.getFormattedNow();

        const {
            file, // 파일명
            ext, //확장자
            newAtchFileSeq, // 파일 시퀀스 넘버
            remotepath // Download API URL
        } = shareMessage;

        const lowercaseExt = ext.toLowerCase();
        const isImage = lowercaseExt === 'png' || lowercaseExt === 'jpg' || lowercaseExt === 'jpeg';

        const buttonId = `receive-file-${newAtchFileSeq}`;
        const messageTextContainer = document.createElement('div');
        messageTextContainer.className = 'chat-panel-message-text';
        messageTextContainer.innerHTML = `${file}<br>`;
        if (isImage) {
            messageTextContainer.innerHTML += `<img id="${buttonId}" class="chat-panel-image-button"></div>`;
        }
        else {
            messageTextContainer.innerHTML += `<div id="${buttonId}" class="chat-panel-download-button">파일 다운로드</div>`;
        }

        const messageContainer = document.createElement('div');
        messageContainer.className = 'chat-panel-send-message-container';
        messageContainer.appendChild(messageTextContainer);
        messageContainer.appendChild(timeTextContainer);

        this._chatListContainer.appendChild(messageContainer);

        // DOM 추가 후 가변 사이즈 계산
        timeTextContainer.style.right = `${messageTextContainer.offsetWidth + 5}px`;

        const messageContainerHeight = messageTextContainer.offsetHeight;
        messageContainer.style.height = `${messageContainerHeight}px`;

        this._chatListContainer.scrollTo({
            top: this._chatListContainer.scrollHeight
        });

        const userProfile = this._DTDon.userProfile;
        const downloadUrl = `${remotepath}?userId=${userProfile.name}&device=${userProfile.deviceIndex}&atchFileSeq=${newAtchFileSeq}`;
        let encodedImage = undefined;

        const fileButton = document.getElementById(buttonId);
        if (isImage) {
            fetch(downloadUrl, {
                method: 'GET'
            }).then((response) => {
                if (response && response.ok) {
                    return response.blob();
                }

                return false;
            }).then(async (blob) => {
                if (blob) {
                    encodedImage = await DTDon.Utility.GetBase64FromBlob(blob);

                    const imageUrl = URL.createObjectURL(blob);
                    fileButton.src = imageUrl;

                    fileButton.onload = () => {
                        URL.revokeObjectURL(imageUrl);
                    };
                }
            });
        }

        if (fileButton) {
            fileButton.addEventListener('click', () => {
                if (isImage) {
                    if (encodedImage) {
                        const dataUrl = DTDon.Utility.GetDataUrlFromBase64(encodedImage);
                        this._DTDon.DTDPlayer.LoadMarkupByBase64String(dataUrl, false);
                    }
                }
                else {
                    fetch(downloadUrl, {
                        method: 'GET'
                    }).then((response) => {
                        if (response && response.ok) {
                            return response.blob();
                        }

                        return false;
                    }).then(async (blob) => {
                        if (blob) {
                            this.downloadFile(file, blob);
                        }
                    });
                }
            });

            fileButton.style.userSelect = "none";
            fileButton.style.mozUserSelect = "none";
            fileButton.style.msUserSelect = "none";
        }
    }

    addReceiveFileMessage(fromSessionId, shareMessage) {
        const fromUser = this._userDictionary[fromSessionId];

        const initialContainer = document.createElement('div');
        initialContainer.className = 'chat-panel-initial';
        initialContainer.style.background = fromUser.personalColor;
        initialContainer.innerHTML = fromUser.initial;

        const userNameContainer = document.createElement('div');
        userNameContainer.className = 'chat-panel-user-name';
        userNameContainer.innerHTML = fromUser.name;

        const {
            file, // 파일명
            ext, //확장자
            newAtchFileSeq, // 파일 시퀀스 넘버
            remotepath // Download API URL
        } = shareMessage;

        const lowercaseExt = ext.toLowerCase();
        const isImage = lowercaseExt === 'png' || lowercaseExt === 'jpg' || lowercaseExt === 'jpeg';

        const buttonId = `receive-file-${newAtchFileSeq}`;
        const messageTextContainer = document.createElement('div');
        messageTextContainer.className = 'chat-panel-message-text';
        messageTextContainer.innerHTML = `${file}<br>`;
        if (isImage) {
            messageTextContainer.innerHTML += `<img id="${buttonId}" class="chat-panel-image-button"></div>`;
        }
        else {
            messageTextContainer.innerHTML += `<div id="${buttonId}" class="chat-panel-download-button">파일 다운로드</div>`;
        }

        const timeTextContainer = document.createElement('div');
        timeTextContainer.className = 'chat-panel-time-text';
        timeTextContainer.innerHTML = this.getFormattedNow();

        const messageContainer = document.createElement('div');
        messageContainer.className = 'chat-panel-receive-message-container';
        messageContainer.appendChild(initialContainer);
        messageContainer.appendChild(userNameContainer);
        messageContainer.appendChild(messageTextContainer);
        messageContainer.appendChild(timeTextContainer);

        this._chatListContainer.appendChild(messageContainer);

        // DOM 추가 후 가변 사이즈 계산
        timeTextContainer.style.left = `${55 + messageTextContainer.offsetWidth + 5}px`;

        const messageContainerHeight = userNameContainer.offsetHeight + messageTextContainer.offsetHeight;
        messageContainer.style.height = `${messageContainerHeight}px`;

        this._chatListContainer.scrollTo({
            top: this._chatListContainer.scrollHeight
        });

        const userProfile = this._DTDon.userProfile;
        const downloadUrl = `${remotepath}?userId=${userProfile.name}&device=${userProfile.deviceIndex}&atchFileSeq=${newAtchFileSeq}`;
        let encodedImage = undefined;

        const fileButton = document.getElementById(buttonId);
        if (isImage) {
            fetch(downloadUrl, {
                method: 'GET'
            }).then((response) => {
                if (response && response.ok) {
                    return response.blob();
                }

                return false;
            }).then(async (blob) => {
                if (blob) {
                    encodedImage = await DTDon.Utility.GetBase64FromBlob(blob);

                    const imageUrl = URL.createObjectURL(blob);
                    fileButton.src = imageUrl;

                    fileButton.onload = () => {
                        URL.revokeObjectURL(imageUrl);
                    };
                }
            });
        }

        if (fileButton) {
            fileButton.addEventListener('click', () => {
                if (isImage) {
                    if (encodedImage) {
                        const dataUrl = DTDon.Utility.GetDataUrlFromBase64(encodedImage);
                        this._DTDon.DTDPlayer.LoadMarkupByBase64String(dataUrl, false);
                    }
                }
                else {
                    fetch(downloadUrl, {
                        method: 'GET'
                    }).then((response) => {
                        if (response && response.ok) {
                            return response.blob();
                        }

                        return false;
                    }).then(async (blob) => {
                        if (blob) {
                            this.downloadFile(file, blob);
                        }
                    });
                }
            });

            fileButton.style.userSelect = "none";
            fileButton.style.mozUserSelect = "none";
            fileButton.style.msUserSelect = "none";
        }
    }

    downloadFile(fileName, blob) {
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    sendChatMessage() {
        const message = this._chatInputText.value;
        if (message) {
            this._DTDon.chatManager.sendTalkMessage(message);

            this._chatInputText.value = '';
        }
    }

    getFormattedNow() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();

        const ampm = hours >= 12 ? '오후' : '오전';

        hours = hours % 12;
        hours = hours ? hours : 12;

        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

        return `${ampm} ${hours}:${formattedMinutes}`;
    }
}

export { DTDonChatPanel };