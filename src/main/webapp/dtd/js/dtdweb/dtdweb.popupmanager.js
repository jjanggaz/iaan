import { DTDWeb } from './dtdweb.js';

class DTDWebPopupManager {
    constructor(dtdWeb) {
        this._DTDWeb = dtdWeb;
        this._scene = dtdWeb.scene;
        this._renderCanvas = dtdWeb.renderCanvas;

        this._isShowMainPopup = false;
        this._isPopupSelected = false;

        this._mainPopup = undefined;
        this._mainPopupChildren = [];

        this._popups = [];
    }

    get isDoNotControl() {
        return this._isShowMainPopup || this._isPopupSelected;
    }

    get isShowMainPopup() {
        return this._isShowMainPopup;
    }

    get isPopupSelected() {
        return this._isPopupSelected;
    }

    // 메인 팝업은 하나만 띄울 수 있음
    showMainPopup(popupType, titleText, messageText, onClickEvent, isShowPointerBlocker = true) {
        if (this._mainPopup) {
            this.hideMainPopup();
        }

        this._mainPopup = new BABYLON.GUI.Rectangle('MainPopup_Rectangle');
        this._mainPopup.leftInPixels = 0;
        this._mainPopup.topInPixels = 0;
        this._mainPopup.widthInPixels = 300;
        this._mainPopup.heightInPixels = 200;
        this._mainPopup.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this._mainPopup.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        this._mainPopup.background = DTDWeb.Popup.MAIN_POPUP_BACKGROUND;
        this._mainPopup.cornerRadius = this._DTDWeb.uiManager.multiplyDevicePixelRatio(5);
        this._mainPopup.thickness = 0;
        this._mainPopup.isPointerBlocker = true;
        this._mainPopup.popupType = popupType;

        const titleTextBlock = new BABYLON.GUI.TextBlock();
        titleTextBlock.leftInPixels = 0;
        titleTextBlock.topInPixels = 0;
        titleTextBlock.width = '100%';
        titleTextBlock.height = '100%';
        titleTextBlock.paddingLeft = '10px';
        titleTextBlock.fontFamily = DTDWeb.GLOBAL_FONT_FAMILY;
        titleTextBlock.fontSize = 12;
        titleTextBlock.color = 'white';
        titleTextBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        titleTextBlock.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        titleTextBlock.text = titleText;

        const titleRectangle = new BABYLON.GUI.Rectangle();
        titleRectangle.leftInPixels = 0;
        titleRectangle.topInPixels = 0;
        titleRectangle.width = '100%';
        titleRectangle.heightInPixels = 20;
        titleRectangle.background = DTDWeb.Popup.MAIN_POPUP_TITLE_BACKGROUND;
        titleRectangle.thickness = 0;
        titleRectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        titleRectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        titleRectangle.addControl(titleTextBlock);

        const messageTextBlock = new BABYLON.GUI.TextBlock();
        messageTextBlock.leftInPixels = 0;
        messageTextBlock.topInPixels = titleRectangle.heightInPixels + 10;
        messageTextBlock.width = '100%';
        messageTextBlock.heightInPixels = 50;
        messageTextBlock.fontFamily = DTDWeb.GLOBAL_FONT_FAMILY;
        messageTextBlock.fontSize = 12;
        messageTextBlock.color = 'white';
        messageTextBlock.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        messageTextBlock.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        messageTextBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        messageTextBlock.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        messageTextBlock.lineSpacing = '5';
        messageTextBlock.text = messageText;

        const confirmButton = BABYLON.GUI.Button.CreateSimpleButton();
        confirmButton.leftInPixels = 0;
        confirmButton.topInPixels = -15;
        confirmButton.widthInPixels = 80;
        confirmButton.heightInPixels = 25;
        confirmButton.background = DTDWeb.Popup.MAIN_POPUP_BUTTON_BACKGROUND;
        confirmButton.color = 'black';
        confirmButton.thickness = 0.1;
        confirmButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        confirmButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        confirmButton.textBlock.fontFamily = DTDWeb.GLOBAL_FONT_FAMILY;
        confirmButton.textBlock.fontSize = 12;
        confirmButton.textBlock.color = 'white';
        confirmButton.textBlock.text = DTDWeb.Popup.POPUP_BUTTON_TEXT.CONFIRM;
        confirmButton.onPointerClickObservable.add(() => {
            if (onClickEvent) {
                if (popupType === DTDWeb.Popup.POPUP_TYPE.INPUT_TEXT) {
                    onClickEvent(this._mainPopup.inputTextElement.value);
                }
                else {
                    onClickEvent();
                }
            }

            this.hideMainPopup();
        });

        this._mainPopup.confirmButton = confirmButton;

        this._mainPopupChildren.push(titleTextBlock);
        this._mainPopupChildren.push(titleRectangle);
        this._mainPopupChildren.push(messageTextBlock);
        this._mainPopupChildren.push(confirmButton.textBlock);
        this._mainPopupChildren.push(confirmButton);

        this._mainPopup.addControl(titleRectangle);
        this._mainPopup.addControl(messageTextBlock);
        this._mainPopup.addControl(confirmButton);

        this._mainPopup.widthInPixels = 250;
        this._mainPopup.heightInPixels = 130;

        if (popupType === DTDWeb.Popup.POPUP_TYPE.NOTICE_WITH_CANCEL) {
            const spacingX = 10;

            confirmButton.widthInPixels = 60;
            confirmButton.leftInPixels = -spacingX - confirmButton.widthInPixels / 2;
            confirmButton.textBlock.text = DTDWeb.Popup.POPUP_BUTTON_TEXT.YES;

            const cancelButton = BABYLON.GUI.Button.CreateSimpleButton();
            cancelButton.leftInPixels = 0;
            cancelButton.leftInPixels = spacingX + confirmButton.widthInPixels / 2;
            cancelButton.topInPixels = confirmButton.topInPixels;
            cancelButton.widthInPixels = confirmButton.widthInPixels;
            cancelButton.heightInPixels = confirmButton.heightInPixels;
            cancelButton.background = confirmButton.background;
            cancelButton.color = confirmButton.color;
            cancelButton.thickness = confirmButton.thickness;
            cancelButton.horizontalAlignment = confirmButton.horizontalAlignment;
            cancelButton.verticalAlignment = confirmButton.verticalAlignment;
            cancelButton.textBlock.fontFamily = confirmButton.textBlock.fontFamily;
            cancelButton.textBlock.fontSize = confirmButton.textBlock.fontSize;
            cancelButton.textBlock.color = confirmButton.textBlock.color;
            cancelButton.textBlock.text = DTDWeb.Popup.POPUP_BUTTON_TEXT.NO;
            cancelButton.onPointerClickObservable.add(() => {
                this.hideMainPopup();
            });

            this._mainPopup.cancelButton = cancelButton;

            this._mainPopupChildren.push(cancelButton.textBlock);
            this._mainPopupChildren.push(cancelButton);

            this._mainPopup.addControl(cancelButton);
        }
        else if (popupType === DTDWeb.Popup.POPUP_TYPE.INPUT_TEXT) {
            this._mainPopup.widthInPixels = 400;
            this._mainPopup.heightInPixels = 160;

            const spacingX = 20;

            confirmButton.widthInPixels = 80;
            confirmButton.leftInPixels = -spacingX - confirmButton.widthInPixels / 2;
            if (this._DTDWeb.functionMode === DTDPlayer.FunctionMode.MARKUP) {
                confirmButton.textBlock.text = DTDWeb.Popup.POPUP_BUTTON_TEXT.SAVE;
            }
            else {
                confirmButton.textBlock.text = DTDWeb.Popup.POPUP_BUTTON_TEXT.YES;
            }
            confirmButton.isEnabled = false;

            const cancelButton = BABYLON.GUI.Button.CreateSimpleButton();
            cancelButton.leftInPixels = 0;
            cancelButton.leftInPixels = spacingX + confirmButton.widthInPixels / 2;
            cancelButton.topInPixels = confirmButton.topInPixels;
            cancelButton.widthInPixels = confirmButton.widthInPixels;
            cancelButton.heightInPixels = confirmButton.heightInPixels;
            cancelButton.background = confirmButton.background;
            cancelButton.color = confirmButton.color;
            cancelButton.thickness = confirmButton.thickness;
            cancelButton.horizontalAlignment = confirmButton.horizontalAlignment;
            cancelButton.verticalAlignment = confirmButton.verticalAlignment;
            cancelButton.textBlock.fontFamily = confirmButton.textBlock.fontFamily;
            cancelButton.textBlock.fontSize = confirmButton.textBlock.fontSize;
            cancelButton.textBlock.color = confirmButton.textBlock.color;
            if (this._DTDWeb.functionMode === DTDPlayer.FunctionMode.MARKUP) {
                cancelButton.textBlock.text = DTDWeb.Popup.POPUP_BUTTON_TEXT.CANCEL;
            }
            else {
                cancelButton.textBlock.text = DTDWeb.Popup.POPUP_BUTTON_TEXT.NO;
            }
            cancelButton.onPointerClickObservable.add(() => {
                this.hideMainPopup();
            });

            this._mainPopup.cancelButton = cancelButton;

            this._mainPopupChildren.push(cancelButton.textBlock);
            this._mainPopupChildren.push(cancelButton);

            this._mainPopup.addControl(cancelButton);

            const inputTextWidth = 220;
            const inputTextHeight = 30;
            const inputTextTop = 5;

            const inputTextElement = document.createElement('input');
            inputTextElement.type = 'text';
            inputTextElement.id = 'mainPopupInputText'
            inputTextElement.style.position = 'absolute';
            inputTextElement.style.left = `calc(50% - ${inputTextWidth / 2}px)`;
            inputTextElement.style.top = `calc(50% - ${inputTextHeight / 2 - inputTextTop}px)`;
            inputTextElement.style.width = `${inputTextWidth}px`;
            inputTextElement.style.height = `${inputTextHeight}px`;
            inputTextElement.style.background = 'white';
            inputTextElement.style.paddingLeft = '5px';
            inputTextElement.style.border = 'none';
            inputTextElement.style.outline = 'none';
            inputTextElement.style.fontFamily = 'NotoSansKR';
            inputTextElement.style.fontSize = 12;
            inputTextElement.spellcheck = false;
            inputTextElement.autocomplete = 'off';
            if (this._DTDWeb.functionMode === DTDPlayer.FunctionMode.MARKUP) {
                inputTextElement.placeholder = DTDWeb.Popup.POPUP_INPUT_TEXT_PLACEHOLDER.MARKUP_TITLE;
            }
            else if (this._DTDWeb.functionMode === DTDPlayer.FunctionMode.BOOKMARK) {
                inputTextElement.placeholder = DTDWeb.Popup.POPUP_INPUT_TEXT_PLACEHOLDER.BOOKMARK_GROUP_TITLE;
            }

            inputTextElement.oninput = () => {
                confirmButton.isEnabled = inputTextElement.value !== '';
            };

            this._mainPopup.inputTextElement = inputTextElement;

            this._DTDWeb.playerElement.appendChild(inputTextElement);

        }
        else if (popupType === DTDWeb.Popup.POPUP_TYPE.PROGRESS) {
            this._mainPopup.widthInPixels = 300;
            this._mainPopup.heightInPixels = 175;

            confirmButton.textBlock.text = DTDWeb.Popup.POPUP_BUTTON_TEXT.CANCEL;

            const progressRectangle = new BABYLON.GUI.Rectangle();
            progressRectangle.leftInPixels = 0;
            progressRectangle.topInPixels = messageTextBlock.topInPixels + messageTextBlock.heightInPixels + 10;
            progressRectangle.width = '80%';
            progressRectangle.heightInPixels = 30;
            progressRectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            progressRectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

            const progressValueRectangle = new BABYLON.GUI.Rectangle();
            progressValueRectangle.leftInPixels = 0;
            progressValueRectangle.topInPixels = 0;
            progressValueRectangle.width = '0%';
            progressValueRectangle.height = '100%';
            progressValueRectangle.background = DTDWeb.Popup.MAIN_POPUP_PROGRESS_VALUE_BACKGROUND;
            progressValueRectangle.alpha = 0.7;
            progressValueRectangle.thickness = 0;
            progressValueRectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            progressValueRectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

            const progressValueTextBlock = new BABYLON.GUI.TextBlock();
            progressValueTextBlock.leftInPixels = 0;
            progressValueTextBlock.topInPixels = 0;
            progressValueTextBlock.width = '100%';
            progressValueTextBlock.height = '100%';
            progressValueTextBlock.fontFamily = DTDWeb.GLOBAL_FONT_FAMILY;
            progressValueTextBlock.fontSize = 12;
            progressValueTextBlock.color = 'white';
            progressValueTextBlock.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            progressValueTextBlock.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            progressValueTextBlock.text = '0%';

            progressRectangle.addControl(progressValueRectangle);
            progressRectangle.addControl(progressValueTextBlock);

            this._mainPopup.addControl(progressRectangle);
            this._mainPopup.setMessageText = (message) => {
                messageTextBlock.text = message;
            };
            this._mainPopup.setProgressValue = (percentage) => {
                progressValueRectangle.width = `${percentage}%`;
                progressValueTextBlock.text = `${percentage}%`;
            };

            this._mainPopupChildren.push(progressValueRectangle);
            this._mainPopupChildren.push(progressValueTextBlock);
            this._mainPopupChildren.push(progressRectangle);
        }

        this._mainPopup.isShowPointerBlocker = isShowPointerBlocker;
        if (isShowPointerBlocker) {
            // 마크업 모드는 PointerBlocker가 있어야 함
            if (this._DTDWeb.functionMode === DTDPlayer.FunctionMode.MARKUP) {
                this._mainPopup.isDoNotHidePointerBlocker = true;
            }

            this._DTDWeb.uiManager.showPointerBlocker(false);
        }

        this._DTDWeb.uiManager.addGUIControl(this._mainPopup);

        this._isShowMainPopup = true;

        this.addPopup(this._mainPopup);

        return this._mainPopup;
    }

