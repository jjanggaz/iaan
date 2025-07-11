import { DTDon } from '../../dtdon.js';

import { DTDonChatBasePanel } from './dtdon.chatbasepanel.js';

class DTDonChatRequestCallPanel extends DTDonChatBasePanel {
    constructor(dtdon) {
        super(dtdon);

        this._panelType = DTDon.UI.CHAT_PANEL_TYPE.REQUEST_CALL;

        this._receiverText = undefined;

        this._receiverPlayerSchema = undefined;
    }

    createPanel() {
        if (this._panelContainer) {
            return;
        }

        this._panelContainer = this.createBasePanel('request-call-panel');

        this._receiverText = document.createElement('div');
        this._receiverText.className = 'call-caller-text';
        this._receiverText.innerHTML = '사용자';

        const messageText = document.createElement('div');
        messageText.className = 'call-message-text';
        messageText.innerHTML = '연결중입니다.';

        const cancelCallButton = document.createElement('input');
        cancelCallButton.className = 'call-button';
        cancelCallButton.type = 'button';
        cancelCallButton.style.left = '50%';
        cancelCallButton.style.transform = 'translateX(-50%)';
        cancelCallButton.style.background = `url(${DTDonPlayer.IMAGE_DIRECTORY}/cancel-call-icon.png)`;
        cancelCallButton.style.backgroundSize = 'cover';
        cancelCallButton.onclick = () => {
            const toPlayerSchema = this._receiverPlayerSchema;
            if (toPlayerSchema === undefined) {
                return;
            }

            this._DTDon.lobbyManager.sendCancelCall(toPlayerSchema.playerLobbyId);

            this._DTDon.uiManager.showChatPanel(DTDon.UI.CHAT_PANEL_TYPE.USER_LIST);
        };

        const requestCallContainer = document.createElement('div');
        requestCallContainer.className = 'call-container';
        requestCallContainer.appendChild(this._receiverText);
        requestCallContainer.appendChild(messageText);
        requestCallContainer.appendChild(cancelCallButton);

        this._panelContainer.appendChild(requestCallContainer);
    }

    setCaller(playerSchema) {
        this._receiverPlayerSchema = playerSchema;

        if (this._receiverText) {
            this._receiverText.innerHTML = playerSchema.playerName;
        }
    }
}

export { DTDonChatRequestCallPanel };