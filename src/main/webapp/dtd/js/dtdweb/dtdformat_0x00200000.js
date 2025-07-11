import { DTDFormat, HeaderData, MaterialData, TextureData, MeshData, LinkMeshData, ConnectorData } from './dtdformat.js';

import { DTDWeb } from './dtdweb.js';

class DTDFormat_0x00200000 extends DTDFormat {
    constructor(resultArrayBuffer, fileName) {
        super(fileName);

        let sliceIndex = 6; // Signature(2) + Version(4)

        const formatType = new Int32Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 4))[0];
        const jsonLength = new Int32Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 4))[0];

        let decodeData = undefined;
        if (formatType === 3) {
            const encodeData = new Uint8Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += jsonLength));
            decodeData = msgpack.decode(encodeData);
        }

        this.headerData = new HeaderData();
        this.headerData.fileName = decodeData.header.fn ? decodeData.header.fn : fileName;
        this.headerData.dateTime = decodeData.header.dt;
        this.headerData.pivot = decodeData.header.p;
        this.headerData.size = decodeData.header.s;

        // Parameter Data
        this.parameterGroupTableDictionary = decodeData.attr === undefined ? {} : decodeData.attr;
        if (decodeData.strattr && Object.keys(decodeData.strattr).length > 0) {
            for (const key in decodeData.strattr) {
                if (this.parameterGroupTableDictionary[key] === undefined) {
                    this.parameterGroupTableDictionary[key] = decodeData.strattr[key];
                }
            }
        }

        // Material Data
        const materials = decodeData.material;
        for (const material of materials) {
            const materialData = new MaterialData();
            materialData.id = this.getUniqueId(material.id);
            materialData.diffuse = [material.d[0] * 255, material.d[1] * 255, material.d[2] * 255];
            materialData.alpha = material.d[3] * 255;
            materialData.specular = [material.s[0] * 255, material.s[1] * 255, material.s[2] * 255];
            materialData.glossiness = material.g * 255;

            if (this.isAllMaterialTransparent && materialData.alpha > 0) {
                this.isAllMaterialTransparent = false;
            }

            if (material.tex) {
                materialData.textureDataArray = [];

                const textures = material.tex;
                for (const texture of textures) {
                    const textureData = new TextureData();
                    textureData.textureType = texture.type;
                    textureData.format = texture.ht;
                    textureData.textureFileName = texture.nm;
                    textureData.textureDataSize = texture.len;
                    textureData.textureDataPosition = texture.tp;
                    textureData.textureBlob = new Blob([resultArrayBuffer.slice(textureData.textureDataPosition, textureData.textureDataPosition + textureData.textureDataSize)]);
                    materialData.textureDataArray.push(textureData);
                }
            }

            this.materialDataArray.push(materialData);
        }

        // Mesh Data
        const meshes = decodeData.mesh;
        for (const mesh of meshes) {
            const meshData = new MeshData();
            meshData.id = this.getUniqueId(mesh.id);
            meshData.primitive = mesh.prm;
            meshData.pivot = mesh.p;
            meshData.rotation = mesh.ro;
            meshData.scale = mesh.sc;
            meshData.size = mesh.s;
            meshData.materialArray = mesh.m;
            meshData.materialCount = meshData.materialArray.length;
            meshData.vertexCount = mesh.vc;
            meshData.vertexDataPosition = mesh.vp;
            meshData.triangleTablePosition = mesh.tp;
            meshData.uvDataPosition = mesh.uvp ? mesh.uvp : undefined;

            if (meshData.materialCount > 0) {
                let startSliceIndex = meshData.triangleTablePosition;
                let endSliceIndex = meshData.materialCount * 4 + startSliceIndex;

                const subMeshIndicesCount = new Int32Array(resultArrayBuffer.slice(startSliceIndex, endSliceIndex));
                if (subMeshIndicesCount.length > 0) {
                    const subMeshIndices = [];
                    for (let subMeshIndex = 0; subMeshIndex < subMeshIndicesCount.length; subMeshIndex++) {
                        startSliceIndex = endSliceIndex;
                        endSliceIndex = subMeshIndicesCount[subMeshIndex] * 4 + startSliceIndex;

                        const indices = new Int32Array(resultArrayBuffer.slice(startSliceIndex, endSliceIndex));
                        subMeshIndices.push(indices);
                    }

                    meshData.indices = subMeshIndices;
                }
            }

            if (mesh.vc > 0) {
                let startSliceIndex = meshData.vertexDataPosition;
                let endSliceIndex = meshData.vertexCount * 12 + startSliceIndex;

                const vertices = new Float32Array(resultArrayBuffer.slice(startSliceIndex, endSliceIndex));
                meshData.vertices = vertices;

                if (meshData.uvDataPosition) {
                    startSliceIndex = meshData.uvDataPosition;
                    endSliceIndex = meshData.vertexCount * 12 + startSliceIndex;

                    meshData.uvData = new Float32Array(resultArrayBuffer.slice(startSliceIndex, endSliceIndex));
                }
            }

            if (!mesh.pa || mesh.pa.length === 0) {
                meshData.parameterGroupTableArray = DTDWeb.ParameterController.CreateParameterGroupTableArray(meshData.id, this.fileName);
            }
            else if (mesh.pa.length > 0) {
                meshData.parameterGroupTableArray = this.getParameterGroupTableArray(meshData.id, mesh.pa, this.parameterGroupTableDictionary);
            }

            if (!this.meshDataDictionary[meshData.id]) {
                this.meshDataDictionary[meshData.id] = meshData;
            }
        }

        // LinkMesh Data
        const linkMeshes = decodeData.linkMesh;
        for (const linkMesh of linkMeshes) {
            const linkMeshData = new LinkMeshData();
            linkMeshData.id = this.getUniqueId(linkMesh.id);
            linkMeshData.linkId = this.getUniqueId(linkMesh.lid);
            linkMeshData.pivot = linkMesh.p;
            linkMeshData.rotation = linkMesh.ro;
            linkMeshData.scale = linkMesh.sc;
            linkMeshData.size = linkMesh.s;

            if (!linkMesh.pa || linkMesh.pa.length === 0) {
                linkMeshData.parameterGroupTableArray = DTDWeb.ParameterController.CreateParameterGroupTableArray(linkMeshData.id, this.fileName);
            }
            else if (linkMesh.pa.length > 0) {
                linkMeshData.parameterGroupTableArray = this.getParameterGroupTableArray(linkMeshData.id, linkMesh.pa, this.parameterGroupTableDictionary);
            }

            const originMeshData = this.meshDataDictionary[linkMeshData.linkId];
            if (originMeshData) {
                DTDWeb.ParameterController.MergeParameterGroupTableArray(originMeshData.parameterGroupTableArray, linkMeshData.parameterGroupTableArray);
            }

            if (!this.linkMeshDataDictionary[linkMeshData.id]) {
                this.linkMeshDataDictionary[linkMeshData.id] = linkMeshData;
            }
        }

        // Connector Data
        if (decodeData.connector !== undefined) {
            const connectors = decodeData.connector;
            for (const connector of connectors) {
                const connectorData = new ConnectorData();
                connectorData.id = this.getUniqueId(connector.id);
                connectorData.elementOwner = this.getUniqueId(connector.oid);
                connectorData.elementConnect = this.getUniqueId(connector.cid);
                connectorData.origin = new BABYLON.Vector3(connector.o[0], connector.o[1], connector.o[2]);
                connectorData.thickness = connector.tk;
                connectorData.direction = connector.dir;

                if (!this.connectorDataDictionary[connectorData.id]) {
                    this.connectorDataDictionary[connectorData.id] = [];
                }

                this.connectorDataDictionary[connectorData.id].push(connectorData);
            }
        }
    }

    static Save(fileName, fileMeshDictionary, connectorDataDictionary) {
        const originFileNames = Object.keys(fileMeshDictionary);

        let isGenerateNewId = originFileNames.length > 1;

        const meshes = [];
        for (const originFileName of originFileNames) {
            const fileMeshes = Object.values(fileMeshDictionary[originFileName]);
            for (const mesh of fileMeshes) {
                meshes.push(mesh);

                if (!isGenerateNewId) {
                    const id = DTDFormat.GetIdFromUniqueId(mesh.id);
                    if (isNaN(id) || id === -1) {
                        isGenerateNewId = true;
                    }
                }
            }
        }

        const boundingBox = DTDWeb.Utility.ComputeBoundingInfo(meshes).boundingBox;
        const centerWorld = boundingBox.centerWorld;
        const sizeWorld = boundingBox.extendSizeWorld.scale(2);

        const p = [centerWorld.x, centerWorld.y, centerWorld.z];
        const s = [sizeWorld.x, sizeWorld.y, sizeWorld.z];

        const msgpackJSON = {};
        msgpackJSON.header = {
            fn: fileName,
            dt: DTDWeb.Utility.GetFormattedNowDateTime('yyyyMMdd_HHmmss'),
            p,
            s
        };
        msgpackJSON.revitInfo = {};
        msgpackJSON.material = [];
        msgpackJSON.mesh = [];
        msgpackJSON.linkMesh = [];
        msgpackJSON.connector = [];
        msgpackJSON.strattr = {};

        let totalDataBufferLength = 0;
        const buffers = [];

        let newMaterialId = 0;
        let newMeshId = 10001;

        const newMaterialIdDictionary = {};
        const newMeshIdDictionary = {};

        const meshMaterialDictionary = {};

        const meshDataDictionary = {};

        for (const mesh of meshes) {
            if (mesh.isLinkMesh || mesh.isAnInstance) {
                continue;
            }

            const meshMaterial = mesh.material;
            let materials = undefined;

            if (meshMaterial.subMaterials === undefined) {
                materials = [meshMaterial]; // 단일 Material
            }
            else {
                materials = meshMaterial.subMaterials; // MultiMaterial
            }

            meshMaterialDictionary[mesh.id] = [];

            for (let materialIndex = 0; materialIndex < materials.length; materialIndex++) {
                const material = materials[materialIndex];
                if (newMaterialIdDictionary[material.id]) {
                    meshMaterialDictionary[mesh.id].push(newMaterialIdDictionary[material.id]);
                    continue;
                }
                else {
                    newMaterialIdDictionary[material.id] = newMaterialId;
                    meshMaterialDictionary[mesh.id].push(newMaterialId);
                }

                const d = [
                    material.diffuseColor.r,
                    material.diffuseColor.g,
                    material.diffuseColor.b,
                    material.alpha
                ];

                const s = [
                    material.specularColor.r,
                    material.specularColor.g,
                    material.specularColor.b
                ];

                const materialData = {
                    id: newMaterialId,
                    t: 0,
                    d,
                    s,
                    g: 0, // TODO: Glosiness
                    tex: [] // TODO: 텍스처 정보
                };

                msgpackJSON.material.push(materialData);

                newMaterialId += 1;
            }
        }

        // 메시 처리(원본 메시)
        for (const mesh of meshes) {
            if (mesh.isLinkMesh || mesh.isAnInstance) {
                continue;
            }

            if (!isGenerateNewId) {
                newMeshId = this.GetIdFromUniqueId(mesh.id);
            }

            newMeshIdDictionary[mesh.id] = newMeshId;

            const meshData = {
                id: newMeshId,
                prm: 1,
                m: meshMaterialDictionary[mesh.id]
            };

            const vertices = new Float32Array(mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind));
            const verticesBuffer = new Uint8Array(vertices.buffer);
            buffers.push(verticesBuffer);

            meshData.vc = vertices.length / 3;
            meshData.vp = totalDataBufferLength;

            totalDataBufferLength += verticesBuffer.length;

            meshData.tp = totalDataBufferLength;

            const submeshes = mesh.subMeshes;
            for (let submeshIndex = 0; submeshIndex < submeshes.length; submeshIndex++) {
                const submesh = submeshes[submeshIndex];
                const submeshIndicesCount = new Int32Array([submesh.indexCount]);
                const submeshIndicesCountBuffer = new Uint8Array(submeshIndicesCount.buffer);
                buffers.push(submeshIndicesCountBuffer);

                totalDataBufferLength += submeshIndicesCountBuffer.length;
            }

            const indices = new Int32Array(mesh.getIndices());
            const indicesBuffer = new Uint8Array(indices.buffer);
            buffers.push(indicesBuffer);

            totalDataBufferLength += indicesBuffer.length;

            meshDataDictionary[mesh.id] = meshData;

            msgpackJSON.mesh.push(meshData);

            newMeshId += 1;
        }

        // 링크 메시 처리
        for (const mesh of meshes) {
            if (!mesh.isLinkMesh && !mesh.isAnInstance) {
                continue;
            }

            if (!isGenerateNewId) {
                newMeshId = this.GetIdFromUniqueId(mesh.id);
            }

            newMeshIdDictionary[mesh.id] = newMeshId;

            let linkId = mesh.linkId ? mesh.linkId : mesh.sourceMesh.id;
            if (linkId === undefined || newMeshIdDictionary[linkId] === undefined) {
                console.error(`ERROR: Cannot found source mesh: ${mesh.id}`);
                continue;
            }

            linkId = newMeshIdDictionary[linkId];

            const linkMeshData = {
                id: newMeshId,
                lid: linkId
            };

            meshDataDictionary[mesh.id] = linkMeshData;

            msgpackJSON.linkMesh.push(linkMeshData);

            newMeshId += 1;
        }

        // MEP 연결 정보 추가
        for (const connectorDataId in connectorDataDictionary) {
            const connectorDatas = connectorDataDictionary[connectorDataId];
            if (connectorDatas === undefined || connectorDatas.length === 0) {
                continue;
            }

            for (const connectorData of connectorDatas) {
                const elementOwner = connectorData.elementOwner === '-1' ?
                    -1 : newMeshIdDictionary[connectorData.elementOwner];
                const elementConnect = connectorData.elementConnect === '-1' ?
                    -1 : newMeshIdDictionary[connectorData.elementConnect];

                msgpackJSON.connector.push({
                    id: 0,
                    oid: elementOwner,
                    cid: elementConnect,
                    o: [connectorData.origin.x, connectorData.origin.y, connectorData.origin.z],
                    tk: connectorData.thickness,
                    dir: connectorData.direction
                });
            }
        }

        // 부재 Transform, 속성 정보
        for (const mesh of meshes) {
            const meshData = meshDataDictionary[mesh.id];
            if (meshData === undefined) {
                console.error(`ERROR: Cannot Found MeshData(${mesh.id}`);
                continue;
            }

            const meshPosition = mesh.getAbsolutePosition();
            const meshRotation = mesh.rotationQuaternion === null ?
                mesh.rotation : mesh.rotationQuaternion.toEulerAngles();
            const meshScale = mesh.scaling;
            const meshSize = mesh.getBoundingInfo().boundingBox.extendSizeWorld.scale(2);

            meshData.p = [meshPosition.x, meshPosition.y, meshPosition.z];
            meshData.ro = [
                BABYLON.Tools.ToDegrees(meshRotation.x),
                BABYLON.Tools.ToDegrees(meshRotation.y),
                BABYLON.Tools.ToDegrees(meshRotation.z)
            ];
            meshData.sc = [meshScale.x, meshScale.y, meshScale.z];
            meshData.s = [meshSize.x, meshSize.y, meshSize.z];
            meshData.pa = [];

            if (mesh.meshData && mesh.meshData.parameterGroupTableArray) {
                const parameterGroupTableArray = mesh.meshData.parameterGroupTableArray;
                for (const parameterGroupTable of parameterGroupTableArray) {
                    const parameterDictionary = parameterGroupTable.parameterDictionary;
                    if (parameterDictionary === undefined) {
                        continue;
                    }

                    const group = parameterGroupTable.group;
                    const groupHashCode = group.hashCode();
                    if (msgpackJSON.strattr[groupHashCode] === undefined) {
                        msgpackJSON.strattr[groupHashCode] = group;
                    }

                    for (const parameterKey in parameterDictionary) {
                        if (parameterKey === DTDWeb.Parameter.PARAMETER_KEY_TEXT.ID ||
                            parameterKey === DTDWeb.Parameter.PARAMETER_KEY_TEXT.FILE_NAME) {
                            continue;
                        }

                        const key = parameterKey;
                        const keyHashCode = key.hashCode();
                        if (msgpackJSON.strattr[keyHashCode] === undefined) {
                            msgpackJSON.strattr[keyHashCode] = key;
                        }

                        const value = parameterDictionary[key];
                        const valueHashCode = value.hashCode();
                        if (msgpackJSON.strattr[valueHashCode] === undefined) {
                            msgpackJSON.strattr[valueHashCode] = value;
                        }

                        meshData.pa.push(keyHashCode, valueHashCode, groupHashCode);
                    }
                }
            }
        }

        const meshBaseOffsets = {};

        for (const meshData of msgpackJSON.mesh) {
            const baseOffset = {
                vp: meshData.vp,
                tp: meshData.tp
            };

            meshBaseOffsets[meshData.id] = baseOffset;
        }

        let isFinalMsgPackCreated = false;
        let msgpackBuffer = undefined;
        while (!isFinalMsgPackCreated) {
            msgpackBuffer = msgpack.encode(msgpackJSON);
            const offset = 14 + msgpackBuffer.length;

            // for (const material of msgpackJSON.material) {
            //     // TODO: Texture?
            // }

            for (const meshData of msgpackJSON.mesh) {
                const baseOffset = meshBaseOffsets[meshData.id];

                meshData.vp = offset + baseOffset.vp;
                meshData.tp = offset + baseOffset.tp;
            }

            const finalMsgPackBuffer = msgpack.encode(msgpackJSON);

            isFinalMsgPackCreated = msgpackBuffer.length === finalMsgPackBuffer.length;
        }

        const signature = new Uint16Array([0xFF09]);
        const version = new Int32Array([0x00200000]);
        const formatType = new Int32Array([3]);
        const jsonLength = new Int32Array([msgpackBuffer.length]);

        const headerBuffer = DTDWeb.Utility.ConcatTypedArrayToUint8Array([signature, version, formatType, jsonLength]);

        msgpackBuffer = msgpack.encode(msgpackJSON);

        buffers.unshift(msgpackBuffer);
        buffers.unshift(headerBuffer);

        return new Blob(buffers);
    }
}

export { DTDFormat_0x00200000 };