import { DTDWeb } from './dtdweb.js';

class DTDWebInputController {
    constructor(dtdWeb) {
        this._DTDWeb = dtdWeb;
        this._engine = dtdWeb.engine;
        this._scene = dtdWeb.scene;
        this._renderCanvas = dtdWeb.renderCanvas;

        // Gizmo Manager
        this._gizmoManager = new BABYLON.GizmoManager(this._scene);

        this._selectedMeshDictionary = {};

        this._exceptSelectMeshDictionary = {};

        this._keyButtonStatusDictionary = {
            16: false, // Shift
            81: false, // Q
            69: false, // E
            87: false, // W
            65: false, // A
            83: false, // S
            68: false  // D
        };
        this._keyStatusDictionary = {};
        Object.assign(this._keyStatusDictionary, this._keyButtonStatusDictionary);
        this._keyStatusDictionary['32'] = false; // Space

        this._floorCone = undefined;
        this._isFloorConeEnabled = false;

        this._lastPickedPoint = undefined;

        this._startPanningPosition = undefined;
        this._inertialPanning = BABYLON.Vector3.Zero();
        this._panningPlane = undefined;

        this._isMouseRotation = false;

        this.initializeGizmo();
        this.initializeInput();
        this.initializePivotGizmo();
        this.initializeFloorCone();
    }

    get isMouseRotation() {
        return this._isMouseRotation;
    }

    set isMouseRotation(isMouseRotation) {
        this._isMouseRotation = isMouseRotation;
    }

    get lastPickedPoint() {
        return this._lastPickedPoint;
    }

    set lastPickedPoint(pickedPoint) {
        this._lastPickedPoint = pickedPoint;
    }

    get exceptSelectMeshDictionary() {
        return this._exceptSelectMeshDictionary;
    }

    initializeGizmo() {
        this._gizmoManager.boundingBoxGizmoEnabled = true;

        this._gizmoManager.boundingBoxDragBehavior.rotateDraggedObject = false;
        this._gizmoManager.boundingBoxDragBehavior.disableMovement = true;

        this._gizmoManager.gizmos.boundingBoxGizmo.setEnabledRotationAxis('');
        this._gizmoManager.gizmos.boundingBoxGizmo.setEnabledScaling(false);
        this._gizmoManager.gizmos.boundingBoxGizmo.setColor(BABYLON.Color3.Yellow());

        this._gizmoManager.boundingBoxGizmoEnabled = false;
    }

