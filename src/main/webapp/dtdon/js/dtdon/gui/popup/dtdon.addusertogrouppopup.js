import { DTDon } from '../../dtdon.js';

class DTDonAddUserToGroupPopup {
    constructor(dtdon) {
        this._DTDon = dtdon;

        this._userListPanel = this._DTDon.uiManager.getChatPanel(DTDon.UI.CHAT_PANEL_TYPE.USER_LIST);

        this._chatContainer = this._DTDon.chatContainer;

        this._parentContainer = undefined;
        this._popupContainer = undefined;

        this._selectedUserSessionIds = [];
        this._talkingUserSessionIds = [];

        this._noticeText = undefined;
        this._userListContainer = undefined;
        this._inviteButton = undefined;
        this._cancelButton = undefined;

        this._userCellDictionary = {};

        this._isPopupShowing = false;
    }

    createPopup() {
        this._noticeText = document.createElement('div');
        this._noticeText.className = 'add-user-to-group-notice-text';
        this.updateNoticeMessage();

        this._userListContainer = document.createElement('div');
        this._userListContainer.className = 'add-user-to-group-list-container';

        this._inviteButton = document.createElement('input');
        this._inviteButton.className = 'add-user-to-group-button';
        this._inviteButton.type = 'button';
        this._inviteButton.style.left = 'calc(50% - 55px)';
        this._inviteButton.value = '초대하기';
        this._inviteButton.disabled = true;
        this._inviteButton.onclick = () => {
            this.hidePopup();

            this._DTDon.lobbyManager.sendRequestGroupCall(this._selectedUserSessionIds);
        };

        this._cancelButton = document.createElement('input');
        this._cancelButton.className = 'add-user-to-group-button';
        this._cancelButton.type = 'button';
        this._cancelButton.style.left = 'calc(50% + 55px)';
        this._cancelButton.value = '취소';
        this._cancelButton.onclick = () => {
            this.hidePopup();
        };

        this._popupContainer = document.createElement('div');
        this._popupContainer.className = 'add-user-to-group-popup';
        this._popupContainer.appendChild(this._noticeText);
        this._popupContainer.appendChild(this._userListContainer);
        this._popupContainer.appendChild(this._inviteButton);
        this._popupContainer.appendChild(this._cancelButton);

        this._parentContainer = document.createElement('div');
        this._parentContainer.className = 'add-user-to-group-container';
        this._parentContainer.appendChild(this._popupContainer);
    }

    showPopup() {
        if (!this._isPopupShowing) {
            for (const lobbySessionId in this._userCellDictionary) {
                const userCell = this._userCellDictionary[lobbySessionId];
                const userCellContainer = userCell.container;
                const initialInnerCircle = userCell.initialInnerCircle;
                if (userCellContainer === undefined || initialInnerCircle === undefined) {
                    continue;
                }

                userCellContainer.style.background = 'rgb(35, 38, 47)';
                initialInnerCircle.style.background = 'rgb(35, 38, 47)';

                userCell.isSelected = false;
            }

            this._selectedUserSessionIds = [];
            this.updateNoticeMessage();

            this._chatContainer.appendChild(this._parentContainer);
            this._isPopupShowing = true;
        }
    }

    hidePopup() {
        if (this._isPopupShowing) {
            this._chatContainer.removeChild(this._parentContainer);
            this._isPopupShowing = false
        }
    }

