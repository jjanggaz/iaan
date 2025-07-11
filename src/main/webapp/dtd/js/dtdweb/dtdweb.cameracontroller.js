import { ArcRotateCameraKeyboardWalkInput } from './dtdweb.inputcontroller.js';

import { DTDWeb } from './dtdweb.js';

class DTDWebCameraController {
    constructor(dtdWeb) {
        this._DTDWeb = dtdWeb;
        this._engine = dtdWeb.engine;
        this._scene = dtdWeb.scene;
        this._renderCanvas = dtdWeb.renderCanvas;

        this._isAttachControl = false;

        this.initializeMainCamera();
        this.initializeLight();

        this._currentCameraMode = DTDWeb.Camera.CAMERA_MODE.FLY_MODE;

        this._pivotTransformNode = undefined;

        this._lastThirdPersonModeCameraAlpha = 0;

        this._isMainCameraAnimating = false;
        this._mainCameraAnimation = undefined;

        this._mainCameraMatrix = new BABYLON.Matrix();
        this._mainCameraDisplacement = BABYLON.Vector3.Zero();

        this._effectXrayCoveredCameraMeshesObservable = undefined;
        this._coveredCameraInfoDictionary = {};
        this._exceptCoveredCameraMeshDictionary = {};
    }

    get mainCamera() {
        return this._mainCamera;
    }

    get cameraMode() {
        return this._currentCameraMode;
    }

    set cameraMode(cameraMode) {
        this._currentCameraMode = cameraMode;

        this._DTDWeb.uiManager.setCameraModeUI(cameraMode);

        switch (this._currentCameraMode) {
            case DTDWeb.Camera.CAMERA_MODE.FLY_MODE:
                this._DTDWeb.walkModeViewController.releaseFirstPerson();
                break;
        }
    }

    get isAttachControl() {
        return this._isAttachControl;
    }

    get isMainCameraAnimating() {
        return this._isMainCameraAnimating;
    }

    // THIRD_PERSON_MODE 재시작을 위해 알파를 ThirdPersonController로 전달하며 저장
    get cameraAlphaForThirdPersonMode() {
        this._lastThirdPersonModeCameraAlpha = this._mainCamera.alpha;

        return this._mainCamera.alpha;
    }

    initializeMainCamera() {
        this._mainCamera = new BABYLON.ArcRotateCamera('MainCamera', 0, 0, 0, BABYLON.Vector3.Zero(), this._scene);
        this._mainCamera.mode = BABYLON.Camera.PERSPECTIVE_CAMERA;
        this._mainCamera.minZ = DTDWeb.Camera.NEAR_CLIP_PLANE;
        this._mainCamera.maxZ = DTDWeb.Camera.FAR_CLIP_PLANE;
        this._mainCamera.fov = DTDWeb.Camera.FOV;
        this._mainCamera.layerMask = 0x0FFFFFFF;

        this.attachControl();

        this._mainCamera.inertia = 0;
        this._mainCamera.panningInertia = 0;
        this._mainCamera.panningAxis = BABYLON.Vector3.Zero();
        this._mainCamera.angularSensibilityX = DTDWeb.Camera.ANGULAR_SENSIBILITY_X; // Rotate X Sensibility
        this._mainCamera.angularSensibilityY = DTDWeb.Camera.ANGULAR_SENSIBILITY_Y; // Rotate Y Sensibility
        this._mainCamera.lowerBetaLimit = -Infinity;
        this._mainCamera.upperBetaLimit = Infinity;
        this._mainCamera.zoomToMouseLocation = true;
        this._mainCamera.wheelPrecision = DTDWeb.Camera.WHEEL_PRECISION;
        this._mainCamera.wheelDeltaPercentage = DTDWeb.Camera.WHEEL_DELTA_PERCENTAGE;
        this._mainCamera.pinchDeltaPercentage = 0.007;
        this._mainCamera.inputs.removeByType('ArcRotateCameraKeyboardMoveInput');
        this._mainCamera.inputs.add(new ArcRotateCameraKeyboardWalkInput(this._DTDWeb));
        this._mainCamera.inputs.attached.mousewheel._updateHitPlane();

        this._mainCamera.cameraController = this;
    }

    initializeLight() {
        if (!this._hemisphericLight) {
            this._hemisphericLight = new BABYLON.HemisphericLight('HemisphericLight', new BABYLON.Vector3(0, -1, 0), this._scene);
        }

        if (!this._directionalLight) {
            this._directionalLight = new BABYLON.DirectionalLight('DirectionalLight', new BABYLON.Vector3(0, -1, 0), this._scene);
        }
    }