    hideMainPopup() {
        if (this._mainPopup === undefined) {
            return;
        }

        if (this._mainPopup.isShowPointerBlocker) {
            // PointerBlocker가 Hide 되지 않아야 하는 경우
            if (this._mainPopup.isDoNotHidePointerBlocker) {
                this._DTDWeb.uiManager.setPointerBlockerAlpha(true);
                // 팝업을 다시 그려 UI레이어 최상단으로 올려줌
                this.redrawAllPopups();
            }
            else {
                this._DTDWeb.uiManager.hidePointerBlocker();
            }
        }

        if (this._mainPopup.popupType === DTDWeb.Popup.POPUP_TYPE.INPUT_TEXT) {
            if (this._mainPopup.inputTextElement) {
                this._DTDWeb.playerElement.removeChild(this._mainPopup.inputTextElement);
                this._mainPopup.inputTextElement = undefined;
            }
        }

        for (const popupChild of this._mainPopupChildren) {
            popupChild.dispose();
        }
        this._mainPopupChildren = [];

        if (this._mainPopup) {
            this.removePopup(this._mainPopup);
            this._DTDWeb.uiManager.removeGUIControl(this._mainPopup);
            this._mainPopup.dispose();
        }
        this._mainPopup = undefined;

        this._isShowMainPopup = false;
    }