    initializeInput() {
        const minimumTransformCoordinate = 15;

        let lastPointerX = 0;
        let lastPointerY = 0;

        let isLeftButtonPressed = false;
        let isRightButtonPressed = false;
        let isNeedBeforeRenderForPointerMove = false;

        let isHitMeshOnPointerUp = false;

        let pointer = BABYLON.Vector2.Zero();
        let pointerId = -1;

        let touchPressedObservable = undefined;
        const disposeTouchPressedObservable = () => {
            if (touchPressedObservable) {
                this._scene.onBeforeRenderObservable.remove(touchPressedObservable);
            }
        }

        // 입력 관련 Before Render
        this._scene.onBeforeRenderObservable.add(() => {
            if (!this._DTDWeb.cameraController.isAttachControl || this._DTDWeb.pathTrackingController.isPathTracking) {
                return;
            }

            if (isRightButtonPressed) {
                const panningPosition = DTDWeb.Utility.GetPlanePositionFromPointer(
                    this._scene, this._DTDWeb.cameraController.mainCamera, this._panningPlane, pointer.x, pointer.y);
                if (panningPosition !== undefined) {
                    const directionToZoomLocation = this._startPanningPosition.subtract(panningPosition);
                    this._inertialPanning.copyFromFloats(directionToZoomLocation.x, directionToZoomLocation.y, directionToZoomLocation.z);
                }

                if (this._inertialPanning.x !== 0 || this._inertialPanning.y !== 0 || this._inertialPanning.z !== 0) {
                    this._DTDWeb.cameraController.mainCamera.target.addInPlace(this._inertialPanning);
                    this._DTDWeb.cameraController.pivotCameraTargetOffset();

                    this._inertialPanning.setAll(0);
                }
            }

            if (isNeedBeforeRenderForPointerMove) {
                const pickInfo = this._scene.pick(this._scene.pointerX, this._scene.pointerY);
                if (pickInfo.pickedMesh) {
                    const pickedMesh = pickInfo.pickedMesh;
                    if (this._DTDWeb.modelManager.isFloor(pickedMesh)) {
                        this.setFloorConeEnabled(true, pickInfo.pickedPoint);
                    }
                }
            }

            if (this._pivotGizmo && this._pivotGizmo.isShowing) {
                const diff = this._DTDWeb.cameraController.mainCamera.position.subtract(this._pivotGizmo.position);
                const distance = diff.length();
                this._pivotGizmo.scaling.setAll(distance * 0.02);
            }
        });

        // Pointer 입력
        this._scene.onPointerObservable.add((pointerInfo) => {
            if (!this._DTDWeb.cameraController.isAttachControl || this._DTDWeb.pathTrackingController.isPathTracking) {
                return;
            }

            const isTouch = pointerInfo.event.pointerType === 'touch';

            switch (pointerInfo.type) {
                case BABYLON.PointerEventTypes.POINTERMOVE:
                    if (pointerInfo.event.pointerId === pointerId) {
                        pointer.set(pointerInfo.event.x, pointerInfo.event.y);
                    }
                    else {
                        return;
                    }

                    if (lastPointerX + minimumTransformCoordinate <= pointer.x || lastPointerX - minimumTransformCoordinate >= pointer.x ||
                        lastPointerY + minimumTransformCoordinate <= pointer.y || lastPointerY - minimumTransformCoordinate >= pointer.y) {
                        if (isLeftButtonPressed && !isRightButtonPressed) {
                            this.setPivotGizmoEnabled(true);
                            this.setCursor(DTDWeb.Input.CURSOR_TYPE.TRANSFORM_ROTATE);
                        }

                        if (isRightButtonPressed) {
                            this.setCursor(DTDWeb.Input.CURSOR_TYPE.TRANSFORM_MOVE);
                        }
                    }

                    // floorCone 관련 처리는 this._scene.onBeforeRenderObservable에서
                    this.setFloorConeEnabled(false);
                    isNeedBeforeRenderForPointerMove = this._DTDWeb.cameraController.cameraMode === DTDWeb.Camera.CAMERA_MODE.WALK_MODE && this._DTDWeb.uiManager.isSelectableFloor;
                    return;
                case BABYLON.PointerEventTypes.POINTERDOWN:
                    if (isTouch) {
                        if (isLeftButtonPressed) {
                            isRightButtonPressed = true;
                        }
                        else {
                            isLeftButtonPressed = true;
                            pointerId = pointerInfo.event.pointerId;
                            pointer.set(pointerInfo.event.x, pointerInfo.event.y);
                        }
                    }
                    else {
                        isLeftButtonPressed = pointerInfo.event.button === 0 || pointerInfo.event.button === 1;
                        isRightButtonPressed = pointerInfo.event.button === 2;

                        pointerId = pointerInfo.event.pointerId;
                        pointer.set(pointerInfo.event.x, pointerInfo.event.y);
                    }

                    if (pointerInfo.event.pointerId === pointerId) {
                        lastPointerX = pointer.x;
                        lastPointerY = pointer.y;
                    }

                    // 마우스 버튼을 누르면 walkModeViewController BeforeRender Stop
                    if (this._DTDWeb.cameraController.cameraMode === DTDWeb.Camera.CAMERA_MODE.WALK_MODE) {
                        this._DTDWeb.walkModeViewController.isStopBeforeRender = true;
                    }

                    if (pointerInfo.event.pointerId === pointerId) {
                        this._DTDWeb.uiManager.hideContextMenu()

                        if (pointerInfo.pickInfo.hit) {
                            this._lastPickedPoint = pointerInfo.pickInfo.pickedPoint;
                        }

                        this._DTDWeb.cameraController.setPivotPosition(this._lastPickedPoint, false);
                        this._DTDWeb.cameraController.pivotCameraTargetOffset();
                    }

                    if (isRightButtonPressed) {
                        this.setPivotGizmoEnabled(false);
                        this.updatePanningPlane();
                        this._startPanningPosition = DTDWeb.Utility.GetPlanePositionFromPointer(
                            this._scene, this._DTDWeb.cameraController.mainCamera, this._panningPlane, pointer.x, pointer.y);
                    }

                    // 터치 롱프레스
                    if (isTouch && isLeftButtonPressed) {
                        disposeTouchPressedObservable();

                        let touchPressedSeconds = 0;
                        touchPressedObservable = this._scene.onBeforeRenderObservable.add(() => {
                            if (lastPointerX + minimumTransformCoordinate <= pointer.x || lastPointerX - minimumTransformCoordinate >= pointer.x ||
                                lastPointerY + minimumTransformCoordinate <= pointer.y || lastPointerY - minimumTransformCoordinate >= pointer.y) {
                                disposeTouchPressedObservable();
                                return;
                            }

                            touchPressedSeconds += this._engine.getDeltaTime() / 1000;

                            if (touchPressedSeconds >= DTDWeb.Input.CONTEXT_MENU_TOUCH_SECONDS) {
                                const pickInfo = this._scene.pick(this._scene.pointerX, this._scene.pointerY);

                                let isHit = false;
                                const pickedMesh = pickInfo.pickedMesh;
                                if (pickedMesh && this._DTDWeb.modelManager.getMeshFromId(pickedMesh.id)) {
                                    isHit = true;

                                    if (!this.isSelectedMesh(pickedMesh)) {
                                        this.deselectAllMeshes();
                                        this.selectMesh(pickedMesh, true);
                                    }

                                    const parameters = this._DTDWeb.parameterController.getParametersByMesh(pickedMesh);
                                    this._DTDWeb.onSelected(parameters);

                                    if (this._DTDWeb.parameterController.isParameterPanelVisible) {
                                        this._DTDWeb.parameterController.updateParameterPanel(pickedMesh);
                                    }
                                }

                                if (!this._DTDWeb.uiManager.isContextMenuVisible) {
                                    this._DTDWeb.uiManager.showContextMenu(this._scene.pointerX, this._scene.pointerY, isHit);
                                }

                                disposeTouchPressedObservable();
                            }
                        });
                    }
                    return;
                case BABYLON.PointerEventTypes.POINTERUP:
                    let isLeftButtonReleased = false;
                    let isRightButtonReleased = false;

                    if (isTouch) {
                        if (isRightButtonPressed) {
                            isRightButtonPressed = false;
                            isRightButtonReleased = true;
                        }
                        else {
                            isLeftButtonPressed = false;
                            isLeftButtonReleased = true;
                        }
                    }
                    else {
                        isLeftButtonReleased = pointerInfo.event.button === 0 || pointerInfo.event.button === 1;
                        if (isLeftButtonReleased) {
                            isLeftButtonPressed = false;
                        }
                        isRightButtonReleased = pointerInfo.event.button === 2;
                        if (isRightButtonReleased) {
                            isRightButtonPressed = false;
                        }
                    }

                    disposeTouchPressedObservable();

                    if (isLeftButtonReleased || isRightButtonReleased) {
                        this.setCursor(DTDWeb.Input.CURSOR_TYPE.NONE);
                        this.setPivotGizmoEnabled(false);

                        this._DTDWeb.cameraController.resetCameraTargetOffset();
                    }

                    if (lastPointerX + minimumTransformCoordinate <= pointer.x || lastPointerX - minimumTransformCoordinate >= pointer.x ||
                        lastPointerY + minimumTransformCoordinate <= pointer.y || lastPointerY - minimumTransformCoordinate >= pointer.y) {
                        return;
                    }

                    isHitMeshOnPointerUp = pointerInfo.pickInfo.hit;
                    if (isHitMeshOnPointerUp) {
                        if (this._isFloorConeEnabled && !this._DTDWeb.cameraController.isMainCameraAnimating && pointerInfo.event.button === 0) {
                            const pickedPoint = pointerInfo.pickInfo.pickedPoint;
                            if (pickedPoint) {
                                this._DTDWeb.walkModeViewController.createFirstPerson(pickedPoint, true);
                            }
                            return;
                        }

                        const pickedMesh = pointerInfo.pickInfo.pickedMesh;
                        if (pickedMesh && this._DTDWeb.modelManager.getMeshFromId(pickedMesh.id)) {
                            console.log(pickedMesh.id);
                            // KEPCO E&C Custom START
                            if (pickedMesh.symbolProperty) {
                                console.log(pickedMesh.symbolProperty);
                            }
                            // KEPCO E&C Custom END

                            if (pointerInfo.event.button === 0 || !this.isSelectedMesh(pickedMesh)) {
                                this.deselectAllMeshes();
                                this.selectMesh(pickedMesh, true);
                            }

                            const parameters = this._DTDWeb.parameterController.getParametersByMesh(pickedMesh);
                            this._DTDWeb.onSelected(parameters);

                            if (!isTouch && isRightButtonReleased) {
                                this._DTDWeb.uiManager.showContextMenu(this._scene.pointerX, this._scene.pointerY, true);
                            }
                        }
                        else {
                            isHitMeshOnPointerUp = false;
                        }
                    }

                    if (!isHitMeshOnPointerUp) {
                        this.deselectAllMeshes();

                        this._DTDWeb.onSelected(undefined);

                        this._DTDWeb.parameterController.hideParameterPanel();

                        if (!isTouch && isRightButtonReleased) {
                            this._DTDWeb.uiManager.showContextMenu(this._scene.pointerX, this._scene.pointerY, false);
                        }
                    }
                    return;
                case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
                    if (this._DTDWeb.cameraController.cameraMode === DTDWeb.Camera.CAMERA_MODE.WALK_MODE) {
                        return;
                    }

                    if (isTouch || (!isTouch && pointerInfo.event.button === 0)) {
                        const pickedMesh = pointerInfo.pickInfo.pickedMesh;
                        if (pickedMesh && this._DTDWeb.modelManager.getMeshFromId(pickedMesh.id)) {
                            this._DTDWeb.cameraController.moveCameraToPickedPoint(pointerInfo.pickInfo);
                        }
                    }
                    return;
            }
        });

        this._scene.onKeyboardObservable.add((keyboardInfo) => {
            switch (keyboardInfo.type) {
                case BABYLON.KeyboardEventTypes.KEYDOWN:
                    const keyCode = keyboardInfo.event.keyCode;

                    // Key Escape
                    if (keyCode === 27) {
                        switch (this._DTDWeb.functionMode) {
                            case DTDPlayer.FunctionMode.PATH_TRACKING:
                                this._DTDWeb.pathTrackingController.stopPathTracking(true);
                                break;
                            default:
                                if (this._DTDWeb.uiManager.isContextMenuVisible) {
                                    this._DTDWeb.uiManager.hideContextMenu();
                                }
                                else {
                                    if (this._DTDWeb.parameterController.isParameterPanelVisible) {
                                        this._DTDWeb.parameterController.hideParameterPanel();
                                    }
                                    this.deselectAllMeshes();
                                }
                                break;
                        }
                    }
                    // Key H or h
                    else if (keyCode === 72) {
                        const selectedMeshes = this.getSelectedMeshes();
                        this._DTDWeb.modelManager.effectMeshes(selectedMeshes, DTDWeb.Mesh.MESH_EFFECT_TYPE.HIGHLIGHT);
                    }
                    // Key X or x
                    else if (keyCode === 88) {
                        const selectedMeshes = this.getSelectedMeshes();
                        this._DTDWeb.modelManager.effectMeshes(selectedMeshes, DTDWeb.Mesh.MESH_EFFECT_TYPE.XRAY);
                    }
                    // Key V or v
                    else if (keyCode === 86) {
                        const selectedMeshes = this.getSelectedMeshes();
                        this._DTDWeb.modelManager.effectMeshes(selectedMeshes, DTDWeb.Mesh.MESH_EFFECT_TYPE.INVISIBLE);
                    }

                    switch (this._DTDWeb.functionMode) {
                        case DTDPlayer.FunctionMode.MARKUP:
                            // Key Delete
                            if (keyCode === 46) {
                                this._DTDWeb.markupController.removeSelectedMarkup();
                            }
                            break;
                        case DTDPlayer.FunctionMode.PATH_TRACKING:
                            // Key P or p
                            if (keyCode === 80) {
                                this._DTDWeb.pathTrackingController.pausePathTracking();
                            }
                            // Key R or r
                            else if (keyCode === 82) {
                                this._DTDWeb.pathTrackingController.resumePathTracking();
                            }
                            // Key S or s
                            else if (keyCode === 83) {
                                this._DTDWeb.pathTrackingController.stopPathTracking(true);
                            }
                            break;
                    }
                    break;
            }
        });
    }