    toggleCameraMode() {
        if (!this._isAttachControl) {
            console.warn('카메라 작업 중.');
            return;
        }
        if (this._DTDWeb.functionMode === DTDPlayer.FunctionMode.PATH_TRACKING) {
            console.warn('패스 트래킹 모드에서는 카메라 애니메이션을 사용할 수 없음.');
            return;
        }

        this.cameraMode = this.cameraMode === DTDWeb.Camera.CAMERA_MODE.FLY_MODE ? DTDWeb.Camera.CAMERA_MODE.WALK_MODE : DTDWeb.Camera.CAMERA_MODE.FLY_MODE;

        if (this._currentCameraMode === DTDWeb.Camera.CAMERA_MODE.WALK_MODE) {
            this.moveCameraToWalkModePosition();
        }
    }

    // 카메라 로테이션 전 포인터 클릭 지점을 화면 이동 없이 타겟으로 잡음
    pivotCameraTargetOffset() {
        const relativePosition = this._pivotTransformNode.getPositionInCameraSpace(this._mainCamera);
        const previousCameraAlpha = this._mainCamera.alpha;
        const previousCameraBeta = this._mainCamera.beta;

        this.setCameraTarget(this._pivotTransformNode.position);
        this._mainCamera.targetScreenOffset.x = relativePosition.x;
        this._mainCamera.targetScreenOffset.y = relativePosition.y;
        this._mainCamera.alpha = previousCameraAlpha;
        this._mainCamera.beta = previousCameraBeta;
        this._mainCamera.radius = relativePosition.z;
    }

    // setCameraOffset에서 넣은 targetScreenOffset을 화면 이동 없이 리셋
    resetCameraTargetOffset() {
        if (this._mainCamera.targetScreenOffset.x === 0 && this._mainCamera.targetScreenOffset.y === 0) {
            return;
        }

        const relativePosition = this._pivotTransformNode.getPositionInCameraSpace(this._mainCamera);
        const localDirection = new BABYLON.Vector3(relativePosition.x, relativePosition.y, 0);
        const viewMatrix = this._mainCamera.getViewMatrix();
        const transformMatrix = this._mainCamera.getTransformationMatrix();
        const transformedDirection = BABYLON.Vector3.Zero();

        viewMatrix.invertToRef(transformMatrix);
        localDirection.multiplyInPlace(BABYLON.Vector3.One());
        BABYLON.Vector3.TransformNormalToRef(localDirection, transformMatrix, transformedDirection);

        this._mainCamera.targetScreenOffset.setAll(0);
        this._mainCamera.target.subtractInPlace(transformedDirection);
        this._mainCamera.radius = relativePosition.z;
    }

    resetCameraPosition() {
        if (this._pivotTransformNode === undefined) {
            this._pivotTransformNode = new BABYLON.TransformNode('TransformTargetMesh');
        }

        this.setPivotPosition(this._DTDWeb.modelManager.getRootBoundingCenter(), true);

        this.setCameraTarget(this._pivotTransformNode.position);
        this._mainCamera.alpha = BABYLON.Tools.ToRadians(315);
        this._mainCamera.beta = BABYLON.Tools.ToRadians(65);
        this._mainCamera.radius = this._DTDWeb.modelManager.getRootRadius() * 2;
    }

    moveCameraFromDirection(cameraDirection) {
        if (!this._isAttachControl) {
            console.warn('카메라 작업 중.');
            return;
        }
        if (this._DTDWeb.functionMode === DTDPlayer.FunctionMode.PATH_TRACKING) {
            console.warn('패스 트래킹 모드에서는 카메라 애니메이션을 사용할 수 없음.');
            return;
        }

        switch (cameraDirection) {
            case DTDWeb.Camera.CAMERA_DIRECTION.HOME:
            case DTDWeb.Camera.CAMERA_DIRECTION.UP:
                this.cameraMode = DTDWeb.Camera.CAMERA_MODE.FLY_MODE;
                break;
            case DTDWeb.Camera.CAMERA_DIRECTION.FRONT:
            case DTDWeb.Camera.CAMERA_DIRECTION.BACK:
            case DTDWeb.Camera.CAMERA_DIRECTION.LEFT:
            case DTDWeb.Camera.CAMERA_DIRECTION.RIGHT:
                this.cameraMode = DTDWeb.Camera.CAMERA_MODE.WALK_MODE;
                break;
        }

        this.setPivotPosition(this._DTDWeb.modelManager.getRootBoundingCenter(), true);

        this._mainCamera.animations = this._currentCameraMode === DTDWeb.Camera.CAMERA_MODE.FLY_MODE ?
            this.getFlyModeAnimations(cameraDirection) : this.getWalkModeAnimations(cameraDirection);

        this.onMainCameraAnimationStart();
        this._mainCameraAnimation = this._scene.beginAnimation(this._mainCamera, 0, DTDWeb.Camera.CAMERA_ANIMATION_FRAMERATE, false, DTDWeb.Camera.CAMERA_ANIMATION_SPEED_RATIO);
        this._mainCameraAnimation.onAnimationEnd = () => {
            this.onMainCameraAnimationEnd();

            if (this._currentCameraMode === DTDWeb.Camera.CAMERA_MODE.WALK_MODE) {
                this._DTDWeb.walkModeViewController.createFirstPersonFromCameraPosition();
            }
        };
    }

