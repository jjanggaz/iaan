import { DTDWeb } from '../dtdweb.js';

class DTDWebOnScreenNavigate {
    constructor(uiManager, dtdWeb) {
        this._uiManager = uiManager;

        this._DTDWeb = dtdWeb;
        this._engine = dtdWeb.engine;

        this._onScreenNavigateStackPanel = undefined;
        this._cameraModeTextBlock = undefined;

        this._walkModeUIStackPanel = undefined;
        this._walkModeUIStackPanelBackgroundRectangle = undefined;
        this._selectFloorCheckboxButton = undefined;
        this._showAvatarCheckboxButton = undefined;
        this._mouseRotationCheckboxButton = undefined;
    }

    get isSelectableFloor() {
        return this._selectFloorCheckboxButton.isChecked;
    }

    initialize() {
        const devicePixelRatio = this._uiManager.devicePixelRatio;

        const cameraModeBackgroundRectangle = new BABYLON.GUI.Rectangle('CaneraModeBackgroundRectangle');
        cameraModeBackgroundRectangle.width = '50px';
        cameraModeBackgroundRectangle.height = '28px';
        cameraModeBackgroundRectangle.background = 'black';
        cameraModeBackgroundRectangle.alpha = 100 / 255;
        cameraModeBackgroundRectangle.cornerRadius = 5 * devicePixelRatio * devicePixelRatio;
        cameraModeBackgroundRectangle.thickness = 0;

        this._cameraModeTextBlock = new BABYLON.GUI.TextBlock('CameraModeTextBlock', DTDWeb.UI.UI_TEXT.FLY_MODE);
        this._cameraModeTextBlock.background = 'transparent';
        this._cameraModeTextBlock.color = 'white';
        this._cameraModeTextBlock.fontFamily = DTDWeb.GLOBAL_FONT_FAMILY;
        this._cameraModeTextBlock.fontSize = 10;

        const cameraModeButton = new BABYLON.GUI.Button('CameraModeButton');
        cameraModeButton.width = '50px';
        cameraModeButton.height = '28px';
        cameraModeButton.background = 'transparent';
        cameraModeButton.thickness = 0;
        cameraModeButton.addControl(cameraModeBackgroundRectangle);
        cameraModeButton.addControl(this._cameraModeTextBlock);
        cameraModeButton.onPointerClickObservable.add(() => {
            this._DTDWeb.cameraController.toggleCameraMode();
        });
        const cameraModeButtonRectangle = this.createRectangleWithPadding(cameraModeButton, 50, 28, 5);

        // Camera Top Button
        const cameraTopButton = this.createCameraDirectionButton('CameraTopButton', DTDWeb.UI.UI_TEXT.UP);
        cameraTopButton.onPointerClickObservable.add(() => {
            this._DTDWeb.cameraController.moveCameraFromDirection(DTDWeb.Camera.CAMERA_DIRECTION.UP);
        });
        const cameraTopButtonRectangle = this.createRectangleWithPadding(cameraTopButton, 28, 28, 5);

        // Camera Front Button
        const cameraFrontButton = this.createCameraDirectionButton('CameraFrontButton', DTDWeb.UI.UI_TEXT.FRONT);
        cameraFrontButton.onPointerClickObservable.add(() => {
            this._DTDWeb.cameraController.moveCameraFromDirection(DTDWeb.Camera.CAMERA_DIRECTION.FRONT);
        });
        const cameraFrontButtonRectangle = this.createRectangleWithPadding(cameraFrontButton, 28, 28, 5);

        // Camera Back Button
        const cameraBackButton = this.createCameraDirectionButton('CameraBackButton', DTDWeb.UI.UI_TEXT.BACK);
        cameraBackButton.onPointerClickObservable.add(() => {
            this._DTDWeb.cameraController.moveCameraFromDirection(DTDWeb.Camera.CAMERA_DIRECTION.BACK);
        });
        const cameraBackButtonRectangle = this.createRectangleWithPadding(cameraBackButton, 28, 28, 5);

        // Camera Left Button
        const cameraLeftButton = this.createCameraDirectionButton('CameraLeftButton', DTDWeb.UI.UI_TEXT.LEFT);
        cameraLeftButton.onPointerClickObservable.add(() => {
            this._DTDWeb.cameraController.moveCameraFromDirection(DTDWeb.Camera.CAMERA_DIRECTION.LEFT);
        });
        const cameraLeftButtonRectangle = this.createRectangleWithPadding(cameraLeftButton, 28, 28, 5);

        // Camera Right Button
        const cameraRightButton = this.createCameraDirectionButton('CameraRightButton', DTDWeb.UI.UI_TEXT.RIGHT);
        cameraRightButton.onPointerClickObservable.add(() => {
            this._DTDWeb.cameraController.moveCameraFromDirection(DTDWeb.Camera.CAMERA_DIRECTION.RIGHT);
        });
        const cameraRightButtonRectangle = this.createRectangleWithPadding(cameraRightButton, 28, 28, 5);

        const cameraHomeBackgroundCircleRectangle = new BABYLON.GUI.Rectangle('CameraHomeBackgroundCircleRectangle');
        cameraHomeBackgroundCircleRectangle.width = '28px';
        cameraHomeBackgroundCircleRectangle.height = '28px';
        cameraHomeBackgroundCircleRectangle.background = 'black';
        cameraHomeBackgroundCircleRectangle.alpha = 100 / 255;
        cameraHomeBackgroundCircleRectangle.cornerRadius = 100 * devicePixelRatio * devicePixelRatio;
        cameraHomeBackgroundCircleRectangle.thickness = 0;

        const cameraHomeImage = new BABYLON.GUI.Image('CameraHomeImage', `${DTDPlayer.IMAGE_DIRECTORY}/home.png`);
        cameraHomeImage.width = '14px';
        cameraHomeImage.height = '14px';
        cameraHomeImage.thickness = 0;

        const cameraHomeButton = new BABYLON.GUI.Button('CameraHomeButton');
        cameraHomeButton.width = '28px';
        cameraHomeButton.height = '28px';
        cameraHomeButton.background = 'transparent';
        cameraHomeButton.thickness = 0;
        cameraHomeButton.addControl(cameraHomeBackgroundCircleRectangle);
        cameraHomeButton.addControl(cameraHomeImage);
        cameraHomeButton.onPointerClickObservable.add(() => {
            // KEPCO E&C Custom START
            // if (this._DTDWeb.kepcoEncController.hasRootValve()) {
            //     this._DTDWeb.kepcoEncController.moveCameraToRootValvePosition(this._DTDWeb.kepcoEncController.getDefaultRootValveTags());
            //     return;
            // }
            // KEPCO E&C Custom END

            this._DTDWeb.cameraController.moveCameraFromDirection(DTDWeb.Camera.CAMERA_DIRECTION.HOME);
        });
        const cameraHomeButtonRectangle = this.createRectangleWithPadding(cameraHomeButton, 28, 28, 5);

        const fullscreenBackgroundCircleRectangle = new BABYLON.GUI.Rectangle('FullscreenBackgroundCircleRectangle');
        fullscreenBackgroundCircleRectangle.width = '28px';
        fullscreenBackgroundCircleRectangle.height = '28px';
        fullscreenBackgroundCircleRectangle.background = 'black';
        fullscreenBackgroundCircleRectangle.alpha = 100 / 255;
        fullscreenBackgroundCircleRectangle.cornerRadius = 100 * devicePixelRatio * devicePixelRatio;
        fullscreenBackgroundCircleRectangle.thickness = 0;

        const fullscreenImage = new BABYLON.GUI.Image('FullscreenImage', `${DTDPlayer.IMAGE_DIRECTORY}/fullscreen_on.png`);
        fullscreenImage.width = '14px';
        fullscreenImage.height = '14px';
        fullscreenImage.thickness = 0;

        const fullscreenButton = new BABYLON.GUI.Button('FullscreenButton');
        fullscreenButton.width = '28px';
        fullscreenButton.height = '28px';
        fullscreenButton.background = 'transparent';
        fullscreenButton.thickness = 0;
        fullscreenButton.addControl(fullscreenBackgroundCircleRectangle);
        fullscreenButton.addControl(fullscreenImage);
        fullscreenButton.onPointerClickObservable.add(() => {
            if (this._engine.isFullscreen) {
                this._engine.exitFullscreen();
            }
            else {
                this._engine.enterFullscreen();
            }
        });
        const fullscreenButtonRectangle = this.createRectangleWithPadding(fullscreenButton, 28, 28, 5);

        document.addEventListener('fullscreenchange', () => {
            fullscreenImage.source = this._engine.isFullscreen ? `${DTDPlayer.IMAGE_DIRECTORY}/fullscreen_off.png` : `${DTDPlayer.IMAGE_DIRECTORY}/fullscreen_on.png`;
        });

        this._onScreenNavigateStackPanel = new BABYLON.GUI.StackPanel('OnScreenNavigateStackPanel');
        this._onScreenNavigateStackPanel.left = '-10px';
        this._onScreenNavigateStackPanel.top = '10px';
        this._onScreenNavigateStackPanel.widthInPixels = 330;
        this._onScreenNavigateStackPanel.heightInPixels = 38;
        this._onScreenNavigateStackPanel.background = 'transparent';
        this._onScreenNavigateStackPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this._onScreenNavigateStackPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this._onScreenNavigateStackPanel.isVisible = true;
        this._onScreenNavigateStackPanel.isVertical = false;
        this._onScreenNavigateStackPanel.addControl(cameraModeButtonRectangle);
        this._onScreenNavigateStackPanel.addControl(this.createCameraSplitRectangle('EmptyCameraSplitImage', false));
        this._onScreenNavigateStackPanel.addControl(cameraTopButtonRectangle);
        this._onScreenNavigateStackPanel.addControl(this.createCameraSplitRectangle('FirstCameraSplitImage', true));
        this._onScreenNavigateStackPanel.addControl(cameraFrontButtonRectangle);
        this._onScreenNavigateStackPanel.addControl(cameraBackButtonRectangle);
        this._onScreenNavigateStackPanel.addControl(cameraLeftButtonRectangle);
        this._onScreenNavigateStackPanel.addControl(cameraRightButtonRectangle);
        this._onScreenNavigateStackPanel.addControl(this.createCameraSplitRectangle('SecondCameraSplitImage', true));
        this._onScreenNavigateStackPanel.addControl(cameraHomeButtonRectangle);
        this._onScreenNavigateStackPanel.addControl(fullscreenButtonRectangle);

        this._uiManager.addGUIControl(this._onScreenNavigateStackPanel);

        this.initializeWalkModeUI();
    }