    addExceptSelectMesh(mesh) {
        this._exceptSelectMeshDictionary[mesh.id] = mesh;
    }

    updatePanningPlane() {
        const direction = this._DTDWeb.cameraController.getCameraTarget().subtract(this._DTDWeb.cameraController.mainCamera.position);
        this._panningPlane = BABYLON.Plane.FromPositionAndNormal(this._DTDWeb.cameraController.getCameraTarget(), direction);
    }

    async initializePivotGizmo() {
        this._pivotGizmo = new BABYLON.TransformNode('PivotGizmo');

        const pivotGizmoImportResult = await BABYLON.SceneLoader.ImportMeshAsync('', `${DTDPlayer.GLTF_DIRECTORY}/`, 'Pivot.gltf', this._scene);
        for (const pivotGizmoMesh of pivotGizmoImportResult.meshes) {
            pivotGizmoMesh.parent = this._pivotGizmo;
            pivotGizmoMesh.renderingGroupId = 1;
            pivotGizmoMesh.layerMask = DTDWeb.Camera.LAYER_MASK.TOOL;
            pivotGizmoMesh.alwaysSelectAsActiveMesh = true;
        }

        this.setPivotGizmoEnabled(false);
    }

    setPivotGizmoEnabled(isEnalbed) {
        if (isEnalbed) {
            if (this.zoomTimeout) {
                clearTimeout(this.zoomTimeout);
            }

            this._pivotGizmo.position.set(this._lastPickedPoint.x, this._lastPickedPoint.y, this._lastPickedPoint.z);
            if (!this._DTDWeb.useFreeze) {
                this._pivotGizmo.setEnabled(true);
            }

            this._pivotGizmo.isShowing = true;
            this.zoomTimeout = setTimeout(() => {
                if (this._DTDWeb.useFreeze) {
                    this._pivotGizmo.position.setAll(DTDWeb.Mesh.MESH_HIDE_POSITION);
                }
                else {
                    this._pivotGizmo.setEnabled(false);
                }

                this._pivotGizmo.isShowing = false;
            }, 1000);
        }
        else {
            if (this._DTDWeb.useFreeze) {
                this._pivotGizmo.position.setAll(DTDWeb.Mesh.MESH_HIDE_POSITION);
            }
            else {
                this._pivotGizmo.setEnabled(false);
            }

            this._pivotGizmo.isShowing = false;
        }
    }