    moveCameraToWalkModePosition() {
        const cameraPositionY = this._DTDWeb.modelManager.getRootBoundingMinimumY();
        this._mainCamera.animations.push(this.animateCameraPositionY(cameraPositionY));
        this._mainCamera.animations.push(this.animateCameraBeta(BABYLON.Tools.ToRadians(90)));

        this.onMainCameraAnimationStart();
        this._mainCameraAnimation = this._scene.beginAnimation(this._mainCamera, 0, DTDWeb.Camera.CAMERA_ANIMATION_FRAMERATE, false, DTDWeb.Camera.CAMERA_ANIMATION_SPEED_RATIO);
        this._mainCameraAnimation.onAnimationEnd = () => {
            this.onMainCameraAnimationEnd();

            this._DTDWeb.walkModeViewController.createFirstPersonFromCameraPosition();
        };
    }

    moveCameraToPickedPoint(pickInfo) {
        if (!this._isAttachControl) {
            console.warn('카메라 작업 중.');
            return;
        }
        if (this._DTDWeb.functionMode === DTDPlayer.FunctionMode.PATH_TRACKING) {
            console.warn('패스 트래킹 모드에서는 카메라 애니메이션을 사용할 수 없음.');
            return;
        }

        const pickedMesh = pickInfo.pickedMesh;
        const pickedMeshSize = pickedMesh.getBoundingInfo().boundingBox.extendSizeWorld;

        const pickedPoint = pickInfo.pickedPoint;
        const normal = DTDWeb.Utility.GetLargestAxisVector(pickInfo.getNormal(true));

        const cameraPosition = pickedPoint.add(
            pickedMeshSize.multiply(normal)).add(normal.scale(DTDWeb.Camera.CAMERA_DIRECTION_DISTANCE_OFFSET * 2));

        let cameraAlpha = BABYLON.Tools.ToRadians(270);
        if (normal.x === -1) {
            cameraAlpha = BABYLON.Tools.ToRadians(180);
        }
        else if (normal.x === 1) {
            cameraAlpha = BABYLON.Tools.ToRadians(0);
        }
        else if (normal.z === -1) {
            cameraAlpha = BABYLON.Tools.ToRadians(270);
        }
        else if (normal.z === 1) {
            cameraAlpha = BABYLON.Tools.ToRadians(90);
        }
        else {
            const currentAlpha = DTDWeb.Utility.NormalizeAngle(this._mainCamera.alpha);
            cameraAlpha = currentAlpha - currentAlpha % BABYLON.Tools.ToRadians(90);
        }

        this._mainCamera.animations.push(this.animateCameraTarget(pickedPoint));
        this._mainCamera.animations.push(this.animateCameraPosition(cameraPosition));
        this._mainCamera.animations.push(this.animateCameraAlpha(cameraAlpha));
        this._mainCamera.animations.push(this.animateCameraBeta(0.5 * Math.PI));

        this._mainCameraAnimation = this._scene.beginAnimation(this._mainCamera, 0, DTDWeb.Camera.CAMERA_ANIMATION_FRAMERATE, false, DTDWeb.Camera.CAMERA_ANIMATION_SPEED_RATIO);
        this._mainCameraAnimation.onAnimationEnd = () => {
            this.onMainCameraAnimationEnd();
        };
    }