    createCameraSplitRectangle(objectName, isVisible) {
        const cameraSplitImage = new BABYLON.GUI.Image(objectName, isVisible ? `${DTDPlayer.IMAGE_DIRECTORY}/divider.png` : '');
        cameraSplitImage.width = '1px';
        cameraSplitImage.height = '28px';
        cameraSplitImage.background = 'transparent';
        cameraSplitImage.thickness = 0;

        return this.createRectangleWithPadding(cameraSplitImage, 10, 28, 5);
    }

    createCameraDirectionButton(objectName, text) {
        const backgroundCircleRectangle = new BABYLON.GUI.Rectangle(objectName + '_Rectangle');
        backgroundCircleRectangle.width = '28px';
        backgroundCircleRectangle.height = '28px';
        backgroundCircleRectangle.background = 'black';
        backgroundCircleRectangle.alpha = 100 / 255;
        backgroundCircleRectangle.cornerRadius = 100 * devicePixelRatio * devicePixelRatio;
        backgroundCircleRectangle.thickness = 0;

        const textBlock = new BABYLON.GUI.TextBlock(objectName + '_TextBlock', text);
        textBlock.background = 'transparent';
        textBlock.color = 'white';
        textBlock.fontFamily = DTDWeb.GLOBAL_FONT_FAMILY;
        textBlock.fontSize = 10;

        const cameraDirectionButton = new BABYLON.GUI.Button(objectName);
        cameraDirectionButton.width = '28px';
        cameraDirectionButton.height = '28px';
        cameraDirectionButton.background = 'transparent';
        cameraDirectionButton.thickness = 0;
        cameraDirectionButton.addControl(backgroundCircleRectangle);
        cameraDirectionButton.addControl(textBlock);

        return cameraDirectionButton;
    }