    async initializeFloorCone() {
        this._floorCone = new BABYLON.TransformNode('FloorCone');

        const coneImportResult = await BABYLON.SceneLoader.ImportMeshAsync('', `${DTDPlayer.GLTF_DIRECTORY}/`, 'Cone.gltf', this._scene);
        coneImportResult.meshes[1].position.set(0, 0.25, 0);
        for (const coneMesh of coneImportResult.meshes) {
            coneMesh.parent = this._floorCone;
            coneMesh.renderingGroupId = 1;
            coneMesh.layerMask = DTDWeb.Camera.LAYER_MASK.TOOL;
            coneMesh.alwaysSelectAsActiveMesh = true;
        }

        const cylinderTubeImportResult = await BABYLON.SceneLoader.ImportMeshAsync('', `${DTDPlayer.GLTF_DIRECTORY}/`, 'CylinderTubeThin.gltf', this._scene);
        for (const cylinderTubeMesh of cylinderTubeImportResult.meshes) {
            cylinderTubeMesh.parent = this._floorCone;
            cylinderTubeMesh.renderingGroupId = 1;
            cylinderTubeMesh.layerMask = DTDWeb.Camera.LAYER_MASK.TOOL;
            cylinderTubeMesh.alwaysSelectAsActiveMesh = true;
        }
        this.setFloorConeEnabled(false);

        this.animateFloorCone();
    }

