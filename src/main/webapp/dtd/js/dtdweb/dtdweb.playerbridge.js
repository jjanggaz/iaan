import { DTDWeb } from './dtdweb.js';

class DTDWebPlayerBridge {
    constructor(dtdWeb, dtdPlayer) {
        this._DTDWeb = dtdWeb;
        this._DTDPlayer = dtdPlayer;
        this._DTDPlayer._DTDWebPlayerBridge = this;
    }

    initializeOptions(options) {
        this._DTDWeb.initializeOptions(options);
    }

    openURL(uri, isUrl) {
        let uris = isUrl ? (Array.isArray(uri) ? uri : [uri]) : uri;
        this._DTDWeb.onOpenURL(uris, isUrl);
    }

    saveDTDX(fileName) {
        return this._DTDWeb.saveDTDX(fileName);
    }

    closeAll() {
        this._DTDWeb.closeScene();
    }

    get functionMode() {
        return this._DTDPlayer.GetFunctionMode();
    }

    set functionMode(functionMode) {
        this._DTDPlayer.SetFunctionMode(functionMode);
    }

    startFunctionMode(functionMode) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        switch (functionMode) {
            case DTDPlayer.FunctionMode.MARKUP:
                this._DTDWeb.markupController.startMarkup(true);
                break;
        }
    }

    stopPreviousFunctionMode(previousFunctionMode) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        switch (previousFunctionMode) {
            case DTDPlayer.FunctionMode.MARKUP:
                this._DTDWeb.markupController.stopMarkup(false);
                break;
            case DTDPlayer.FunctionMode.PATH_TRACKING:
                this._DTDWeb.pathTrackingController.stopPathTracking(false);
                break;
            case DTDPlayer.FunctionMode.INTERFERENCE_CHECK:
                this._DTDWeb.interferenceCheckController.stopInterferenceCheck(false);
                break;
            case DTDPlayer.FunctionMode.BOOKMARK:
                this._DTDWeb.bookmarkController.stopBookmark(false);
                break;
        }
    }

    select(keyValueJson) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        const foundMeshes = this._DTDWeb.parameterController.getMeshesByParameters(keyValueJson);

        this._DTDWeb.inputController.selectMeshes(foundMeshes);
    }

    deselect(keyValueJson) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        const foundMeshes = this._DTDWeb.parameterController.getMeshesByParameters(keyValueJson);

        this._DTDWeb.inputController.deselectMeshes(foundMeshes);
    }

    deselectAll() {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.inputController.deselectAllMeshes();
    }

    selectAndFit(keyValueJson, isXrayCoveredMesh) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        const foundMeshes = this._DTDWeb.parameterController.getMeshesByParameters(keyValueJson, true);
        if (foundMeshes === undefined || foundMeshes.length === 0) {
            return;
        }

        const foundMesh = foundMeshes[0];
        const boundingVectors = foundMesh.getHierarchyBoundingVectors();
        const meshSize = boundingVectors.max.subtract(boundingVectors.min);

        let cameraAlpha = BABYLON.Tools.ToRadians(meshSize.x > meshSize.z ? 270 : 180);
        let cameraBeta = meshSize.y > Math.min(meshSize.x, meshSize.z) ? BABYLON.Tools.ToRadians(90) : 0;

        this._DTDWeb.cameraController.moveCameraToMesh(foundMeshes[0], cameraAlpha, cameraBeta, 1, () => {
            this.deselectAll();

            this._DTDWeb.inputController.selectMesh(foundMesh, true);

            if (isXrayCoveredMesh) {
                const mainCamera = this._DTDWeb.cameraController.mainCamera;
                const distance = BABYLON.Vector3.Distance(mainCamera.target, mainCamera.position);
                const ray = mainCamera.getForwardRay(distance);
                const raycastHits = this._DTDWeb.scene.multiPickWithRay(ray, (pickedMesh) => {
                    if (!pickedMesh.isPickable) {
                        return false;
                    }

                    const meshId = pickedMesh.id;
                    if (foundMesh.id === meshId || !this._DTDWeb.modelManager.getMeshFromId(meshId)) {
                        return false;
                    }

                    return true;
                });

                if (raycastHits) {
                    const xrayMeshes = [];
                    for (const raycastHit of raycastHits) {
                        xrayMeshes.push(raycastHit.pickedMesh);
                    }

                    this._DTDWeb.modelManager.effectMeshes(xrayMeshes, DTDWeb.Mesh.MESH_EFFECT_TYPE.XRAY);
                }
            }
        });
    }

    fit(keyValueJson, isXrayCoveredMesh) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        const foundMeshes = this._DTDWeb.parameterController.getMeshesByParameters(keyValueJson, true);
        if (foundMeshes === undefined || foundMeshes.length === 0) {
            return;
        }

        const foundMesh = foundMeshes[0];
        const boundingVectors = foundMesh.getHierarchyBoundingVectors();
        const meshSize = boundingVectors.max.subtract(boundingVectors.min);

        let cameraAlpha = BABYLON.Tools.ToRadians(meshSize.x > meshSize.z ? 270 : 180);
        let cameraBeta = meshSize.y > Math.min(meshSize.x, meshSize.z) ? BABYLON.Tools.ToRadians(90) : 0;

        this._DTDWeb.cameraController.moveCameraToMesh(foundMeshes[0], cameraAlpha, cameraBeta, 1, () => {
            if (isXrayCoveredMesh) {
                const mainCamera = this._DTDWeb.cameraController.mainCamera;
                const distance = BABYLON.Vector3.Distance(mainCamera.target, mainCamera.position);
                const ray = mainCamera.getForwardRay(distance);
                const raycastHits = this._DTDWeb.scene.multiPickWithRay(ray, (pickedMesh) => {
                    if (!pickedMesh.isPickable) {
                        return false;
                    }

                    const meshId = pickedMesh.id;
                    if (foundMesh.id === meshId || !this._DTDWeb.modelManager.getMeshFromId(meshId)) {
                        return false;
                    }

                    return true;
                });

                if (raycastHits) {
                    const xrayMeshes = [];
                    for (const raycastHit of raycastHits) {
                        xrayMeshes.push(raycastHit.pickedMesh);
                    }

                    this._DTDWeb.modelManager.effectMeshes(xrayMeshes, DTDWeb.Mesh.MESH_EFFECT_TYPE.XRAY);
                }
            }
        });
    }

    moveCameraFromJSON(cameraTransform, onAfterAnimateEndCallback) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        if (typeof cameraTransform === 'string') {
            cameraTransform = JSON.parse(cameraTransform);
        }

        const cameraTarget = cameraTransform.cameraTarget;
        const cameraPosition = cameraTransform.cameraPosition;
        const cameraRotation = cameraTransform.cameraRotation;

        this._DTDWeb.cameraController.moveCameraFromJSON(
            cameraTarget, cameraPosition, cameraRotation, undefined, onAfterAnimateEndCallback);
    }

    getElementDataList(keyValyeJson) {
        if (this._DTDWeb.scene === undefined) {
            return undefined;
        }

        return this._DTDWeb.parameterController.getMeshesParameters(keyValyeJson);
    }

    getClassificatedElementDataList() {
        if (this._DTDWeb.scene === undefined) {
            return {};
        }

        return this._DTDWeb.parameterController.getClassificatedParameters();
    }

    effectHighlight(keyValueJson, isInverse) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        const foundMeshes = this._DTDWeb.parameterController.getMeshesByParameters(keyValueJson);
        const selectedMeshes = isInverse ? this._DTDWeb.modelManager.getInverseMeshes(foundMeshes) : foundMeshes;

        this._DTDWeb.modelManager.effectMeshes(selectedMeshes, DTDWeb.Mesh.MESH_EFFECT_TYPE.HIGHLIGHT);
    }

    effectXray(keyValueJson, isInverse) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        const foundMeshes = this._DTDWeb.parameterController.getMeshesByParameters(keyValueJson);
        const selectedMeshes = isInverse ? this._DTDWeb.modelManager.getInverseMeshes(foundMeshes) : foundMeshes;

        this._DTDWeb.modelManager.effectMeshes(selectedMeshes, DTDWeb.Mesh.MESH_EFFECT_TYPE.XRAY);
    }

    effectChangeColor(keyValueJson, isInverse, colorR, colorG, colorB, alpha) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        const foundMeshes = this._DTDWeb.parameterController.getMeshesByParameters(keyValueJson);
        const selectedMeshes = isInverse ? this._DTDWeb.modelManager.getInverseMeshes(foundMeshes) : foundMeshes;

        this._DTDWeb.modelManager.effectMeshes(selectedMeshes, DTDWeb.Mesh.MESH_EFFECT_TYPE.CHANGE_COLOR, colorR, colorG, colorB, alpha);
    }

    effectInvisible(keyValueJson, isInverse) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        const foundMeshes = this._DTDWeb.parameterController.getMeshesByParameters(keyValueJson);
        const selectedMeshes = isInverse ? this._DTDWeb.modelManager.getInverseMeshes(foundMeshes) : foundMeshes;

        this._DTDWeb.modelManager.effectMeshes(selectedMeshes, DTDWeb.Mesh.MESH_EFFECT_TYPE.INVISIBLE);
    }

    resetEffect(keyValueJson) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        const foundMeshes = this._DTDWeb.parameterController.getMeshesByParameters(keyValueJson);

        this._DTDWeb.modelManager.effectMeshes(foundMeshes, DTDWeb.Mesh.MESH_EFFECT_TYPE.NORMAL);
    }

    resetAllEffect() {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.modelManager.resetEffectAllMeshes();
    }

    moveCameraToHome() {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.cameraController.moveCameraFromDirection(DTDWeb.Camera.CAMERA_DIRECTION.HOME);
    }

    moveCameraToUp() {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.cameraController.moveCameraFromDirection(DTDWeb.Camera.CAMERA_DIRECTION.UP);
    }

    moveCameraToFront() {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.cameraController.moveCameraFromDirection(DTDWeb.Camera.CAMERA_DIRECTION.FRONT);
    }

    moveCameraToBack() {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.cameraController.moveCameraFromDirection(DTDWeb.Camera.CAMERA_DIRECTION.BACK);
    }

    moveCameraToLeft() {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.cameraController.moveCameraFromDirection(DTDWeb.Camera.CAMERA_DIRECTION.LEFT);
    }

    moveCameraToRight() {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.cameraController.moveCameraFromDirection(DTDWeb.Camera.CAMERA_DIRECTION.RIGHT);
    }

    playEffectXrayCoveredCameraMeshes(keyValueJson) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        const exceptCoveredCameraMeshDictionary = {};

        if (keyValueJson) {
            const exceptMeshes = this._DTDWeb.parameterController.getMeshesByParameters(keyValueJson);
            for (const exceptMesh of exceptMeshes) {
                exceptCoveredCameraMeshDictionary[exceptMesh.id] = exceptMesh;
            }
        }

        this._DTDWeb.cameraController.playEffectXrayCoveredCameraMeshes(exceptCoveredCameraMeshDictionary);
    }

    stopEffectXrayCoveredCameraMeshes() {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.cameraController.stopEffectXrayCoveredCameraMeshes();
    }

    getPresetColors() {
        return DTDWeb.UI.COLORS;
    }

    startMarkup() {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.markupController.startMarkup();
    }

    stopMarkup() {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.markupController.stopMarkup(true);
    }

    undoMarkup() {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.markupController.undoHistory();
    }

    redoMarkup() {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.markupController.redoHistory();
    }

    clearAllMarkups() {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.markupController.clearAllMarkups();
    }

    setMarkupPenColor(hexColor) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.markupController.setPenColor(hexColor);
    }

    setMarkupPenThickness(thickness) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.markupController.setPenThickness(thickness);
    }

    setMarkupFontColor(hexColor) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.markupController.setFontColor(hexColor);
    }

    setMarkupFontSize(fontSize) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.markupController.setFontSize(fontSize);
    }

    getMarkupClipartImageUrls() {
        const clipartImageUrls = [];
        for (const clipartImage of DTDWeb.Markup.CLIPART_IMAGES) {
            clipartImageUrls.push(clipartImage.RELATIVE_URL);
        }

        return clipartImageUrls;
    }

    setMarkupClipartIndex(clipartIndex) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.markupController.setClipartIndex(clipartIndex);
    }

    getMarkupCurrentOptions() {
        return this._DTDWeb.markupController.currentOptions;
    }

    saveMarkup(onSuccessCallback) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.markupController.saveMarkup(onSuccessCallback);
    }

    loadMarkupByUrl(url) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.markupController.loadMarkup(url, undefined);
    }

    loadMarkupByBase64String(base64String, isChangeMarkupMode) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.markupController.loadMarkup(undefined, base64String, isChangeMarkupMode);
    }

    pausePathTracking() {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.pathTrackingController.pausePathTracking();
    }

    resumePathTracking() {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.pathTrackingController.resumePathTracking();
    }

    stopPathTracking() {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.pathTrackingController.stopPathTracking(true);
    }

    runInterferenceCheck(keyValueJson1, keyValueJson2, onSuccessCallback) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        const meshes1 = this._DTDWeb.parameterController.getMeshesByParameters(keyValueJson1);
        const meshes2 = this._DTDWeb.parameterController.getMeshesByParameters(keyValueJson2);

        this._DTDWeb.interferenceCheckController.runInterferenceCheck(meshes1, meshes2, onSuccessCallback);
    }

    stopInterferenceCheck() {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.interferenceCheckController.stopInterferenceCheck(true);
    }

    moveCameraToInterferencePoint(pointIndex, onAfterMoveCallback) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.interferenceCheckController.moveCameraToInterferencePoint(pointIndex, onAfterMoveCallback);
    }

    addBookmarkGroup(groupSequenceId, onSuccessCallback) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.bookmarkController.addBookmarkGroup(groupSequenceId, onSuccessCallback);
    }

    removeBookmarkGroup(groupSequenceId, onSuccessCallback) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.bookmarkController.removeBookmarkGroup(groupSequenceId, onSuccessCallback);
    }

    addBookmark(groupSequenceId, onSuccessCallback) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.bookmarkController.addBookmark(groupSequenceId, onSuccessCallback);
    }

    removeBookmark(groupSequenceId, bookmarkSequenceId, onSuccessCallback) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.bookmarkController.removeBookmark(groupSequenceId, bookmarkSequenceId, onSuccessCallback);
    }

    getAllBookmarks() {
        return this._DTDWeb.bookmarkController.bookmarks;
    }

    setBookmarkAnimateSpeed(groupSequenceId, bookmarkSequenceId, animateSpeed) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.bookmarkController.setBookmarkAnimateSpeed(groupSequenceId, bookmarkSequenceId, animateSpeed);
    }

    setBookmarkAnimateDelay(groupSequenceId, bookmarkSequenceId, animateDelay) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.bookmarkController.setBookmarkAnimateDelay(groupSequenceId, bookmarkSequenceId, animateDelay);
    }

    setBookmarkGlobalAnimateSpeed(animateSpeed) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.bookmarkController.globalAnimateSpeed = animateSpeed;
    }

    setBookmarkGlobalAnimateDelay(animateDelay) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.bookmarkController.globalAnimateDelay = animateDelay;
    }

    playBookmarkAnimation(groupSequenceId, isReverse, isRepeat, onStateChangedCallback) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.bookmarkController.playBookmarkAnimation(groupSequenceId, isReverse, isRepeat, onStateChangedCallback);
    }

    stopBookmarkAnimation() {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.bookmarkController.stopBookmarkAnimation();
    }

    saveBookmark() {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        return JSON.stringify(this._DTDWeb.bookmarkController.bookmarks);
    }

    loadBookmark(bookmarks) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        return this._DTDWeb.bookmarkController.loadBookmark(bookmarks);
    }

    showToastMessage(message, showSeconds) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.uiManager.showToastMessage(message, showSeconds);
    }

    hideToastMessage() {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.uiManager.hideToastMessage();
    }

    setOnScreenKeyHelperVisible(isVisible) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.uiManager.setOnScreenKeyHelperVisible(isVisible);
    }

    onCanvasResized(width, height) {
        if (this._DTDPlayer.OnCanvasResized) {
            this._DTDPlayer.OnCanvasResized(width, height);
        }
    }

    onModelLoaded() {
        if (this._DTDPlayer.OnContentsAllLoaded) {
            this._DTDPlayer.OnContentsAllLoaded();
        }
    }

    onSelected(parameters) {
        if (this._DTDPlayer.OnSelected) {
            this._DTDPlayer.OnSelected(parameters);
        }
    }

    onClickProperty(parameters) {
        if (this._DTDPlayer.OnClickProperty) {
            this._DTDPlayer.OnClickProperty(parameters);
        }
    }

    onAddMarkupSuccess(markupType) {
        if (this._DTDPlayer.OnAddMarkupSuccess) {
            this._DTDPlayer.OnAddMarkupSuccess(markupType);
        }
    }

    onAfterMarkupAction(hasPrevious, hasNext) {
        if (this._DTDPlayer.OnAfterMarkupAction) {
            this._DTDPlayer.OnAfterMarkupAction(hasPrevious, hasNext);
        }
    }

    onPathTrackingEnd() {
        if (this._DTDPlayer.OnPathTrackingEnd) {
            this._DTDPlayer.OnPathTrackingEnd();
        }
    }

    // for DTDon START
    getRenderCanvasForStreaming() {
        return this._DTDWeb.renderCanvas;
    }

    setJoinedDTDonChatRoom(hasJoined) {
        this._DTDWeb.hasJoinedDTDonChatRoom = hasJoined;
    }

    addDTDonPlayer(lobbySessionId) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.dtdonManager.addPlayer(lobbySessionId);
    }

    updateDTDonPlayerPosition(lobbySessionId, position) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.dtdonManager.updatePlayerPosition(lobbySessionId, position);
    }

    updateDTDonPlayerRotation(lobbySessionId, rotation) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.dtdonManager.updatePlayerRotation(lobbySessionId, rotation);
    }

    removeDTDonPlayer(lobbySessionId) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.dtdonManager.removePlayer(lobbySessionId);
    }

    onClickShareMarkupButton(base64String) {
        if (this._DTDPlayer.OnClickShareMarkupButton) {
            this._DTDPlayer.OnClickShareMarkupButton(base64String);
        }
    }
    // for DTDon END

    // KEPCO E&C Custom Start
    moveCameraToRootValvePosition(rootValveTag, isXrayCoveredMesh) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.kepcoEncController.moveCameraToRootValvePosition(rootValveTag, isXrayCoveredMesh);
    }

    runRootValvePathTracking(rootValveTag, animateDelay, animateSpeed, cameraRadius) {
        if (this._DTDWeb.scene === undefined) {
            return;
        }

        this._DTDWeb.kepcoEncController.runRootValvePathTracking(rootValveTag, animateDelay, animateSpeed, cameraRadius);
    }

    onClick2DViewButton(rootValveParameters) {
        if (this._DTDPlayer.On2DView) {
            this._DTDPlayer.On2DView(rootValveParameters);
        }
    }

    onClick2DDesignCheckResultButton(rootValveParameters) {
        if (this._DTDPlayer.On2DDesignCheckResult) {
            this._DTDPlayer.On2DDesignCheckResult(rootValveParameters);
        }
    }

    onClick3DDesignCheckResultButton(rootValveParameters) {
        if (this._DTDPlayer.On3DDesignCheckResult) {
            this._DTDPlayer.On3DDesignCheckResult(rootValveParameters);
        }
    }

    onClickFieldDesignCheckResultButton(rootValveParameters) {
        if (this._DTDPlayer.OnFieldDesignCheckResult) {
            this._DTDPlayer.OnFieldDesignCheckResult(rootValveParameters);
        }
    }
    // KEPCO E&C Custom End
}

export { DTDWebPlayerBridge };