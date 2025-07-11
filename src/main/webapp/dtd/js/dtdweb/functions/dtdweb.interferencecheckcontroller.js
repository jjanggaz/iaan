import { DTDWeb } from '../dtdweb.js';

class DTDWebInterferenceCheckController {
    constructor(dtdWeb) {
        this._DTDWeb = dtdWeb;
        this._scene = dtdWeb.scene;

        this._interferenceResultMeshes = [];

        this._isCheckingInterference = false;
        this._isForceStop = false;
    }

    async runInterferenceCheck(meshes1, meshes2, onSuccessCallback) {
        if (this._isCheckingInterference || meshes1.length === 0 || meshes2.length === 0) {
            this._DTDWeb.popupManager.showMainPopup(DTDWeb.Popup.POPUP_TYPE.NOTICE, DTDWeb.Popup.POPUP_TITLE_TEXT.NOTICE,
                DTDWeb.Popup.POPUP_MESSAGE_TEXT.CANNOT_FOUND_TARGET);
            return;
        }

        this.stopInterferenceCheck(false);

        this._DTDWeb.functionMode = DTDPlayer.FunctionMode.INTERFERENCE_CHECK;

        const popup = this._DTDWeb.popupManager.showMainPopup(DTDWeb.Popup.POPUP_TYPE.PROGRESS, DTDWeb.Popup.POPUP_TITLE_TEXT.INTERFERENCE_CHECK,
            `${DTDWeb.Popup.POPUP_MESSAGE_TEXT.INTERFERENCE_CHECK}\n0 / ${meshes1.length}`, () => {
                this.stopInterferenceCheck(true);
            });

        this._isCheckingInterference = true;
        this._isForceStop = false;

        this.clearInterferenceSpheres();

        const meshTrianglesDictionary = {};
        const successResult = [];

        const performanceStartTime = performance.now();

        let checkCount = 0;
        for (const mesh1 of meshes1) {
            if (this._isForceStop) {
                break;
            }

            const mesh1Id = DTDWeb.ParameterController.GetMeshId(mesh1);
            const boundingBox1 = mesh1.getBoundingInfo().boundingBox;

            let triangles1 = meshTrianglesDictionary[mesh1.id];
            if (triangles1 === undefined) {
                triangles1 = DTDWeb.Utility.GetTriangles(mesh1);
                meshTrianglesDictionary[mesh1.id] = triangles1;
            }

            for (const mesh2 of meshes2) {
                if (this._isForceStop) {
                    break;
                }

                if (mesh1.id === mesh2.id) {
                    continue;
                }

                if (!mesh1.intersectsMesh(mesh2, true)) {
                    continue;
                }

                const mesh2Id = DTDWeb.ParameterController.GetMeshId(mesh2);
                const boundingBox2 = mesh2.getBoundingInfo().boundingBox;

                let triangles2 = meshTrianglesDictionary[mesh2.id];
                if (triangles2 === undefined) {
                    triangles2 = DTDWeb.Utility.GetTriangles(mesh2);
                    meshTrianglesDictionary[mesh2.id] = triangles2;
                }

                const result = DTDWeb.Utility.IntersectsMesh(boundingBox1, boundingBox2, triangles1, triangles2);

                if (result.intersect) {
                    let mesh1VertexData = DTDWeb.Utility.GetBoxVertexDataFromTriangles(result.intersectTriangles1);
                    let mesh2VertexData = DTDWeb.Utility.GetBoxVertexDataFromTriangles(result.intersectTriangles2);

                    const mesh1CSG = BABYLON.CSG.FromVertexData(mesh1VertexData);
                    const mesh2CSG = BABYLON.CSG.FromVertexData(mesh2VertexData);
                    let finalCSG = mesh1CSG.intersect(mesh2CSG);

                    if (finalCSG._polygons.length > 0) {
                        const intersectMesh = finalCSG.toMesh(`${mesh1Id}_${mesh2Id}_IntersectMesh`, this._DTDWeb.modelManager.getMaterialFromRGBA(0, 0, 255, 30), this._scene, false);

                        const centerWorld = intersectMesh.getBoundingInfo().boundingSphere.centerWorld;
                        const radiusWorld = intersectMesh.getBoundingInfo().boundingSphere.radiusWorld;

                        intersectMesh.dispose();

                        const interferenceSphere = BABYLON.MeshBuilder.CreateSphere(`${mesh1Id}_${mesh2Id}_IntersectSphere`, {
                            diameter: radiusWorld * 2
                        }, this._scene);
                        interferenceSphere.position.set(centerWorld.x, centerWorld.y, centerWorld.z);
                        interferenceSphere.isPickable = false;
                        interferenceSphere.material = this._DTDWeb.modelManager.getMaterialFromRGBA(0, 0, 255, 30);
                        interferenceSphere.renderingGroupId = 1;
                        if (this._DTDWeb.useFreeze) {
                            interferenceSphere.alwaysSelectAsActiveMesh = true;
                        }
                        interferenceSphere.freezeWorldMatrix();
                        interferenceSphere.intersectedMeshes = [mesh1, mesh2];
                        this._interferenceResultMeshes.push(interferenceSphere);

                        const pointIndex = this._interferenceResultMeshes.length - 1;

                        successResult.push({
                            pointIndex,
                            mesh1Id,
                            mesh2Id,
                            mesh1FileName: DTDWeb.ParameterController.GetMeshFileName(mesh1),
                            mesh2FileName: DTDWeb.ParameterController.GetMeshFileName(mesh2),
                            intersectCenter: { x: centerWorld.x, y: centerWorld.y, z: centerWorld.z },
                            intersectRadius: radiusWorld * 2
                        });
                    }
                }
            }

            popup.setMessageText(`${DTDWeb.Popup.POPUP_MESSAGE_TEXT.INTERFERENCE_CHECK}\n${++checkCount} / ${meshes1.length}`);
            popup.setProgressValue(((checkCount / meshes1.length) * 100).toFixed(0));

            await DTDWeb.Utility.Sleep(0);
        }

        this._DTDWeb.popupManager.hideMainPopup();

        if (this._isForceStop) {
            this.clearInterferenceSpheres();
        }
        else {
            if (successResult.length === 0) {
                this._DTDWeb.popupManager.showMainPopup(DTDWeb.Popup.POPUP_TYPE.NOTICE, DTDWeb.Popup.POPUP_TITLE_TEXT.INTERFERENCE_CHECK,
                    DTDWeb.Popup.POPUP_MESSAGE_TEXT.NOTHING_INTERFERENCE);
            }

            const performanceEndTime = performance.now();
            console.log(`INTERFERENCE CHECK: ${(performanceEndTime - performanceStartTime) / 1000} seconds`)
        }

        if (!this._isForceStop) {
            if (onSuccessCallback) {
                onSuccessCallback(successResult);
            }
        }

        this._isForceStop = false;
        this._isCheckingInterference = false;
    }