    setFloorConeEnabled(isEnabled, pickedPoint) {
        if (isEnabled) {
            this._floorCone.position.set(pickedPoint.x, pickedPoint.y, pickedPoint.z);

            let scale = this._DTDWeb.cameraController.mainCamera.radius / 30;
            this._floorCone.scaling.setAll(Math.max(scale, 1));

            if (!this._DTDWeb.useFreeze) {
                this._floorCone.setEnabled(true);
            }
        }
        else {
            if (this._DTDWeb.useFreeze) {
                this._floorCone.position.setAll(DTDWeb.Mesh.MESH_HIDE_POSITION);
            }
            else {
                this._floorCone.setEnabled(false);
            }
        }

        this._isFloorConeEnabled = isEnabled;
    }

    animateFloorCone() {
        const framerate = 50;
        const cone = this._floorCone.getChildMeshes()[1];

        const keyframeConePosition = [];
        keyframeConePosition.push({ frame: 0, value: 0.25 });
        keyframeConePosition.push({ frame: 25, value: 0.6 });
        keyframeConePosition.push({ frame: framerate, value: 0.25 });

        const animateConePosition = new BABYLON.Animation('cone', 'position.y', framerate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        animateConePosition.setKeys(keyframeConePosition);

        cone.animations.push(animateConePosition);
        this._scene.beginAnimation(cone, 0, framerate, true);
    }

    getKeyStatus(keyCode) {
        return this._keyStatusDictionary[keyCode];
    }

    // From onScreenKeyButton.onPointerDownObservable(), onScreenKeyButton.onPonterUpObservable()
    keyDownFromUIButton(keyCode, isPressed) {
        let isContainsKey = false;
        switch (keyCode) {
            case 16: // Shift
            case 81: // Q
            case 69: // E
            case 87: // W
            case 65: // A
            case 83: // S
            case 68: // D
                isContainsKey = true;
                break;
        }

        if (isContainsKey) {
            this._keyStatusDictionary[keyCode] = isPressed;
            this._keyButtonStatusDictionary[keyCode] = isPressed;
        }
    }

    // From ArcRotateCameraKeyboardWalkInput.checkInputs()
    // 이 곳에서 가상키보드 마우스 클릭, 키보드 입력을 종합
    mergeKeyboardInput(keys) {
        for (let keyCode in this._keyStatusDictionary) {
            keyCode = parseInt(keyCode);
            // 키 입력이 있을 경우
            if (this._keyButtonStatusDictionary[keyCode] || keys.indexOf(parseInt(keyCode)) !== -1) {
                this._keyStatusDictionary[keyCode] = true;
                this._DTDWeb.uiManager.setOnScreenKeyButtonStatus(keyCode, true);

                if (this._DTDWeb.cameraController.cameraMode === DTDWeb.Camera.CAMERA_MODE.FLY_MODE) {
                    this._DTDWeb.cameraController.moveCameraFromKeyboard(keyCode, true);
                }
                else if (this._DTDWeb.cameraController.cameraMode === DTDWeb.Camera.CAMERA_MODE.WALK_MODE) {
                    if (this._DTDWeb.walkModeViewController.firstPersonMesh && this._DTDWeb.walkModeViewController.isStopBeforeRender) {
                        this._DTDWeb.walkModeViewController.isStopBeforeRender = false;
                        this._DTDWeb.cameraController.setFirstPersonCameraView(false, true);
                    }
                }
            }
            // 키 입력이 없는 경우
            else {
                this._keyStatusDictionary[keyCode] = false;
                this._DTDWeb.uiManager.setOnScreenKeyButtonStatus(keyCode, false);

                if (this._DTDWeb.cameraController.cameraMode === DTDWeb.Camera.CAMERA_MODE.FLY_MODE) {
                    this._DTDWeb.cameraController.moveCameraFromKeyboard(keyCode, false);
                }
            }
        }
    }

    getGizmoAttachedMesh() {
        if (this._gizmoManager.gizmos.boundingBoxGizmo.attachedMesh) {
            return this._gizmoManager.gizmos.boundingBoxGizmo.attachedMesh;
        }

        return undefined;
    }

    isGizmoAttachedMesh(mesh) {
        if (this._gizmoManager.gizmos.boundingBoxGizmo.attachedMesh &&
            this._gizmoManager.gizmos.boundingBoxGizmo.attachedMesh.id === mesh.id) {
            return true;
        }

        return false;
    }

    selectMesh(mesh, isGizmoAttach) {
        if (isGizmoAttach) {
            this._gizmoManager.attachToMesh(mesh);
            this._gizmoManager.boundingBoxGizmoEnabled = true;
            this._gizmoManager.boundingBoxDragBehavior.detach();

            if (this._DTDWeb.parameterController.isParameterPanelVisible) {
                this._DTDWeb.parameterController.updateParameterPanel(mesh);
            }
        }

        mesh.showBoundingBox = !isGizmoAttach;

        this._selectedMeshDictionary[mesh.id] = mesh;
    }

    selectMeshes(meshes) {
        if (meshes.length === 0) {
            return;
        }

        const isNeedUnfreeze = meshes.length > 1 && this._DTDWeb.modelManager.isActiveMeshesFrozen;
        if (isNeedUnfreeze) {
            this._DTDWeb.modelManager.unfreezeActiveMeshes();
        }

        this.deselectAllMeshes();

        for (let meshIndex = 0; meshIndex < meshes.length; meshIndex++) {
            const mesh = meshes[meshIndex];
            this.selectMesh(mesh, meshIndex === 0);
        }

        if (isNeedUnfreeze) {
            this._DTDWeb.modelManager.freezeActiveMeshes();
        }
    }

    deselectMesh(mesh) {
        if (this.isGizmoAttachedMesh(mesh)) {
            this._gizmoManager.boundingBoxGizmoEnabled = false;
        }

        mesh.showBoundingBox = false;
        if (this._selectedMeshDictionary[mesh.id]) {
            delete this._selectedMeshDictionary[mesh.id];
        }
    }

    deselectMeshes(meshes) {
        if (meshes.length === 0) {
            return;
        }

        let hasShowBoundingBox = false;
        for (const mesh of meshes) {
            if (mesh.showBoundingBox) {
                hasShowBoundingBox = true;
                break;
            }
        }

        const isNeedUnfreeze = (hasShowBoundingBox) && this._DTDWeb.modelManager.isActiveMeshesFrozen;
        if (isNeedUnfreeze) {
            this._DTDWeb.modelManager.unfreezeActiveMeshes();
        }

        for (const mesh of meshes) {
            this.deselectMesh(mesh);
        }

        if (isNeedUnfreeze) {
            this._DTDWeb.modelManager.freezeActiveMeshes();
        }
    }

    deselectAllMeshes() {
        this._gizmoManager.boundingBoxGizmoEnabled = false;

        this.deselectMeshes(this.getSelectedMeshes());
    }

    isSelectedMesh(mesh) {
        if (this._selectedMeshDictionary[mesh.id]) {
            return true;
        }

        return false;
    }

    hasSelectedMeshesShowBoundingBox() {
        const selectedMeshes = this.getSelectedMeshes();
        let hasShowBoundingBox = false;
        for (const selectedMesh of selectedMeshes) {
            if (selectedMesh.showBoundingBox) {
                hasShowBoundingBox = true;
                break;
            }
        }

        return hasShowBoundingBox;
    }

    getSelectedMeshes() {
        return Object.values(this._selectedMeshDictionary);
    }

    selectSameCategoryMeshes(targetMesh) {
        const selectedMesh = targetMesh ? targetMesh : this.getGizmoAttachedMesh();
        const sameCategoryMeshes = this._DTDWeb.parameterController.getSameCategoryMeshes(selectedMesh);
        if (sameCategoryMeshes.length === 0) {
            return;
        }

        const isNeedUnfreeze = this._DTDWeb.modelManager.isActiveMeshesFrozen;
        if (isNeedUnfreeze) {
            this._DTDWeb.modelManager.unfreezeActiveMeshes();
        }

        this.deselectAllMeshes();

        for (const sameCategoryMesh of sameCategoryMeshes) {
            this.selectMesh(sameCategoryMesh, selectedMesh.id === sameCategoryMesh.id);
        }

        if (isNeedUnfreeze) {
            this._DTDWeb.modelManager.freezeActiveMeshes();
        }
    }

    selectConnectedMeshes(mesh) {
        const selectedMesh = mesh ? mesh : this.getGizmoAttachedMesh();
        const connectedMeshSet = this._DTDWeb.modelManager.getConnectedMeshSet(selectedMesh);
        if (connectedMeshSet.size <= 1) {
            this._DTDWeb.popupManager.showMainPopup(DTDWeb.Popup.POPUP_TYPE.NOTICE, DTDWeb.Popup.POPUP_TITLE_TEXT.NOTICE,
                DTDWeb.Popup.POPUP_MESSAGE_TEXT.CANNOT_FOUND_CONNECTED_DATA);
            return;
        }

        const isNeedUnfreeze = this._DTDWeb.modelManager.isActiveMeshesFrozen;
        if (isNeedUnfreeze) {
            this._DTDWeb.modelManager.unfreezeActiveMeshes();
        }

        this.deselectAllMeshes();

        for (const connectedMesh of connectedMeshSet) {
            this.selectMesh(connectedMesh, selectedMesh.id === connectedMesh.id);
        }

        if (isNeedUnfreeze) {
            this._DTDWeb.modelManager.freezeActiveMeshes();
        }
    }

    setCursor(cursorType) {
        let cursorUrl = 'default';

        switch (cursorType) {
            case DTDWeb.Input.CURSOR_TYPE.TRANSFORM_MOVE:
                cursorUrl = `url('${DTDPlayer.IMAGE_DIRECTORY}/cursors/transform_move.png') 10 10, auto`;
                break;
            case DTDWeb.Input.CURSOR_TYPE.TRANSFORM_ROTATE:
                cursorUrl = `url('${DTDPlayer.IMAGE_DIRECTORY}/cursors/transform_rotate.png') 10 10, auto`;
                break;
        }

        document.documentElement.style.cursor = cursorUrl;
    }

    setupPointerLock() {
        const updateMouseMovement = (event) => {
            this._DTDWeb.walkModeViewController.updateMouseMovement(event);
        }

        const changeCallback = () => {
            if (document.pointerLockElement === this._renderCanvas || document.mozPointerLockElement === this._renderCanvas || document.webkitPointerLockElement === this._renderCanvas) {
                this._isMouseRotation = true;

                document.addEventListener('mousemove', updateMouseMovement, false);
                document.addEventListener('mousedown', updateMouseMovement, false);
                document.addEventListener('mouseup', updateMouseMovement, false);

                if (this._floorCone) {
                    this.setFloorConeEnabled(false);
                }
            }
            else {
                this._isMouseRotation = false;

                this._engine.exitPointerlock();

                document.removeEventListener('mousemove', updateMouseMovement, false);
                document.removeEventListener('mousedown', updateMouseMovement, false);
                document.removeEventListener('mouseup', updateMouseMovement, false);

                document.removeEventListener('pointerlockchange', changeCallback, false);
                document.removeEventListener('mozpointerlockchange', changeCallback, false);
                document.removeEventListener('webkitpointerlockchange', changeCallback, false);

                this._DTDWeb.uiManager.uncheckMouseRotationCheckboxButton();

                this._DTDWeb.cameraController.attachControl();
                this._DTDWeb.cameraController.setFirstPersonCameraView(false, true);
            }
        }

        this._engine.enterPointerlock();

        this._DTDWeb.cameraController.detachControl();

        document.addEventListener('pointerlockchange', changeCallback, false);
        document.addEventListener('mozpointerlockchange', changeCallback, false);
        document.addEventListener('webkitpointerlockchange', changeCallback, false);
    }
}

// ArcRotateCamera.zoomToMouseLocation = true 시 발생
BABYLON.ArcRotateCameraMouseWheelInput.prototype._zoomToMouse = function (delta) {
    let _DTDWeb = this.camera.cameraController._DTDWeb;
    if (_DTDWeb) {
        if (_DTDWeb.cameraController.cameraMode === DTDWeb.Camera.CAMERA_MODE.WALK_MODE) {
            _DTDWeb.walkModeViewController.isStopBeforeRender = true;
        }

        if (_DTDWeb.pathTrackingController.isPathTracking) {
            return;
        }
    }

    let _a, _b;
    let inertiaCompare = 1 - this.camera.inertia;

    if (this.camera.lowerRadiusLimit) {
        let lowerLimit = (_a = this.camera.lowerRadiusLimit) !== undefined && _a !== void 0 ? _a : 0;
        if (this.camera.radius - (this.camera.inertialRadiusOffset + delta) / inertiaCompare < lowerLimit) {
            delta = (this.camera.radius - lowerLimit) * inertiaCompare - this.camera.inertialRadiusOffset;
        }
    }
    if (this.camera.upperRadiusLimit) {
        let upperLimit = (_b = this.camera.upperRadiusLimit) !== undefined && _b !== void 0 ? _b : 0;
        if (this.camera.radius - (this.camera.inertialRadiusOffset + delta) / inertiaCompare > upperLimit) {
            delta = (this.camera.radius - upperLimit) * inertiaCompare - this.camera.inertialRadiusOffset;
        }
    }

    let zoomDistance = delta / inertiaCompare;
    let ratio = zoomDistance / this.camera.radius;
    // let vector = this._getPosition();

    if (_DTDWeb) {
        const pickInfo = _DTDWeb.scene.pick(_DTDWeb.scene.pointerX, _DTDWeb.scene.pointerY, undefined, true, this.camera);
        if (pickInfo.pickedMesh) {
            _DTDWeb.inputController.lastPickedPoint = pickInfo.pickedPoint;
        }

        _DTDWeb.inputController.setPivotGizmoEnabled(true);
    }

    // Now this vector tells us how much we also need to pan the camera
    // so the targeted mouse location becomes the center of zooming.
    let directionToZoomLocation = _DTDWeb.inputController.lastPickedPoint.subtract(this.camera.target);
    let offset = directionToZoomLocation.scale(ratio);
    offset.scaleInPlace(inertiaCompare);
    this._inertialPanning.addInPlace(offset);
    this.camera.inertialRadiusOffset += delta;
}

class ArcRotateCameraKeyboardWalkInput {
    constructor(dtdWeb) {
        this._keys = [];
        this.keysShift = [16]; // Shift
        this.keysSpace = [32]; // Space
        this.keysRotationLeft = [81]; // Q
        this.keysRotationRight = [69]; // E
        this.keysUp = [87]; // W
        this.keysDown = [83]; // S
        this.keysLeft = [65]; // A
        this.keysRight = [68]; // D

        this._DTDWeb = dtdWeb;
        this._engine = dtdWeb.engine;
    }

