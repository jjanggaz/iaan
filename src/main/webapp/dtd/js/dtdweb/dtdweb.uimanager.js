import { DTDWeb } from './dtdweb.js';

import { DTDWebOnScreenNavigate } from './gui/dtdweb.onscreennavigate.js';
import { DTDWebOnScreenKeyHelper } from './gui/dtdweb.onscreenkeyhelper.js';

class DTDWebUIManager {
    constructor(dtdWeb) {
        this._DTDWeb = dtdWeb;
        this._engine = dtdWeb.engine;
        this._scene = dtdWeb.scene;
        this._renderCanvas = dtdWeb.renderCanvas;

        // GUI Root (기즈모 보다 위에 UI를 그리기 위해 UtilityLayerRenderer를 새로 만들어 덮음)
        this._utilityLayerRenderer = new BABYLON.UtilityLayerRenderer(this._scene);
        this._utilityLayerRenderer.processAllEvents = true;
        this._advancedDynamicTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI', true, this._utilityLayerRenderer.utilityLayerScene);
        this._advancedDynamicTexture.layer.layerMask = DTDWeb.Camera.LAYER_MASK.UI;

        this.initializeIdealWidth();
        this.initializeRenderScale();

        if (this._DTDWeb.useScreenKeyHelper) {
            this._onScreenKeyHelper = new DTDWebOnScreenKeyHelper(this, this._DTDWeb);
            this._onScreenKeyHelper.initialize();
        }

        this._onScreenNavigate = new DTDWebOnScreenNavigate(this, this._DTDWeb);
        this._onScreenNavigate.initialize();

        this._toastRectangle = undefined;
        this._toastBackgroundRectangle = undefined;
        this._toastTextBlock = undefined;
        this.initializeToast();

        this._pointerBlockerRectangle = undefined;
        this._isPointerBlockerShowing = false;
        this.initializePointerBlocker();

        this._popupRectangle = undefined;
        this._popupChildren = [];

        this._contextMenuType = DTDWeb.UI.CONTEXT_MENU_TYPE.CLASSIC;

        const contextMenuButtonTypeArray = [
            DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.CATEGORY_SELECT,
            DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.CONNECT_SELECT,
            DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.SPLIT_LINE,
            DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.HIGHLIGHT,
            DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.XRAY,
            DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.INVISIBLE,
            DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.RESET_ALL,
            DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.SPLIT_LINE,
            DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.PATH_TRACKING,
            DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.SPLIT_LINE,
            DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.PROPERTY
        ];

        const notPickedContextMenuButtonTypeArray = [
            DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.NOT_PICKED_RESET
        ];

        this._contextMenuButtonArray = [];
        this._notPickedContextMenuButtonArray = [];

        if (this._contextMenuType === DTDWeb.UI.CONTEXT_MENU_TYPE.CLASSIC) {
            this._contextMenuRectangle = this.createClassicContextMenu('ClassicContextMenu', contextMenuButtonTypeArray, this._contextMenuButtonArray);
            this._notPickedContextMenuRectangle = this.createClassicContextMenu('NotPickClassicContextMenu', notPickedContextMenuButtonTypeArray, this._notPickedContextMenuButtonArray);
        }
        else if (this._contextMenuType === DTDWeb.UI.CONTEXT_MENU_TYPE.CIRCLE) {
            this._contextMenuRectangle = this.createCircleContextMenu('CircleContextMenu', contextMenuButtonTypeArray, this._contextMenuButtonArray);
            this._notPickedContextMenuRectangle = this.createCircleContextMenu('NotPickCircleContextMenu', notPickedContextMenuButtonTypeArray, this._notPickedContextMenuButtonArray);
        }

        this.setContextMenuButtonAction(this._contextMenuButtonArray);
        this.setContextMenuButtonAction(this._notPickedContextMenuButtonArray);

        this.addGUIControl(this._contextMenuRectangle);
        this.addGUIControl(this._notPickedContextMenuRectangle);

        // KEPCO E&C Custom START
        const rootValveContextMenuButtonTypeArray = [
            DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.CATEGORY_SELECT,
            DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.CONNECT_SELECT,
            DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.SPLIT_LINE,
            DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.HIGHLIGHT,
            DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.XRAY,
            DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.INVISIBLE,
            DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.RESET_ALL,
            DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.SPLIT_LINE,
            DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.PATH_TRACKING,
            DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.SPLIT_LINE,
            DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.VIEW_2D,
            DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.DESIGN_CHECK_2D,
            DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.DESIGN_CHECK_3D,
            DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.FIELD_DESIGN_CHECK,
            DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.SPLIT_LINE,
            DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.PROPERTY
        ];

        this._rootValveContextMenuButtonArray = [];
        this._rootValveContextMenuRectangle = this.createClassicContextMenu('RootValveContextMenu', rootValveContextMenuButtonTypeArray, this._rootValveContextMenuButtonArray);
        this.setContextMenuButtonAction(this._rootValveContextMenuButtonArray);

        this.addGUIControl(this._rootValveContextMenuRectangle);
        // KEPCO E&C Custom END

        this._currentContextMenuRectangle = undefined;
        this._currentSubContextMenuRectangle = undefined;
    }

    get idealWidth() {
        return this._advancedDynamicTexture.idealWidth;
    }

    get devicePixelRatio() {
        return this._devicePixelRatio;
    }

    get isSelectableFloor() {
        return this._onScreenNavigate.isSelectableFloor;
    }

    get isPointerBlockerShowing() {
        return this._isPointerBlockerShowing;
    }

    get isContextMenuVisible() {
        return this._currentContextMenuRectangle && this._currentContextMenuRectangle.isVisible;
    }

    initializeIdealWidth() {
        this._boundingClientRect = this._renderCanvas.getBoundingClientRect();
        this._advancedDynamicTexture.idealWidth = Math.round(this._boundingClientRect.width);

        if (this._DTDWeb.markupController) {
            if (this._DTDWeb.markupController.advancedDynamicTexture) {
                this._DTDWeb.markupController.advancedDynamicTexture.idealWidth =
                    this._advancedDynamicTexture.idealWidth;
            }
        }
    }

    initializeRenderScale() {
        this._devicePixelRatio = window.devicePixelRatio / this._DTDWeb.scaleFactor;
        this._advancedDynamicTexture.renderScale = this._devicePixelRatio;

        if (this._DTDWeb.markupController) {
            if (this._DTDWeb.markupController.advancedDynamicTexture) {
                this._DTDWeb.markupController.advancedDynamicTexture.renderScale = this._devicePixelRatio;
            }
        }
    }

    initializeToast() {
        this._toastRectangle = new BABYLON.GUI.Rectangle('ToastRectangle');
        this._toastRectangle.topInPixels = -125;
        this._toastRectangle.widthInPixels = 1000;
        this._toastRectangle.heightInPixels = 32;
        this._toastRectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this._toastRectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this._toastRectangle.background = 'transparent';
        this._toastRectangle.thickness = 0;

        this._toastTextBlock = new BABYLON.GUI.TextBlock('ToastTextBlock');
        this._toastTextBlock.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this._toastTextBlock.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        this._toastTextBlock.color = 'white';
        this._toastTextBlock.fontFamily = DTDWeb.GLOBAL_FONT_FAMILY;
        this._toastTextBlock.fontSize = 12;
        this._toastTextBlock.text = '';

        this._toastBackgroundRectangle = new BABYLON.GUI.Rectangle('ToastBackgroundRectangle');
        this._toastBackgroundRectangle.leftInPixels = 0;
        this._toastBackgroundRectangle.topInPixels = 0;
        this._toastBackgroundRectangle.widthInPixels = 0;
        this._toastBackgroundRectangle.heightInPixels = 32;
        this._toastBackgroundRectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this._toastBackgroundRectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        this._toastBackgroundRectangle.cornerRadius = 10 * this._devicePixelRatio * this._devicePixelRatio;
        this._toastBackgroundRectangle.background = '#161616';
        this._toastBackgroundRectangle.alpha = 0.5;
        this._toastBackgroundRectangle.thickness = 0;

        this._toastRectangle.addControl(this._toastBackgroundRectangle);
        this._toastRectangle.addControl(this._toastTextBlock);
    }

