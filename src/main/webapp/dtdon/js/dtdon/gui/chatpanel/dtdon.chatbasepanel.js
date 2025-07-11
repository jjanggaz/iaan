import { DTDon } from '../../dtdon.js';

class DTDonChatBasePanel {
    constructor(dtdon) {
        this._DTDon = dtdon;

        this._panelType = undefined;

        this._panelContainer = undefined;
    }

    get panelType() {
        return this._panelType;
    }

    get panelContainer() {
        return this._panelContainer;
    }

    createBasePanel(className) {
        const basePanel = document.createElement('div');
        basePanel.className = className;
        basePanel.style.position = 'absolute';
        basePanel.style.left = '0px';
        basePanel.style.top = '0px';
        basePanel.style.width = '100%';
        basePanel.style.height = '100%';
        basePanel.style.background = 'transparent';
        basePanel.style.overflow = 'hidden';
        basePanel.style.display = 'none';

        if (this._panelType &&
            this._panelType === DTDon.UI.CHAT_PANEL_TYPE.USER_LIST ||
            this._panelType === DTDon.UI.CHAT_PANEL_TYPE.REQUEST_CALL ||
            this._panelType === DTDon.UI.CHAT_PANEL_TYPE.RECEIVED_CALL ||
            this._panelType === DTDon.UI.CHAT_PANEL_TYPE.CHAT) {
            const userProfileContainer = this.createUserProfileContainer(this._DTDon.userProfile, true);

            if (this._panelType === DTDon.UI.CHAT_PANEL_TYPE.USER_LIST ||
                this._panelType === DTDon.UI.CHAT_PANEL_TYPE.CHAT) {
                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'user-info-button-container';

                // 채팅화면일 떄 파일 공유 버튼 추가(2024-08-23, 프로토콜 보안 이슈로 숨김)
                // if (this._panelType === DTDon.UI.CHAT_PANEL_TYPE.CHAT) {
                //     const attachmentInput = document.createElement('input');
                //     attachmentInput.id = 'attachment-input';
                //     attachmentInput.type = 'file';
                //     attachmentInput.multiple = true;
                //     attachmentInput.style.display = 'none';
                //     attachmentInput.onchange = (event) => {
                //         const files = event.target.files;
                //         if (files && files.length > 0) {
                //             this._DTDon.chatManager.sendAttachmentByFiles(files);
                //         }
                //     }

                //     const attachmentButton = document.createElement('input');
                //     attachmentButton.className = 'user-info-button';
                //     attachmentButton.type = 'button';
                //     attachmentButton.style.background = `url(${DTDonPlayer.IMAGE_DIRECTORY}/attachment-icon.png) no-repeat`;
                //     attachmentButton.style.backgroundSize = 'cover';
                //     attachmentButton.onclick = () => {
                //         attachmentInput.click();
                //     };

                //     buttonContainer.appendChild(attachmentInput);
                //     buttonContainer.appendChild(attachmentButton);
                // }

                const requestGroupButton = document.createElement('input');
                requestGroupButton.className = 'user-info-button';
                requestGroupButton.type = 'button';
                requestGroupButton.style.background = `url(${DTDonPlayer.IMAGE_DIRECTORY}/group-icon.png) no-repeat`;
                requestGroupButton.style.backgroundSize = 'cover';
                requestGroupButton.onclick = () => {
                    if (this._DTDon.popupManager.isAddUserToGroupVisible) {
                        return;
                    }

                    this._DTDon.popupManager.showAddUserToGroupPopup();
                };
                buttonContainer.appendChild(requestGroupButton);

                // 채팅화면일 때 방 나가기 버튼 추가
                if (this._panelType === DTDon.UI.CHAT_PANEL_TYPE.CHAT) {
                    const leaveRoomButton = document.createElement('input');
                    leaveRoomButton.className = 'user-info-button';
                    leaveRoomButton.type = 'button';
                    leaveRoomButton.style.background = `url(${DTDonPlayer.IMAGE_DIRECTORY}/leave-room-icon.png) no-repeat`;
                    leaveRoomButton.style.backgroundSize = 'cover';
                    leaveRoomButton.onclick = () => {
                        this._DTDon.chatManager.leaveChatRoom();
                    };

                    buttonContainer.appendChild(leaveRoomButton);
                }

                userProfileContainer.appendChild(buttonContainer);
            }

            basePanel.appendChild(userProfileContainer);

            this._DTDon.uiManager.addSeparator(basePanel, '0', '70px', '2px', 'rgba(50, 50, 50)');
        }

        return basePanel;
    }

    createUserProfileContainer(userProfile, isMe) {
        const initialOuterCircle = document.createElement('div');
        initialOuterCircle.className = 'initial-outer-circle';
        initialOuterCircle.style.background = userProfile.personalColor;

        const initialInnerCircle = document.createElement('div');
        initialInnerCircle.className = 'initial-inner-circle';

        const initialText = document.createElement('div');
        initialText.className = 'initial-text';
        initialText.innerHTML = userProfile.initial;
        initialText.style.fontSize = isMe ? '22px' : '15px';

        const initialContainer = document.createElement('div');
        initialContainer.className = 'initial-container';
        initialContainer.style.width = isMe ? '40px' : '30px';
        initialContainer.style.height = isMe ? '40px' : '30px';
        initialContainer.appendChild(initialOuterCircle);
        initialContainer.appendChild(initialInnerCircle);
        initialContainer.appendChild(initialText);

        const userNicknameText = document.createElement('span');
        userNicknameText.className = 'user-info-nickname-text';
        userNicknameText.innerHTML = userProfile.nickname ? userProfile.nickname : '<br />';
        if (!isMe) {
            userNicknameText.style.fontSize = '14px';
            userNicknameText.style.color = 'rgb(130, 130, 130)';
        }

        const userNameText = document.createElement('span');
        userNameText.className = 'user-info-name-text';
        userNameText.innerHTML = userProfile.name ? userProfile.name : '<br />';
        if (!isMe) {
            userNameText.style.fontSize = '12px';
            userNameText.style.color = 'white';
        }

        const userCompanyText = document.createElement('span');
        userCompanyText.className = 'user-info-company-text';
        userCompanyText.innerHTML = userProfile.company ? userProfile.company : '<br />';
        if (!isMe) {
            userCompanyText.style.fontSize = '10px';
            userCompanyText.style.color = 'rgb(130, 130, 130)';
        }

        const userInfoContainer = document.createElement('div');
        userInfoContainer.className = 'user-info-container';
        userInfoContainer.appendChild(userNicknameText);
        userInfoContainer.appendChild(userNameText);
        userInfoContainer.appendChild(userCompanyText);
        if (!isMe) {
            userInfoContainer.style.marginLeft = '42px';
        }

        const userProfileContainer = document.createElement('div');
        userProfileContainer.className = 'user-profile-container';
        userProfileContainer.appendChild(initialContainer);
        userProfileContainer.appendChild(userInfoContainer);

        if (!isMe) {
            const userDeviceText = document.createElement('div');
            userDeviceText.className = 'user-info-device-text';
            userDeviceText.innerHTML = userProfile.deviceName;
            userProfileContainer.appendChild(userDeviceText);
        }

        return userProfileContainer;
    }

    showPanel() {
        if (this._panelContainer === undefined) {
            return;
        }

        this._panelContainer.style.display = 'block';
    }

    hidePanel() {
        if (this._panelContainer === undefined) {
            return;
        }

        this._panelContainer.style.display = 'none';
    }
}

export { DTDonChatBasePanel };