    attachControl(noPreventDefault) {
        const _this = this;
        const element = this._engine.getInputElement();
        if (!this._onKeyDown) {
            element.tabIndex = 1;

            this._onKeyDown = function (event) {
                if (_this.keysShift.indexOf(event.keyCode) !== -1 ||
                    _this.keysSpace.indexOf(event.keyCode) !== -1 ||
                    _this.keysRotationLeft.indexOf(event.keyCode) !== -1 ||
                    _this.keysRotationRight.indexOf(event.keyCode) !== -1 ||
                    _this.keysUp.indexOf(event.keyCode) !== -1 ||
                    _this.keysDown.indexOf(event.keyCode) !== -1 ||
                    _this.keysLeft.indexOf(event.keyCode) !== -1 ||
                    _this.keysRight.indexOf(event.keyCode) !== -1) {
                    const index = _this._keys.indexOf(event.keyCode);
                    if (index === -1) {
                        _this._keys.push(event.keyCode);
                    }

                    if (!noPreventDefault) {
                        event.preventDefault();
                    }
                }
            };

            this._onKeyUp = function (event) {
                if (_this.keysShift.indexOf(event.keyCode) !== -1 ||
                    _this.keysSpace.indexOf(event.keyCode) !== -1 ||
                    _this.keysRotationLeft.indexOf(event.keyCode) !== -1 ||
                    _this.keysRotationRight.indexOf(event.keyCode) !== -1 ||
                    _this.keysUp.indexOf(event.keyCode) !== -1 ||
                    _this.keysDown.indexOf(event.keyCode) !== -1 ||
                    _this.keysLeft.indexOf(event.keyCode) !== -1 ||
                    _this.keysRight.indexOf(event.keyCode) !== -1) {
                    const index = _this._keys.indexOf(event.keyCode);
                    if (index >= 0) {
                        _this._keys.splice(index, 1);
                    }

                    if (!noPreventDefault) {
                        event.preventDefault();
                    }
                }
            };

            element.addEventListener('keydown', this._onKeyDown, false);
            element.addEventListener('keyup', this._onKeyUp, false);
        }
    }

    detachControl() {
        if (this._scene) {
            if (this._onKeyboardObserver) {
                this._scene.onKeyboardObservable.remove(this._onKeyboardObserver);
            }
            if (this._onCanvasBlurObserver) {
                this._engine.onCanvasBlurObservable.remove(this._onCanvasBlurObserver);
            }
            this._onKeyboardObserver = undefined;
            this._onCanvasBlurObserver = undefined;
        }

        this._keys.length = 0;
    }

    checkInputs() {
        if (!this._DTDWeb.cameraController.isAttachControl) {
            return;
        }

        if (this._DTDWeb.inputController && this._onKeyDown) {
            this._DTDWeb.inputController.mergeKeyboardInput(this._keys);
        }
    }

    _onLostFocus() {
        this._keys = [];
    }

    getClassName() {
        return 'ArcRotateCameraKeyboardWalkInput';
    }

    getSimpleName() {
        return 'keyboard';
    }
}

export { DTDWebInputController, ArcRotateCameraKeyboardWalkInput };