import { DTDWeb } from './dtdweb.js';

class HeaderData {
    constructor() {
        this.signature = undefined; // UInt16
        this.version = undefined; // Int32
        this.pivot = undefined; // float[3]
        this.size = undefined; // float[3]
        this.materialCount = undefined; // Int32
        this.meshCount = undefined; // Int32
        this.linkMeshCount = undefined; // Int32
        this.connectorCount = undefined; // Int32
        this.paramDataPosition = undefined; // Int32

        // 2.0이상 추가
        this.fileName = undefined;
        this.dateTime = undefined;
    }
}

class MaterialData {
    constructor() {
        this.id = undefined; // Int32
        this.diffuse = undefined; // byte[3]
        this.specular = undefined; // byte[3]
        this.alpha = undefined; // byte
        this.glossiness = undefined; // byte

        // 2.0이상 추가
        this.textureDataArray = undefined;
    }
}

// 2.0이상 추가
class TextureData {
    constructor() {
        this.textureType = undefined; // diffuse, normal, specular, ambient, emissive, height, shiniess, opacity, displacement, reflection, metalness, occlusion
        this.format = undefined; // (Texture Hint) bmp, jpg, png, rgba8888, argb8888, rgba5650
        this.textureFileName = undefined;
        this.textureDataSize = undefined;
        this.textureDataPosition = undefined;
        this.textureBlob = undefined;
    }
}

class MeshData {
    constructor() {
        this.id = undefined; // Int32
        this.paramTableCount = undefined; // Int16
        this.paramTableDataPosition = undefined; // Int32
        this.pivot = undefined; // float[3]
        this.size = undefined; // float[3]
        this.materialCount = undefined; // Int16
        this.materialTableDataPosition = undefined; // Int32
        this.vertexCount = undefined; // Int32
        this.vertexDataPosition = undefined; // Int32
        this.triangleTablePosition = undefined; // Int32

        this.parameterGroupTableArray = undefined;

        this.materialArray = [];

        this.vertices = [];
        this.indices = [];

        // 2.0이상 추가
        this.uvData = undefined;
        this.uvDataPosition = undefined;
    }
}

class LinkMeshData {
    constructor() {
        this.id = undefined; // Int32
        this.paramTableCount = undefined; // Int16
        this.paramTableDataPosition = undefined; // Int32
        this.linkId = undefined; // Int32
        this.pivot = undefined; // float[3]
        this.size = undefined; // float[3]

        this.parameterGroupTableArray = undefined;
    }
}

class ConnectorData {
    constructor() {
        this.id = undefined; // Int32
        this.elementOwner; // Int32
        this.elementConnect; // Int32
        this.origin; // float[3]
        this.thickness; // Int16
        this.direction; // byte

        // 한국전력기술 과제용
        this.lineSequence;
    }
}

class DTDFormat {
    constructor(fileName) {
        this.headerData = undefined;
        this.materialDataArray = [];
        this.meshDataDictionary = {};
        this.linkMeshDataDictionary = {};
        this.connectorDataDictionary = {};
        this.parameterGroupTableDictionary = {};

        this.fileName = fileName;

        this.isAllMaterialTransparent = true;
    }

    getParameterGroupTableArray(id, parameterTableArray, parameterGroupTableDictionary) {
        const parameterGroupTableArray = [];

        const replaceId = id.replace(`[${this.fileName}]`, '');

        const baseItem = new Object();
        baseItem.group = DTDWeb.Parameter.PARAMETER_GROUP_TEXT.BASE_INFORMATION;
        baseItem.parameterDictionary = {};
        baseItem.parameterDictionary[DTDWeb.Parameter.PARAMETER_KEY_TEXT.ID] = replaceId;
        baseItem.parameterDictionary[DTDWeb.Parameter.PARAMETER_KEY_TEXT.FILE_NAME] = this.fileName;
        parameterGroupTableArray.push(baseItem);

        for (let parameterIndex = 0; parameterIndex < parameterTableArray.length; parameterIndex += 3) {
            const key = parameterTableArray[parameterIndex];
            const value = parameterTableArray[parameterIndex + 1];
            const group = parameterTableArray[parameterIndex + 2];

            let parameterKey = parameterGroupTableDictionary[key];
            let parameterValue = parameterGroupTableDictionary[value];
            const parameterGroup = DTDWeb.ParameterController.GetLocalizedParameterGroup(parameterGroupTableDictionary[group]);

            // 기본정보, Basic 병합
            if (parameterGroup === DTDWeb.Parameter.PARAMETER_GROUP_TEXT.BASE_INFORMATION) {
                parameterKey = DTDWeb.ParameterController.GetLocalizedParameterKey(parameterKey);
                parameterGroupTableArray[0].parameterDictionary[parameterKey] = parameterValue;
            }
            else {
                let parameterGroupIndex = -1;
                for (let parameterGroupTableIndex = 0; parameterGroupTableIndex < parameterGroupTableArray.length; parameterGroupTableIndex++) {
                    if (parameterGroupTableArray[parameterGroupTableIndex].group === parameterGroup) {
                        parameterGroupIndex = parameterGroupTableIndex;
                        break;
                    }
                }

                if (parameterGroupIndex === -1) {
                    const parameterGroupTableItem = new Object();
                    parameterGroupTableItem.group = parameterGroup;
                    parameterGroupTableItem.parameterDictionary = {};

                    parameterGroupTableArray.push(parameterGroupTableItem);
                    parameterGroupIndex = parameterGroupTableArray.length - 1;
                }

                parameterGroupTableArray[parameterGroupIndex].parameterDictionary[parameterKey] = parameterValue;
            }
        }

        parameterGroupTableArray.sort(function (a, b) {
            if (a.group === DTDWeb.Parameter.PARAMETER_GROUP_TEXT.BASE_INFORMATION) {
                return -1;
            }
            if (b.group === DTDWeb.Parameter.PARAMETER_GROUP_TEXT.BASE_INFORMATION) {
                return 1;
            }

            if (a.group === DTDWeb.Parameter.PARAMETER_GROUP_TEXT.ETC) {
                return 1;
            }
            if (b.group === DTDWeb.Parameter.PARAMETER_GROUP_TEXT.ETC) {
                return -1;
            }

            return a.group < b.group ? -1 : a.group > b.group ? 1 : 0;
        });

        return parameterGroupTableArray;
    }

    getUniqueId(id) {
        let uniqueId = id === undefined ? DTDWeb.Utility.GetUUID() : id;
        uniqueId = uniqueId === -1 ? uniqueId.toString() : `[${this.fileName}]${uniqueId.toString()}`;

        return uniqueId
    }

    static GetIdFromUniqueId(uniqueId) {
        const id = uniqueId.split(']')[1];

        if (DTDWeb.Utility.IsHex(id)) {
            return parseInt(id, 16);
        }

        return id === undefined || id === '' ? -1 : Number(id);
    }
}

export { DTDFormat, HeaderData, MaterialData, TextureData, MeshData, LinkMeshData, ConnectorData };