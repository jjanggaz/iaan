import { DTDon } from './dtdon.js';

import { DTDonUserControlPanel } from './gui/usercontrolpanel/dtdon.usercontrolpanel.js';

import { DTDonChatUserListPanel } from './gui/chatpanel/dtdon.chatuserlistpanel.js';
import { DTDonChatRequestCallPanel } from './gui/chatpanel/dtdon.chatrequestcallpanel.js';
import { DTDonChatReceivedCallPanel } from './gui/chatpanel/dtdon.chatreceivedcallpanel.js';
import { DTDonChatPanel } from './gui/chatpanel/dtdon.chatpanel.js';

class DTDonUIManager {
    constructor(dtdon) {
        this._DTDon = dtdon;

        this._userContainer = this._DTDon.userContainer;
        this._chatContainer = this._DTDon.chatContainer;

        this._userControlPanel = new DTDonUserControlPanel(this._DTDon);

        this._chatPanels = [];
        this._chatPanels.length = Object.keys(DTDon.UI.CHAT_PANEL_TYPE).length;

        this._currentChatPanelIndex = -1;

        this.initializeChatPanels();
    }

    get userControlPanel() {
        return this._userControlPanel;
    }

    initializeChatPanels() {
        for (let panelIndex = 0; panelIndex < this._chatPanels.length; panelIndex++) {
            let chatPanel = undefined;
            switch (panelIndex) {
                case DTDon.UI.CHAT_PANEL_TYPE.LOADING:
                    break;
                case DTDon.UI.CHAT_PANEL_TYPE.USER_LIST:
                    chatPanel = new DTDonChatUserListPanel(this._DTDon);
                    break;
                case DTDon.UI.CHAT_PANEL_TYPE.REQUEST_CALL:
                    chatPanel = new DTDonChatRequestCallPanel(this._DTDon);
                    break;
                case DTDon.UI.CHAT_PANEL_TYPE.RECEIVED_CALL:
                    chatPanel = new DTDonChatReceivedCallPanel(this._DTDon);
                    break;
                case DTDon.UI.CHAT_PANEL_TYPE.CANCELED_CALL:
                    break;
                case DTDon.UI.CHAT_PANEL_TYPE.CHAT:
                    chatPanel = new DTDonChatPanel(this._DTDon);
                    break;
            }

            if (chatPanel) {
                this._chatPanels[panelIndex] = chatPanel;
            }
        }
    }

    addChatContainer(chatPanelContainer) {
        if (this._chatContainer === undefined) {
            return;
        }

        this._chatContainer.appendChild(chatPanelContainer);
    }

    removeChatContainer(chatPanelContainer) {
        if (this._chatContainer === undefined) {
            return;
        }

        this._chatContainer.removeChild(chatPanelContainer);
    }

    getChatPanel(chatPanelType) {
        const chatPanel = this._chatPanels[chatPanelType];

        return chatPanel;
    }

    showChatPanel(chatPanelType) {
        this.hideAllPanels();

        const chatPanel = this._chatPanels[chatPanelType];

        if (chatPanel) {
            this._currentChatPanelIndex = chatPanelType;

            if (chatPanel.panelContainer === undefined) {
                chatPanel.createPanel();
                this.addChatContainer(chatPanel.panelContainer);
            }

            chatPanel.showPanel();
        }

        return chatPanel;
    }

    hideAllPanels() {
        for (const chatPanel of this._chatPanels) {
            if (chatPanel === undefined) {
                continue;
            }

            chatPanel.hidePanel();
        }

        this._currentChatPanelIndex = -1;
    }

    addSeparator(parent, left, top, thickness, color) {
        const separator = document.createElement('div');
        separator.style.position = 'absolute';
        separator.style.left = left;
        separator.style.top = top;
        separator.style.width = '100%';
        separator.style.height = thickness;
        separator.style.background = color;

        parent.appendChild(separator);
    }

    // 사용자 목록 관련 기능 Start
    addUserCell(playerSchema) {
        const userListPanel = this._chatPanels[DTDon.UI.CHAT_PANEL_TYPE.USER_LIST];
        if (userListPanel === undefined) {
            return;
        }

        const user = new DTDon.User(playerSchema);
        userListPanel.addUserCell(user);
    }

    removeUserCell(lobbySessionId) {
        const userListPanel = this._chatPanels[DTDon.UI.CHAT_PANEL_TYPE.USER_LIST];
        if (userListPanel === undefined) {
            return;
        }

        userListPanel.removeUserCell(lobbySessionId);
    }

    getLobbyUserBySessionId(lobbySessionId) {
        const userListPanel = this._chatPanels[DTDon.UI.CHAT_PANEL_TYPE.USER_LIST];
        if (userListPanel === undefined) {
            return;
        }

        return userListPanel.getUserBySessionId(lobbySessionId);
    }

    setUserTalking(lobbySessionId, isTalking) {
        const userListPanel = this._chatPanels[DTDon.UI.CHAT_PANEL_TYPE.USER_LIST];
        if (userListPanel === undefined) {
            return;
        }

        userListPanel.setUserTalking(lobbySessionId, isTalking)
    }
    // 사용자 목록 관련 기능 End

    // Request, Received Call 관련 기능 Start
    setCaller(playerSchema) {
        if (this._currentChatPanelIndex !== DTDon.UI.CHAT_PANEL_TYPE.REQUEST_CALL &&
            this._currentChatPanelIndex !== DTDon.UI.CHAT_PANEL_TYPE.RECEIVED_CALL) {
            return;
        }

        const callChatPanel = this._chatPanels[this._currentChatPanelIndex];
        if (callChatPanel === undefined) {
            return;
        }

        callChatPanel.setCaller(playerSchema);
    }
    // Request, Received Call 관련 기능 End

    // 사용자 컨트롤 관련 Start
    showUserControlPanel() {
        this._userControlPanel.createPanel();

        if (this._userControlPanel.panelContainer) {
            this._userContainer.appendChild(this._userControlPanel.panelContainer);
        }
    }

    hideUserControlPanel() {
        this._userControlPanel.closePanel();
        this._userContainer.replaceChildren();
    }
    // 사용자 컨트롤 관련 End
}

export { DTDonUIManager };