    initializePointerBlocker() {
        this._pointerBlockerRectangle = new BABYLON.GUI.Rectangle('PointerLockerRectangle');
        this._pointerBlockerRectangle.leftInPixels = 0;
        this._pointerBlockerRectangle.topInPixels = 0;
        this._pointerBlockerRectangle.width = '100%';
        this._pointerBlockerRectangle.height = '100%';
        this._pointerBlockerRectangle.background = 'black';
        this._pointerBlockerRectangle.alpha = 0.5;
        this._pointerBlockerRectangle.thickness = 0;
        this._pointerBlockerRectangle.isPointerBlocker = true;
    }

    createClassicContextMenu(objectName, contextMenuButtonTypeArray, contextMenuButtonArray) {
        const contextMenuStackPanel = new BABYLON.GUI.StackPanel(`${objectName}_StackPanel`);
        contextMenuStackPanel.background = 'transparent';
        contextMenuStackPanel.isVertical = true;
        contextMenuStackPanel.widthInPixels = 180;

        let splitLineCount = 0;
        let heightInPixels = 0;
        for (const contextMenuButtonType of contextMenuButtonTypeArray) {
            if (contextMenuButtonType === DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.SPLIT_LINE) {
                const splitLineImage = new BABYLON.GUI.Image(`${objectName}_SplitLine_Image_${++splitLineCount}`, `${DTDPlayer.IMAGE_DIRECTORY}/context_menu/separator.png`);
                splitLineImage.widthInPixels = contextMenuStackPanel.widthInPixels;
                splitLineImage.heightInPixels = 1;
                splitLineImage.background = 'transparent';

                const splitLineRectangle = new BABYLON.GUI.Rectangle(`${objectName}_SplitLine_Rectangle_${splitLineCount}`);
                splitLineRectangle.widthInPixels = contextMenuStackPanel.widthInPixels;
                splitLineRectangle.heightInPixels = 7;
                splitLineRectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
                splitLineRectangle.background = 'transparent';
                splitLineRectangle.thickness = 0;
                splitLineRectangle.addControl(splitLineImage);

                contextMenuStackPanel.addControl(splitLineRectangle);
                heightInPixels += splitLineRectangle.heightInPixels;
            }
            else {
                const contextMenuButton = this.createClassicContextMenuButton(contextMenuButtonType);
                contextMenuButtonArray.push(contextMenuButton);
                contextMenuStackPanel.addControl(contextMenuButton);
                heightInPixels += contextMenuButton.heightInPixels;
            }
        }

        contextMenuStackPanel.heightInPixels = heightInPixels;

        const contextMenuRectangle = new BABYLON.GUI.Rectangle(`${objectName}_Rectangle`);
        contextMenuRectangle.widthInPixels = contextMenuStackPanel.widthInPixels + 10;
        contextMenuRectangle.heightInPixels = contextMenuStackPanel.heightInPixels + 10;
        contextMenuRectangle.background = '#3a3838';
        contextMenuRectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        contextMenuRectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        contextMenuRectangle.thickness = 0;
        contextMenuRectangle.isVisible = false;
        contextMenuRectangle.contextMenuButtonArray = contextMenuButtonArray;
        contextMenuRectangle.addControl(contextMenuStackPanel);

        for (const contextMenuButton of contextMenuButtonArray) {
            if (contextMenuButton.hasSubContextMenu) {
                contextMenuButton.contextMenuButtonArray = contextMenuButtonArray;
                contextMenuButton.contextMenuRectangle = contextMenuRectangle;
                contextMenuButton.subContextMenuButtonArray = [];
                contextMenuButton.subContextMenuRectangle = this.createClassicSubContextMenu(contextMenuButton, contextMenuButton.subContextMenuButtonArray);

                this.addGUIControl(contextMenuButton.subContextMenuRectangle);
            }
        }

        return contextMenuRectangle;
    }

    createCircleContextMenu(objectName, contextMenuButtonTypeArray, contextMenuButtonArray) {
        const circleImage = new BABYLON.GUI.Image(objectName + '_CircleImage', `${DTDPlayer.IMAGE_DIRECTORY}/context_menu/line_context.png`);
        circleImage.widthInPixels = 100;
        circleImage.heightInPixels = 100;

        const contextMenuRectangle = new BABYLON.GUI.Rectangle(objectName + '_Rectangle');
        contextMenuRectangle.widthInPixels = 217;
        contextMenuRectangle.heightInPixels = 217;
        contextMenuRectangle.background = 'transparent';
        contextMenuRectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        contextMenuRectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        contextMenuRectangle.thickness = 0;
        contextMenuRectangle.isVisible = false;
        contextMenuRectangle.contextMenuButtonArray = contextMenuButtonArray;
        contextMenuRectangle.addControl(circleImage);

        for (const contextMenuButtonType of contextMenuButtonTypeArray) {
            if (contextMenuButtonType === DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.SPLIT_LINE) {
                continue;
            }
            const contextMenuButton = this.createCircleContextMenuButton(contextMenuButtonType);
            contextMenuButtonArray.push(contextMenuButton);
            contextMenuRectangle.addControl(contextMenuButton);
        }

        const contextMenuButtonCount = contextMenuButtonArray.length;
        for (let contextMenuButtonIndex = 0; contextMenuButtonIndex < contextMenuButtonCount; contextMenuButtonIndex++) {
            const contextMenuButton = contextMenuButtonArray[contextMenuButtonIndex];

            if (contextMenuButton.hasSubContextMenu) {
                contextMenuButton.contextMenuButtonArray = contextMenuButtonArray;
                contextMenuButton.contextMenuRectangle = contextMenuRectangle;
                contextMenuButton.subContextMenuButtonArray = [];
                contextMenuButton.subContextMenuRectangle = this.createCircleSubContextMenu(contextMenuButton, contextMenuButton.subContextMenuButtonArray);

                const hasSubContextMenuImage = new BABYLON.GUI.Image(contextMenuButton.name + '_HasSubContextMenuImage', `${DTDPlayer.IMAGE_DIRECTORY}/context_menu/context_blue_next.png`);
                hasSubContextMenuImage.leftInPixels = (40 * Math.sin(2 * Math.PI * contextMenuButtonIndex / contextMenuButtonCount)) / 2;
                hasSubContextMenuImage.topInPixels = (40 * Math.cos(2 * Math.PI * contextMenuButtonIndex / contextMenuButtonCount)) / -2;
                hasSubContextMenuImage.widthInPixels = 10;
                hasSubContextMenuImage.heightInPixels = 10;
                hasSubContextMenuImage.rotation = 2 * Math.PI * contextMenuButtonIndex / contextMenuButtonCount;
                hasSubContextMenuImage.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
                hasSubContextMenuImage.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
                hasSubContextMenuImage.background = 'transparent';
                hasSubContextMenuImage.thickness = 0;
                contextMenuButton.addControl(hasSubContextMenuImage);

                this.addGUIControl(contextMenuButton.subContextMenuRectangle);
            }
        }

        return contextMenuRectangle;
    }

