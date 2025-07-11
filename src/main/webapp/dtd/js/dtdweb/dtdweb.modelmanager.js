import { DTDFormat_0x00100007 } from './dtdformat_0x00100007.js';
import { DTDFormat_0x00200000 } from './dtdformat_0x00200000.js';

import { DTDWeb } from './dtdweb.js';

class DTDWebModelManager {
    constructor(dtdWeb) {
        this._DTDWeb = dtdWeb;
        this._engine = dtdWeb.engine;
        this._scene = dtdWeb.scene;

        this._modelRoot = undefined; // Model Root TransformNode
        this._dtdxRoots = []; // Model Root Mesh

        this._materialDictionary = {};
        this._meshDictionary = {};
        this._connectorDataDictionary = {};

        this._fileMeshDictionary = {};

        this._unfreezeMeshes = [];

        this._isActiveMeshesFrozen = false;
        this._isNeedFreezeActiveMeshes = false;
        this._freezeActiveMeshesCallback = [];

        this._gridGround = undefined;
        this._walkModeGround = undefined;

        this._sizeTextMaterial = undefined;
        this._sizeXTextMesh = undefined;
        this._sizeYTextMesh = undefined;
        this._sizeZTextMesh = undefined;

        this._sizeXLineMesh = undefined;
        this._sizeYLineMesh = undefined;
        this._sizeZLineMesh = undefined;

        this._highlightMaterial = this.getMaterialFromRGBA(220, 220, 0, 255);
        this._xrayMaterial = this.getMaterialFromRGBA(217, 217, 217, 36);

        if (this._DTDWeb.useGridGround) {
            this._gridGroundMaterial = new BABYLON.GridMaterial("GridGroundMaterial", this._scene);
            this._gridGroundMaterial.majorUnitFrequency = 5;
            this._gridGroundMaterial.minorUnitVisibility = 0.5;
            this._gridGroundMaterial.gridRatio = 1;
            this._gridGroundMaterial.backFaceCulling = false;
            this._gridGroundMaterial.mainColor = BABYLON.Color3.Black();
            this._gridGroundMaterial.lineColor = BABYLON.Color3.White();
            this._gridGroundMaterial.opacity = 0.9;
            this._gridGroundMaterial.freeze();
        }

        this._octree = undefined;

        this._sizeTextMeshFontData = undefined;

        if (this._DTDWeb.useFreeze) {
            this._scene.onBeforeRenderObservable.add(() => {
                if (this._isNeedFreezeActiveMeshes) {
                    this._isNeedFreezeActiveMeshes = false;
                    this._isActiveMeshesFrozen = true;

                    this._scene.freezeActiveMeshes(true, () => {
                        if (this._unfreezeMeshes.length > 0) {
                            for (const unfreezeMesh of this._unfreezeMeshes) {
                                if (unfreezeMesh) {
                                    unfreezeMesh._unFreeze();
                                }
                            }

                            this._scene.onAfterRenderObservable.addOnce(() => {
                                for (const unfreezeMesh of this._unfreezeMeshes) {
                                    if (unfreezeMesh) {
                                        unfreezeMesh._freeze();
                                    }
                                }

                                this._unfreezeMeshes = [];
                            });
                        }

                        if (this._freezeActiveMeshesCallback.length > 0) {
                            for (const callback of this._freezeActiveMeshesCallback) {
                                callback();
                            }
                            this._freezeActiveMeshesCallback = [];
                        }
                    }, undefined, true, false);
                }
            });
        }
    }

    get fileMeshDictionary() {
        return this._fileMeshDictionary;
    }

    get connectorDataDictionary() {
        return this._connectorDataDictionary;
    }

    get isActiveMeshesFrozen() {
        return this._isActiveMeshesFrozen;
    }

    async loadDTDXFile(uri, isUrl, isLoadFileOnly) {
        try {
            const dtdxFileName = isUrl ? DTDWeb.Utility.GetFileNameFromUrl(uri) : uri.name;

            if (this.isAlreadyOpenedModel(dtdxFileName)) {
                return true;
            }

            let performanceStartTime = performance.now();

            const resultArrayBuffer = isUrl ? await DTDWeb.Utility.LoadFileFromUrl(uri, false) : await DTDWeb.Utility.LoadFileFromLocal(uri, false);
            if (resultArrayBuffer === undefined) {
                return false;
            }

            const version = new Int32Array(resultArrayBuffer.slice(2, 6))[0];
            let dtdFormat = undefined;
            if (version === 0x00100007) {
                dtdFormat = new DTDFormat_0x00100007(resultArrayBuffer, dtdxFileName);
            }
            else if (version === 0x00200000) {
                dtdFormat = new DTDFormat_0x00200000(resultArrayBuffer, dtdxFileName);
            }

            if (isLoadFileOnly) {
                return dtdFormat;
            }
            else {
                let performanceEndTime = performance.now();
                console.log(`${dtdxFileName} LOAD DTDX FILE: ${(performanceEndTime - performanceStartTime) / 1000} seconds`);

                return this.loadDTDFormat(dtdFormat, dtdxFileName);
            }
        }
        catch (error) {
            console.error(error);

            return false;
        }
    }