    createResizablePopup(name, titleText, guiControl) {
        const titleTextBlock = new BABYLON.GUI.TextBlock(`${name}_PopupTitleTextBlock`);
        titleTextBlock.leftInPixels = 0;
        titleTextBlock.topInPixels = 0;
        titleTextBlock.width = '100%';
        titleTextBlock.height = '100%';
        titleTextBlock.paddingLeft = '10px';
        titleTextBlock.fontFamily = DTDWeb.GLOBAL_FONT_FAMILY;
        titleTextBlock.fontSize = 15;
        titleTextBlock.color = 'white';
        titleTextBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        titleTextBlock.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        titleTextBlock.text = titleText;

        const closeButton = BABYLON.GUI.Button.CreateImageOnlyButton(`${name}_PopupCloseButton`,
            `${DTDPlayer.IMAGE_DIRECTORY}/close.png`
        );
        closeButton.leftInPixels = -5;
        closeButton.topInPixels = 0;
        closeButton.widthInPixels = 15;
        closeButton.heightInPixels = 15;
        closeButton.background = 'transparent';
        closeButton.thickness = 0;
        closeButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        closeButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        closeButton.onPointerClickObservable.add(() => {
            this.disposeResizablePopup(resizablePopup);
        });

        const titleRectangle = new BABYLON.GUI.Rectangle(`${name}_PopupTitleRectangle`);
        titleRectangle.leftInPixels = 0;
        titleRectangle.topInPixels = 0;
        titleRectangle.width = '100%';
        titleRectangle.heightInPixels = 30;
        titleRectangle.background = DTDWeb.Popup.RESIZABLE_POPUP_TITLE_BACKGROUND;
        titleRectangle.thickness = 0;
        titleRectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        titleRectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        titleRectangle.titleTextBlock = titleTextBlock;
        titleRectangle.closeButton = closeButton;
        titleRectangle.addControl(titleTextBlock);
        titleRectangle.addControl(closeButton);

        let pointerMoveObservable = undefined;

        let isPointerDown = false;
        titleRectangle.onPointerDownObservable.add(() => {
            isPointerDown = true;

            let lastPointerX = this._scene.pointerX;
            let lastPointerY = this._scene.pointerY;

            pointerMoveObservable = this._scene.onBeforeRenderObservable.add(() => {
                if (!isPointerDown) {
                    return;
                }

                const deltaX = this._DTDWeb.uiManager.multiplyDevicePixelRatio(this._scene.pointerX - lastPointerX);
                const deltaY = this._DTDWeb.uiManager.multiplyDevicePixelRatio(this._scene.pointerY - lastPointerY);
                lastPointerX = this._scene.pointerX;
                lastPointerY = this._scene.pointerY;

                resizablePopup.leftInPixels = this._DTDWeb.uiManager.divideDevicePixelRatio(resizablePopup.leftInPixels + deltaX);
                resizablePopup.topInPixels = this._DTDWeb.uiManager.divideDevicePixelRatio(resizablePopup.topInPixels + deltaY);
            });
        });

        titleRectangle.onPointerUpObservable.add(() => {
            isPointerDown = false;

            if (pointerMoveObservable) {
                this._scene.onBeforeRenderObservable.remove(pointerMoveObservable);
                pointerMoveObservable = undefined;
            }
        });

        guiControl.leftInPixels = 0;
        guiControl.topInPixels = titleRectangle.heightInPixels;
        guiControl.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        guiControl.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

        const resizableThickness = 2;
        const popupWidth = guiControl.widthInPixels + resizableThickness * 2;
        const popupHeight = titleRectangle.heightInPixels + guiControl.heightInPixels + resizableThickness * 2;
        const centerPoint = this._DTDWeb.uiManager.getCenterPoint(popupWidth, popupHeight);

        const resizablePopup = new BABYLON.GUI.Rectangle(`${name}_ResizablePopup`);
        resizablePopup.leftInPixels = centerPoint.leftInPixels;
        resizablePopup.topInPixels = centerPoint.topInPixels;
        resizablePopup.widthInPixels = popupWidth;
        resizablePopup.heightInPixels = popupHeight;
        resizablePopup.background = DTDWeb.Popup.RESIZABLE_POPUP_BACKGROUND;
        resizablePopup.color = titleRectangle.background;
        resizablePopup.thickness = resizableThickness;
        resizablePopup.isPointerBlocker = true;
        resizablePopup.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        resizablePopup.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        resizablePopup.titleRectangle = titleRectangle;
        resizablePopup.contentGUIControl = guiControl;
        resizablePopup.additionalControls = [];
        resizablePopup.onPointerDownObservable.add(() => {
            this._isPopupSelected = true;
        });
        resizablePopup.onPointerUpObservable.add(() => {
            this._isPopupSelected = false;
        });

        resizablePopup.addControl(titleRectangle);
        resizablePopup.addControl(guiControl);

        resizablePopup.resizeAreaRectangles = [];

        const resizeDirections = ['N', 'E', 'S', 'W', 'NE', 'NW', 'SE', 'SW'];
        for (const resizeDirection of resizeDirections) {
            const resizeAreaRectangle = new BABYLON.GUI.Rectangle();
            resizeAreaRectangle.leftInPixels = 0;
            resizeAreaRectangle.topInPixels = 0;
            resizeAreaRectangle.thickness = 0;
            resizeAreaRectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            resizeAreaRectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            resizeAreaRectangle.resizeDirection = resizeDirection;

            if (resizeDirection.includes('N')) {
                resizeAreaRectangle.topInPixels = -resizableThickness;
                resizeAreaRectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            }
            if (resizeDirection.includes('S')) {
                resizeAreaRectangle.topInPixels = resizableThickness;
                resizeAreaRectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
            }
            if (resizeDirection.includes('E')) {
                resizeAreaRectangle.leftInPixels = resizableThickness;
                resizeAreaRectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
            }
            if (resizeDirection.includes('W')) {
                resizeAreaRectangle.leftInPixels = -resizableThickness;
                resizeAreaRectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            }

            switch (resizeDirection) {
                case 'N':
                case 'S':
                    resizeAreaRectangle.widthInPixels = resizablePopup.widthInPixels - resizableThickness * 4;
                    resizeAreaRectangle.heightInPixels = resizableThickness;
                    break;
                case 'E':
                case 'W':
                    resizeAreaRectangle.widthInPixels = resizableThickness;
                    resizeAreaRectangle.heightInPixels = resizablePopup.heightInPixels - resizableThickness * 4;
                    break;
                default:
                    resizeAreaRectangle.widthInPixels = resizableThickness * 2;
                    resizeAreaRectangle.heightInPixels = resizableThickness * 2;
                    break;
            }

            let resizePointerMoveObservable = undefined;
            resizeAreaRectangle.onPointerEnterObservable.add(() => {
                switch (resizeDirection) {
                    case 'N':
                    case 'S':
                        document.documentElement.style.cursor = 'ns-resize';
                        return;
                    case 'E':
                    case 'W':
                        document.documentElement.style.cursor = 'ew-resize';
                        return;
                    case 'NE':
                    case 'SW':
                        document.documentElement.style.cursor = 'nesw-resize';
                        return;
                    case 'NW':
                    case 'SE':
                        document.documentElement.style.cursor = 'nwse-resize';
                        return;
                }
            });
            resizeAreaRectangle.onPointerOutObservable.add(() => {
                document.documentElement.style.cursor = 'default';
            });
            resizeAreaRectangle.onPointerDownObservable.add(() => {
                let lastPointerX = this._scene.pointerX;
                let lastPointerY = this._scene.pointerY;

                resizePointerMoveObservable = this._scene.onBeforeRenderObservable.add(() => {
                    switch (resizeDirection) {
                        case 'N':
                        case 'S':
                            document.documentElement.style.cursor = 'ns-resize';
                            break;
                        case 'E':
                        case 'W':
                            document.documentElement.style.cursor = 'ew-resize';
                            break;
                        case 'NE':
                        case 'SW':
                            document.documentElement.style.cursor = 'nesw-resize';
                            break;
                        case 'NW':
                        case 'SE':
                            document.documentElement.style.cursor = 'nwse-resize';
                            break;
                    }

                    const deltaX = Math.round(this._DTDWeb.uiManager.multiplyDevicePixelRatio(this._scene.pointerX - lastPointerX));
                    const deltaY = Math.round(this._DTDWeb.uiManager.multiplyDevicePixelRatio(this._scene.pointerY - lastPointerY));
                    lastPointerX = this._scene.pointerX;
                    lastPointerY = this._scene.pointerY;

                    if (resizeDirection.includes('N')) {
                        resizablePopup.topInPixels = this._DTDWeb.uiManager.divideDevicePixelRatio(resizablePopup.topInPixels + deltaY);
                        resizablePopup.resize(undefined, this._DTDWeb.uiManager.divideDevicePixelRatio(guiControl.heightInPixels - deltaY));
                    }
                    if (resizeDirection.includes('S')) {
                        resizablePopup.resize(undefined, this._DTDWeb.uiManager.divideDevicePixelRatio(guiControl.heightInPixels + deltaY));
                    }
                    if (resizeDirection.includes('E')) {
                        resizablePopup.resize(this._DTDWeb.uiManager.divideDevicePixelRatio(guiControl.widthInPixels + deltaX), undefined);
                    }
                    if (resizeDirection.includes('W')) {
                        resizablePopup.leftInPixels = this._DTDWeb.uiManager.divideDevicePixelRatio(resizablePopup.leftInPixels + deltaX);
                        resizablePopup.resize(this._DTDWeb.uiManager.divideDevicePixelRatio(guiControl.widthInPixels - deltaX), undefined);
                    }
                });
            });
            resizeAreaRectangle.onPointerUpObservable.add(() => {
                this._scene.onBeforeRenderObservable.remove(resizePointerMoveObservable);

                document.documentElement.style.cursor = 'default';
            });

            resizablePopup.resizeAreaRectangles.push(resizeAreaRectangle);
            resizablePopup.addControl(resizeAreaRectangle);
        }

        resizablePopup.resize = (controlWidth, controlHeight) => {
            if (controlWidth !== undefined) {
                guiControl.widthInPixels = controlWidth;
                resizablePopup.widthInPixels = this._DTDWeb.uiManager.divideDevicePixelRatio(guiControl.widthInPixels) + resizableThickness * 2;
            }

            if (controlHeight !== undefined) {
                guiControl.heightInPixels = controlHeight;
                resizablePopup.heightInPixels = this._DTDWeb.uiManager.divideDevicePixelRatio(titleRectangle.heightInPixels + guiControl.heightInPixels) + resizableThickness * 2;
            }

            const resizeAreaRectangles = resizablePopup.resizeAreaRectangles;
            if (resizeAreaRectangles) {
                for (const resizeAreaRectangle of resizeAreaRectangles) {
                    const resizeDirection = resizeAreaRectangle.resizeDirection;
                    switch (resizeDirection) {
                        case 'N':
                        case 'S':
                            resizeAreaRectangle.widthInPixels = resizablePopup.widthInPixels - resizableThickness * 4;
                            resizeAreaRectangle.heightInPixels = resizableThickness;
                            break;
                        case 'E':
                        case 'W':
                            resizeAreaRectangle.widthInPixels = resizableThickness;
                            resizeAreaRectangle.heightInPixels = resizablePopup.heightInPixels - resizableThickness * 4;
                            break;
                        default:
                            resizeAreaRectangle.widthInPixels = resizableThickness * 2;
                            resizeAreaRectangle.heightInPixels = resizableThickness * 2;
                            break;
                    }
                }
            }
        };

        this.addPopup(resizablePopup);

        return resizablePopup;
    }

