class DTDonVideoPopup {
    constructor(dtdon) {
        this._DTDon = dtdon;
        this._backgroundColor = 'rgb(49, 52, 62)';
        this._titleBar = undefined;
        this._closeButton = undefined;
        this._customBorders = {};
        this._parentContainer = this._DTDon.DTDPlayerElement;
        this._popupContainer = undefined;
        this._videoElement = undefined;

        this._isPopupShowing = false;
        this._isDragging = false;
        this._isResizing = false;
        this._dragStartX = 0;
        this._dragStartY = 0;
        this._popupStartX = 0;
        this._popupStartY = 0;
        this._popupStartWidth = 0;
        this._popupStartHeight = 0;
        this._resizeDirection = '';
    }

    get videoElement() {
        return this._videoElement;
    }

    createPopup(userName, width, height, onClickCloseButton) {
        const halfWidth = width / 2;
        const haflHeight = height / 2;

        const customBorderSize = 5;
        const titleBarHeight = 25 - customBorderSize;

        const popupWidth = halfWidth + customBorderSize * 2;
        const popupHeight = haflHeight + titleBarHeight + customBorderSize * 2;

        this._popupContainer = document.createElement('div');
        this._popupContainer.className = 'user-rtc-video-popup';
        this._popupContainer.style.position = 'absolute';
        this._popupContainer.style.left = `calc(50% - ${popupWidth / 2}px)`;
        this._popupContainer.style.top = `calc(50% - ${popupHeight / 2}px)`;
        this._popupContainer.style.width = `${popupWidth}px`;
        this._popupContainer.style.height = `${popupHeight}px`;
        this._popupContainer.style.background = this._backgroundColor;
        this._popupContainer.style.overflow = 'hidden';

        this._titleBar = document.createElement('div');
        this._titleBar.className = 'user-rtc-video-popup-title-bar';
        this._titleBar.style.position = 'absolute';
        this._titleBar.style.left = `${customBorderSize}px`;
        this._titleBar.style.top = `${customBorderSize}px`;
        this._titleBar.style.width = `calc(100% - ${customBorderSize * 2}px)`;
        this._titleBar.style.height = `${titleBarHeight}px`;
        this._titleBar.style.background = this._backgroundColor;
        // this._titleBar.style.cursor = 'move';
        this._titleBar.appendChild(this.createTitleBarContent(userName, onClickCloseButton));

        this._popupContainer.appendChild(this._titleBar);

        this._videoElement = document.createElement('video');
        this._videoElement.className = 'user-rtc-video-popup-video';
        this._videoElement.style.position = 'absolute';
        this._videoElement.style.left = `${customBorderSize}px`;
        this._videoElement.style.top = `${customBorderSize + titleBarHeight}px`;
        this._videoElement.style.width = `calc(100% - ${customBorderSize * 2}px)`;
        this._videoElement.style.height = `calc(100% - ${customBorderSize * 2 + titleBarHeight}px)`;
        this._videoElement.style.background = 'black';
        this._videoElement.style.objectFit = 'contain';

        this._popupContainer.appendChild(this._videoElement);

        this.createCustomBorders(customBorderSize);

        this.addEventListeners();
    }

    createTitleBarContent(userName, onClickCloseButton) {
        const userNameText = document.createElement('div');
        userNameText.className = 'user-rtc-video-popup-user-name-text';
        userNameText.style.position = 'absolute';
        userNameText.style.left = '5px';
        userNameText.style.top = '0';
        userNameText.style.width = '100%';
        userNameText.style.height = '100%';
        userNameText.style.fontFamily = '\'NotoSansKR\', sans-serif';
        userNameText.style.fontSize = '14px';
        userNameText.style.color = 'white';
        userNameText.style.border = 'none';
        userNameText.style.userSelect = 'none';
        userNameText.innerHTML = userName;

        this._closeButton = document.createElement('input');
        this._closeButton.className = 'user-rtc-video-popup-close-button';
        this._closeButton.type = 'button';
        this._closeButton.style.position = 'absolute';
        this._closeButton.style.right = '5px';
        this._closeButton.style.top = '50%';
        this._closeButton.style.width = '15px';
        this._closeButton.style.height = '15px';
        this._closeButton.style.transform = 'translateY(-50%)';
        this._closeButton.style.background = `url(${DTDonPlayer.IMAGE_DIRECTORY}/close-icon.png) no-repeat`;
        this._closeButton.style.backgroundSize = 'cover';
        this._closeButton.style.border = 'none';
        this._closeButton.onclick = () => {
            if (onClickCloseButton) {
                onClickCloseButton();
            }
        };

        const titleBarContent = document.createElement('div');
        titleBarContent.style.position = 'relative';
        titleBarContent.style.width = '100%';
        titleBarContent.style.height = '100%';
        titleBarContent.appendChild(userNameText);
        titleBarContent.appendChild(this._closeButton);

        return titleBarContent;
    }