    loadDTDFormat(dtdFormat, dtdxFileName) {
        try {
            this.unfreezeActiveMeshes();

            Object.assign(this._connectorDataDictionary, dtdFormat.connectorDataDictionary);

            let performanceStartTime = performance.now();

            const dtdxRoot = this.createDTDXRoot(dtdxFileName);

            const materialArray = this.loadMaterials(dtdFormat.materialDataArray, dtdFormat.isAllMaterialTransparent);

            this._scene.blockfreeActiveMeshesAndRenderingGroups = true;

            this.loadMeshes(dtdxRoot, dtdFormat.meshDataDictionary, materialArray);

            this.loadLinkMeshes(dtdxRoot, dtdFormat.linkMeshDataDictionary);

            this._scene.blockfreeActiveMeshesAndRenderingGroups = false;

            let performanceEndTime = performance.now();
            console.log(`${dtdxFileName} CREATE MESHES: ${(performanceEndTime - performanceStartTime) / 1000} seconds`);

            return true;
        }
        catch (error) {
            console.error(error);

            return false;
        }
    }

    loadMaterials(materialDataArray, isAllMaterialTransparent) {
        const materialArray = [];

        for (const materialData of materialDataArray) {
            const colorR = materialData.diffuse[0];
            const colorG = materialData.diffuse[1];
            const colorB = materialData.diffuse[2];
            const alpha = materialData.alpha;

            const forceMaterialId = materialData.textureDataArray && materialData.textureDataArray.length > 0 ? materialData.id : undefined;
            const material = this.getMaterialFromRGBA(colorR, colorG, colorB, isAllMaterialTransparent ? 255 : alpha, forceMaterialId);
            if (forceMaterialId) {
                for (const textureData of materialData.textureDataArray) {
                    const textureBlob = textureData.textureBlob;
                    const textureUrl = URL.createObjectURL(textureBlob);
                    const texture = new BABYLON.Texture(textureUrl, this._scene);

                    if (textureData.textureType === 'diffuse') {
                        if (this._DTDWeb.usePBRMaterial) {
                            material.albedoTexture = texture;
                            material.useAlphaFromAlbedoTextureSearch = true;
                        }
                        else {
                            material.diffuseTexture = texture;
                            material.useAlphaFromDiffuseTexture = true;
                        }
                    }
                }
            }
            materialArray.push(material);
        }

        return materialArray;
    }

    loadMeshes(dtdxRoot, meshDataDictionary, materialArray, doNotManagement) {
        const meshes = [];

        for (const meshId in meshDataDictionary) {
            const meshData = meshDataDictionary[meshId];
            const mesh = new BABYLON.Mesh(meshId, this._scene);
            mesh.parent = dtdxRoot;
            mesh.position.set(meshData.pivot[0], meshData.pivot[1], meshData.pivot[2]);
            if (meshData.rotation && meshData.rotation.length >= 3) {
                mesh.rotation = BABYLON.Vector3.Zero();
                mesh.rotation.x = BABYLON.Tools.ToRadians(meshData.rotation[0]);
                mesh.rotation.y = BABYLON.Tools.ToRadians(meshData.rotation[1]);
                mesh.rotation.z = BABYLON.Tools.ToRadians(meshData.rotation[2]);
            }
            if (meshData.scale && meshData.scale.length >= 3) {
                mesh.scaling.set(meshData.scale[0], meshData.scale[1], meshData.scale[2]);
            }
            mesh.layerMask = DTDWeb.Camera.LAYER_MASK.MESH;
            mesh.isPickable = true;
            mesh.cullingStrategy = DTDWeb.Mesh.MESH_CULLING_STRATEGY;
            if (this._DTDWeb.useFreeze) {
                mesh.alwaysSelectAsActiveMesh = true;
            }
            mesh.meshData = meshData;
            mesh.isLinkMesh = false;
            mesh.isEffectMesh = false;
            mesh.effectType = DTDWeb.Mesh.MESH_EFFECT_TYPE.NORMAL;

            let indices = [];
            for (let subMeshIndex = 0; subMeshIndex < meshData.indices.length; subMeshIndex++) {
                indices = indices.concat(Array.from(meshData.indices[subMeshIndex]));
            }

            const normals = [];

            BABYLON.VertexData.ComputeNormals(meshData.vertices, indices, normals);

            const vertexData = new BABYLON.VertexData();
            vertexData.positions = meshData.vertices;
            vertexData.indices = indices;
            vertexData.normals = normals;
            if (meshData.uvData) {
                vertexData.uvs = meshData.uvData;
            }
            vertexData.applyToMesh(mesh);

            // Sub Mesh Start
            mesh.subMeshes = [];
            const verticesCount = mesh.getTotalVertices();
            let startIndex = 0;
            for (let subMeshIndex = 0; subMeshIndex < meshData.indices.length; subMeshIndex++) {
                new BABYLON.SubMesh(subMeshIndex, 0, verticesCount, startIndex, meshData.indices[subMeshIndex].length, mesh);
                startIndex += meshData.indices[subMeshIndex].length;
            }
            // Sub Mesh End

            const materialIndexArray = meshData.materialArray;
            if (materialArray.length > 0 && materialIndexArray.length > 0) {
                if (mesh.subMeshes.length === 1) {
                    mesh.material = materialArray[meshData.materialArray[0]];
                }
                else {
                    const multiMaterial = new BABYLON.MultiMaterial(meshId + '_materials', this._scene);
                    for (const materialIndex of materialIndexArray) {
                        const material = materialArray[materialIndex];
                        multiMaterial.subMaterials.push(material);
                    }

                    mesh.material = multiMaterial;
                }

                if (!this._DTDWeb.useInstance) {
                    mesh.originMaterial = mesh.material;
                }
            }

            meshes.push(mesh);

            if (!doNotManagement) {
                this.addMesh(dtdxRoot.id, meshId, mesh);
            }
        }

        return meshes;
    }