    moveCameraFromKeyboard(keyCode, isPressed) {
        const speed = this._DTDWeb.inputController.getKeyStatus('16') ? 0.1 : 0.05;
        const matrix = this._mainCameraMatrix;

        this._mainCamera.absoluteRotation.toRotationMatrix(matrix);

        if (isPressed) {
            switch (keyCode) {
                case 81: // Q
                    this._mainCameraDisplacement.set(matrix.m[4], matrix.m[5], matrix.m[6]);
                    break;
                case 69: // E
                    this._mainCameraDisplacement.set(-matrix.m[4], -matrix.m[5], -matrix.m[6]);
                    break;
                case 87: // W
                    this._mainCameraDisplacement.set(matrix.m[8], 0, matrix.m[10]);
                    break;
                case 65: // A
                    this._mainCameraDisplacement.set(-matrix.m[0], -matrix.m[1], -matrix.m[2]);
                    break;
                case 83: // S
                    this._mainCameraDisplacement.set(-matrix.m[8], 0, -matrix.m[10]);
                    break;
                case 68: // D
                    this._mainCameraDisplacement.set(matrix.m[0], matrix.m[1], matrix.m[2]);
                    break;
            }

            this._mainCameraDisplacement = this._mainCameraDisplacement.multiplyByFloats(speed, speed, speed);

            this._mainCamera.target.addInPlace(this._mainCameraDisplacement);
            this._mainCamera.position.addInPlace(this._mainCameraDisplacement);
        }

        this._mainCameraDisplacement.setAll(0);
    }

    moveCameraToMesh(mesh, cameraAlpha, cameraBeta, cameraRadius, callback) {
        this.cameraMode = DTDWeb.Camera.CAMERA_MODE.FLY_MODE;

        let meshPosition = mesh.getBoundingInfo().boundingBox.centerWorld;

        this.setPivotPosition(meshPosition, true);

        const meshSize = mesh.getBoundingInfo().boundingBox.extendSizeWorld.scale(2);
        cameraRadius = Math.max(meshSize.x, meshSize.y, meshSize.z) + cameraRadius;

        const cameraAnimations = [];
        cameraAnimations.push(this.animateCameraTarget(this._pivotTransformNode.position));
        cameraAnimations.push(this.animateCameraAlpha(cameraAlpha));
        cameraAnimations.push(this.animateCameraBeta(cameraBeta));
        cameraAnimations.push(this.animateCameraRadius(cameraRadius));

        this.onMainCameraAnimationStart();
        this._mainCamera.animations = cameraAnimations;
        this._mainCameraAnimation = this._scene.beginAnimation(this._mainCamera, 0, DTDWeb.Camera.CAMERA_ANIMATION_FRAMERATE, false, DTDWeb.Camera.CAMERA_ANIMATION_SPEED_RATIO);
        this._mainCameraAnimation.onAnimationEnd = () => {
            this.onMainCameraAnimationEnd();

            if (callback) {
                callback();
            }
        };
    }

    moveCameraFromJSON(cameraTarget, cameraPosition, cameraRotation, animateSpeed, callback) {
        const newCameraTarget = new BABYLON.Vector3(cameraTarget.x, cameraTarget.y, cameraTarget.z);
        const newCameraPosition = new BABYLON.Vector3(cameraPosition.x, cameraPosition.y, cameraPosition.z);
        const newCameraRotation = new BABYLON.Quaternion(cameraRotation.x, cameraRotation.y, cameraRotation.z, cameraRotation.w);
        const eulerAngles = newCameraRotation.toEulerAngles();
        eulerAngles.x = 0.5 * Math.PI - eulerAngles.x;
        eulerAngles.y = 1.5 * Math.PI - eulerAngles.y;

        const cameraAlpha = DTDWeb.Utility.NormalizeAngle(eulerAngles.y);
        const cameraBeta = DTDWeb.Utility.NormalizeAngle(eulerAngles.x);

        let totalFrame = DTDWeb.Camera.CAMERA_ANIMATION_FRAMERATE;
        if (animateSpeed !== undefined) {
            totalFrame *= animateSpeed;
        }

        const cameraAnimations = [];
        cameraAnimations.push(this.animateCameraTarget(newCameraTarget, 0, totalFrame));
        cameraAnimations.push(this.animateCameraPosition(newCameraPosition, 0, totalFrame));
        cameraAnimations.push(this.animateCameraAlpha(cameraAlpha, 0, totalFrame));
        cameraAnimations.push(this.animateCameraBeta(cameraBeta, 0, totalFrame));

        this.onMainCameraAnimationStart();
        this._mainCamera.animations = cameraAnimations;
        this._mainCameraAnimation = this._scene.beginAnimation(this._mainCamera, 0, totalFrame, false, DTDWeb.Camera.CAMERA_ANIMATION_SPEED_RATIO);
        this._mainCameraAnimation.onAnimationEnd = () => {
            this.onMainCameraAnimationEnd();

            if (callback) {
                callback();
            }
        };
    }

    stopMainCameraAnimation() {
        if (this._isMainCameraAnimating && this._mainCamera.animations.length > 0) {

            this._mainCameraAnimation.stop();
        }
    }