    createRectangleWithPadding(toRectangleUI, width, height, padding) {
        const cameraControlButtonRectangle = new BABYLON.GUI.Rectangle(toRectangleUI.name + '_Rectangle');
        cameraControlButtonRectangle.width = width + padding + 'px';
        cameraControlButtonRectangle.height = height + padding + 'px';
        cameraControlButtonRectangle.background = 'transparent';
        cameraControlButtonRectangle.thickness = 0;
        cameraControlButtonRectangle.addControl(toRectangleUI);

        return cameraControlButtonRectangle;
    }

    initializeWalkModeUI() {
        this._selectFloorCheckboxButton = this.createWalkModeUICheckboxButton('SelectFloorCheckbox', true);
        const selectFloorTextBlock = this.createWalkModeUITextBlock('SelectFloorTextBlock', DTDWeb.UI.UI_TEXT.SELECT_FLOOR);
        const selectFloorRectangle = this.createWalkModeUIRectangle('SelectFloorRectangle', this._selectFloorCheckboxButton, selectFloorTextBlock);

        this._showAvatarCheckboxButton = this.createWalkModeUICheckboxButton('ShowAvatarCheckbox', false);
        this._showAvatarCheckboxButton.onPointerClickObservable.add(() => {
            const isChecked = this._showAvatarCheckboxButton.isChecked;
            if (isChecked) {
                this._DTDWeb.walkModeViewController.createCharacter();
            }
            else {
                this._DTDWeb.walkModeViewController.releaseCharacter();
            }
        });
        const showAvatarTextBlock = this.createWalkModeUITextBlock('ShowAvatarTextBlock', DTDWeb.UI.UI_TEXT.SHOW_AVATAR);
        const showAvatarRectangle = this.createWalkModeUIRectangle('ShowAvatarRectangle', this._showAvatarCheckboxButton, showAvatarTextBlock);

        this._mouseRotationCheckboxButton = this.createWalkModeUICheckboxButton('MouseRotationCheckbox', false);
        this._mouseRotationCheckboxButton.disabledColor = 'transparent';
        this._mouseRotationCheckboxButton.onPointerClickObservable.add(() => {
            const isChecked = this._mouseRotationCheckboxButton.isChecked;
            if (isChecked) {
                this._mouseRotationCheckboxButton.isEnabled = false;

                this._DTDWeb.inputController.setupPointerLock();
            }
        });
        const mouseRotationTextBlock = this.createWalkModeUITextBlock('MouseRotationTextBlock', DTDWeb.UI.UI_TEXT.MOUSE_ROTATION);
        const mouseRotationRectangle = this.createWalkModeUIRectangle('MouseRotationRectangle', this._mouseRotationCheckboxButton, mouseRotationTextBlock);

        this._walkModeUIStackPanel = new BABYLON.GUI.StackPanel('WalkModeUIStackPanel');
        this._walkModeUIStackPanel.left = '-10px';
        this._walkModeUIStackPanel.top = '53px';
        this._walkModeUIStackPanel.widthInPixels = 330;
        this._walkModeUIStackPanel.heightInPixels = 30;
        this._walkModeUIStackPanel.background = 'transparent';
        this._walkModeUIStackPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this._walkModeUIStackPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this._walkModeUIStackPanel.isVisible = false;
        this._walkModeUIStackPanel.isVertical = false;
        this._walkModeUIStackPanel.addControl(selectFloorRectangle);
        // this.walkModeUIStackPanel.addControl(showAvatarRectangle);
        if (!this._DTDWeb.isTouchDevice) {
            this._walkModeUIStackPanel.addControl(mouseRotationRectangle);
        }

        this._walkModeUIStackPanelBackgroundRectangle = new BABYLON.GUI.Rectangle('WalkModeUIStackPanelBackgroundRectangle');
        this._walkModeUIStackPanelBackgroundRectangle.left = this._walkModeUIStackPanel.left;
        this._walkModeUIStackPanelBackgroundRectangle.top = this._walkModeUIStackPanel.top;
        this._walkModeUIStackPanelBackgroundRectangle.width = this._walkModeUIStackPanel.width;
        this._walkModeUIStackPanelBackgroundRectangle.height = this._walkModeUIStackPanel.height;
        this._walkModeUIStackPanelBackgroundRectangle.background = 'white';
        this._walkModeUIStackPanelBackgroundRectangle.alpha = 100 / 255;
        this._walkModeUIStackPanelBackgroundRectangle.thickness = 0;
        this._walkModeUIStackPanelBackgroundRectangle.isVisible = false;
        this._walkModeUIStackPanelBackgroundRectangle.horizontalAlignment = this._walkModeUIStackPanel.horizontalAlignment;
        this._walkModeUIStackPanelBackgroundRectangle.verticalAlignment = this._walkModeUIStackPanel.verticalAlignment;

        this._uiManager.addGUIControl(this._walkModeUIStackPanelBackgroundRectangle);
        this._uiManager.addGUIControl(this._walkModeUIStackPanel);
    }

