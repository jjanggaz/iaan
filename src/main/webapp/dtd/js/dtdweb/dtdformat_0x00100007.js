import { DTDFormat, HeaderData, MaterialData, MeshData, LinkMeshData, ConnectorData } from './dtdformat.js';

import { DTDWeb } from './dtdweb.js';

class DTDFormat_0x00100007 extends DTDFormat {
    constructor(resultArrayBuffer, fileName) {
        super(fileName);

        let sliceIndex = 0;

        // Header Data Start
        this.headerData = new HeaderData();
        this.headerData.signature = new Uint16Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 2))[0].toString(16);
        this.headerData.version = new Int32Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 4))[0].toString(16);
        this.headerData.pivot = new Float32Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 12));
        this.headerData.size = new Float32Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 12));
        this.headerData.materialCount = new Int32Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 4))[0];
        this.headerData.meshCount = new Int32Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 4))[0];
        this.headerData.linkMeshCount = new Int32Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 4))[0];
        this.headerData.connectorCount = new Int32Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 4))[0];
        this.headerData.paramDataPosition = new Int32Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 4))[0];
        // Header Data End

        // Material Data Start
        for (let materialIndex = 0; materialIndex < this.headerData.materialCount; materialIndex++) {
            const materialData = new MaterialData();
            materialData.id = this.getUniqueId(new Int32Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 4))[0]);
            materialData.diffuse = new Uint8Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 3));
            materialData.specular = new Uint8Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 3));
            materialData.alpha = new Uint8Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 1))[0];
            materialData.glossiness = new Uint8Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 1))[0];

            materialData.alpha = 255 - materialData.alpha * 255 / 100;

            if (this.isAllMaterialTransparent && materialData.alpha > 0) {
                this.isAllMaterialTransparent = false;
            }

            this.materialDataArray.push(materialData);
        }
        // Material Data End

        // Mesh Data Start
        for (let meshIndex = 0; meshIndex < this.headerData.meshCount; meshIndex++) {
            const meshData = new MeshData();
            meshData.id = this.getUniqueId(new Int32Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 4))[0]);
            meshData.paramTableCount = new Int16Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 2))[0];
            meshData.paramTableDataPosition = new Int32Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 4))[0];
            meshData.pivot = new Float32Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 12));
            meshData.size = new Float32Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 12));
            meshData.materialCount = new Int16Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 2))[0];
            meshData.materialTableDataPosition = new Int32Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 4))[0];
            meshData.vertexCount = new Int32Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 4))[0];
            meshData.vertexDataPosition = new Int32Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 4))[0];
            meshData.triangleTablePosition = new Int32Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 4))[0];

            if (!this.meshDataDictionary[meshData.id]) {
                this.meshDataDictionary[meshData.id] = meshData;
            }
        }
        // Mesh Data End

        // Link Mesh Data Start
        for (let linkMeshIndex = 0; linkMeshIndex < this.headerData.linkMeshCount; linkMeshIndex++) {
            const linkMeshData = new LinkMeshData();
            linkMeshData.id = this.getUniqueId(new Int32Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 4))[0]);
            linkMeshData.paramTableCount = new Int16Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 2))[0];
            linkMeshData.paramTableDataPosition = new Int32Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 4))[0];
            linkMeshData.linkId = this.getUniqueId(new Int32Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 4))[0]);
            linkMeshData.pivot = new Float32Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 12));
            linkMeshData.size = new Float32Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 12));

            if (!this.linkMeshDataDictionary[linkMeshData.id]) {
                this.linkMeshDataDictionary[linkMeshData.id] = linkMeshData;
            }
        }
        // Link Mesh Data End

        // Connector Data Start
        for (let connectorIndex = 0; connectorIndex < this.headerData.connectorCount; connectorIndex++) {
            const connectorData = new ConnectorData();
            connectorData.id = this.getUniqueId(new Int32Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 4))[0]);
            connectorData.elementOwner = this.getUniqueId(new Int32Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 4))[0]);
            connectorData.elementConnect = this.getUniqueId(new Int32Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 4))[0]);
            const origin = new Float32Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 12));
            connectorData.origin = new BABYLON.Vector3(origin[0], origin[1], origin[2]);
            connectorData.thickness = new Int16Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 2))[0];
            connectorData.direction = new Uint8Array(resultArrayBuffer.slice(sliceIndex, sliceIndex += 1))[0];

            if (!this.connectorDataDictionary[connectorData.id]) {
                this.connectorDataDictionary[connectorData.id] = [];
            }

            this.connectorDataDictionary[connectorData.id].push(connectorData);
        }
        // Connector Data End

        const textDecoder = new TextDecoder('utf-8');

        const parameterCount = new Int32Array(resultArrayBuffer.slice(this.headerData.paramDataPosition, this.headerData.paramDataPosition + 4))[0];
        const parameterString = new Uint8Array(resultArrayBuffer.slice(this.headerData.paramDataPosition + 4));

        let parameterStartPosition = 1;
        let parameterEndPosition = parameterString[0] + 1;
        for (let parameterIndex = 0; parameterIndex < parameterCount; parameterIndex++) {
            const value = textDecoder.decode(parameterString.slice(parameterStartPosition, parameterEndPosition));
            const key = value.hashCode();

            parameterStartPosition = parameterEndPosition + 1;
            parameterEndPosition += parameterString[parameterEndPosition] + 1;

            this.parameterGroupTableDictionary[key] = value;
        }
        for (const meshId in this.meshDataDictionary) {
            const meshData = this.meshDataDictionary[meshId];

            let startSliceIndex = 0;
            let endSliceIndex = 0;

            // Mesh Parameter Table Data Start
            if (meshData.paramTableCount === 0) {
                meshData.parameterGroupTableArray = DTDWeb.ParameterController.CreateParameterGroupTableArray(meshData.id, this.fileName);
            }
            else if (meshData.paramTableCount > 0) {
                startSliceIndex = meshData.paramTableDataPosition;
                endSliceIndex = meshData.paramTableCount * 4 + startSliceIndex;

                const parameterTableArray = new Int32Array(resultArrayBuffer.slice(startSliceIndex, endSliceIndex));
                meshData.parameterGroupTableArray = this.getParameterGroupTableArray(meshData.id, parameterTableArray, this.parameterGroupTableDictionary);
            }
            // Mesh Parameter Table Data End

            if (meshData.materialCount > 0) {
                // Material Start
                startSliceIndex = meshData.materialTableDataPosition;
                endSliceIndex = meshData.materialCount * 2 + startSliceIndex;

                // 2023-02-10 수정: materialArray 2차원 배열 -> 1차원 배열로 수정(2.0 버전 관련)
                meshData.materialArray = new Int16Array(resultArrayBuffer.slice(startSliceIndex, endSliceIndex));
                // Material End

                // Triangle Start
                startSliceIndex = meshData.triangleTablePosition;
                endSliceIndex = meshData.materialCount * 4 + startSliceIndex;

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
                // Triangle End
            }

            // Mesh Vertex Start
            if (meshData.vertexCount > 0) {
                startSliceIndex = meshData.vertexDataPosition;
                endSliceIndex = meshData.vertexCount * 12 + startSliceIndex;

                const vertices = new Float32Array(resultArrayBuffer.slice(startSliceIndex, endSliceIndex));
                meshData.vertices = vertices;
            }
            // Mesh Vertex End
        }

        for (const linkMeshId in this.linkMeshDataDictionary) {
            const linkMeshData = this.linkMeshDataDictionary[linkMeshId];

            let startSliceIndex = 0;
            let endSliceIndex = 0;

            // Link Mesh Parameter Table Data Start
            if (linkMeshData.paramTableCount === 0) {
                linkMeshData.parameterGroupTableArray = DTDWeb.ParameterController.CreateParameterGroupTableArray(linkMeshData.id, this.fileName);
            }
            else if (linkMeshData.paramTableCount > 0) {
                startSliceIndex = linkMeshData.paramTableDataPosition;
                endSliceIndex = linkMeshData.paramTableCount * 4 + startSliceIndex;

                const parameterTableArray = new Int32Array(resultArrayBuffer.slice(startSliceIndex, endSliceIndex));
                linkMeshData.parameterGroupTableArray = this.getParameterGroupTableArray(linkMeshData.id, parameterTableArray, this.parameterGroupTableDictionary);
            }

            const originMeshData = this.meshDataDictionary[linkMeshData.linkId];
            if (originMeshData) {
                DTDWeb.ParameterController.MergeParameterGroupTableArray(originMeshData.parameterGroupTableArray, linkMeshData.parameterGroupTableArray);
            }
            // Link Mesh Parameter Table Data End
        }
    }
}

export { DTDFormat_0x00100007 };