    createClassicSubContextMenu(parentContextMenuButton, subContextMenuButtonArray) {
        let subContextMenuButtonTypeArray = [];
        const parentContextMenuButtonType = parentContextMenuButton.contextMenuButtonType;
        switch (parentContextMenuButtonType) {
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.HIGHLIGHT:
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.XRAY:
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.INVISIBLE:
                subContextMenuButtonTypeArray.push(DTDWeb.UI.SUB_CONTEXT_MENU_BUTTON_TYPE.APPLY);
                subContextMenuButtonTypeArray.push(DTDWeb.UI.SUB_CONTEXT_MENU_BUTTON_TYPE.INVERT_APPLY);
                subContextMenuButtonTypeArray.push(DTDWeb.UI.SUB_CONTEXT_MENU_BUTTON_TYPE.CATEGORY_APPLY);
                break;
        }

        const objectName = `${parentContextMenuButton.name}_SubContextMenu`;

        const subContextMenuStackPanel = new BABYLON.GUI.StackPanel(`${objectName}_StackPanel`);
        subContextMenuStackPanel.background = 'transparent';
        subContextMenuStackPanel.isVertical = true;
        subContextMenuStackPanel.widthInPixels = 220;

        let heightInPixels = 0;
        for (const subContextMenuButtonType of subContextMenuButtonTypeArray) {
            const subContextMenuButton = this.createClassicSubContextMenuButton(subContextMenuButtonType, parentContextMenuButton);
            subContextMenuButtonArray.push(subContextMenuButton);
            subContextMenuStackPanel.addControl(subContextMenuButton);
            heightInPixels += subContextMenuButton.heightInPixels;
        }

        this.setSubContextMenuButtonAction(subContextMenuButtonArray);

        subContextMenuStackPanel.heightInPixels = heightInPixels;

        const subContextMenuRectangle = new BABYLON.GUI.Rectangle(`${objectName}_Rectangle`);
        subContextMenuRectangle.widthInPixels = subContextMenuStackPanel.widthInPixels + 10;
        subContextMenuRectangle.heightInPixels = subContextMenuStackPanel.heightInPixels + 10;
        subContextMenuRectangle.background = '#3a3838';
        subContextMenuRectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        subContextMenuRectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        subContextMenuRectangle.thickness = 0;
        subContextMenuRectangle.isVisible = false;
        subContextMenuRectangle.parentContextMenuButton = parentContextMenuButton;
        subContextMenuRectangle.addControl(subContextMenuStackPanel);

        return subContextMenuRectangle;
    }

    createCircleSubContextMenu(parentContextMenuButton, subContextMenuButtonArray) {
        let subContextMenuButtonTypeArray = [];
        const parentContextMenuButtonType = parentContextMenuButton.contextMenuButtonType;
        switch (parentContextMenuButtonType) {
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.HIGHLIGHT:
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.XRAY:
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.INVISIBLE:
                subContextMenuButtonTypeArray.push(DTDWeb.UI.SUB_CONTEXT_MENU_BUTTON_TYPE.APPLY);
                subContextMenuButtonTypeArray.push(DTDWeb.UI.SUB_CONTEXT_MENU_BUTTON_TYPE.INVERT_APPLY);
                subContextMenuButtonTypeArray.push(DTDWeb.UI.SUB_CONTEXT_MENU_BUTTON_TYPE.CATEGORY_APPLY);
                break;
        }

        const objectName = parentContextMenuButton.name + '_SubContextMenu';

        const circleImage = new BABYLON.GUI.Image(objectName + '_CircleImage', `${DTDPlayer.IMAGE_DIRECTORY}/context_menu/line_context.png`);
        circleImage.widthInPixels = 100;
        circleImage.heightInPixels = 100;

        const subContextMenuRectangle = new BABYLON.GUI.Rectangle(objectName + '_Rectangle');
        subContextMenuRectangle.widthInPixels = 217;
        subContextMenuRectangle.heightInPixels = 217;
        subContextMenuRectangle.background = 'transparent';
        subContextMenuRectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        subContextMenuRectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        subContextMenuRectangle.thickness = 0;
        subContextMenuRectangle.isVisible = false;
        subContextMenuRectangle.parentContextMenuButton = parentContextMenuButton;
        subContextMenuRectangle.addControl(circleImage);

        for (const subContextMenuButtonType of subContextMenuButtonTypeArray) {
            const subContextMenuButton = this.createCircleSubContextMenuButton(subContextMenuButtonType, parentContextMenuButton);
            subContextMenuButtonArray.push(subContextMenuButton);
            subContextMenuRectangle.addControl(subContextMenuButton);
        }

        this.setSubContextMenuButtonAction(subContextMenuButtonArray);

        const subContextMenuBackImage = new BABYLON.GUI.Image(objectName + '_BackImage', `${DTDPlayer.IMAGE_DIRECTORY}/context_menu/context_back.png`);
        subContextMenuBackImage.widthInPixels = 20;
        subContextMenuBackImage.heightInPixels = 20;
        subContextMenuBackImage.thickness = 0;

        const subContextMenuBackButton = new BABYLON.GUI.Button(objectName + '_BackButton');
        subContextMenuBackButton.widthInPixels = 40;
        subContextMenuBackButton.heightInPixels = 40;
        subContextMenuBackButton.background = 'white';
        subContextMenuBackButton.cornerRadius = 100 * this._devicePixelRatio * this._devicePixelRatio;
        if (!this._DTDWeb.isTouchDevice) {
            subContextMenuBackButton.onPointerEnterObservable.add(() => {
                subContextMenuBackButton.background = '#f5f5f5';
            });
            subContextMenuBackButton.onPointerOutObservable.add(() => {
                subContextMenuBackButton.background = 'white';
            });
        }
        subContextMenuBackButton.onPointerClickObservable.add(() => {
            this.hideContextMenu();
            this.showContextMenuFromSubContextMenu(parentContextMenuButton);
        });

        subContextMenuBackButton.addControl(subContextMenuBackImage);

        subContextMenuRectangle.addControl(subContextMenuBackButton);

        return subContextMenuRectangle;
    }