    loadLinkMeshes(dtdxRoot, linkMeshDataDictionary, doNotManagement) {
        const linkMeshes = [];

        for (const linkMeshId in linkMeshDataDictionary) {
            const linkMeshData = linkMeshDataDictionary[linkMeshId];
            const sourceMesh = this.getMeshFromId(linkMeshData.linkId);
            const linkMesh = this._DTDWeb.useInstance ? sourceMesh.createInstance(linkMeshId) : sourceMesh.clone(linkMeshId);
            // clone 시 생성되는 id로 인해 강제로 id를 넣어줌
            linkMesh.id = linkMeshId;
            linkMesh.parent = dtdxRoot;
            linkMesh.position.set(linkMeshData.pivot[0], linkMeshData.pivot[1], linkMeshData.pivot[2]);
            if (linkMeshData.rotation && linkMeshData.rotation.length >= 3) {
                linkMesh.rotation = BABYLON.Vector3.Zero();
                linkMesh.rotation.x = BABYLON.Tools.ToRadians(linkMeshData.rotation[0]);
                linkMesh.rotation.y = BABYLON.Tools.ToRadians(linkMeshData.rotation[1]);
                linkMesh.rotation.z = BABYLON.Tools.ToRadians(linkMeshData.rotation[2]);
            }
            if (linkMeshData.scale && linkMeshData.scale.length >= 3)
                linkMesh.scaling.set(linkMeshData.scale[0], linkMeshData.scale[1], linkMeshData.scale[2]);
            linkMesh.layerMask = DTDWeb.Camera.LAYER_MASK.MESH;
            linkMesh.isPickable = true;
            linkMesh.cullingStrategy = DTDWeb.Mesh.MESH_CULLING_STRATEGY;
            if (this._DTDWeb.useFreeze) {
                linkMesh.alwaysSelectAsActiveMesh = true;
            }

            linkMesh.meshData = linkMeshData;
            linkMesh.isLinkMesh = true;
            linkMesh.linkId = linkMeshData.linkId;
            linkMesh.isEffectMesh = false;
            linkMesh.effectType = DTDWeb.Mesh.MESH_EFFECT_TYPE.NORMAL;
            if (!this._DTDWeb.useInstance) {
                linkMesh.originMaterial = linkMesh.material;
            }

            linkMeshes.push(linkMesh);

            if (!doNotManagement) {
                this.addMesh(dtdxRoot.id, linkMeshId, linkMesh);
            }
        }

        return linkMeshes;
    }

    onModelLoaded() {
        this.computeAllMeshesBoundingInfo();

        this._DTDWeb.cameraController.cameraMode = DTDWeb.Camera.CAMERA_MODE.FLY_MODE;
        this._DTDWeb.cameraController.resetCameraPosition();

        this.createOrUpdateGround();

        this.createSelectionOctree();

        this._isActiveMeshesFrozen = false;
        this.freezeActiveMeshes(() => {
            this._DTDWeb.onModelLoaded();
        });
    }

    computeAllMeshesBoundingInfo() {
        let meshes = this.getMeshes();
        for (const mesh of meshes) {
            mesh.computeWorldMatrix(true);
            mesh.freezeWorldMatrix();
        }

        this._modelRoot.setBoundingInfo(DTDWeb.Utility.ComputeBoundingInfo(meshes));
    }

    createOrUpdateGround() {
        if (!this._walkModeGround) {
            this._walkModeGround = BABYLON.MeshBuilder.CreateGround('WalkModeGround', { width: 5000, height: 5000, subDivision: 1 }, this._scene);
            this._walkModeGround.parent = this._modelRoot;
            this._walkModeGround.id = 'WalkModeGround';
            this._walkModeGround.layerMask = DTDWeb.Camera.LAYER_MASK.NONE;
            this._walkModeGround.isPickable = true;
            this._walkModeGround.checkCollisions = true;

            this._DTDWeb.inputController.addExceptSelectMesh(this._walkModeGround);
        }

        const totalSize = this.getRootBoundingSize();
        const centerPosition = this.getRootBoundingCenter();
        const minimumY = this.getRootBoundingMinimumY();

        this._walkModeGround.unfreezeWorldMatrix();
        this._walkModeGround.position.set(centerPosition.x, minimumY, centerPosition.z);
        this._walkModeGround.computeWorldMatrix(true);
        this._walkModeGround.freezeWorldMatrix();

        if (this._DTDWeb.useGridGround) {
            if (this._gridGround) {
                this._gridGround.dispose();
                this._gridGround = undefined;
            }

            if (totalSize.x > 1 && totalSize.z > 1) {
                this._gridGround = BABYLON.MeshBuilder.CreateGround('GridGround', { width: totalSize.x, height: totalSize.z, subDivision: 1 }, this._scene);
                this._gridGround.parent = this._modelRoot;
                this._gridGround.id = 'GridGround';
                this._gridGround.position.set(centerPosition.x, minimumY, centerPosition.z);
                this._gridGround.isPickable = false;
                this._gridGround.material = this._gridGroundMaterial;
                this._gridGround.layerMask = DTDWeb.Camera.LAYER_MASK.TOOL;
                if (this._DTDWeb.useFreeze) {
                    this._gridGround.alwaysSelectAsActiveMesh = true;
                }
            }

            fetch(`${DTDPlayer.FONT_DIRECTORY}/Arial-Regular.json`)
                .then(response => response.json()).then((fontJSON) => {
                    this._sizeTextMeshFontData = fontJSON;

                    this.createRootBoundingMeasure(this.getRootBoundingBox());
                });
        }
    }

