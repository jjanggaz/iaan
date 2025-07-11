import { DTDWeb } from '../dtdweb.js';

class DTDWebPathTrackingController {
    constructor(dtdWeb) {
        this._DTDWeb = dtdWeb;
        this._engine = dtdWeb.engine;
        this._scene = dtdWeb.scene;

        // 현재는 MainCamera 사용. 애니메이션 겹침 문제로 교체 예상
        this._pathTrackingCamera = dtdWeb.cameraController.mainCamera;

        this._isPathTrackingRunning = false;
        this._isPathTrackingForceStop = false;
        this._pathTrackingAnimation = undefined;
    }

    get isPathTracking() {
        if (this._isPathTrackingRunning) {
            return (!this._pathTrackingAnimation) || (this._pathTrackingAnimation && !this._pathTrackingAnimation.paused);
        }

        return false;
    }

    get isPathTrackingRunning() {
        return this._isPathTrackingRunning;
    }

    addPathTrackingSequence(ownerMeshId, pathTrackingSequences) {
        const connectorDatas = this._DTDWeb.modelManager.getConnectorDataFromMeshId(ownerMeshId);
        if (connectorDatas.length === 0) {
            return;
        }

        const previousPathTrackingSequence = pathTrackingSequences[pathTrackingSequences.length - 1];
        const previousElementOwner = previousPathTrackingSequence.elementOwner;

        let connectorData = connectorDatas[0];
        for (let connectorDataIndex = 0; connectorDataIndex < connectorDatas.length; connectorDataIndex++) {
            if (connectorDatas[connectorDataIndex].elementConnect !== previousElementOwner) {
                connectorData = connectorDatas[connectorDataIndex];
                break;
            }
        }

        const pathTrackingSequence = {};
        pathTrackingSequence.elementOwner = connectorData.elementOwner;
        pathTrackingSequence.elementConnect = connectorData.elementConnect;
        pathTrackingSequence.cameraTarget = connectorData.origin;

        pathTrackingSequence.highlightMesh = this._DTDWeb.modelManager.getMeshFromId(connectorData.elementOwner);
        pathTrackingSequence.cameraAlpha = BABYLON.Tools.ToRadians(270);
        pathTrackingSequence.cameraBeta = BABYLON.Tools.ToRadians(45);

        pathTrackingSequences.push(pathTrackingSequence);

        if (connectorData.elementConnect !== '-1') {
            this.addPathTrackingSequence(connectorData.elementConnect, pathTrackingSequences);
        }
    }

    runPathTracking(ownerMesh, animateDelay, animateSpeed, cameraRadius) {
        if (this._isPathTrackingRunning) {
            this.stopPathTracking(false);
        }

        const ownerMeshId = ownerMesh.id;
        const connectorDatas = this._DTDWeb.modelManager.getConnectorDataFromMeshId(ownerMeshId);
        if (connectorDatas.length === 0) {
            return;
        }

        let directionIndex = 0;
        const pathTrackingSequencesDictionary = {};
        for (const connectorData of connectorDatas) {
            if (connectorData.elementConnect !== '-1') {
                const pathTrackingSequence = {};
                pathTrackingSequence.elementOwner = connectorData.elementOwner;
                pathTrackingSequence.elementConnect = connectorData.elementConnect;
                pathTrackingSequence.cameraTarget = connectorData.origin;

                pathTrackingSequence.highlightMesh = this._DTDWeb.modelManager.getMeshFromId(connectorData.elementOwner);
                pathTrackingSequence.cameraAlpha = BABYLON.Tools.ToRadians(270);
                pathTrackingSequence.cameraBeta = BABYLON.Tools.ToRadians(45);

                pathTrackingSequencesDictionary[directionIndex] = [pathTrackingSequence];
                this.addPathTrackingSequence(connectorData.elementConnect, pathTrackingSequencesDictionary[directionIndex]);

                directionIndex += 1;
            }
        }

        let directionKeys = Object.keys(pathTrackingSequencesDictionary);
        if (directionKeys.length === 0) {
            return;
        }

        let pathTrackingSequences = pathTrackingSequencesDictionary[directionKeys[0]];
        for (const directionKey of directionKeys) {
            if (pathTrackingSequences.length < pathTrackingSequencesDictionary[directionKey].length) {
                pathTrackingSequences = pathTrackingSequencesDictionary[directionKey];
            }
        }

        if (pathTrackingSequences.length > 1) {
            this._isPathTrackingRunning = true;
            this._isPathTrackingForceStop = false;

            this._DTDWeb.functionMode = DTDPlayer.FunctionMode.PATH_TRACKING;

            this._DTDWeb.cameraController.moveCameraToMesh(ownerMesh, BABYLON.Tools.ToRadians(270), BABYLON.Tools.ToRadians(45), cameraRadius, () => {
                if (this._isPathTrackingForceStop) {
                    this._isPathTrackingRunning = false;
                }
                else {
                    setTimeout(() => {
                        if (this._isPathTrackingForceStop) {
                            this._isPathTrackingRunning = false;
                        }
                        else {
                            const boundingVectors = ownerMesh.getHierarchyBoundingVectors();
                            const meshSize = boundingVectors.max.subtract(boundingVectors.min);
                            cameraRadius = Math.max(meshSize.x, meshSize.y, meshSize.z) + cameraRadius;
                            this.playPathTrackingSequences(pathTrackingSequences, animateSpeed, cameraRadius);
                        }
                    }, animateDelay * 1000);
                }
            });
        }
    }