    createClassicContextMenuButton(contextMenuButtonType) {
        const objectName = contextMenuButtonType;

        let imageDirectory = `${DTDPlayer.IMAGE_DIRECTORY}/context_menu`;
        let imagePath = undefined;
        let buttonText = undefined;
        let hasSubContextMenu = false;

        switch (contextMenuButtonType) {
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.CATEGORY_SELECT:
                imagePath = `${imageDirectory}/context_category_select.png`;
                buttonText = DTDWeb.UI.UI_TEXT.CATEGORY_SELECT;
                break;
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.CONNECT_SELECT:
                imagePath = `${imageDirectory}/context_connect_select.png`;
                buttonText = DTDWeb.UI.UI_TEXT.CONNECT_SELECT;
                break;
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.HIGHLIGHT:
                imagePath = `${imageDirectory}/context_highlight.png`;
                buttonText = DTDWeb.UI.UI_TEXT.HIGHLIGHT;
                hasSubContextMenu = true;
                break;
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.XRAY:
                imagePath = `${imageDirectory}/context_xray.png`;
                buttonText = DTDWeb.UI.UI_TEXT.XRAY;
                hasSubContextMenu = true;
                break;
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.INVISIBLE:
                imagePath = `${imageDirectory}/context_hidden.png`;
                buttonText = DTDWeb.UI.UI_TEXT.INVISIBLE;
                hasSubContextMenu = true;
                break;
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.RESET_ALL:
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.NOT_PICKED_RESET:
                imagePath = `${imageDirectory}/context_refresh.png`;
                buttonText = DTDWeb.UI.UI_TEXT.RESET_ALL;
                break;
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.PATH_TRACKING:
                imagePath = `${imageDirectory}/context_path_tracking.png`;
                buttonText = DTDWeb.UI.UI_TEXT.PATH_TRACKING;
                break;
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.PROPERTY:
                imagePath = `${imageDirectory}/context_property.png`;
                buttonText = DTDWeb.UI.UI_TEXT.SHOW_PROPERTIES;
                break;
            // KEPCO E&C Custom START
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.VIEW_2D:
                buttonText = DTDWeb.UI.UI_TEXT.VIEW_2D;
                break;
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.DESIGN_CHECK_2D:
                buttonText = DTDWeb.UI.UI_TEXT.DESIGN_CHECK_2D;
                break;
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.DESIGN_CHECK_3D:
                buttonText = DTDWeb.UI.UI_TEXT.DESIGN_CHECK_3D;
                break;
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.FIELD_DESIGN_CHECK:
                buttonText = DTDWeb.UI.UI_TEXT.FIELD_DESIGN_CHECK;
                break;
            // KEPCO E&C Custom END
        }

        const contextMenuButton = new BABYLON.GUI.Button(objectName + '_Button');
        contextMenuButton.widthInPixels = 180;
        contextMenuButton.heightInPixels = 22;
        contextMenuButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        contextMenuButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        contextMenuButton.background = 'transparent';
        contextMenuButton.cornerRadius = 5 * this._devicePixelRatio * this._devicePixelRatio;
        contextMenuButton.thickness = 0;
        contextMenuButton.contextMenuButtonType = contextMenuButtonType;
        contextMenuButton.hasSubContextMenu = hasSubContextMenu;
        contextMenuButton.onPointerEnterObservable.add(() => {
            if (!this._DTDWeb.isTouchDevice) {
                contextMenuButton.background = '#282627';
            }

            this.hideSubContextMenu();

            if (contextMenuButton.hasSubContextMenu) {
                this.showSubContextMenu(contextMenuButton);
            }
        });
        if (!this._DTDWeb.isTouchDevice) {
            contextMenuButton.onPointerOutObservable.add(() => {
                contextMenuButton.background = 'transparent';
            });
        }

        if (imagePath) {
            const contextMenuImage = new BABYLON.GUI.Image(objectName + '_Image', imagePath);
            contextMenuImage.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            contextMenuImage.widthInPixels = 15;
            contextMenuImage.heightInPixels = 15;
            contextMenuImage.left = '5px';
            contextMenuImage.background = 'transparent';

            contextMenuButton.addControl(contextMenuImage);
        }

        if (buttonText) {
            const contextMenuTextBlock = new BABYLON.GUI.TextBlock(`${objectName}_TextBlock`, buttonText);
            contextMenuTextBlock.textWrapping = true;
            contextMenuTextBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            contextMenuTextBlock.paddingLeft = '25px';
            contextMenuTextBlock.fontFamily = DTDWeb.GLOBAL_FONT_FAMILY;
            contextMenuTextBlock.fontSize = 12;
            contextMenuTextBlock.color = '#d4d4d4';

            contextMenuButton.addControl(contextMenuTextBlock);
        }

        if (hasSubContextMenu) {
            const hasSubContextMenuImage = new BABYLON.GUI.Image(`${contextMenuButton.name}_HasSubContextMenuImage`, `${imageDirectory}/baseline_play_arrow_white_48dp.png`);
            hasSubContextMenuImage.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
            hasSubContextMenuImage.widthInPixels = 15;
            hasSubContextMenuImage.heightInPixels = 15;
            hasSubContextMenuImage.right = '5px';
            hasSubContextMenuImage.background = 'transparent';
            hasSubContextMenuImage.color = '#d4d4d4'

            contextMenuButton.addControl(hasSubContextMenuImage);
        }

        return contextMenuButton;
    }

    createClassicSubContextMenuButton(subContextMenuButtonType, parentContextMenuButton) {
        const objectName = subContextMenuButtonType;

        let subContextMenuButtonText = undefined;
        switch (parentContextMenuButton.contextMenuButtonType) {
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.HIGHLIGHT:
                subContextMenuButtonText = DTDWeb.UI.UI_TEXT.HIGHLIGHT;
                break;
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.XRAY:
                subContextMenuButtonText = DTDWeb.UI.UI_TEXT.XRAY;
                break;
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.INVISIBLE:
                subContextMenuButtonText = DTDWeb.UI.UI_TEXT.INVISIBLE;
                break;
        }

        switch (subContextMenuButtonType) {
            case DTDWeb.UI.SUB_CONTEXT_MENU_BUTTON_TYPE.APPLY:
                subContextMenuButtonText = `${subContextMenuButtonText} ${DTDWeb.UI.UI_TEXT.APPLY}`;
                break;
            case DTDWeb.UI.SUB_CONTEXT_MENU_BUTTON_TYPE.INVERT_APPLY:
                subContextMenuButtonText = `${DTDWeb.UI.UI_TEXT.INVERT_APPLY} ${subContextMenuButtonText}`;
                break;
            case DTDWeb.UI.SUB_CONTEXT_MENU_BUTTON_TYPE.CATEGORY_APPLY:
                subContextMenuButtonText = `${DTDWeb.UI.UI_TEXT.CATEGORY_APPLY} ${subContextMenuButtonText}`;
                break;
        }

        const subContextMenuButton = new BABYLON.GUI.Button(objectName + '_Button');
        subContextMenuButton.widthInPixels = 220;
        subContextMenuButton.heightInPixels = 22;
        subContextMenuButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        subContextMenuButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        subContextMenuButton.background = 'transparent';
        subContextMenuButton.cornerRadius = 5 * this._devicePixelRatio * this._devicePixelRatio;
        subContextMenuButton.thickness = 0;
        subContextMenuButton.contextMenuButtonType = subContextMenuButtonType;
        subContextMenuButton.parentContextMenuButton = parentContextMenuButton;
        if (!this._DTDWeb.isTouchDevice) {
            subContextMenuButton.onPointerEnterObservable.add(() => {
                subContextMenuButton.background = '#282627';
            });
            subContextMenuButton.onPointerOutObservable.add(() => {
                subContextMenuButton.background = 'transparent';
            });
        }

        if (subContextMenuButtonText) {
            const subContextMenuTextBlock = new BABYLON.GUI.TextBlock(`${objectName}_TextBlock`, subContextMenuButtonText);
            subContextMenuTextBlock.textWrapping = true;
            subContextMenuTextBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            subContextMenuTextBlock.paddingLeft = '25px';
            subContextMenuTextBlock.fontFamily = DTDWeb.GLOBAL_FONT_FAMILY;
            subContextMenuTextBlock.fontSize = 12;
            subContextMenuTextBlock.color = '#d4d4d4';

            subContextMenuButton.addControl(subContextMenuTextBlock);
        }

        return subContextMenuButton;
    }