    stopInterferenceCheck(isChangeModeNone) {
        this._isForceStop = true;

        if (!this._isCheckingInterference) {
            this.clearInterferenceSpheres();
        }

        this._DTDWeb.popupManager.hideMainPopup();

        if (isChangeModeNone) {
            this._DTDWeb.functionMode = DTDPlayer.FunctionMode.NONE;
        }
    }

    clearInterferenceSpheres() {
        for (const interferenceSphere of this._interferenceResultMeshes) {
            interferenceSphere.dispose();
        }
        this._interferenceResultMeshes = [];
    }

    moveCameraToInterferencePoint(pointIndex, onAfterMoveCallback) {
        if (this._DTDWeb.functionMode !== DTDPlayer.FunctionMode.INTERFERENCE_CHECK ||
            pointIndex >= this._interferenceResultMeshes.length) {
            return;
        }

        if (this._interferenceResultMeshes[pointIndex]) {
            const isNeedUnfreeze = this._DTDWeb.modelManager.isActiveMeshesFrozen;
            if (isNeedUnfreeze) {
                this._DTDWeb.modelManager.unfreezeActiveMeshes();
            }

            for (const interferenceSphere of this._interferenceResultMeshes) {
                interferenceSphere.material = this._DTDWeb.modelManager.getMaterialFromRGBA(0, 0, 255, 30);
            }

            const interferenceSphere = this._interferenceResultMeshes[pointIndex];
            interferenceSphere.material = this._DTDWeb.modelManager.getMaterialFromRGBA(255, 0, 0, 30);

            if (interferenceSphere.intersectedMeshes) {
                const intersectedMeshes = interferenceSphere.intersectedMeshes;

                this._DTDWeb.inputController.deselectAllMeshes();

                this._DTDWeb.inputController.selectMesh(intersectedMeshes[0], true);
                this._DTDWeb.inputController.selectMesh(intersectedMeshes[1], false);
            }

            this._DTDWeb.cameraController.moveCameraToMesh(interferenceSphere, BABYLON.Tools.ToRadians(270), BABYLON.Tools.ToRadians(50), 0.5, onAfterMoveCallback);

            if (isNeedUnfreeze) {
                this._DTDWeb.modelManager.freezeActiveMeshes();
            }
        }
    }
}

export { DTDWebInterferenceCheckController };