import { DTDWeb } from '../dtdweb.js';

class DTDWebOnScreenKeyHelper {
    constructor(uiManager, dtdWeb) {
        this._uiManager = uiManager;

        this._DTDWeb = dtdWeb;
        this._scene = dtdWeb.scene;

        this._isArrowLeft = true;

        this._onScreenKeyButtonDictionary = {};
        this._onScreenKeyHelperGrid = undefined;
        this._onScreenKeyHelperGridBackgroundRectangle = undefined;
        this._arrowButton = undefined;
    }

    get onScreenKeyButtonDictionary() {
        return this._onScreenKeyButtonDictionary;
    }

    initialize() {
        const keypadShiftButton = this.createOnScreenKeyButton('Shift');
        const keypadQButton = this.createOnScreenKeyButton('Q');
        const keypadEButton = this.createOnScreenKeyButton('E');
        const keypadWButton = this.createOnScreenKeyButton('W');
        const keypadAButton = this.createOnScreenKeyButton('A');
        const keypadSButton = this.createOnScreenKeyButton('S');
        const keypadDButton = this.createOnScreenKeyButton('D');

        this._onScreenKeyButtonDictionary[keypadShiftButton.keyCode] = keypadShiftButton;
        this._onScreenKeyButtonDictionary[keypadQButton.keyCode] = keypadQButton;
        this._onScreenKeyButtonDictionary[keypadEButton.keyCode] = keypadEButton;
        this._onScreenKeyButtonDictionary[keypadWButton.keyCode] = keypadWButton;
        this._onScreenKeyButtonDictionary[keypadAButton.keyCode] = keypadAButton;
        this._onScreenKeyButtonDictionary[keypadSButton.keyCode] = keypadSButton;
        this._onScreenKeyButtonDictionary[keypadDButton.keyCode] = keypadDButton;

        this._onScreenKeyHelperGrid = new BABYLON.GUI.Grid('OnScreenKeyHelperGrid');
        this._onScreenKeyHelperGrid.leftInPixels = 0;
        this._onScreenKeyHelperGrid.topInPixels = 0;
        this._onScreenKeyHelperGrid.widthInPixels = 258;
        this._onScreenKeyHelperGrid.heightInPixels = 104;
        this._onScreenKeyHelperGrid.background = 'transparent';
        this._onScreenKeyHelperGrid.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._onScreenKeyHelperGrid.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this._onScreenKeyHelperGrid.addColumnDefinition(10, true);
        this._onScreenKeyHelperGrid.addColumnDefinition(85, true);
        this._onScreenKeyHelperGrid.addColumnDefinition(51, true);
        this._onScreenKeyHelperGrid.addColumnDefinition(51, true);
        this._onScreenKeyHelperGrid.addColumnDefinition(51, true);
        this._onScreenKeyHelperGrid.addColumnDefinition(20, true);
        this._onScreenKeyHelperGrid.addColumnDefinition(10, true);
        this._onScreenKeyHelperGrid.addRowDefinition(5, true);
        this._onScreenKeyHelperGrid.addRowDefinition(47, true);
        this._onScreenKeyHelperGrid.addRowDefinition(47, true);
        this._onScreenKeyHelperGrid.addRowDefinition(5, true);
        this._onScreenKeyHelperGrid.addControl(keypadShiftButton, 2, 1);
        this._onScreenKeyHelperGrid.addControl(keypadQButton, 1, 2);
        this._onScreenKeyHelperGrid.addControl(keypadEButton, 1, 4);
        this._onScreenKeyHelperGrid.addControl(keypadWButton, 1, 3);
        this._onScreenKeyHelperGrid.addControl(keypadAButton, 2, 2);
        this._onScreenKeyHelperGrid.addControl(keypadSButton, 2, 3);
        this._onScreenKeyHelperGrid.addControl(keypadDButton, 2, 4);

        // 버튼 알파 문제로 뒷 배경 Rectangle 생성
        this._onScreenKeyHelperGridBackgroundRectangle = new BABYLON.GUI.Rectangle('OnScreenKeyHelperGridBackgroundRectangle');
        this._onScreenKeyHelperGridBackgroundRectangle.leftInPixels = this._onScreenKeyHelperGrid.leftInPixels;
        this._onScreenKeyHelperGridBackgroundRectangle.topInPixels = this._onScreenKeyHelperGrid.topInPixels;
        this._onScreenKeyHelperGridBackgroundRectangle.widthInPixels = 278;
        this._onScreenKeyHelperGridBackgroundRectangle.heightInPixels = this._onScreenKeyHelperGrid.heightInPixels;
        this._onScreenKeyHelperGridBackgroundRectangle.background = 'black';
        this._onScreenKeyHelperGridBackgroundRectangle.alpha = 100 / 255;
        this._onScreenKeyHelperGridBackgroundRectangle.thickness = 0;
        this._onScreenKeyHelperGridBackgroundRectangle.horizontalAlignment = this._onScreenKeyHelperGrid.horizontalAlignment;
        this._onScreenKeyHelperGridBackgroundRectangle.verticalAlignment = this._onScreenKeyHelperGrid.verticalAlignment;

        this._isArrowLeft = true;

        this._arrowButton = BABYLON.GUI.Button.CreateImageOnlyButton('OnScreenKeyArrowButton', `${DTDPlayer.IMAGE_DIRECTORY}/arrow_left.png`);
        this._arrowButton.leftInPixels = this._onScreenKeyHelperGrid.widthInPixels;
        this._arrowButton.topInPixels = -43;
        this._arrowButton.widthInPixels = 20;
        this._arrowButton.heightInPixels = 20;
        this._arrowButton.thickness = 0;
        this._arrowButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._arrowButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        
        this._arrowButton.onPointerClickObservable.add(() => {
            this.onClickArrowButton(!this._isArrowLeft);
        });

        this._uiManager.addGUIControl(this._onScreenKeyHelperGridBackgroundRectangle);
        this._uiManager.addGUIControl(this._arrowButton);
        this._uiManager.addGUIControl(this._onScreenKeyHelperGrid);
    }