    createCircleContextMenuButton(contextMenuButtonType) {
        const objectName = contextMenuButtonType;

        let imageDirectory = `${DTDPlayer.IMAGE_DIRECTORY}/context_menu`;
        let imagePath = undefined;
        let circleColor = '#26a6d1';
        let hoverColor = '#16627b';
        let hasSubContextMenu = false;

        switch (contextMenuButtonType) {
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.CATEGORY_SELECT:
                imagePath = `${imageDirectory}/context_category_select.png`;
                circleColor = '#26a6d1';
                hoverColor = '#16627b';
                break;
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.CONNECT_SELECT:
                imagePath = `${imageDirectory}/context_connect_select.png`;
                circleColor = '#26a6d1';
                hoverColor = '#16627b';
                break;
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.HIGHLIGHT:
                imagePath = `${imageDirectory}/context_highlight.png`;
                circleColor = '#efc75e';
                hoverColor = '#8d7537';
                hasSubContextMenu = true;
                break;
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.XRAY:
                imagePath = `${imageDirectory}/context_xray.png`;
                circleColor = '#efc75e';
                hoverColor = '#8d7537';
                hasSubContextMenu = true;
                break;
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.INVISIBLE:
                imagePath = `${imageDirectory}/context_hidden.png`;
                circleColor = '#efc75e';
                hoverColor = '#8d7537';
                hasSubContextMenu = true;
                break;
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.RESET_ALL:
                imagePath = `${imageDirectory}/context_refresh.png`;
                circleColor = '#efc75e';
                hoverColor = '#8d7537';
                break;
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.PATH_TRACKING:
                imagePath = `${imageDirectory}/context_path_tracking.png`;
                circleColor = '#7f56c1';
                hoverColor = '#48316e';
                break;
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.PROPERTY:
                imagePath = `${imageDirectory}/context_property.png`;
                circleColor = '#26a6d1';
                hoverColor = '#16627b';
                break;
            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.NOT_PICKED_RESET:
                imagePath = `${imageDirectory}/context_refresh.png`;
                circleColor = '#26a6d1';
                hoverColor = '#16627b';
                break;
        }

        const contextMenuButton = new BABYLON.GUI.Button(objectName + '_Button');
        contextMenuButton.widthInPixels = 45;
        contextMenuButton.heightInPixels = 45;
        contextMenuButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        contextMenuButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        contextMenuButton.cornerRadius = 100 * this._devicePixelRatio * this._devicePixelRatio;
        contextMenuButton.circleColor = circleColor;
        contextMenuButton.hoverColor = hoverColor;
        contextMenuButton.background = contextMenuButton.circleColor;
        contextMenuButton.thickness = 0;
        contextMenuButton.contextMenuButtonType = contextMenuButtonType;
        contextMenuButton.hasSubContextMenu = hasSubContextMenu;
        if (!this._DTDWeb.isTouchDevice) {
            contextMenuButton.onPointerEnterObservable.add(() => {
                contextMenuButton.background = contextMenuButton.hoverColor;
            });
            contextMenuButton.onPointerOutObservable.add(() => {
                contextMenuButton.background = contextMenuButton.circleColor;
            });
        }

        if (imagePath) {
            const contextMenuImage = new BABYLON.GUI.Image(objectName + '_Image', imagePath);
            contextMenuImage.widthInPixels = 30;
            contextMenuImage.heightInPixels = 30;
            contextMenuImage.background = 'transparent';

            contextMenuButton.addControl(contextMenuImage);
        }

        return contextMenuButton;
    }

    createCircleSubContextMenuButton(subContextMenuButtonType, parentContextMenuButton) {
        const objectName = subContextMenuButtonType;

        let subContextMenuButtonText = '';
        switch (subContextMenuButtonType) {
            case DTDWeb.UI.SUB_CONTEXT_MENU_BUTTON_TYPE.APPLY:
                subContextMenuButtonText = DTDWeb.UI.UI_TEXT.APPLY;
                break;
            case DTDWeb.UI.SUB_CONTEXT_MENU_BUTTON_TYPE.INVERT_APPLY:
                subContextMenuButtonText = DTDWeb.UI.UI_TEXT.SUB_CONTEXT_MENU_INVERT_APPLY;
                break;
            case DTDWeb.UI.SUB_CONTEXT_MENU_BUTTON_TYPE.CATEGORY_APPLY:
                subContextMenuButtonText = DTDWeb.UI.UI_TEXT.SUB_CONTEXT_MENU_CATEGORY_APPLY;
                break;
        }

        const subContextMenuButton = BABYLON.GUI.Button.CreateSimpleButton(objectName + '_Button', subContextMenuButtonText);
        subContextMenuButton.widthInPixels = 45;
        subContextMenuButton.heightInPixels = 45;
        subContextMenuButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        subContextMenuButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        subContextMenuButton.cornerRadius = 100 * this._devicePixelRatio * this._devicePixelRatio;
        subContextMenuButton.circleColor = parentContextMenuButton.circleColor;
        subContextMenuButton.hoverColor = parentContextMenuButton.hoverColor;
        subContextMenuButton.background = subContextMenuButton.circleColor;
        subContextMenuButton.thickness = 0;
        subContextMenuButton.textBlock.fontFamily = DTDWeb.GLOBAL_FONT_FAMILY;
        subContextMenuButton.textBlock.fontSize = 10;
        subContextMenuButton.textBlock.color = 'white';
        subContextMenuButton.contextMenuButtonType = subContextMenuButtonType;
        subContextMenuButton.parentContextMenuButton = parentContextMenuButton;
        if (!this._DTDWeb.isTouchDevice) {
            subContextMenuButton.onPointerEnterObservable.add(() => {
                subContextMenuButton.background = subContextMenuButton.hoverColor;
            });
            subContextMenuButton.onPointerOutObservable.add(() => {
                subContextMenuButton.background = subContextMenuButton.circleColor;
            });
        }

        return subContextMenuButton;
    }

    resetCircleContextMenuButtonPosition(contextMenuButtonArray) {
        const contextMenuButtonCount = contextMenuButtonArray.length;

        for (let positionIndex = 0; positionIndex < contextMenuButtonCount; positionIndex++) {
            contextMenuButtonArray[positionIndex].leftInPixels = (170 * Math.sin(2 * Math.PI * positionIndex / contextMenuButtonCount)) / 2;
            contextMenuButtonArray[positionIndex].topInPixels = (170 * Math.cos(2 * Math.PI * positionIndex / contextMenuButtonCount)) / -2;
        }
    }

    setContextMenuButtonAction(contextMenuButtonArray) {
        for (const contextMenuButton of contextMenuButtonArray) {
            if (contextMenuButton.hasSubContextMenu) {
                contextMenuButton.onPointerClickObservable.add(() => {
                    if (this._contextMenuType === DTDWeb.UI.CONTEXT_MENU_TYPE.CLASSIC) {
                        this.hideSubContextMenu();
                    }
                    else if (this._contextMenuType === DTDWeb.UI.CONTEXT_MENU_TYPE.CIRCLE) {
                        this.hideContextMenu();
                    }
                    this.showSubContextMenu(contextMenuButton);
                });

                continue;
            }

            contextMenuButton.onPointerClickObservable.add(() => {
                if (this._contextMenuType === DTDWeb.UI.CONTEXT_MENU_TYPE.CLASSIC) {
                    this.hideSubContextMenu();
                }

                this.hideContextMenu();

                const contextMenuButtonType = contextMenuButton.contextMenuButtonType;
                if (contextMenuButtonType === DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.CATEGORY_SELECT) {
                    this._DTDWeb.inputController.selectSameCategoryMeshes();
                }
                else if (contextMenuButtonType === DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.CONNECT_SELECT) {
                    this._DTDWeb.inputController.selectConnectedMeshes();
                }
                else if (contextMenuButtonType === DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.RESET_ALL ||
                    contextMenuButtonType === DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.NOT_PICKED_RESET) {
                    this._DTDWeb.modelManager.resetEffectAllMeshes();
                }
                else if (contextMenuButtonType === DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.PROPERTY) {
                    const pickedMesh = this._DTDWeb.inputController.getGizmoAttachedMesh();
                    if (!pickedMesh) {
                        return;
                    }

                    // KEPCO E&C Custom START
                    const parameters = this._DTDWeb.parameterController.getParametersByMesh(pickedMesh);
                    this._DTDWeb.onClickProperty(parameters);
                    // KEPCO E&C Custom END

                }
                else if (contextMenuButtonType === DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.PATH_TRACKING) {
                    const pickedMesh = this._DTDWeb.inputController.getGizmoAttachedMesh();
                    if (!pickedMesh) {
                        return;
                    }

                    const connectorDataSet = this._DTDWeb.modelManager.getConnectorDataSet(pickedMesh);
                    if (!connectorDataSet || connectorDataSet.size === 0) {
                        this._DTDWeb.popupManager.showMainPopup(DTDWeb.Popup.POPUP_TYPE.NOTICE, DTDWeb.Popup.POPUP_TITLE_TEXT.NOTICE,
                            DTDWeb.Popup.POPUP_MESSAGE_TEXT.CANNOT_FOUND_CONNECTED_DATA);
                        return;
                    }

                    // KEPCO E&C Custom START
                    const isSymbolMesh = this._DTDWeb.kepcoEncController.isSymbolMesh(pickedMesh);
                    const animateDelay = 2;
                    const animateSpeed = isSymbolMesh ? 0.75 : 1.5;
                    const cameraRadius = isSymbolMesh ? 2 : 5;
                    // KEPCO E&C Custom END
                    this._DTDWeb.pathTrackingController.runPathTracking(pickedMesh, animateDelay, animateSpeed, cameraRadius);
                }
                // KEPCO E&C Custom START
                else if (contextMenuButtonType === DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.VIEW_2D ||
                    contextMenuButtonType === DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.DESIGN_CHECK_2D ||
                    contextMenuButtonType === DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.DESIGN_CHECK_3D ||
                    contextMenuButtonType === DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.FIELD_DESIGN_CHECK
                ) {
                    const pickedMesh = this._DTDWeb.inputController.getGizmoAttachedMesh();
                    if (pickedMesh && this._DTDWeb.kepcoEncController.isRootValveMesh(pickedMesh)) {
                        const parameterDictionary = this._DTDWeb.parameterController.getParametersByMesh(pickedMesh);

                        switch (contextMenuButtonType) {
                            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.VIEW_2D:
                                this._DTDWeb.onClick2DViewButton(parameterDictionary);
                                break;
                            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.DESIGN_CHECK_2D:
                                this._DTDWeb.onClick2DDesignCheckResultButton(parameterDictionary);
                                break;
                            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.DESIGN_CHECK_3D:
                                this._DTDWeb.onClick3DDesignCheckResultButton(parameterDictionary);
                                break;
                            case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.FIELD_DESIGN_CHECK:
                                this._DTDWeb.onClickFieldDesignCheckResultButton(parameterDictionary);
                                break;
                        }
                    }
                }
                // KEPCO E&C Custom END
            });
        }
    }