    getFlyModeAnimations(cameraDirection) {
        let cameraAlpha = 0;
        let cameraBeta = 0;

        switch (cameraDirection) {
            case DTDWeb.Camera.CAMERA_DIRECTION.HOME:
                cameraAlpha = BABYLON.Tools.ToRadians(315);
                cameraBeta = BABYLON.Tools.ToRadians(65);
                break;
            case DTDWeb.Camera.CAMERA_DIRECTION.UP:
                cameraAlpha = BABYLON.Tools.ToRadians(270);
                cameraBeta = 0;
                break;
        }

        const animations = [];
        animations.push(this.animateCameraTarget(this._DTDWeb.modelManager.getRootBoundingCenter()));
        animations.push(this.animateCameraAlpha(cameraAlpha));
        animations.push(this.animateCameraBeta(cameraBeta));
        animations.push(this.animateCameraRadius(this._DTDWeb.modelManager.getRootRadius() * 2));

        return animations;
    }

    getWalkModeAnimations(cameraDirection) {
        const cameraTarget = this._pivotTransformNode.position;
        const cameraPosition = this._DTDWeb.modelManager.getRootBoundingCenter();
        cameraPosition.y = this._DTDWeb.modelManager.getRootBoundingMinimumY();

        let cameraAlpha = 0;
        let cameraBeta = 0;

        switch (cameraDirection) {
            case DTDWeb.Camera.CAMERA_DIRECTION.FRONT:
                cameraPosition.z += this._DTDWeb.modelManager.getRootBoundingHalfSizeZ() + DTDWeb.Camera.CAMERA_DIRECTION_DISTANCE_OFFSET;
                cameraAlpha = BABYLON.Tools.ToRadians(270);
                cameraBeta = BABYLON.Tools.ToRadians(90);
                break;
            case DTDWeb.Camera.CAMERA_DIRECTION.BACK:
                cameraPosition.z -= this._DTDWeb.modelManager.getRootBoundingHalfSizeZ() + DTDWeb.Camera.CAMERA_DIRECTION_DISTANCE_OFFSET;
                cameraAlpha = BABYLON.Tools.ToRadians(90);
                cameraBeta = BABYLON.Tools.ToRadians(90);
                break;
            case DTDWeb.Camera.CAMERA_DIRECTION.LEFT:
                cameraPosition.x -= this._DTDWeb.modelManager.getRootBoundingHalfSizeX() + DTDWeb.Camera.CAMERA_DIRECTION_DISTANCE_OFFSET;
                cameraAlpha = BABYLON.Tools.ToRadians(180);
                cameraBeta = BABYLON.Tools.ToRadians(90);
                break;
            case DTDWeb.Camera.CAMERA_DIRECTION.RIGHT:
                cameraPosition.x += this._DTDWeb.modelManager.getRootBoundingHalfSizeX() + DTDWeb.Camera.CAMERA_DIRECTION_DISTANCE_OFFSET;
                cameraAlpha = 0;
                cameraBeta = BABYLON.Tools.ToRadians(90);
                break;
        }

        const animations = [];
        animations.push(this.animateCameraTarget(cameraTarget));
        animations.push(this.animateCameraPosition(cameraPosition));
        animations.push(this.animateCameraAlpha(cameraAlpha));
        animations.push(this.animateCameraBeta(cameraBeta));

        return animations;
    }

    setFirstPersonCameraView(isCreateThirdPerson, isNeedAnimate) {
        const cameraPosition = this._DTDWeb.walkModeViewController.firstPersonMesh.position;

        let cameraAlpha = this._lastThirdPersonModeCameraAlpha;
        if (isCreateThirdPerson) {
            cameraAlpha = this._mainCamera.alpha;
        }

        if (isNeedAnimate) {
            this._mainCamera.animations.push(this.animateCameraTarget(cameraPosition));
            this._mainCamera.animations.push(this.animateCameraPosition(cameraPosition));
            this._mainCamera.animations.push(this.animateCameraAlpha(cameraAlpha));
            this._mainCamera.animations.push(this.animateCameraBeta(BABYLON.Tools.ToRadians(90)));

            this.onMainCameraAnimationStart();
            this._mainCameraAnimation = this._scene.beginAnimation(this._mainCamera, 0, DTDWeb.Camera.CAMERA_ANIMATION_FRAMERATE, false, DTDWeb.Camera.CAMERA_ANIMATION_SPEED_RATIO);
            this._mainCameraAnimation.onAnimationEnd = () => {
                this.onMainCameraAnimationEnd();
            };
        }
        else {
            this._mainCamera.target = cameraPosition.clone();
            this._mainCamera.position = cameraPosition.clone();
            this._mainCamera.alpha = cameraAlpha;
        }
    }