    addUserCellBySessionId(lobbySessionId) {
        if (this._userCellDictionary[lobbySessionId]) {
            this.removeUserBySessionId((lobbySessionId));
        }

        const userTalkingImage = document.createElement('img');
        userTalkingImage.className = 'user-talking-image';
        userTalkingImage.src = `${DTDonPlayer.IMAGE_DIRECTORY}/talking-icon.png`;
        userTalkingImage.style.display = 'none';

        const user = this._userListPanel.getUserBySessionId(lobbySessionId);
        const userProfileContainer = this._userListPanel.createUserProfileContainer(user, false);
        userProfileContainer.style.left = '15px';
        userProfileContainer.style.top = '15px';
        userProfileContainer.style.width = 'calc(100% - 30px)';
        userProfileContainer.style.height = '51px';
        userProfileContainer.appendChild(userTalkingImage);

        const initialInnerCircle = userProfileContainer.querySelector('.initial-inner-circle');
        initialInnerCircle.style.background = 'rgb(35, 38, 47)';

        const userCellContainer = document.createElement('li');
        userCellContainer.className = 'user-cell-container';
        userCellContainer.appendChild(userProfileContainer);
        userCellContainer.onclick = () => {
            const isSelected = !this._userCellDictionary[lobbySessionId].isSelected;
            this._userCellDictionary[lobbySessionId].isSelected = isSelected;

            if (isSelected) {
                userCellContainer.style.background = 'rgb(21, 57, 81)';
                initialInnerCircle.style.background = 'rgb(21, 57, 81)';

                const foundIndex = this._selectedUserSessionIds.findIndex((sessionId) => {
                    return sessionId === lobbySessionId;
                });

                if (foundIndex === -1) {
                    this._selectedUserSessionIds.push(lobbySessionId);
                }
            }
            else {
                userCellContainer.style.background = 'rgb(35, 38, 47)';
                initialInnerCircle.style.background = 'rgb(35, 38, 47)';

                const foundIndex = this._selectedUserSessionIds.findIndex((sessionId) => {
                    return sessionId === lobbySessionId;
                });

                if (foundIndex > -1) {
                    this._selectedUserSessionIds.splice(foundIndex, 1);
                }
            }

            this.updateNoticeMessage();
        };

        this._userCellDictionary[lobbySessionId] = {
            user,
            container: userCellContainer,
            talkingImage: userTalkingImage,
            initialInnerCircle,
            isSelected: false
        };

        this._userListContainer.appendChild(userCellContainer);
    }

    removeUserBySessionId(lobbySessionId) {
        const userCellContainer = this._userCellDictionary[lobbySessionId];

        if (userCellContainer === undefined) {
            return;
        }

        this._userListContainer.removeChild(userCellContainer.container);

        delete this._userCellDictionary[lobbySessionId];

        const foundIndex = this._selectedUserSessionIds.findIndex((sessionId) => {
            return sessionId === lobbySessionId;
        });

        if (foundIndex > -1) {
            this._selectedUserSessionIds.splice(foundIndex, 1);
        }

        this.updateNoticeMessage();
    }

    setUserTalking(lobbySessionId, isTalking) {
        if (this._userCellDictionary[lobbySessionId] === undefined) {
            return;
        }

        const userTalkingImage = this._userCellDictionary[lobbySessionId].talkingImage;
        userTalkingImage.style.display = isTalking ? 'block' : 'none';

        if (isTalking) {
            const foundIndex = this._talkingUserSessionIds.findIndex((sessionId) => {
                return sessionId === lobbySessionId;
            });

            if (foundIndex === -1) {
                this._talkingUserSessionIds.push(lobbySessionId);
            }
        }
        else {
            const foundIndex = this._talkingUserSessionIds.findIndex((sessionId) => {
                return sessionId === lobbySessionId;
            });

            if (foundIndex > -1) {
                this._talkingUserSessionIds.splice(foundIndex, 1);
            }
        }

        this.updateNoticeMessage();
    }

    updateNoticeMessage() {
        let talkingUserCount = 0;
        let selectedUserCount = this._selectedUserSessionIds.length;
        for (const sessionId of this._selectedUserSessionIds) {
            const userCell = this._userCellDictionary[sessionId];
            if (userCell === undefined) {
                continue;
            }

            const user = userCell.user;
            const playerSchema = user.playerSchema;

            if (playerSchema.isTalking) {
                talkingUserCount += 1;
                selectedUserCount -= 1;
            }
        }

        if (this._noticeText) {
            this._noticeText.innerHTML = `대화상태선택: ${selectedUserCount}, 대화중: ${talkingUserCount}`;
        }

        if (this._inviteButton) {
            this._inviteButton.disabled = selectedUserCount < 1;
        }
    }
}

export { DTDonAddUserToGroupPopup };