    setSubContextMenuButtonAction(subContextMenuButtonArray) {
        for (const subContextMenuButton of subContextMenuButtonArray) {
            subContextMenuButton.onPointerClickObservable.add(() => {
                this.hideContextMenu();

                const parentContextMenuButton = subContextMenuButton.parentContextMenuButton;
                let meshEffectType = -1;
                switch (parentContextMenuButton.contextMenuButtonType) {
                    case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.HIGHLIGHT:
                        meshEffectType = DTDWeb.Mesh.MESH_EFFECT_TYPE.HIGHLIGHT;
                        break;
                    case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.XRAY:
                        meshEffectType = DTDWeb.Mesh.MESH_EFFECT_TYPE.XRAY;
                        break;
                    case DTDWeb.UI.CONTEXT_MENU_BUTTON_TYPE.INVISIBLE:
                        meshEffectType = DTDWeb.Mesh.MESH_EFFECT_TYPE.INVISIBLE;
                        break;
                }

                if (meshEffectType === -1) {
                    return;
                }

                const selectedMeshes = this._DTDWeb.inputController.getSelectedMeshes();
                if (selectedMeshes.length === 0) {
                    return;
                }

                let effectTargetMeshes = undefined;
                const contextMenuButtonType = subContextMenuButton.contextMenuButtonType;
                switch (contextMenuButtonType) {
                    case DTDWeb.UI.SUB_CONTEXT_MENU_BUTTON_TYPE.APPLY:
                        effectTargetMeshes = selectedMeshes;
                        break;
                    case DTDWeb.UI.SUB_CONTEXT_MENU_BUTTON_TYPE.INVERT_APPLY:
                        effectTargetMeshes = this._DTDWeb.modelManager.getInverseMeshes(selectedMeshes);
                        break;
                    case DTDWeb.UI.SUB_CONTEXT_MENU_BUTTON_TYPE.CATEGORY_APPLY:
                        const selectedMesh = this._DTDWeb.inputController.getGizmoAttachedMesh();
                        if (!selectedMesh) {
                            return;
                        }
                        effectTargetMeshes = this._DTDWeb.parameterController.getSameCategoryMeshes(selectedMesh);
                        break;
                }

                if (effectTargetMeshes === undefined || effectTargetMeshes.length === 0) {
                    return;
                }

                this._DTDWeb.modelManager.effectMeshes(effectTargetMeshes, meshEffectType);
            });
        }
    }