    getCameraTarget() {
        return this._mainCamera.target;
    }

    setCameraTarget(cameraTarget) {
        this._mainCamera.target = cameraTarget.clone();
    }

    setPivotPosition(pivotPosition, isUpdateLastPickedPoint) {
        this._pivotTransformNode.position.set(pivotPosition.x, pivotPosition.y, pivotPosition.z);

        if (isUpdateLastPickedPoint) {
            this._DTDWeb.inputController.lastPickedPoint = this._pivotTransformNode.position;
        }
    }

    addMouseWheelInput() {
        this._mainCamera.inputs.addMouseWheel();
        this._mainCamera.zoomToMouseLocation = true;
        this._mainCamera.wheelPrecision = DTDWeb.Camera.WHEEL_PRECISION;
        this._mainCamera.wheelDeltaPercentage = DTDWeb.Camera.WHEEL_DELTA_PERCENTAGE;
    }

    removeMouseWheelInput() {
        this._mainCamera.inputs.removeByType('ArcRotateCameraMouseWheelInput');
    }

    animateCameraTarget(cameraTarget, startFrame, endFrame) {
        if (startFrame === undefined) {
            startFrame = 0;
        }
        if (endFrame === undefined) {
            endFrame = startFrame + DTDWeb.Camera.CAMERA_ANIMATION_FRAMERATE;
        }

        const cameraTargetKeyframe = [];
        cameraTargetKeyframe.push({ frame: startFrame, value: this._mainCamera.target.clone() });
        cameraTargetKeyframe.push({ frame: endFrame, value: cameraTarget });

        const cameraTargetAnimation = new BABYLON.Animation('CameraTargetAnimation', 'target', DTDWeb.Camera.CAMERA_ANIMATION_FRAMERATE,
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        cameraTargetAnimation.setKeys(cameraTargetKeyframe);

        return cameraTargetAnimation;
    }

    animateCameraPositionY(cameraPositionY, startFrame, endFrame) {
        if (startFrame === undefined) {
            startFrame = 0;
        }
        if (endFrame === undefined) {
            endFrame = startFrame + DTDWeb.Camera.CAMERA_ANIMATION_FRAMERATE;
        }

        const cameraPositionYKeyframe = [];
        cameraPositionYKeyframe.push({ frame: startFrame, value: this._mainCamera.position.y });
        cameraPositionYKeyframe.push({ frame: endFrame, value: cameraPositionY });

        const cameraPositionYAnimation = new BABYLON.Animation('CameraPositionYAnimation', 'position.y', DTDWeb.Camera.CAMERA_ANIMATION_FRAMERATE,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        cameraPositionYAnimation.setKeys(cameraPositionYKeyframe);

        return cameraPositionYAnimation;
    }

    animateCameraPosition(cameraPosition, startFrame, endFrame) {
        if (startFrame === undefined) {
            startFrame = 0;
        }
        if (endFrame === undefined) {
            endFrame = startFrame + DTDWeb.Camera.CAMERA_ANIMATION_FRAMERATE;
        }

        const cameraPositionKeyframe = [];
        cameraPositionKeyframe.push({ frame: startFrame, value: this._mainCamera.position.clone() });
        cameraPositionKeyframe.push({ frame: endFrame, value: cameraPosition })

        const cameraPositionAnimation = new BABYLON.Animation('CameraPositionAnimation', 'position', DTDWeb.Camera.CAMERA_ANIMATION_FRAMERATE,
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        cameraPositionAnimation.setKeys(cameraPositionKeyframe);

        return cameraPositionAnimation;
    }

    animateCameraAlpha(cameraAlpha, startFrame, endFrame) {
        if (startFrame === undefined) {
            startFrame = 0;
        }
        if (endFrame === undefined) {
            endFrame = startFrame + DTDWeb.Camera.CAMERA_ANIMATION_FRAMERATE;
        }

        cameraAlpha = DTDWeb.Utility.NormalizeAngle(cameraAlpha);
        this._mainCamera.alpha = DTDWeb.Utility.NormalizeAngle(this._mainCamera.alpha);

        const differentAlpha = cameraAlpha - this._mainCamera.alpha;
        if (differentAlpha > Math.PI) {
            cameraAlpha -= 2 * Math.PI;
        }
        else if (differentAlpha < -Math.PI) {
            cameraAlpha += 2 * Math.PI;
        }

        const cameraAlphaKeyframe = [];
        cameraAlphaKeyframe.push({ frame: startFrame, value: this._mainCamera.alpha });
        cameraAlphaKeyframe.push({ frame: endFrame, value: cameraAlpha });

        const cameraAlphaAnimation = new BABYLON.Animation('CameraAlphaAnimation', 'alpha', DTDWeb.Camera.CAMERA_ANIMATION_FRAMERATE,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        cameraAlphaAnimation.setKeys(cameraAlphaKeyframe);

        return cameraAlphaAnimation;
    }

    animateCameraBeta(cameraBeta, startFrame, endFrame) {
        if (startFrame === undefined) {
            startFrame = 0;
        }
        if (endFrame === undefined) {
            endFrame = startFrame + DTDWeb.Camera.CAMERA_ANIMATION_FRAMERATE;
        }

        cameraBeta = DTDWeb.Utility.NormalizeAngle(cameraBeta);
        this._mainCamera.beta = DTDWeb.Utility.NormalizeAngle(this._mainCamera.beta);

        const differentBeta = cameraBeta - this._mainCamera.beta;
        if (differentBeta > Math.PI) {
            cameraBeta -= 2 * Math.PI;
        }
        else if (differentBeta < -Math.PI) {
            cameraBeta += 2 * Math.PI;
        }

        const cameraBetaKeyframe = [];
        cameraBetaKeyframe.push({ frame: startFrame, value: this._mainCamera.beta });
        cameraBetaKeyframe.push({ frame: endFrame, value: cameraBeta });

        const cameraBetaAnimation = new BABYLON.Animation('CameraBetaAnimation', 'beta', DTDWeb.Camera.CAMERA_ANIMATION_FRAMERATE,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        cameraBetaAnimation.setKeys(cameraBetaKeyframe);

        return cameraBetaAnimation;
    }

    animateCameraRadius(cameraRadius, startFrame, endFrame) {
        if (startFrame === undefined) {
            startFrame = 0;
        }
        if (endFrame === undefined) {
            endFrame = startFrame + DTDWeb.Camera.CAMERA_ANIMATION_FRAMERATE;
        }

        const cameraRadiusKeyframe = [];
        cameraRadiusKeyframe.push({ frame: startFrame, value: this._mainCamera.radius });
        cameraRadiusKeyframe.push({ frame: endFrame, value: cameraRadius });

        const cameraRadiusAnimation = new BABYLON.Animation('CameraRadiusAnimation', 'radius', DTDWeb.Camera.CAMERA_ANIMATION_FRAMERATE,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        cameraRadiusAnimation.setKeys(cameraRadiusKeyframe);

        return cameraRadiusAnimation;
    }

    onMainCameraAnimationStart() {
        this._isMainCameraAnimating = true;

        if (this._mainCameraAnimation) {
            this._mainCameraAnimation.stop();
            this._mainCameraAnimation = undefined;
            this._mainCamera.animations.length = 0;
        }
    }

    onMainCameraAnimationEnd() {
        this._isMainCameraAnimating = false;

        this._mainCameraAnimation = undefined;
        this._mainCamera.animations.length = 0;

        this.setPivotPosition(this._mainCamera.target, true);
    }

    attachControl() {
        this._mainCamera.attachControl(this._renderCanvas, true);
        this._isAttachControl = true;
    }

    detachControl() {
        this._mainCamera.detachControl();
        this._isAttachControl = false;
    }

    playEffectXrayCoveredCameraMeshes(exceptCoveredCameraMeshDictionary) {
        if (this._effectXrayCoveredCameraMeshesObservable) {
            return;
        }

        this._exceptCoveredCameraMeshDictionary = {};
        if (exceptCoveredCameraMeshDictionary) {
            this._exceptCoveredCameraMeshDictionary = exceptCoveredCameraMeshDictionary;
        }

        const exceptSelectMeshDictionary = this._DTDWeb.inputController.exceptSelectMeshDictionary;

        for (const exceptMeshId in exceptSelectMeshDictionary) {
            this._exceptCoveredCameraMeshDictionary[exceptMeshId] = exceptSelectMeshDictionary[exceptMeshId];
        }

        const isNeedUnfreeze = this._DTDWeb.modelManager.isActiveMeshesFrozen;
        if (isNeedUnfreeze) {
            this._DTDWeb.modelManager.unfreezeActiveMeshes();
        }

        this._coveredCameraInfoDictionary = {};
        this._effectXrayCoveredCameraMeshesObservable = this._scene.onBeforeRenderObservable.add(() => {
            this.effectXrayCoveredCameraMeshes();
        });
    }

    stopEffectXrayCoveredCameraMeshes() {
        if (!this._effectXrayCoveredCameraMeshesObservable) {
            return;
        }

        this._scene.onBeforeRenderObservable.remove(this._effectXrayCoveredCameraMeshesObservable);
        this._effectXrayCoveredCameraMeshesObservable = undefined;

        const isNeedUnfreeze = this._DTDWeb.modelManager.isActiveMeshesFrozen;
        if (isNeedUnfreeze) {
            this._DTDWeb.modelManager.unfreezeActiveMeshes();
        }

        for (const coveredCameraInfo of Object.values(this._coveredCameraInfoDictionary)) {
            this.revertCoveredCameraMesh(coveredCameraInfo);
        }
        this._coveredCameraInfoDictionary = {};

        this._exceptCoveredCameraMeshDictionary = {};

        if (isNeedUnfreeze) {
            this._DTDWeb.modelManager.freezeActiveMeshes();
        }
    }

    effectXrayCoveredCameraMeshes() {
        const deltaTime = this._engine.getDeltaTime() / 1000;
        for (const coveredCameraMeshId in this._coveredCameraInfoDictionary) {
            this._coveredCameraInfoDictionary[coveredCameraMeshId].time += deltaTime;
            if (this._coveredCameraInfoDictionary[coveredCameraMeshId].time >= DTDWeb.Camera.COVERED_CAMERA_MESH_TIMEOUT_SECONDS) {
                this.revertCoveredCameraMesh(this._coveredCameraInfoDictionary[coveredCameraMeshId]);
                delete this._coveredCameraInfoDictionary[coveredCameraMeshId];
            }
        }

        const distance = BABYLON.Vector3.Distance(this._mainCamera.target, this._mainCamera.position);
        const ray = this._mainCamera.getForwardRay(distance);
        const raycastHit = this._scene.pickWithRay(ray, (pickedMesh) => {
            if (!pickedMesh.isPickable) {
                return false;
            }

            // KEPCO E&C Custom START
            if (this._DTDWeb.kepcoEncController.isSymbolMesh(pickedMesh)) {
                return false;
            }
            // KEPCO E&C Custom END

            const meshId = pickedMesh.id;
            if (!this._DTDWeb.modelManager.getMeshFromId(meshId) || this._exceptCoveredCameraMeshDictionary[meshId]) {
                return false;
            }

            if (this._coveredCameraInfoDictionary[meshId]) {
                this._coveredCameraInfoDictionary[meshId].time = 0;
                return false;
            }

            return true;
        });

        if (!raycastHit.hit) {
            return;
        }

        const pickedMesh = raycastHit.pickedMesh;

        this._DTDWeb.modelManager.effectMeshes([pickedMesh], DTDWeb.Mesh.MESH_EFFECT_TYPE.XRAY);
        this._coveredCameraInfoDictionary[pickedMesh.id] = {
            time: 0,
            mesh: pickedMesh,
            previousMeshEffectType: pickedMesh.effectType
        };
    }

    revertCoveredCameraMesh(coveredCameraMeshInfo) {
        const coveredCameraMesh = coveredCameraMeshInfo.mesh;
        if (coveredCameraMesh) {
            this._DTDWeb.modelManager.effectMeshes([coveredCameraMesh], coveredCameraMeshInfo.previousMeshEffectType);
        }
    }

    async createScreenshotUsingLayerMask(layerMask) {
        const isNeedUnfreeze = this._DTDWeb.modelManager.isActiveMeshesFrozen;
        if (isNeedUnfreeze) {
            this._DTDWeb.modelManager.unfreezeActiveMeshes();
        }

        this._mainCamera.layerMask = layerMask;

        this._scene.render();

        const screenshot = await BABYLON.Tools.CreateScreenshotAsync(this._engine, this._mainCamera, { precision: 1 }, 'image/jpeg', 8);
        this._mainCamera.layerMask = 0x0FFFFFFF;

        if (isNeedUnfreeze) {
            this._DTDWeb.modelManager.freezeActiveMeshes();
        }

        return screenshot;
    }

    getCameraTransformJSON() {
        const cameraTarget = this._mainCamera.target;
        const cameraPosition = this._mainCamera.globalPosition;
        const cameraRotation = BABYLON.Quaternion.FromRotationMatrix(this._mainCamera.getWorldMatrix());

        return {
            cameraTarget: { x: cameraTarget.x, y: cameraTarget.y, z: cameraTarget.z },
            cameraPosition: { x: cameraPosition.x, y: cameraPosition.y, z: cameraPosition.z },
            cameraRotation: { x: cameraRotation.x, y: cameraRotation.y, z: cameraRotation.z, w: cameraRotation.w }
        };
    }
}

export { DTDWebCameraController };