    createRootBoundingMeasure(boundingBox) {
        const totalSize = boundingBox.extendSizeWorld.scale(2);

        const centerPosition = boundingBox.centerWorld;

        const minimumX = boundingBox.minimumWorld.x;
        const maximumX = boundingBox.maximumWorld.x;
        const minimumY = boundingBox.minimumWorld.y;
        const maximumY = boundingBox.maximumWorld.y;
        const minimumZ = boundingBox.minimumWorld.z;
        const maximumZ = boundingBox.maximumWorld.z;

        const fontPositionOffset = totalSize.length() * 0.05;
        const fontSize = totalSize.length() * 0.015;

        if (!this._sizeTextMaterial) {
            this._sizeTextMaterial = new BABYLON.StandardMaterial('SizeTextMaterial', this._scene);
            this._sizeTextMaterial.disableLighting = true;
            this._sizeTextMaterial.emissiveColor = BABYLON.Color3.White();
            this._sizeTextMaterial.backFaceCulling = false;
            this._sizeTextMaterial.checkReadyOnEveryCall = false;
            this._sizeTextMaterial.freeze();
        }

        if (this._sizeXTextMesh) {
            this._sizeXTextMesh.dispose();
            this._sizeXTextMesh = undefined;
        }

        this._sizeXTextMesh = BABYLON.MeshBuilder.CreateText('SizeXTextMesh', `${totalSize.x.toFixed(2)}m`, this._sizeTextMeshFontData, {
            size: fontSize, depth: 0.0001, resolution: 64
        }, this._scene);
        this._sizeXTextMesh.position.set(centerPosition.x, minimumY, maximumZ + fontPositionOffset);
        this._sizeXTextMesh.rotation.x = BABYLON.Tools.ToRadians(90);
        this._sizeXTextMesh.material = this._sizeTextMaterial;
        this._sizeXTextMesh.isPickable = false;
        this._sizeXTextMesh.layerMask = DTDWeb.Camera.LAYER_MASK.TOOL;
        if (this._DTDWeb.useFreeze) {
            this._sizeXTextMesh.alwaysSelectAsActiveMesh = true;
        }

        if (this._sizeYTextMesh) {
            this._sizeYTextMesh.dispose();
            this._sizeYTextMesh = undefined;
        }

        this._sizeYTextMesh = BABYLON.MeshBuilder.CreateText('SizeYTextMesh', `${totalSize.y.toFixed(2)}m`, this._sizeTextMeshFontData, {
            size: fontSize, depth: 0.0001, resolution: 64
        }, this._scene);
        this._sizeYTextMesh.position.set(minimumX - fontPositionOffset, centerPosition.y, maximumZ);
        this._sizeYTextMesh.rotation.z = BABYLON.Tools.ToRadians(90);
        this._sizeYTextMesh.material = this._sizeTextMaterial;
        this._sizeYTextMesh.isPickable = false;
        this._sizeYTextMesh.layerMask = DTDWeb.Camera.LAYER_MASK.TOOL;
        if (this._DTDWeb.useFreeze) {
            this._sizeYTextMesh.alwaysSelectAsActiveMesh = true;
        }

        if (this._sizeZTextMesh) {
            this._sizeZTextMesh.dispose();
            this._sizeZTextMesh = undefined;
        }

        this._sizeZTextMesh = BABYLON.MeshBuilder.CreateText('SizeZTextMesh', `${totalSize.z.toFixed(2)}m`, this._sizeTextMeshFontData, {
            size: fontSize, depth: 0.0001, resolution: 64
        }, this._scene);
        this._sizeZTextMesh.position.set(maximumX + fontPositionOffset, minimumY, centerPosition.z);
        this._sizeZTextMesh.rotation.x = BABYLON.Tools.ToRadians(90);
        this._sizeZTextMesh.rotation.y = BABYLON.Tools.ToRadians(90);
        this._sizeZTextMesh.material = this._sizeTextMaterial;
        this._sizeZTextMesh.isPickable = false;
        this._sizeZTextMesh.layerMask = DTDWeb.Camera.LAYER_MASK.TOOL;
        if (this._DTDWeb.useFreeze) {
            this._sizeZTextMesh.alwaysSelectAsActiveMesh = true;
        }

        const linePositionOffset1 = totalSize.length() * 0.01;
        const linePositionOffset2 = totalSize.length() * 0.04;

        const lineXPoints = [];
        lineXPoints.push(new BABYLON.Vector3(minimumX, minimumY, maximumZ + linePositionOffset1));
        lineXPoints.push(new BABYLON.Vector3(minimumX, minimumY, maximumZ + linePositionOffset2));
        lineXPoints.push(new BABYLON.Vector3(maximumX, minimumY, maximumZ + linePositionOffset2));
        lineXPoints.push(new BABYLON.Vector3(maximumX, minimumY, maximumZ + linePositionOffset1));

        if (this._sizeXLineMesh) {
            this._sizeXLineMesh.dispose();
            this._sizeXLineMesh = undefined;
        }

        this._sizeXLineMesh = BABYLON.MeshBuilder.CreateLines('SizeXLineMesh', {
            points: lineXPoints
        }, this._scene);
        this._sizeXLineMesh.isPickable = false;
        this._sizeXLineMesh.layerMask = DTDWeb.Camera.LAYER_MASK.TOOL;
        if (this._DTDWeb.useFreeze) {
            this._sizeXLineMesh.alwaysSelectAsActiveMesh = true;
        }

        const lineYPoints = [];
        lineYPoints.push(new BABYLON.Vector3(minimumX - linePositionOffset1, minimumY, maximumZ));
        lineYPoints.push(new BABYLON.Vector3(minimumX - linePositionOffset2, minimumY, maximumZ));
        lineYPoints.push(new BABYLON.Vector3(minimumX - linePositionOffset2, maximumY, maximumZ));
        lineYPoints.push(new BABYLON.Vector3(minimumX - linePositionOffset1, maximumY, maximumZ));

        if (this._sizeYLineMesh) {
            this._sizeYLineMesh.dispose();
            this._sizeYLineMesh = undefined;
        }

        this._sizeYLineMesh = BABYLON.MeshBuilder.CreateLines('SizeYLineMesh', {
            points: lineYPoints
        }, this._scene);
        this._sizeYLineMesh.isPickable = false;
        this._sizeYLineMesh.layerMask = DTDWeb.Camera.LAYER_MASK.TOOL;
        if (this._DTDWeb.useFreeze) {
            this._sizeYLineMesh.alwaysSelectAsActiveMesh = true;
        }

        const lineZPoints = [];
        lineZPoints.push(new BABYLON.Vector3(maximumX + linePositionOffset1, minimumY, minimumZ));
        lineZPoints.push(new BABYLON.Vector3(maximumX + linePositionOffset2, minimumY, minimumZ));
        lineZPoints.push(new BABYLON.Vector3(maximumX + linePositionOffset2, minimumY, maximumZ));
        lineZPoints.push(new BABYLON.Vector3(maximumX + linePositionOffset1, minimumY, maximumZ));

        if (this._sizeZLineMesh) {
            this._sizeZLineMesh.dispose();
            this._sizeZLineMesh = undefined;
        }

        this._sizeZLineMesh = BABYLON.MeshBuilder.CreateLines('SizeZLineMesh', {
            points: lineZPoints
        }, this._scene);
        this._sizeZLineMesh.isPickable = false;
        this._sizeZLineMesh.layerMask = DTDWeb.Camera.LAYER_MASK.TOOL;
        if (this._DTDWeb.useFreeze) {
            this._sizeZLineMesh.alwaysSelectAsActiveMesh = true;
        }
    }