    animateCircleContextMenu(contextMenuButtonArray) {
        this.resetCircleContextMenuButtonPosition(contextMenuButtonArray);

        const contextMenuButtonCount = contextMenuButtonArray.length;

        const originTopArray = [];
        const originLeftArray = [];

        for (let contextMenuButtonIndex = 0; contextMenuButtonIndex < contextMenuButtonCount; contextMenuButtonIndex++) {
            const contextMenuButton = contextMenuButtonArray[contextMenuButtonIndex];

            originLeftArray.push(contextMenuButton.leftInPixels / this._devicePixelRatio / this._devicePixelRatio);
            originTopArray.push(contextMenuButton.topInPixels / this._devicePixelRatio / this._devicePixelRatio);

            contextMenuButton.leftInPixels = originLeftArray[0];
            contextMenuButton.topInPixels = originTopArray[0];

            if (contextMenuButtonIndex === 0) {
                continue;
            }

            if (contextMenuButton.leftKeyframe) {
                contextMenuButton.leftKeyframe.length = 0;
            }

            if (contextMenuButton.topKeyframe) {
                contextMenuButton.topKeyframe.length = 0;
            }

            contextMenuButton.leftKeyframe = [];
            contextMenuButton.topKeyframe = [];

            contextMenuButton.leftKeyframe.push({ frame: 0, value: originLeftArray[0] });
            contextMenuButton.topKeyframe.push({ frame: 0, value: originTopArray[0] });

            for (let frameIndex = 1; frameIndex < DTDWeb.UI.CONTEXT_MENU_ANIMATION_FRAMERATE; frameIndex++) {
                contextMenuButton.leftKeyframe.push({ frame: frameIndex, value: 170 * Math.sin(2 * Math.PI * (contextMenuButtonIndex / contextMenuButtonCount) * (frameIndex / (DTDWeb.UI.CONTEXT_MENU_ANIMATION_FRAMERATE - 1))) / 2 });
                contextMenuButton.topKeyframe.push({ frame: frameIndex, value: 170 * Math.cos(2 * Math.PI * (contextMenuButtonIndex / contextMenuButtonCount) * (frameIndex / (DTDWeb.UI.CONTEXT_MENU_ANIMATION_FRAMERATE - 1))) / -2 });
            }

            contextMenuButton.leftKeyframe.push({ frame: DTDWeb.UI.CONTEXT_MENU_ANIMATION_FRAMERATE, value: originLeftArray[contextMenuButtonIndex] });
            contextMenuButton.topKeyframe.push({ frame: DTDWeb.UI.CONTEXT_MENU_ANIMATION_FRAMERATE, value: originTopArray[contextMenuButtonIndex] });

            const contextMenuButtonLeftAnimation = new BABYLON.Animation('ContextMenuButtonLeftAnimation', 'leftInPixels', DTDWeb.UI.CONTEXT_MENU_ANIMATION_FRAMERATE, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
            contextMenuButtonLeftAnimation.setKeys(contextMenuButton.leftKeyframe);

            const contextMenuButtonTopAnimation = new BABYLON.Animation('ContextMenuButtonTopAnimation', 'topInPixels', DTDWeb.UI.CONTEXT_MENU_ANIMATION_FRAMERATE, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
            contextMenuButtonTopAnimation.setKeys(contextMenuButton.topKeyframe);

            contextMenuButton.animations = [contextMenuButtonTopAnimation, contextMenuButtonLeftAnimation];

            this._scene.beginAnimation(contextMenuButton, 0, DTDWeb.UI.CONTEXT_MENU_ANIMATION_FRAMERATE, false, 4);
        }
    }

    showContextMenu(x, y, isHit) {
        // KEPCO E&C Custom START
        if (this._contextMenuType === DTDWeb.UI.CONTEXT_MENU_TYPE.CLASSIC) {

            if (isHit) {
                const pickedMesh = this._DTDWeb.inputController.getGizmoAttachedMesh();
                if (pickedMesh && this._DTDWeb.kepcoEncController.isRootValveMesh(pickedMesh)) {
                    this._currentContextMenuRectangle = this._rootValveContextMenuRectangle;
                }
                else {
                    this._currentContextMenuRectangle = this._contextMenuRectangle;
                }
            }
            else {
                this._currentContextMenuRectangle = this._notPickedContextMenuRectangle;
            }
        }
        else {
            this._currentContextMenuRectangle = isHit ? this._contextMenuRectangle : this._notPickedContextMenuRectangle;
        }
        // KEPCO E&C Custom END

        const contextMenuWidth = this._currentContextMenuRectangle.widthInPixels / this._devicePixelRatio / this._devicePixelRatio;
        const contextMenuHeight = this._currentContextMenuRectangle.heightInPixels / this._devicePixelRatio / this._devicePixelRatio;

        if (this._contextMenuType === DTDWeb.UI.CONTEXT_MENU_TYPE.CLASSIC) {
            const boundingRect = this._renderCanvas.getBoundingClientRect();

            if ((x + contextMenuWidth) > boundingRect.width) {
                this._currentContextMenuRectangle.leftInPixels = x - contextMenuWidth;
            }
            else {
                this._currentContextMenuRectangle.leftInPixels = x;
            }

            if ((y + contextMenuHeight) > boundingRect.height) {
                this._currentContextMenuRectangle.topInPixels = y - contextMenuHeight;
            }
            else {
                this._currentContextMenuRectangle.topInPixels = y;
            }
        }
        else if (this._contextMenuType === DTDWeb.UI.CONTEXT_MENU_TYPE.CIRCLE) {
            this._currentContextMenuRectangle.leftInPixels = x - contextMenuWidth / 2;
            this._currentContextMenuRectangle.topInPixels = y - contextMenuHeight / 2;
        }

        this._currentContextMenuRectangle.isVisible = true;

        if (this._contextMenuType === DTDWeb.UI.CONTEXT_MENU_TYPE.CIRCLE) {
            this.animateCircleContextMenu(isHit ? this._contextMenuButtonArray : this._notPickedContextMenuButtonArray);
        }

        this.addGUIControl(this._currentContextMenuRectangle);
    }

    showContextMenuFromSubContextMenu(parentContextMenuButton) {
        const contextMenuRectangle = parentContextMenuButton.contextMenuRectangle;
        const subContextMenuRectangle = parentContextMenuButton.subContextMenuRectangle;

        contextMenuRectangle.leftInPixels = subContextMenuRectangle.leftInPixels / this._devicePixelRatio / this._devicePixelRatio;
        contextMenuRectangle.topInPixels = subContextMenuRectangle.topInPixels / this._devicePixelRatio / this._devicePixelRatio;
        contextMenuRectangle.isVisible = true;

        this._currentContextMenuRectangle = contextMenuRectangle;

        if (this._contextMenuType === DTDWeb.UI.CONTEXT_MENU_TYPE.CIRCLE) {
            this.animateCircleContextMenu(parentContextMenuButton.contextMenuButtonArray);
        }

        this.addGUIControl(this._currentContextMenuRectangle);
    }

    showSubContextMenu(parentContextMenuButton) {
        const contextMenuRectangle = parentContextMenuButton.contextMenuRectangle;
        const subContextMenuRectangle = parentContextMenuButton.subContextMenuRectangle;

        if (this._contextMenuType === DTDWeb.UI.CONTEXT_MENU_TYPE.CLASSIC) {
            const boundingRect = this._renderCanvas.getBoundingClientRect();
            const contextMenuLeft = contextMenuRectangle.leftInPixels / this._devicePixelRatio / this._devicePixelRatio;
            const contextMenuWidth = contextMenuRectangle.widthInPixels / this._devicePixelRatio / this._devicePixelRatio;
            const subContextMenuWidth = subContextMenuRectangle.widthInPixels / this._devicePixelRatio / this._devicePixelRatio;;

            if ((contextMenuLeft + contextMenuWidth + subContextMenuWidth) > boundingRect.width) {
                subContextMenuRectangle.left = contextMenuLeft - subContextMenuWidth - 1;
            }
            else {
                subContextMenuRectangle.leftInPixels = contextMenuWidth + contextMenuLeft + 0.5;
            }

            subContextMenuRectangle.topInPixels = (contextMenuRectangle.topInPixels / this._devicePixelRatio / this._devicePixelRatio) + (parentContextMenuButton.topInPixels / this._devicePixelRatio / this._devicePixelRatio);

        }
        else if (this._contextMenuType === DTDWeb.UI.CONTEXT_MENU_TYPE.CIRCLE) {
            subContextMenuRectangle.leftInPixels = contextMenuRectangle.leftInPixels / this._devicePixelRatio / this._devicePixelRatio;
            subContextMenuRectangle.topInPixels = contextMenuRectangle.topInPixels / this._devicePixelRatio / this._devicePixelRatio;
        }

        subContextMenuRectangle.isVisible = true;

        this._currentSubContextMenuRectangle = subContextMenuRectangle;

        if (this._contextMenuType === DTDWeb.UI.CONTEXT_MENU_TYPE.CIRCLE) {
            this.animateCircleContextMenu(parentContextMenuButton.subContextMenuButtonArray);
        }

        this.addGUIControl(this._currentSubContextMenuRectangle);
    }

    hideContextMenu() {
        if (this._currentContextMenuRectangle) {
            this._currentContextMenuRectangle.isVisible = false;

            this._currentContextMenuRectangle = undefined;
        }

        if (this._currentSubContextMenuRectangle) {
            this._currentSubContextMenuRectangle.isVisible = false;

            this._currentSubContextMenuRectangle = undefined;
        }
    }

    hideSubContextMenu() {
        if (this._currentSubContextMenuRectangle) {
            this._currentSubContextMenuRectangle.isVisible = false;

            this._currentSubContextMenuRectangle = undefined;
        }
    }

    showToastMessage(message, showSeconds) {
        this._toastTextBlock.text = message;

        const context = this._advancedDynamicTexture.getContext();
        context.font = `${this._toastTextBlock.fontSize} ${this._toastTextBlock.fontFamily ? this._toastTextBlock.fontFamily : 'Arial'}`;

        const textBlockWidth = context.measureText(this._toastTextBlock.text).width;
        this._toastBackgroundRectangle.widthInPixels = textBlockWidth + DTDWeb.UI.TOAST_MARGIN_WIDTH;

        this.addGUIControl(this._toastRectangle);

        setTimeout(() => {
            this.hideToastMessage();
        }, showSeconds * 1000);
    }

    hideToastMessage() {
        this.removeGUIControl(this._toastRectangle);
    }

    showPointerBlocker(isAlphaZero) {
        this._pointerBlockerRectangle.alpha = isAlphaZero ? 0 : 0.5;

        this.addGUIControl(this._pointerBlockerRectangle);

        this._isPointerBlockerShowing = true;
    }

    setPointerBlockerAlpha(isAlphaZero) {
        this._pointerBlockerRectangle.alpha = isAlphaZero ? 0 : 0.5;
    }

    hidePointerBlocker() {
        this.removeGUIControl(this._pointerBlockerRectangle);

        this._isPointerBlockerShowing = false;
    }

    setRightPanelVisible(isVisible) {
        this._onScreenNavigate.setRightPanelVisible(isVisible);
    }

    setCameraModeUI(cameraMode) {
        this._onScreenNavigate.setCameraMode(cameraMode);

        if (this._DTDWeb.useScreenKeyHelper) {
            this._onScreenKeyHelper.setCameraMode(cameraMode);
        }
    }

    setOnScreenKeyHelperVisible(isVisible) {
        if (this._DTDWeb.useScreenKeyHelper && this._onScreenKeyHelper) {
            this._onScreenKeyHelper.onClickArrowButton(isVisible);
        }
    }

    setOnScreenKeyButtonStatus(keyCode, isPressed) {
        if (this._DTDWeb.useScreenKeyHelper && this._onScreenKeyHelper) {
            this._onScreenKeyHelper.setOnScreenKeyButtonStatus(keyCode, isPressed);
        }
    }

    uncheckMouseRotationCheckboxButton() {
        this._onScreenNavigate.uncheckMouseRotationCheckboxButton();
    }

    get2DPositionByDevicePixelRatio(x, y) {
        return new BABYLON.Vector2(x * this._devicePixelRatio, y * this._devicePixelRatio);
    }

    addGUIControl(ui) {
        if (ui === undefined || ui.name === undefined) {
            return;
        }

        this.removeGUIControl(ui);

        this._advancedDynamicTexture.addControl(ui);
    }

    removeGUIControl(ui) {
        if (ui === undefined || ui.name === undefined) {
            return;
        }

        if (this._advancedDynamicTexture.getControlByName(ui.name)) {
            this._advancedDynamicTexture.removeControl(ui);
        }
    }

    getCanvasPixelRatioSize() {
        let width = this.divideDevicePixelRatio(this._advancedDynamicTexture.getSize().width);
        let height = this.divideDevicePixelRatio(this._advancedDynamicTexture.getSize().height);

        return { width, height };
    }

    // 좌상단 기준 UI의 Center Point
    getCenterPoint(widthInPixels, heightInPixels) {
        const canvasSize = this.getCanvasPixelRatioSize();

        return {
            leftInPixels: canvasSize.width / 2 - widthInPixels / 2,
            topInPixels: canvasSize.height / 2 - heightInPixels / 2
        };
    }

    multiplyDevicePixelRatio(originValue) {
        return originValue * this._devicePixelRatio * this._devicePixelRatio;
    }

    divideDevicePixelRatio(originValue) {
        return originValue / this._devicePixelRatio / this._devicePixelRatio;
    }

    static CreateTitleContentRectangle(name, widthInPixels, heightInPixels) {
        const titleTextBlock = new BABYLON.GUI.TextBlock(`${name}_TitleTextBlock`);
        titleTextBlock.width = '100%';
        titleTextBlock.height = '100%';
        titleTextBlock.fontFamily = DTDWeb.GLOBAL_FONT_FAMILY;
        titleTextBlock.fontSize = 12;
        titleTextBlock.color = 'white';
        titleTextBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        titleTextBlock.paddingLeftInPixels = 5;

        const titleRectangle = new BABYLON.GUI.Rectangle(`${name}_TitleRectangle`);
        titleRectangle.width = '100%';
        titleRectangle.heightInPixels = 23;
        titleRectangle.thickness = 0;
        titleRectangle.background = '#353535';
        titleRectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        titleRectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        titleRectangle.addControl(titleTextBlock);

        const contentRectangle = new BABYLON.GUI.Rectangle(`${name}_ContentRectangle`);
        contentRectangle.topInPixels = titleRectangle.heightInPixels;
        contentRectangle.width = '100%';
        contentRectangle.heightInPixels = heightInPixels;
        contentRectangle.thickness = 0;
        contentRectangle.background = '#444444';
        contentRectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        contentRectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

        const titleContentRectangle = new BABYLON.GUI.Rectangle(`${name}_TitleContentRectangle`);
        titleContentRectangle.widthInPixels = widthInPixels;
        titleContentRectangle.heightInPixels = titleRectangle.heightInPixels + contentRectangle.heightInPixels;
        titleContentRectangle.thickness = 0;
        titleContentRectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        titleContentRectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        titleContentRectangle.titleTextBlock = titleTextBlock;
        titleContentRectangle.titleRectangle = titleRectangle;
        titleContentRectangle.contentRectangle = contentRectangle;
        titleContentRectangle.addControl(titleRectangle);
        titleContentRectangle.addControl(contentRectangle);

        return titleContentRectangle;
    }

    static CreateColorTitleContentRectangle(name, widthInPixels, heightInPixels, setColorCallback) {
        const colorTitleContentRectangle = DTDWebUIManager.CreateTitleContentRectangle(name, widthInPixels, heightInPixels);
        colorTitleContentRectangle.titleTextBlock.text = '색상';

        const colorRectangleSize = 20;
        const colorRectangleColumnCount = 7;
        const colorRectangleSpacing = 5;

        const colorRectangles = [];

        let colorRectangleX = 0;
        let colorRectangleY = 0;
        let totalWidth = 0;
        let totalHeight = 0;
        for (let colorIndex = 1; colorIndex <= 10; colorIndex++) {
            const colorRectangle = new BABYLON.GUI.Rectangle(`${name}_${colorIndex}_ColorRectangle`);
            colorRectangle.leftInPixels = colorRectangleX;
            colorRectangle.topInPixels = colorRectangleY;
            colorRectangle.widthInPixels = colorRectangleSize;
            colorRectangle.heightInPixels = colorRectangleSize;
            colorRectangle.thickness = 0;
            colorRectangle.color = '#3886BB';
            colorRectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            colorRectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

            let color = '';
            switch (colorIndex) {
                case 1:
                    color = '#FF0000';
                    break;
                case 2:
                    color = '#FF6600';
                    break;
                case 3:
                    color = '#FFFF00';
                    break;
                case 4:
                    color = '#BBFF1B';
                    break;
                case 5:
                    color = '#008000';
                    break;
                case 6:
                    color = '#00B1EF';
                    break;
                case 7:
                    color = '#002060';
                    break;
                case 8:
                    color = '#71309E';
                    break;
                case 9:
                    color = '#000000';
                    break;
                case 10:
                    color = '#FFFFFF';
                    break;
            }

            colorRectangle.background = color;

            if (colorIndex === colorRectangleColumnCount) {
                totalWidth = colorRectangleX + colorRectangleSize;

                colorRectangleX = 0;
                colorRectangleY = colorRectangleSize + colorRectangleSpacing;

                totalHeight = colorRectangleY + colorRectangleSize;
            }
            else {
                colorRectangleX += colorRectangleSize + colorRectangleSpacing;
            }
            colorRectangle.onPointerClickObservable.add(() => {
                if (setColorCallback) {
                    setColorCallback(color);
                }

                for (const _colorRectangle of colorRectangles) {
                    _colorRectangle.thickness = 0;
                }
                colorRectangle.thickness = 2;
            });

            colorRectangles.push(colorRectangle);
        }

        const colorsRectangle = new BABYLON.GUI.Rectangle(`${name}_ColorsRectangle`);
        colorsRectangle.widthInPixels = totalWidth;
        colorsRectangle.heightInPixels = totalHeight;
        colorsRectangle.thickness = 0;
        colorsRectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        colorsRectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        for (const colorRectangle of colorRectangles) {
            colorsRectangle.addControl(colorRectangle);
        }

        colorTitleContentRectangle.contentRectangle.addControl(colorsRectangle);

        return colorTitleContentRectangle;
    }
}

export { DTDWebUIManager };