    disposeResizablePopup(resizablePopup) {
        resizablePopup.clearControls();

        const resizeAreaRectangles = resizablePopup.resizeAreaRectangles;
        if (resizeAreaRectangles) {
            for (const resizeAreaRectangle of resizeAreaRectangles) {
                resizeAreaRectangle.dispose();
            }

            resizablePopup.resizeAreaRectangles = undefined;
        }

        const titleRectangle = resizablePopup.titleRectangle;
        if (titleRectangle) {
            titleRectangle.clearControls();
            const titleTextBlock = titleRectangle.titleTextBlock;
            if (titleTextBlock) {
                titleTextBlock.dispose();
                titleRectangle.titleTextBlock = undefined;
            }

            const closeButton = titleRectangle.closeButton;
            if (closeButton) {
                closeButton.dispose();
                titleRectangle.closeButton = undefined;
            }

            titleRectangle.dispose();
            resizablePopup.titleRectangle = undefined;
        }

        const contentGUIControl = resizablePopup.contentGUIControl;
        if (contentGUIControl) {
            contentGUIControl.dispose();

            resizablePopup.contentGUIControl = undefined;
        }

        if (resizablePopup.additionalControls.length > 0) {
            for (const additionalControl of resizablePopup.additionalControls) {
                additionalControl.clearControls();
                if (additionalControl.children && additionalControl.children.length > 0) {
                    for (const child of additionalControl.children) {
                        child.dispose();
                    }
                }
                additionalControl.dispose();
            }
            resizablePopup.additionalControls = undefined;
        }

        this.removePopup(resizablePopup);
        resizablePopup.dispose();
    }

    addPopup(popup) {
        this._popups.push(popup);
    }

    removePopup(removePopup) {
        const index = this._popups.findIndex((popup) => {
            return popup.uniqueId === removePopup.uniqueId;
        });

        if (index > -1) {
            this._popups.splice(index, 1);
        }
    }

    redrawAllPopups() {
        for (const popup of this._popups) {
            this._DTDWeb.uiManager.addGUIControl(popup);
        }
    }
}

export { DTDWebPopupManager };