    createSelectionOctree() {
        this._octree = new BABYLON.Octree(BABYLON.Octree.CreationFuncForMeshes, 32, 4);

        const meshes = this.getMeshes();

        this.updateSelectionOctree(meshes);

        this._scene._selectionOctree = this._octree;
        if (!this._DTDWeb.useFreeze) {
            this._scene.cullingStrategy = 'octree';
        }

        // DTDWeb.Utility.ShowOctreeBlocks(this._octree.blocks, this._scene);
    }

    updateSelectionOctree(meshes) {
        const minimum = this._modelRoot.getBoundingInfo().boundingBox.minimumWorld;
        const maximum = this._modelRoot.getBoundingInfo().boundingBox.maximumWorld;

        this._octree.update(minimum, maximum, meshes);
    }

    mergeMeshesBySelectionOctree() {
        if (this._octree === undefined || this._octree.blocks === undefined || this._octree.blocks.length === 0) {
            return;
        }

        const meshes = [];
        this.mergeBlockMeshes(this._octree.blocks, meshes);

        if (meshes.length > 0) {
            this.updateSelectionOctree(meshes);
        }
    }

    mergeBlockMeshes(blocks, resultMeshes) {
        for (const block of blocks) {
            if (block.blocks) {
                this.mergeBlockMeshes(block.blocks, resultMeshes);
            }

            if (block.entries.length > 0) {
                const blockMeshes = block.entries;
                if (block.entries.length === 1) {
                    resultMeshes.push(blockMeshes[0]);
                    continue;
                }

                const mergedMesh = BABYLON.Mesh.MergeMeshes(blockMeshes, false, true, undefined, true, true);
                if (this._DTDWeb.useFreeze) {
                    mergedMesh.alwaysSelectAsActiveMesh = true;
                }

                for (const blockMesh of blockMeshes) {
                    this._octree.removeMesh(blockMesh);
                    delete this._meshDictionary[blockMesh.id];
                    blockMesh.dispose();
                }

                resultMeshes.push(mergedMesh);
            }
        }
    }

    getMaterialFromRGBA(inputColorR, inputColorG, inputColorB, inputAlpha, forceMaterialId) {
        const colorR = Number(inputColorR) / 255;
        const colorG = Number(inputColorG) / 255;
        const colorB = Number(inputColorB) / 255;
        let alpha = Number(inputAlpha);
        alpha = alpha > 0 ? alpha / 255 : 0;

        const materialId = forceMaterialId ? forceMaterialId : `RGBA_${inputColorR}_${inputColorG}_${inputColorB}_${inputAlpha}`;

        let material = this._materialDictionary[materialId];
        if (!material) {
            if (this._DTDWeb.usePBRMaterial) {
                material = new BABYLON.PBRMaterial(materialId, this._scene);
                material.albedoColor = new BABYLON.Color3(colorR, colorG, colorB).toLinearSpace();
                material.roughness = 1;
                material.metallic = 0;
                material.specularIntensity = 0;
            }
            else {
                material = new BABYLON.StandardMaterial(materialId, this._scene);
                material.diffuseColor = new BABYLON.Color3(colorR, colorG, colorB);
                material.specularColor = BABYLON.Color3.Black();
            }

            material.alpha = alpha;
            material.id = materialId;
            material.backFaceCulling = false;
            material.checkReadyOnEveryCall = false;
            material.freeze();

            this._materialDictionary[materialId] = material;
        }

        return material;
    }