    pausePathTracking() {
        if (this._pathTrackingAnimation) {
            this._pathTrackingAnimation.pause();
        }
    }

    resumePathTracking() {
        if (this._pathTrackingAnimation) {
            this._pathTrackingAnimation.restart();
        }
    }

    stopPathTracking(isChangeModeNone) {
        this._isPathTrackingForceStop = true;

        if (this._pathTrackingAnimation) {
            this._pathTrackingAnimation.stop();
        }

        if (isChangeModeNone) {
            this._DTDWeb.functionMode = DTDPlayer.FunctionMode.NONE;
        }
    }

    playPathTrackingSequences(pathTrackingSequences, animateSpeed, cameraRadius) {
        let sequenceIndex = 0;

        const isNeedUnfreeze = this._DTDWeb.modelManager.isActiveMeshesFrozen;
        if (isNeedUnfreeze) {
            this._DTDWeb.modelManager.unfreezeActiveMeshes();
        }

        const exceptCoveredCameraMeshDictionary = {};

        const startOwnerMeshId = pathTrackingSequences[0].elementOwner;
        const startOwnerMesh = this._DTDWeb.modelManager.getMeshFromId(startOwnerMeshId);
        const pathTrackingMeshSet = this._DTDWeb.modelManager.getConnectedMeshSet(startOwnerMesh);
        for (const pathTrackingMesh of pathTrackingMeshSet) {
            const meshId = pathTrackingMesh.id;
            exceptCoveredCameraMeshDictionary[meshId] = pathTrackingMesh;
        }
        this._DTDWeb.cameraController.playEffectXrayCoveredCameraMeshes(exceptCoveredCameraMeshDictionary);

        const syncPivotTransformObservable = this._scene.onAfterRenderObservable.add(() => {
            if (this.isPathTracking) {
                this._DTDWeb.cameraController.setPivotPosition(this._pathTrackingCamera.target, true);
            }
        });

        const animateCallback = () => {
            this._pathTrackingAnimation = undefined;

            let hasNext = ++sequenceIndex < pathTrackingSequences.length && !this._isPathTrackingForceStop;
            if (hasNext) {
                const pathTrackingSequence = pathTrackingSequences[sequenceIndex];
                if (pathTrackingSequence.highlightMesh) {
                    this._DTDWeb.inputController.selectConnectedMeshes(pathTrackingSequence.highlightMesh);
                }

                this.playPathTrackingSequence(pathTrackingSequence, animateSpeed, cameraRadius, animateCallback);
            }
            else {
                this._DTDWeb.cameraController.stopEffectXrayCoveredCameraMeshes();

                this._scene.onAfterRenderObservable.remove(syncPivotTransformObservable);

                this._isPathTrackingRunning = false;
                this._isPathTrackingForceStop = false;

                if (isNeedUnfreeze) {
                    this._DTDWeb.modelManager.freezeActiveMeshes();
                }

                this._DTDWeb.onPathTrackingEnd();

                // KEPCO E&C Custom START
                this._DTDWeb.kepcoEncController.onPathTrackingEnd(startOwnerMesh);
                // KEPCO E&C Custom END
            }
        };

        this.playPathTrackingSequence(pathTrackingSequences[sequenceIndex], animateSpeed, cameraRadius, animateCallback);
    }

    playPathTrackingSequence(sequence, animateSpeed, cameraRadius, callback) {
        this._DTDWeb.cameraController.onMainCameraAnimationStart();

        let endFrame = DTDWeb.Camera.CAMERA_ANIMATION_FRAMERATE;

        let previousMeshEffectType = DTDWeb.Mesh.MESH_EFFECT_TYPE.NORMAL;
        if (sequence.highlightMesh !== undefined) {
            const highlightMesh = sequence.highlightMesh;
            previousMeshEffectType = this._DTDWeb.modelManager.getMeshEffectType(highlightMesh);
            this._DTDWeb.modelManager.effectMeshes([highlightMesh], DTDWeb.Mesh.MESH_EFFECT_TYPE.HIGHLIGHT);
        }

        if (sequence.cameraTarget !== undefined) {
            let distance = BABYLON.Vector3.Distance(sequence.cameraTarget, this._pathTrackingCamera.target);
            endFrame *= distance * 2.5;

            this._pathTrackingCamera.animations.push(this._DTDWeb.cameraController.animateCameraTarget(sequence.cameraTarget, 0, endFrame));
        }

        if (sequence.cameraAlpha !== undefined) {
            this._pathTrackingCamera.animations.push(this._DTDWeb.cameraController.animateCameraAlpha(sequence.cameraAlpha, 0, endFrame));
        }

        if (sequence.cameraBeta !== undefined) {
            this._pathTrackingCamera.animations.push(this._DTDWeb.cameraController.animateCameraBeta(sequence.cameraBeta, 0, endFrame));
        }

        this._pathTrackingCamera.animations.push(this._DTDWeb.cameraController.animateCameraRadius(cameraRadius));

        this._pathTrackingAnimation = this._scene.beginAnimation(this._pathTrackingCamera, 0, endFrame, false, animateSpeed);

        this._pathTrackingAnimation.onAnimationEnd = () => {
            this._DTDWeb.cameraController.onMainCameraAnimationEnd();

            if (sequence.highlightMesh !== undefined) {
                const highlightMesh = sequence.highlightMesh;
                this._DTDWeb.modelManager.effectMeshes([highlightMesh], previousMeshEffectType);
            }

            if (callback) {
                callback();
            }
        };
    }
}

export { DTDWebPathTrackingController };