import { DTDon } from '../../dtdon.js';

import { DTDonChatBasePanel } from './dtdon.chatbasepanel.js';

class DTDonChatUserListPanel extends DTDonChatBasePanel {
    constructor(dtdon) {
        super(dtdon);

        this._panelType = DTDon.UI.CHAT_PANEL_TYPE.USER_LIST;

        this._userListContainer;
        this._userCellDictionary = {};

        // 나를 제외한 사용자정보
        this._userDictionary = {};
    }

    createPanel() {
        if (this._panelContainer) {
            return;
        }

        this._panelContainer = this.createBasePanel('user-list-panel');

        this._userListContainer = document.createElement('ul');
        this._userListContainer.className = 'user-list-container';
        this._panelContainer.appendChild(this._userListContainer);
    }

    hidePanel() {
        super.hidePanel();
    }

    addUserCell(user) {
        const lobbySessionId = user.lobbySessionId;
        if (this._userCellDictionary[lobbySessionId]) {
            return;
        }

        const userTalkingImage = document.createElement('img');
        userTalkingImage.className = 'user-talking-image';
        userTalkingImage.src = `${DTDonPlayer.IMAGE_DIRECTORY}/talking-icon.png`;
        userTalkingImage.style.display = 'none';

        const userProfileContainer = this.createUserProfileContainer(user, false);
        userProfileContainer.style.left = '15px';
        userProfileContainer.style.top = '15px';
        userProfileContainer.style.width = 'calc(100% - 30px)';
        userProfileContainer.style.height = '51px';
        userProfileContainer.appendChild(userTalkingImage);

        const userCellContainer = document.createElement('li');
        userCellContainer.className = 'user-cell-container';
        userCellContainer.appendChild(userProfileContainer);
        userCellContainer.onclick = () => {
            const playerSchema = user.playerSchema;
            if (playerSchema && playerSchema.isTalking) {
                return;
            }

            this._DTDon.lobbyManager.sendRequestCall(lobbySessionId);
        };

        this._userListContainer.appendChild(userCellContainer);

        this._userDictionary[lobbySessionId] = user;

        this._userCellDictionary[lobbySessionId] = {
            user,
            container: userCellContainer,
            talkingImage: userTalkingImage
        };
    }

    removeUserCell(lobbySessionId) {
        if (this._userCellDictionary[lobbySessionId] === undefined) {
            return;
        }
        const container = this._userCellDictionary[lobbySessionId].container;

        this._userListContainer.removeChild(container);

        delete this._userCellDictionary[lobbySessionId];
    }

    setUserTalking(lobbySessionId, isTalking) {
        if (this._userCellDictionary[lobbySessionId] === undefined) {
            return;
        }

        const userTalkingImage = this._userCellDictionary[lobbySessionId].talkingImage;
        userTalkingImage.style.display = isTalking ? 'block' : 'none';
    }

    getUserBySessionId(lobbySessionId) {
        return this._userDictionary[lobbySessionId];
    }
}

export { DTDonChatUserListPanel };