    createWalkModeUICheckboxButton(objectName, isChecked) {
        const imageFilePath = isChecked ? `${DTDPlayer.IMAGE_DIRECTORY}/checkbox_on.png` : `${DTDPlayer.IMAGE_DIRECTORY}/checkbox_off.png`;
        const walkModeUICheckboxButton = BABYLON.GUI.Button.CreateImageOnlyButton(objectName, imageFilePath);
        walkModeUICheckboxButton.left = '5px';
        walkModeUICheckboxButton.width = '20px';
        walkModeUICheckboxButton.height = '20px';
        walkModeUICheckboxButton.color = 'white';
        walkModeUICheckboxButton.background = 'transparent';
        walkModeUICheckboxButton.thickness = 0;
        walkModeUICheckboxButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        walkModeUICheckboxButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        walkModeUICheckboxButton.isChecked = isChecked;
        walkModeUICheckboxButton.onPointerClickObservable.add(() => {
            walkModeUICheckboxButton.isChecked = !walkModeUICheckboxButton.isChecked;
            walkModeUICheckboxButton.image.source = walkModeUICheckboxButton.isChecked ? `${DTDPlayer.IMAGE_DIRECTORY}/checkbox_on.png` : `${DTDPlayer.IMAGE_DIRECTORY}/checkbox_off.png`;
        });

        return walkModeUICheckboxButton;
    }