    getRootBoundingCenter() {
        return this._modelRoot.getBoundingInfo().boundingBox.centerWorld.clone();
    }

    getRootBoundingHalfSizeX() {
        return this._modelRoot.getBoundingInfo().boundingBox.extendSizeWorld.x;
    }

    getRootBoundingHalfSizeZ() {
        return this._modelRoot.getBoundingInfo().boundingBox.extendSizeWorld.z;
    }

    getRootBoundingMinimumX() {
        return this._modelRoot.getBoundingInfo().boundingBox.minimumWorld.x;
    }

    getRootBoundingMaximumX() {
        return this._modelRoot.getBoundingInfo().boundingBox.maximumWorld.x;
    }

    getRootBoundingMinimumY() {
        return this._modelRoot.getBoundingInfo().boundingBox.minimumWorld.y;
    }

    getRootBoundingMaximumY() {
        return this._modelRoot.getBoundingInfo().boundingBox.maximumWorld.y;
    }

    getRootBoundingMinimumZ() {
        return this._modelRoot.getBoundingInfo().boundingBox.minimumWorld.z;
    }

    getRootBoundingMaximumZ() {
        return this._modelRoot.getBoundingInfo().boundingBox.maximumWorld.z;
    }

    getRootBoundingSize() {
        return this._modelRoot.getBoundingInfo().boundingBox.extendSizeWorld.scale(2);
    }

    getRootBoundingBox() {
        return this._modelRoot.getBoundingInfo().boundingBox;
    }

    getRootRadius() {
        const size = this._modelRoot.getBoundingInfo().boundingBox.extendSizeWorld.scale(2);
        return Math.max(size.x, size.y, size.z);
    }

    createDTDXRoot(fileName) {
        if (!this._modelRoot) {
            // Pick 방지용 TransformNode
            const transformNode = new BABYLON.TransformNode('Root');
            this._modelRoot = new BABYLON.Mesh('ModelRoot');
            this._modelRoot.parent = transformNode;
        }

        const dtdxRoot = new BABYLON.Mesh(fileName);
        dtdxRoot.parent = this._modelRoot;
        dtdxRoot.renderingGroupId = 0;

        this._dtdxRoots.push(dtdxRoot);

        return dtdxRoot;
    }

    addMesh(fileName, meshId, mesh) {
        this._meshDictionary[meshId] = mesh;

        if (this._fileMeshDictionary[fileName] === undefined) {
            this._fileMeshDictionary[fileName] = {};
        }

        const parameterMeshId = meshId.replace(`[${fileName}]`, '');
        this._fileMeshDictionary[fileName][parameterMeshId] = mesh;
    }

    getMeshFromId(meshId) {
        return this._meshDictionary[meshId];
    }

    getLinkMeshesFromId(meshId) {
        const linkMeshes = [];

        const meshes = this.getMeshes();
        for (const mesh of meshes) {
            if (mesh.isAnInstance && mesh.meshData.linkId === meshId) {
                linkMeshes.push(mesh);
            }
        }

        return linkMeshes;
    }

    getMeshesFromFileName(fileName) {
        if (this._fileMeshDictionary[fileName]) {
            return Object.values(this._fileMeshDictionary[fileName]);
        }

        return [];
    }

    getMeshes() {
        return Object.values(this._meshDictionary);
    }

    getInverseMeshes(foundMeshes) {
        const inverseMeshes = [];

        const meshes = this.getMeshes();
        for (const mesh of meshes) {
            let isContains = false;
            for (const foundMesh of foundMeshes) {
                if (mesh.id === foundMesh.id) {
                    isContains = true;
                    break;
                }
            }

            if (!isContains) {
                inverseMeshes.push(mesh);
            }
        }

        return inverseMeshes;
    }

    getOriginMesh(mesh) {
        return mesh.isEffectMesh ? mesh.originMesh : mesh;
    }

    getEffectMesh(mesh) {
        return mesh.effectMesh ? mesh.effectMesh : mesh;
    }

    getMeshEffectType(mesh) {
        return mesh.effectMesh ? mesh.effectMesh.effectType : mesh.effectType;
    }

    getFileNames() {
        return Object.keys(this._fileMeshDictionary);
    }

    getConnectedMeshSet(mesh) {
        const meshId = mesh.id;

        const connectedMeshDictionary = {};
        const connectorDatas = [];
        const connectedMeshes = [];

        this.findConnectedMesh(meshId, connectorDatas, connectedMeshDictionary);

        for (const connectedMeshId in connectedMeshDictionary) {
            let connectedMesh = connectedMeshDictionary[connectedMeshId];
            if (!connectedMesh) {
                continue;
            }

            connectedMeshes.push(connectedMesh);
        }

        return new Set(connectedMeshes);
    }