    createCustomBorders(borderSize) {
        const positions = {
            ew: { right: '0', top: '0', width: `${borderSize}px`, height: '100%', cursor: 'ew-resize' },
            we: { left: '0', top: '0', width: `${borderSize}px`, height: '100%', cursor: 'ew-resize' },
            sn: { left: '0', bottom: '0', width: '100%', height: `${borderSize}px`, cursor: 'ns-resize' },
            ns: { left: '0', top: '0', width: '100%', height: `${borderSize}px`, cursor: 'ns-resize' },
            ne: { right: '0', top: '0', width: `${borderSize}px`, height: `${borderSize}px`, cursor: 'ne-resize' },
            nw: { left: '0', top: '0', width: `${borderSize}px`, height: `${borderSize}px`, cursor: 'nw-resize' },
            se: { right: '0', bottom: '0', width: `${borderSize}px`, height: `${borderSize}px`, cursor: 'se-resize' },
            sw: { left: '0', bottom: '0', width: `${borderSize}px`, height: `${borderSize}px`, cursor: 'sw-resize' }
        };

        for (const [key, { right, left, top, bottom, width, height, cursor }] of Object.entries(positions)) {
            const border = document.createElement('div');
            border.className = `user-rtc-video-popup-border-${key}`;
            border.style.position = 'absolute';
            border.style.right = right || '';
            border.style.left = left || '';
            border.style.top = top || '';
            border.style.bottom = bottom || '';
            border.style.width = width;
            border.style.height = height;
            border.style.background = this._backgroundColor;
            border.style.cursor = cursor;

            this._customBorders[key] = border;
            this._popupContainer.appendChild(border);
        }
    }

    addEventListeners() {
        this._titleBar.addEventListener('mousedown', (event) => {
            // 닫기 버튼 씹힘 방지
            if (event.target === this._closeButton) {
                return;
            }

            this.hidePopup();
            this.showPopup();
            this.startDragging(event);
        });

        this._videoElement.addEventListener('mousedown', (_) => {
            this.hidePopup();
            this.showPopup();
        });

        const customBorders = Object.values(this._customBorders);
        for (const customBorder of customBorders) {
            customBorder.addEventListener('mousedown', (event) => {
                this.hidePopup();
                this.showPopup();
                this.startResizing(event);
            });
        }
    }

    startDragging(event) {
        this._isDragging = true;
        this._dragStartX = event.clientX;
        this._dragStartY = event.clientY;
        
        const rect = this._popupContainer.getBoundingClientRect();
        const parentRect = this._parentContainer.getBoundingClientRect();
        this._popupStartX = rect.left - parentRect.left;
        this._popupStartY = rect.top - parentRect.top;

        document.body.style.userSelect = 'none';

        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
    }

    startResizing(event) {
        event.preventDefault();
        this._isResizing = true;
        const rect = this._popupContainer.getBoundingClientRect();
        const parentRect = this._parentContainer.getBoundingClientRect();

        this._resizeDirection = event.target.className.split('-').pop();
        this._dragStartX = event.clientX;
        this._dragStartY = event.clientY;
        this._popupStartWidth = rect.width;
        this._popupStartHeight = rect.height;
        this._popupStartX = rect.left - parentRect.left;
        this._popupStartY = rect.top - parentRect.top;

        document.body.style.userSelect = 'none';

        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
    }

    onMouseMove = (event) => {
        if (this._isDragging) {
            const deltaX = event.clientX - this._dragStartX;
            const deltaY = event.clientY - this._dragStartY;
            this._popupContainer.style.left = `${this._popupStartX + deltaX}px`;
            this._popupContainer.style.top = `${this._popupStartY + deltaY}px`;
        } else if (this._isResizing) {
            const deltaX = event.clientX - this._dragStartX;
            const deltaY = event.clientY - this._dragStartY;

            switch (this._resizeDirection) {
                case 'ew':
                    this._popupContainer.style.width = `${this._popupStartWidth + deltaX}px`;
                    break;
                case 'we':
                    this._popupContainer.style.width = `${this._popupStartWidth - deltaX}px`;
                    this._popupContainer.style.left = `${this._popupStartX + deltaX}px`;
                    break;
                case 'ns':
                    this._popupContainer.style.height = `${this._popupStartHeight - deltaY}px`;
                    this._popupContainer.style.top = `${this._popupStartY + deltaY}px`;
                    break;
                case 'sn':
                    this._popupContainer.style.height = `${this._popupStartHeight + deltaY}px`;
                    break;
                case 'ne':
                    this._popupContainer.style.width = `${this._popupStartWidth + deltaX}px`;
                    this._popupContainer.style.height = `${this._popupStartHeight - deltaY}px`;
                    this._popupContainer.style.top = `${this._popupStartY + deltaY}px`;
                    break;
                case 'nw':
                    this._popupContainer.style.width = `${this._popupStartWidth - deltaX}px`;
                    this._popupContainer.style.height = `${this._popupStartHeight - deltaY}px`;
                    this._popupContainer.style.top = `${this._popupStartY + deltaY}px`;
                    this._popupContainer.style.left = `${this._popupStartX + deltaX}px`;
                    break;
                case 'se':
                    this._popupContainer.style.width = `${this._popupStartWidth + deltaX}px`;
                    this._popupContainer.style.height = `${this._popupStartHeight + deltaY}px`;
                    break;
                case 'sw':
                    this._popupContainer.style.width = `${this._popupStartWidth - deltaX}px`;
                    this._popupContainer.style.height = `${this._popupStartHeight + deltaY}px`;
                    this._popupContainer.style.left = `${this._popupStartX + deltaX}px`;
                    break;
            }
        }
    };

    onMouseUp = () => {
        this._isDragging = false;
        this._isResizing = false;

        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);

        document.body.style.userSelect = 'auto';
    };

    showPopup() {
        if (!this._isPopupShowing) {
            this._parentContainer.appendChild(this._popupContainer);
            this._isPopupShowing = true;
        }
    }

    hidePopup() {
        if (this._isPopupShowing) {
            this._parentContainer.removeChild(this._popupContainer);
            this._isPopupShowing = false;
        }
    }
}

export { DTDonVideoPopup };