    createWalkModeUITextBlock(objectName, text) {
        const walkModeUITextBlock = new BABYLON.GUI.TextBlock(objectName, text);
        walkModeUITextBlock.left = '10px';
        walkModeUITextBlock.background = 'transparent';
        walkModeUITextBlock.color = 'white';
        walkModeUITextBlock.fontFamily = DTDWeb.GLOBAL_FONT_FAMILY;
        walkModeUITextBlock.fontSize = 10;
        walkModeUITextBlock.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        walkModeUITextBlock.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

        return walkModeUITextBlock;
    }

    createWalkModeUIRectangle(objectName, walkModeUICheckbox, walkModeUITextBlock) {
        const walkModeUIRectangle = new BABYLON.GUI.Rectangle(objectName);
        walkModeUIRectangle.width = '100px';
        walkModeUIRectangle.height = '20px';
        walkModeUIRectangle.background = 'transparent';
        walkModeUIRectangle.thickness = 0;
        walkModeUIRectangle.addControl(walkModeUITextBlock);
        walkModeUIRectangle.addControl(walkModeUICheckbox);

        return walkModeUIRectangle;
    }

    setCameraMode(cameraMode) {
        switch (cameraMode) {
            case DTDWeb.Camera.CAMERA_MODE.FLY_MODE:
                this._cameraModeTextBlock.text = DTDWeb.UI.UI_TEXT.FLY_MODE;
                this._walkModeUIStackPanel.isVisible = false;
                this._walkModeUIStackPanelBackgroundRectangle.isVisible = false;
                break;
            case DTDWeb.Camera.CAMERA_MODE.WALK_MODE:
                this._cameraModeTextBlock.text = DTDWeb.UI.UI_TEXT.WALK_MODE;
                this._walkModeUIStackPanel.isVisible = true;
                this._walkModeUIStackPanelBackgroundRectangle.isVisible = true;
                break;
        }
    }

    uncheckMouseRotationCheckboxButton() {
        this._mouseRotationCheckboxButton.isEnabled = true;
        this._mouseRotationCheckboxButton.isChecked = false;
        this._mouseRotationCheckboxButton.image.source = `${DTDPlayer.IMAGE_DIRECTORY}/checkbox_off.png`;
    }

    setRightPanelVisible(isVisible) {
        this._onScreenNavigateStackPanel.left = isVisible ? '-280px' : '-10px';
        this._walkModeUIStackPanel.left = isVisible ? '-280px' : '-10px';
        this._walkModeUIStackPanelBackgroundRectangle.left = isVisible ? '-280px' : '-10px';
    }
}

export { DTDWebOnScreenNavigate };