    getConnectorDataSet(mesh) {
        const meshId = mesh.id;

        const connectedMeshDictionary = {};
        const connectorDatas = [];

        this.findConnectedMesh(meshId, connectorDatas, connectedMeshDictionary);

        return new Set(connectorDatas);
    }

    getConnectorDataFromMeshId(meshId) {
        const connectorDatas = [];
        for (const connectorDataId in this._connectorDataDictionary) {
            for (const connectorData of this._connectorDataDictionary[connectorDataId]) {
                if (connectorData.elementOwner === meshId) {
                    connectorDatas.push(connectorData);
                }
            }
        }

        return connectorDatas;
    }

    findConnectedMesh(meshId, connectorDatas, connectedMeshDictionary) {
        for (const connectorDataId in this._connectorDataDictionary) {
            for (const connectorData of this._connectorDataDictionary[connectorDataId]) {
                if (connectorData.elementOwner === meshId) {
                    connectorDatas.push(connectorData);
                    if (!connectedMeshDictionary[connectorData.elementConnect]) {
                        connectedMeshDictionary[connectorData.elementConnect] = this.getMeshFromId(connectorData.elementConnect);

                        if (connectorData.elementConnect !== '-1') {
                            this.findConnectedMesh(connectorData.elementConnect, connectorDatas, connectedMeshDictionary);
                        }
                    }
                }
            }
        }
    }

    isFloor(mesh) {
        if (mesh === this._walkModeGround) {
            return true;
        }

        let isFloor = false;

        const meshData = mesh.meshData;
        if (meshData && meshData.parameterGroupTableArray[0].parameterDictionary[DTDWeb.Parameter.PARAMETER_KEY_TEXT.CATEGORY] === DTDWeb.Parameter.PARAMETER_VALUE_TEXT.FLOOR) {
            isFloor = true;
        }

        return isFloor;
    }

    isAlreadyOpenedModel(fileName) {
        for (const dtdxRoot of this._dtdxRoots) {
            if (dtdxRoot.id === fileName) {
                return true;
            }
        }

        return false;
    }

    effectMeshes(meshes, meshEffectType, colorR, colorG, colorB, alpha) {
        if (meshes.length === 0) {
            return;
        }

        const isNeedUnfreeze = this._isActiveMeshesFrozen;
        if (isNeedUnfreeze) {
            this.unfreezeActiveMeshes();
        }

        for (const mesh of meshes) {
            if (mesh === undefined) {
                continue;
            }

            const targetMesh = this.getEffectMesh(mesh);
            let effectMesh = undefined;
            if (targetMesh) {
                switch (meshEffectType) {
                    case DTDWeb.Mesh.MESH_EFFECT_TYPE.HIGHLIGHT:
                        effectMesh = this.effectHighlight(targetMesh);
                        break;
                    case DTDWeb.Mesh.MESH_EFFECT_TYPE.XRAY:
                        effectMesh = this.effectXray(targetMesh);
                        break;
                    case DTDWeb.Mesh.MESH_EFFECT_TYPE.CHANGE_COLOR:
                        // Revert last effect.
                        if (colorR === undefined || colorG === undefined || colorB === undefined || alpha === undefined) {
                            if (targetMesh.lastColor) {
                                const lastColorR = targetMesh.lastColor.colorR;
                                const lastColorG = targetMesh.lastColor.colorG;
                                const lastColorB = targetMesh.lastColor.colorB;
                                const lastAlpha = targetMesh.lastColor.alpha;

                                effectMesh = this.effectChangeColor(targetMesh, lastColorR, lastColorG, lastColorB, lastAlpha);
                            }
                        }
                        else {
                            effectMesh = this.effectChangeColor(targetMesh, colorR, colorG, colorB, alpha);
                        }
                        break;
                    case DTDWeb.Mesh.MESH_EFFECT_TYPE.INVISIBLE:
                        effectMesh = this.setMeshVisible(targetMesh, false);
                        break;
                    default:
                        effectMesh = this.resetEffect(targetMesh);
                        break;
                }
            }
        }

        if (isNeedUnfreeze) {
            this.freezeActiveMeshes();
        }
    }

    cloneEffectMesh(mesh) {
        // 원본에 생성된 EffectMesh가 있으면 제거
        if (mesh.effectMesh) {
            mesh = this.resetEffect(mesh);
        }
        let effectTargetMesh = mesh;
        if (this._DTDWeb.useInstance) {
            if (!mesh.isEffectMesh) {
                let sourceMesh = mesh.isAnInstance ? mesh.sourceMesh : mesh;
                const cloneMeshId = `${mesh.id}_EffectMesh`;
                const cloneMesh = sourceMesh.clone(cloneMeshId);
                cloneMesh.id = cloneMeshId;
                cloneMesh.parent = mesh.parent;

                const meshPosition = mesh.getAbsolutePosition();
                const meshRotation = mesh.rotationQuaternion === null ?
                    mesh.rotation : mesh.rotationQuaternion.toEulerAngles();

                cloneMesh.position.set(meshPosition.x, meshPosition.y, meshPosition.z);
                cloneMesh.rotation.set(meshRotation.x, meshRotation.y, meshRotation.z);
                cloneMesh.setPivotPoint(BABYLON.Vector3.Zero());

                cloneMesh.meshData = mesh.meshData;
                cloneMesh.originMesh = mesh;
                cloneMesh.isEffectMesh = true;
                cloneMesh.showBoundingBox = false;
                cloneMesh.cullingStrategy = DTDWeb.Mesh.MESH_CULLING_STRATEGY;
                cloneMesh.layerMask = DTDWeb.Camera.LAYER_MASK.MESH;
                cloneMesh.isPickable = false;
                cloneMesh.freezeWorldMatrix();

                if (this._DTDWeb.useFreeze) {
                    cloneMesh.alwaysSelectAsActiveMesh = true;
                }

                if (this._DTDWeb.inputController.isSelectedMesh(mesh)) {
                    const isGizmoAttachedMesh = this._DTDWeb.inputController.isGizmoAttachedMesh(mesh);
                    this._DTDWeb.inputController.deselectMesh(mesh);
                    this._DTDWeb.inputController.selectMesh(cloneMesh, isGizmoAttachedMesh);
                }

                mesh.effectMesh = cloneMesh;
                mesh.layerMask = DTDWeb.Camera.LAYER_MASK.NONE;

                if (this._DTDWeb.useFreeze) {
                    this._unfreezeMeshes.push(mesh.isAnInstance ? sourceMesh : mesh);
                }

                effectTargetMesh = cloneMesh;
            }
        }

        return effectTargetMesh;
    }

