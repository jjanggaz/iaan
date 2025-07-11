import { DTDon } from '../../dtdon.js';

import { DTDonChatBasePanel } from './dtdon.chatbasepanel.js';

class DTDonChatReceivedCallPanel extends DTDonChatBasePanel {
    constructor(dtdon) {
        super(dtdon);

        this._panelType = DTDon.UI.CHAT_PANEL_TYPE.RECEIVED_CALL;

        this._callerText = undefined;

        this._callerPlayerSchema = undefined;
    }

    createPanel() {
        if (this._panelContainer) {
            return;
        }

        this._panelContainer = this.createBasePanel('received-call-panel');

        this._callerText = document.createElement('div');
        this._callerText.className = 'call-caller-text';
        this._callerText.innerHTML = '사용자';

        const messageText = document.createElement('div');
        messageText.className = 'call-message-text';
        messageText.innerHTML = '연결을 수락 하시겠습니까?';

        const cancelCallButton = document.createElement('input');
        cancelCallButton.className = 'call-button';
        cancelCallButton.type = 'button';
        cancelCallButton.style.left = 'calc(50% - 35px)';
        cancelCallButton.style.transform = 'translateX(-50%)';
        cancelCallButton.style.background = `url(${DTDonPlayer.IMAGE_DIRECTORY}/cancel-call-icon.png)`;
        cancelCallButton.style.backgroundSize = 'cover';
        cancelCallButton.onclick = () => {
            this._DTDon.lobbyManager.sendRejectCall();
        };

        const acceptCallButton = document.createElement('input');
        acceptCallButton.className = 'call-button';
        acceptCallButton.type = 'button';
        acceptCallButton.style.left = 'calc(50% + 35px)';
        acceptCallButton.style.transform = 'translateX(-50%)';
        acceptCallButton.style.background = `url(${DTDonPlayer.IMAGE_DIRECTORY}/accept-call-icon.png)`;
        acceptCallButton.style.backgroundSize = 'cover';
        acceptCallButton.onclick = () => {
            this._DTDon.lobbyManager.sendAcceptCall();
        };

        const receivedCallContainer = document.createElement('div');
        receivedCallContainer.className = 'call-container';
        receivedCallContainer.appendChild(this._callerText);
        receivedCallContainer.appendChild(messageText);
        receivedCallContainer.appendChild(cancelCallButton);
        receivedCallContainer.appendChild(acceptCallButton);

        this._panelContainer.appendChild(receivedCallContainer);
    }

    setCaller(playerSchema) {
        this._callerPlayerSchema = playerSchema;

        if (this._callerText) {
            this._callerText.innerHTML = playerSchema.playerName;
        }
    }
}

export { DTDonChatReceivedCallPanel };