    onClickArrowButton(isVisible) {
        this._isArrowLeft = isVisible;

        if (isVisible) {
            this._arrowButton.image.source = `${DTDPlayer.IMAGE_DIRECTORY}/arrow_left.png`;
            this._arrowButton.leftInPixels = this._DTDWeb.uiManager.divideDevicePixelRatio(this._onScreenKeyHelperGrid.widthInPixels);
            this._onScreenKeyHelperGridBackgroundRectangle.widthInPixels = 278;

            this._uiManager.addGUIControl(this._onScreenKeyHelperGrid);
        }
        else {
            this._arrowButton.image.source = `${DTDPlayer.IMAGE_DIRECTORY}/arrow_right.png`;
            this._arrowButton.leftInPixels = 0;
            this._onScreenKeyHelperGridBackgroundRectangle.widthInPixels = this._DTDWeb.uiManager.divideDevicePixelRatio(this._arrowButton.widthInPixels);

            this._uiManager.removeGUIControl(this._onScreenKeyHelperGrid);
        }
    }

    createOnScreenKeyButton(key) {
        const objectName = `Keypad${key}$Button`;
        const lowerCaseKey = key.toLowerCase();
        const imagePath = `${DTDPlayer.IMAGE_DIRECTORY}/keypad_${lowerCaseKey}.png`;
        let onBeforeRenderObservable = undefined;

        let keyCode = -1;
        switch (key) {
            case 'Shift':
                keyCode = 16;
                break;
            case 'Q':
                keyCode = 81;
                break;
            case 'E':
                keyCode = 69;
                break;
            case 'W':
                keyCode = 87;
                break;
            case 'A':
                keyCode = 65;
                break;
            case 'S':
                keyCode = 83;
                break;
            case 'D':
                keyCode = 68;
                break;
        }

        const onScreenKeyButton = BABYLON.GUI.Button.CreateImageOnlyButton(objectName, imagePath);
        onScreenKeyButton.widthInPixels = key === 'Shift' ? 80 : 46;
        onScreenKeyButton.heightInPixels = 42;
        onScreenKeyButton.thickness = 0;
        onScreenKeyButton.key = lowerCaseKey;
        onScreenKeyButton.keyCode = keyCode;
        onScreenKeyButton.isPressed = false;
        onScreenKeyButton.onPointerDownObservable.add(() => {
            onBeforeRenderObservable = this._scene.onBeforeRenderObservable.add(() => {
                this._DTDWeb.inputController.keyDownFromUIButton(onScreenKeyButton.keyCode, true);
            });
        });
        onScreenKeyButton.onPointerUpObservable.add(() => {
            this._DTDWeb.inputController.keyDownFromUIButton(onScreenKeyButton.keyCode, false);

            if (onBeforeRenderObservable) {
                this._scene.onBeforeRenderObservable.remove(onBeforeRenderObservable);
            }
        });

        return onScreenKeyButton;
    }

    setCameraMode(cameraMode) {
        switch (cameraMode) {
            case DTDWeb.Camera.CAMERA_MODE.FLY_MODE:
                this._onScreenKeyButtonDictionary[81].key = 'q';
                this._onScreenKeyButtonDictionary[81].image.source = `${DTDPlayer.IMAGE_DIRECTORY}/keypad_q.png`;
                this._onScreenKeyButtonDictionary[69].key = 'e';
                this._onScreenKeyButtonDictionary[69].image.source = `${DTDPlayer.IMAGE_DIRECTORY}/keypad_e.png`;
                break;
            case DTDWeb.Camera.CAMERA_MODE.WALK_MODE:
                this._onScreenKeyButtonDictionary[81].key = 'q_rotate';
                this._onScreenKeyButtonDictionary[81].image.source = `${DTDPlayer.IMAGE_DIRECTORY}/keypad_q_rotate.png`;
                this._onScreenKeyButtonDictionary[69].key = 'e_rotate';
                this._onScreenKeyButtonDictionary[69].image.source = `${DTDPlayer.IMAGE_DIRECTORY}/keypad_e_rotate.png`;
                break;
        }
    }

    setOnScreenKeyButtonStatus(keyCode, isPressed) {
        if (keyCode === 32) {
            return;
        }

        const onScreenKeyButton = this._onScreenKeyButtonDictionary[keyCode];
        if (onScreenKeyButton.isPressed === isPressed) {
            return;
        }

        const key = onScreenKeyButton.key;
        const fileName = isPressed ? `keypad_${key}_on.png` : `keypad_${key}.png`;
        onScreenKeyButton.image.source = `${DTDPlayer.IMAGE_DIRECTORY}/${fileName}`;
        onScreenKeyButton.isPressed = isPressed;
    }
}

export { DTDWebOnScreenKeyHelper };