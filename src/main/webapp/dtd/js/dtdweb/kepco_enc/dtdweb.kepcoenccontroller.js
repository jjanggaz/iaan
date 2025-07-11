import { DTDWeb } from '../dtdweb.js';

class KEPCOENCController {
    constructor(dtdWeb) {
        this._DTDWeb = dtdWeb;
        this._scene = dtdWeb.scene;

        this._gui3DManager = new BABYLON.GUI.GUI3DManager(this._scene);
    }

    hasRootValve() {
        const rootValveMeshes = this._DTDWeb.parameterController.getMeshesByParameters([
            [{ key: 'TAG', value: '' }]
        ]);
        return rootValveMeshes.length > 0;
    }

    getDefaultRootValveTags() {
        const rootValveMeshes = this._DTDWeb.parameterController.getMeshesByParameters([
            [{ key: 'TAG', value: '' }]
        ], true);

        if (rootValveMeshes.length > 0) {
            const parameters = this._DTDWeb.parameterController.getParametersByMesh(rootValveMeshes[0]);
            return parameters['TAG'];
        }

        return undefined;
    }

    getRootValveMeshFromTag(rootValveTag) {
        const rootValveMeshes = this._DTDWeb.parameterController.getMeshesByParameters([
            [{ key: 'TAG', value: rootValveTag }]
        ], true);

        if (rootValveMeshes.length > 0) {
            return rootValveMeshes[0];
        }

        return undefined;
    }

    isSymbolMesh(mesh) {
        if (this._DTDWeb.modelManager.getMeshFromId(mesh.id) === undefined) {
            return false;
        }
        if (mesh.symbolProperty) {
            return true;
        }

        const parameters = this._DTDWeb.parameterController.getParametersByMesh(mesh);
        const handle = parameters['HANDLE'];
        if (handle && handle !== 'null') {
            return true;
        }

        return false;
    }

    isRootValveMesh(mesh) {
        if (!this.isSymbolMesh(mesh)) {
            return false;
        }

        if (mesh.symbolProperty && mesh.symbolProperty.GUBUN === 'ROOT_VALVE') {
            return true;
        }

        const parameters = this._DTDWeb.parameterController.getParametersByMesh(mesh);
        const tag = parameters['TAG'];
        if (tag && tag !== 'null') {
            return true;
        }

        return false;
    }

    moveCameraToRootValvePosition(rootValveTag, isXrayCoveredMesh) {
        const rootValveMesh = this.getRootValveMeshFromTag(rootValveTag);
        if (rootValveMesh) {
            this._DTDWeb.cameraController.moveCameraToMesh(rootValveMesh, BABYLON.Tools.ToRadians(270), BABYLON.Tools.ToRadians(45), 2, () => {
                if (isXrayCoveredMesh) {
                    const mainCamera = this._DTDWeb.cameraController.mainCamera;
                    const distance = BABYLON.Vector3.Distance(mainCamera.target, mainCamera.position);
                    const ray = mainCamera.getForwardRay(distance);
                    const raycastHits = this._DTDWeb.scene.multiPickWithRay(ray, (pickedMesh) => {
                        if (!pickedMesh.isPickable) {
                            return false;
                        }

                        const meshId = pickedMesh.id;
                        if (rootValveMesh.id === meshId || !this._DTDWeb.modelManager.getMeshFromId(meshId)) {
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
    }

    runRootValvePathTracking(rootValveTag, animateDelay, animateSpeed, cameraRadius) {
        const rootValveMesh = this.getRootValveMeshFromTag(rootValveTag);
        if (rootValveMesh) {
            this._DTDWeb.pathTrackingController.runPathTracking(rootValveMesh, animateDelay, animateSpeed, cameraRadius);
        }
    }

    onPathTrackingEnd(pathTrackingMesh) {
        if (pathTrackingMesh === undefined || !this.isSymbolMesh(pathTrackingMesh)) {
            return;
        }

        this._scene.onAfterRenderObservable.addOnce(() => {
            const camera = this._DTDWeb.cameraController.mainCamera;
            const distance = BABYLON.Vector3.Distance(camera.target, camera.position);
            const ray = camera.getForwardRay(distance);
            const raycastHits = this._scene.multiPickWithRay(ray);
            for (const raycastHit of raycastHits) {
                if (raycastHit.hit && !this.isSymbolMesh(raycastHit.pickedMesh)) {
                    let cameraAlpha = camera.alpha + BABYLON.Tools.ToRadians(180);

                    const cameraAnimations = [];
                    cameraAnimations.push(this._DTDWeb.cameraController.animateCameraAlpha(cameraAlpha));

                    this._DTDWeb.cameraController.onMainCameraAnimationStart();
                    camera.animations = cameraAnimations;

                    this._DTDWeb.cameraController._mainCameraAnimation = this._scene.beginAnimation(camera, 0, DTDWeb.Camera.CAMERA_ANIMATION_FRAMERATE, false, 1.5);
                    this._DTDWeb.cameraController._mainCameraAnimation.onAnimationEnd = () => {
                        this._DTDWeb.cameraController.onMainCameraAnimationEnd();
                    };
                    return;
                }
            }
        });
    }

    createSymbolTextUI(symbolMesh, position, text) {
        const anchor = new BABYLON.AbstractMesh(`${symbolMesh.id}_Anchor`);

        const symbolTextButton = new BABYLON.GUI.HolographicButton(`${symbolMesh.id}_SymbolTextButton`);
        this._gui3DManager.addControl(symbolTextButton);

        symbolTextButton.linkToTransformNode(anchor);
        symbolTextButton.scaling.set(0.1, 0.05, 0.01);
        symbolTextButton.mesh.getChildren()[1].scaling.x = 1;
        symbolTextButton.mesh.getChildren()[1].scaling.y = 2;
        symbolTextButton.mesh.getChildren()[1].scaling.z = 1;
        symbolTextButton.mesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
        symbolTextButton.mesh.isPickable = false;
        symbolTextButton.backMaterial.albedoColor = BABYLON.Color3.Black();

        const symbolText = new BABYLON.GUI.TextBlock();
        symbolText.text = text;
        symbolText.color = 'white';
        symbolText.fontSize = text.length > 8 ? 40 : 60;

        symbolTextButton.content = symbolText;
        symbolTextButton.position.set(position.x, position.y, position.z);
    }
}

export { KEPCOENCController };