    effectHighlight(mesh) {
        const effectMesh = this.cloneEffectMesh(mesh);
        effectMesh.effectType = DTDWeb.Mesh.MESH_EFFECT_TYPE.HIGHLIGHT;
        effectMesh.material = this._highlightMaterial;

        mesh.isPickable = true;

        return effectMesh;
    }

    effectXray(mesh) {
        const effectMesh = this.cloneEffectMesh(mesh);
        effectMesh.effectType = DTDWeb.Mesh.MESH_EFFECT_TYPE.XRAY;
        effectMesh.material = this._xrayMaterial;

        mesh.isPickable = false;

        return effectMesh;
    }

    effectChangeColor(mesh, colorR, colorG, colorB, alpha) {
        const effectMesh = this.cloneEffectMesh(mesh);
        effectMesh.effectType = DTDWeb.Mesh.MESH_EFFECT_TYPE.CHANGE_COLOR;
        effectMesh.material = this.getMaterialFromRGBA(colorR, colorG, colorB, alpha);
        effectMesh.lastColor = { colorR, colorG, colorB, alpha };

        mesh.isPickable = alpha > 0;

        return effectMesh;
    }

    setMeshVisible(mesh, isVisible) {
        const visibleTargetMesh = this.resetEffect(mesh);
        if (isVisible) {
            return;
        }

        if (this._DTDWeb.useFreeze) {
            visibleTargetMesh.alwaysSelectAsActiveMesh = isVisible;
            this._unfreezeMeshes.push(visibleTargetMesh.isAnInstance ? visibleTargetMesh.sourceMesh : visibleTargetMesh);
        }

        visibleTargetMesh.layerMask = DTDWeb.Camera.LAYER_MASK.NONE;
        visibleTargetMesh.isPickable = isVisible;
        visibleTargetMesh.effectType = DTDWeb.Mesh.MESH_EFFECT_TYPE.INVISIBLE;

        this._DTDWeb.inputController.deselectMesh(visibleTargetMesh);

        return visibleTargetMesh;
    }

    resetEffect(mesh) {
        let effectTargetMesh = mesh;
        if (this._DTDWeb.useInstance) {
            if (mesh.isEffectMesh) {
                effectTargetMesh = mesh.originMesh;
            }

            if (effectTargetMesh.effectMesh) {
                if (this._DTDWeb.inputController.isSelectedMesh(effectTargetMesh.effectMesh)) {
                    const isGizmoAttachedMesh = this._DTDWeb.inputController.isGizmoAttachedMesh(effectTargetMesh.effectMesh);
                    this._DTDWeb.inputController.deselectMesh(effectTargetMesh.effectMesh);
                    this._DTDWeb.inputController.selectMesh(effectTargetMesh, isGizmoAttachedMesh);
                }

                effectTargetMesh.effectMesh.dispose();
                effectTargetMesh.effectMesh = undefined;
            }
        }
        else {
            effectTargetMesh.material = effectTargetMesh.originMaterial;
        }

        effectTargetMesh.isPickable = true;
        effectTargetMesh.layerMask = DTDWeb.Camera.LAYER_MASK.MESH;

        if (this._DTDWeb.useFreeze) {
            effectTargetMesh.alwaysSelectAsActiveMesh = true;
            this._unfreezeMeshes.push(effectTargetMesh.isAnInstance ? effectTargetMesh.sourceMesh : effectTargetMesh);
        }

        effectTargetMesh.effectType = DTDWeb.Mesh.MESH_EFFECT_TYPE.NORMAL;

        return effectTargetMesh;
    }

    resetEffectAllMeshes() {
        this.effectMeshes(this.getMeshes(), DTDWeb.Mesh.MESH_EFFECT_TYPE.NORMAL);
    }

    freezeActiveMeshes(callback) {
        if (!this._DTDWeb.useFreeze || this._isActiveMeshesFrozen) {
            if (callback) {
                callback();
            }
            return;
        }

        this._isNeedFreezeActiveMeshes = true;

        if (callback) {
            this._freezeActiveMeshesCallback.push(callback);
        }
    }

    unfreezeActiveMeshes() {
        if (!this._DTDWeb.useFreeze || !this._isActiveMeshesFrozen) {
            return;
        }

        this._isActiveMeshesFrozen = false;

        this._scene.unfreezeActiveMeshes();
    }
}

export { DTDWebModelManager };