import { MeshData, ConnectorData } from '../dtdformat.js';

import { DTDWeb } from '../dtdweb.js';

class KEPCOENCImportManager {
    constructor(dtdWeb) {
        this._DTDWeb = dtdWeb;
        this._scene = this._scene;

        this._importFiles = [];

        this._symbolMeshDictionary = {};

        this._rootValveLineGroupDictionary = {};

        this._isSymbolListInitialized = false;
    }

    async importFile(uri, isUrl) {
        if (!this._isSymbolListInitialized) {
            const response = await fetch('arvr/symbollist');
            if (response.ok) {
                const symbolData = await response.json();
                const SYMBOL_TABLE = DTDWeb.KEPCOENC.SYMBOL_TABLE;
                for (const symbol of symbolData.data) {
                    const sequence = symbol.symbolSeq.toString();
                    if (SYMBOL_TABLE[sequence] === undefined) {
                        SYMBOL_TABLE[sequence] = {};
                    }

                    SYMBOL_TABLE[sequence].TYPE = symbol.symbolType;
                    SYMBOL_TABLE[sequence].OD = symbol.symbolOd;
                    SYMBOL_TABLE[sequence].DTDX_FILE_NAME = symbol.fileNm;

                    const newUrl = symbol.fileUrl.replace(/^https?:\/\/[^\/]+/, `${window.location.protocol}//${window.location.host}`);
                    SYMBOL_TABLE[sequence].DTDX_URL = newUrl;
                }

                this._isSymbolListInitialized = true;
            }
            else {
                // TODO: 에러 처리
            }
        }

        const fileName = isUrl ? DTDWeb.Utility.GetFileNameFromUrl(uri) : uri.name;

        if (this._DTDWeb.modelManager.isAlreadyOpenedModel(fileName)) {
            return true;
        }

        let performanceStartTime = performance.now();

        const resultText = isUrl ? await DTDWeb.Utility.LoadFileFromUrl(uri, true) : await DTDWeb.Utility.LoadFileFromLocal(uri, true);
        if (resultText === undefined) {
            return false;
        }

        const json = JSON.parse(resultText);
        if (json.PROPERTY === undefined) {
            return false;
        }

        const propertiesDictionary = {};

        for (const property of json.PROPERTY) {
            if (propertiesDictionary[property.GUBUN] === undefined) {
                propertiesDictionary[property.GUBUN] = [];
            }

            propertiesDictionary[property.GUBUN].push(property);
        }

        this._DTDWeb.modelManager.unfreezeActiveMeshes();

        const dtdxRoot = this._DTDWeb.modelManager.createDTDXRoot(fileName);

        // Tube(Line)
        let tubeLineMeshes = undefined;
        if (propertiesDictionary.TUBE_LINE !== undefined && propertiesDictionary.TUBE_LINE.length > 0) {
            tubeLineMeshes = this.loadTubeLine(dtdxRoot, propertiesDictionary.TUBE_LINE);
            for (const tubeLineMesh of tubeLineMeshes) {
                tubeLineMesh.meshData = new MeshData();
                tubeLineMesh.meshData.parameterGroupTableArray = DTDWeb.ParameterController.CreateParameterGroupTableArray(tubeLineMesh.id, fileName);
                tubeLineMesh.meshData.parameterGroupTableArray[0].parameterDictionary[DTDWeb.Parameter.PARAMETER_KEY_TEXT.CATEGORY] =
                    DTDWeb.Parameter.PARAMETER_VALUE_TEXT.PIPE;

                this.addSymbolMeshParameters(tubeLineMesh, tubeLineMesh.symbolProperty);
            }
        }

        // Tube(Arc)
        if (propertiesDictionary.TUBE_ARC !== undefined && propertiesDictionary.TUBE_ARC.length > 0) {
            const tubeArcMeshes = this.loadTubeArc(dtdxRoot, propertiesDictionary.TUBE_ARC);
            for (const tubeArcMesh of tubeArcMeshes) {
                tubeArcMesh.meshData = new MeshData();
                tubeArcMesh.meshData.parameterGroupTableArray = DTDWeb.ParameterController.CreateParameterGroupTableArray(tubeArcMesh.id, fileName);
                tubeArcMesh.meshData.parameterGroupTableArray[0].parameterDictionary[DTDWeb.Parameter.PARAMETER_KEY_TEXT.CATEGORY] =
                    DTDWeb.Parameter.PARAMETER_VALUE_TEXT.PIPE_FITTING;

                this.addSymbolMeshParameters(tubeArcMesh, tubeArcMesh.symbolProperty);
            }
        }

        // Clamp2D
        if (propertiesDictionary.CLAMP2D !== undefined && propertiesDictionary.CLAMP2D.length > 0) {
            const clamp2DMeshes = await this.loadSymbolDTDX(dtdxRoot, propertiesDictionary.CLAMP2D);
            for (const clamp2DMesh of clamp2DMeshes) {
                clamp2DMesh.meshData.parameterGroupTableArray[0].parameterDictionary[DTDWeb.Parameter.PARAMETER_KEY_TEXT.CATEGORY] =
                    DTDWeb.Parameter.PARAMETER_VALUE_TEXT.CLAMP;

                const connectorPosition = BABYLON.Vector3.Center(clamp2DMesh.connectorOrigins[0], clamp2DMesh.connectorOrigins[1]);
                clamp2DMesh.position.subtractInPlace(connectorPosition);

                clamp2DMesh.setPivotPoint(connectorPosition);

                this.rotateSymbolToConnectedTubeLineMesh(clamp2DMesh, tubeLineMeshes);
            }
        }

        // Clamp3D
        if (propertiesDictionary.CLAMP3D !== undefined && propertiesDictionary.CLAMP3D.length > 0) {
            const clamp3DMeshes = await this.loadSymbolDTDX(dtdxRoot, propertiesDictionary.CLAMP3D);
            for (const clamp3DMesh of clamp3DMeshes) {
                clamp3DMesh.meshData.parameterGroupTableArray[0].parameterDictionary[DTDWeb.Parameter.PARAMETER_KEY_TEXT.CATEGORY] =
                    DTDWeb.Parameter.PARAMETER_VALUE_TEXT.CLAMP;

                const connectorPosition = BABYLON.Vector3.Center(clamp3DMesh.connectorOrigins[0], clamp3DMesh.connectorOrigins[1]);
                clamp3DMesh.position.subtractInPlace(connectorPosition);

                clamp3DMesh.setPivotPoint(connectorPosition);

                this.rotateSymbolToConnectedTubeLineMesh(clamp3DMesh, tubeLineMeshes);
            }
        }

        // Plate
        if (propertiesDictionary.PLATE !== undefined && propertiesDictionary.PLATE.length > 0) {
            const plateMeshes = await this.loadSymbolDTDX(dtdxRoot, propertiesDictionary.PLATE);
            for (const plateMesh of plateMeshes) {
                plateMesh.meshData.parameterGroupTableArray[0].parameterDictionary[DTDWeb.Parameter.PARAMETER_KEY_TEXT.CATEGORY] =
                    DTDWeb.Parameter.PARAMETER_VALUE_TEXT.MOUNTING_PLATE;

                this.findConnectedTubeLineMesh(plateMesh, tubeLineMeshes, () => {
                    if (plateMesh.connectedTubeLineMesh === undefined) {
                        return;
                    }

                    const tubeLineMeshTHD1 = plateMesh.connectedTubeLineMesh.thd1;
                    const tubeLineMeshTHD2 = plateMesh.connectedTubeLineMesh.thd2;
                    const tubeLineMeshCenterPoint = BABYLON.Vector3.Center(tubeLineMeshTHD1, tubeLineMeshTHD2);
                    const extendSize = plateMesh.getBoundingInfo().boundingBox.extendSize;

                    if (plateMesh.position.y < tubeLineMeshCenterPoint.y) {
                        plateMesh.position.y -= extendSize.y;
                    }
                    else {
                        plateMesh.position.y += extendSize.y;
                    }
                });

                // Plate에 배관이 두 개 물려있을 때 회전 처리
                if (plateMesh.thd2 !== undefined) {
                    const thd1Vector2 = new BABYLON.Vector2(plateMesh.thd1.x, plateMesh.thd1.z);
                    const thd2Vector2 = new BABYLON.Vector2(plateMesh.thd2.x, plateMesh.thd2.z);
                    const different = thd2Vector2.subtract(thd1Vector2);
                    let angle = BABYLON.Tools.ToDegrees(Math.atan2(different.x, different.y));

                    if (different.x > different.y) {
                        angle += 90;
                    }
                    else {
                        angle += 180;
                    }

                    plateMesh.addRotation(0, BABYLON.Tools.ToRadians(angle), 0);
                }

                const directionString = plateMesh.symbolProperty.DIRECTION;
                if (directionString === 'E' || directionString === 'W') {
                    plateMesh.addRotation(0, BABYLON.Tools.ToRadians(90), 0);
                }
            }
        }

        // Union
        if (propertiesDictionary.UNION !== undefined && propertiesDictionary.UNION.length > 0) {
            const unionMeshes = await this.loadSymbolDTDX(dtdxRoot, propertiesDictionary.UNION);
            for (const unionMesh of unionMeshes) {
                unionMesh.meshData.parameterGroupTableArray[0].parameterDictionary[DTDWeb.Parameter.PARAMETER_KEY_TEXT.CATEGORY] =
                    DTDWeb.Parameter.PARAMETER_VALUE_TEXT.UNION;

                this.rotateSymbolToConnectedTubeLineMesh(unionMesh, tubeLineMeshes, () => {
                    // Y축이 90도 회전된 모델을 쓰고 있으므로 lookAt 후 Y축 90도 회전
                    unionMesh.addRotation(0, BABYLON.Tools.ToRadians(90), 0);
                });
            }
        }

        // Instrument Valve
        if (propertiesDictionary.INST_VALVE !== undefined && propertiesDictionary.INST_VALVE.length > 0) {
            const instValveMeshes = await this.loadSymbolDTDX(dtdxRoot, propertiesDictionary.INST_VALVE);
            for (const instValveMesh of instValveMeshes) {
                instValveMesh.meshData.parameterGroupTableArray[0].parameterDictionary[DTDWeb.Parameter.PARAMETER_KEY_TEXT.CATEGORY] =
                    DTDWeb.Parameter.PARAMETER_VALUE_TEXT.INSTRUMENT_VALVE;

                const connectorPosition = BABYLON.Vector3.Center(instValveMesh.connectorOrigins[0], instValveMesh.connectorOrigins[1]);
                instValveMesh.position = instValveMesh.position.subtract(connectorPosition);

                instValveMesh.setPivotPoint(connectorPosition);

                const eulerAngles = this.getEulerAnglesFromDirectionString(instValveMesh.symbolProperty.DIRECTION);
                eulerAngles.y += BABYLON.Tools.ToRadians(90);

                instValveMesh.addRotation(eulerAngles.x, 0, 0);
                instValveMesh.addRotation(0, eulerAngles.y, 0);
                instValveMesh.addRotation(0, 0, eulerAngles.z);
            }
        }

        // Root Valve
        if (propertiesDictionary.ROOT_VALVE !== undefined && propertiesDictionary.ROOT_VALVE.length > 0) {
            const rootValveMeshes = await this.loadSymbolDTDX(dtdxRoot, propertiesDictionary.ROOT_VALVE);
            for (const rootValveMesh of rootValveMeshes) {
                rootValveMesh.meshData.parameterGroupTableArray[0].parameterDictionary[DTDWeb.Parameter.PARAMETER_KEY_TEXT.CATEGORY] =
                    DTDWeb.Parameter.PARAMETER_VALUE_TEXT.ROOT_VALVE;
                // 연결 정보 관련
                const lineGroup = rootValveMesh.symbolProperty.LINE_GROUP;
                if (lineGroup) {
                    this._rootValveLineGroupDictionary[lineGroup] = rootValveMesh;
                }

                // 위치 및 회전
                const connectorPosition = rootValveMesh.connectorOrigins[0];
                rootValveMesh.position = rootValveMesh.position.subtract(connectorPosition);

                rootValveMesh.setPivotPoint(connectorPosition);

                let directionString = rootValveMesh.symbolProperty.DIRECTION;
                if (directionString === 'UD') {
                    directionString = 'SN';
                }
                else if (directionString === 'DU') {
                    directionString = 'NS';
                }

                const eulerAngles = this.getEulerAnglesFromDirectionString(directionString);
                eulerAngles.y += BABYLON.Tools.ToRadians(90);
                eulerAngles.z += BABYLON.Tools.ToRadians(325);

                if (rootValveMesh.symbolProperty.DIRECTION === 'UD') {
                    eulerAngles.z += BABYLON.Tools.ToRadians(-90);
                }
                if (rootValveMesh.symbolProperty.DIRECTION === 'DU') {
                    eulerAngles.z += BABYLON.Tools.ToRadians(90);
                }

                rootValveMesh.addRotation(eulerAngles.x, 0, 0);
                rootValveMesh.addRotation(0, eulerAngles.y, 0);
                rootValveMesh.addRotation(0, 0, eulerAngles.z);

                const textPosition = rootValveMesh.getBoundingInfo().boundingBox.centerWorld.clone();
                switch (rootValveMesh.symbolProperty.DIRECTION) {
                    case 'NS':
                        textPosition.y = rootValveMesh.getBoundingInfo().boundingBox.maximumWorld.y + 0.12;
                        break;
                    case 'SN':
                    case 'WE':
                    case 'EW':
                        textPosition.y = rootValveMesh.getBoundingInfo().boundingBox.maximumWorld.y + 0.12;
                        textPosition.z -= 0.04;
                        break;
                    case 'UD':
                    case 'DU':
                        textPosition.y = rootValveMesh.getBoundingInfo().boundingBox.minimumWorld.y - 0.03;
                        break;
                }

                this._DTDWeb.kepcoEncController.createSymbolTextUI(
                    rootValveMesh, textPosition, rootValveMesh.symbolProperty.TAG);
            }

            // Root Valve, Tube Line 메시 생성 후 Connector Data 생성
            this.addLineTubeConnectorData(tubeLineMeshes);
        }

        // Tee
        if (propertiesDictionary.TEE !== undefined && propertiesDictionary.TEE.length > 0) {
            const teeMeshes = await this.loadSymbolDTDX(dtdxRoot, propertiesDictionary.TEE);
            // TEE scale: UNION TEE 3_8 OD.dtdx = 1.5, UNION TEE(SW)3_8OD.dtdx = 1.55
            const scale = DTDWeb.KEPCOENC.IMPORT_SCALE / DTDWeb.KEPCOENC.MM_SCALE * 1.55;
            for (const teeMesh of teeMeshes) {
                teeMesh.meshData.parameterGroupTableArray[0].parameterDictionary[DTDWeb.Parameter.PARAMETER_KEY_TEXT.CATEGORY] =
                    DTDWeb.Parameter.PARAMETER_VALUE_TEXT.TEE;

                const connectorPosition = BABYLON.Vector3.Center(teeMesh.connectorOrigins[0], teeMesh.connectorOrigins[1]);
                teeMesh.position = teeMesh.position.subtract(connectorPosition);

                teeMesh.setPivotPoint(connectorPosition);

                // TEE_LONG_DIR은 TEE_SHORT_DIR의 NS, SN을 기준으로 회전 하기 때문에
                // TEE_SHORT_DIR의 방향이 횡(EW, WE)으로 바뀌면 NS와 SN을 상대 방향으로
                // 바꿔줘야함(NS, SN, UD, DU은 상관 없음).
                switch (teeMesh.symbolProperty.TEE_SHORT_DIR) {
                    case 'EW':
                        if (teeMesh.symbolProperty.TEE_LONG_DIR === 'NS') {
                            teeMesh.symbolProperty.TEE_LONG_DIR = 'EW';
                        }
                        else if (teeMesh.symbolProperty.TEE_LONG_DIR === 'SN') {
                            teeMesh.symbolProperty.TEE_LONG_DIR = 'WE';
                        }
                        break;
                    case 'WE':
                        if (teeMesh.symbolProperty.TEE_LONG_DIR === 'NS') {
                            teeMesh.symbolProperty.TEE_LONG_DIR = 'WE';
                        }
                        else if (teeMesh.symbolProperty.TEE_LONG_DIR === 'SN') {
                            teeMesh.symbolProperty.TEE_LONG_DIR = 'EW';
                        }
                        break;
                }

                const shortEulerAngles = this.getEulerAnglesFromDirectionString(teeMesh.symbolProperty.TEE_SHORT_DIR);
                const longEulerAngles = this.getEulerAnglesFromTeeLongDirectionString(teeMesh.symbolProperty.TEE_LONG_DIR);
                const eulerAngles = shortEulerAngles.add(longEulerAngles);
                teeMesh.addRotation(eulerAngles.x, 0, 0);
                teeMesh.addRotation(0, eulerAngles.y, 0);
                teeMesh.addRotation(0, 0, eulerAngles.z);

                teeMesh.scaling = BABYLON.Vector3.One().scale(scale);
            }
        }

        let performanceEndTime = performance.now();
        console.log(`${fileName} CREATE MESHES: ${(performanceEndTime - performanceStartTime) / 1000} seconds`);

        return true;
    }

    loadTubeLine(dtdxRoot, tubeLines) {
        const fileName = dtdxRoot.id;
        const tubeLineMeshes = [];

        for (const tubeLine of tubeLines) {
            const meshId = `[${fileName}]${tubeLine.HANDLE}`;

            const thd1 = this.getVector3FromString(tubeLine.THD1);
            const thd2 = this.getVector3FromString(tubeLine.THD2);
            const thdCenter = BABYLON.Vector3.Center(thd1, thd2);
            const radius = DTDWeb.Utility.GetMillimeterFromInchString(tubeLine.THD_OD) * DTDWeb.KEPCOENC.IMPORT_SCALE;

            const tubeLineMesh = BABYLON.MeshBuilder.CreateTube(meshId, {
                path: [thd1.subtract(thdCenter), thd2.subtract(thdCenter)],
                radius
            }, this._scene);
            tubeLineMesh.id = meshId;
            tubeLineMesh.parent = dtdxRoot;
            tubeLineMesh.position.set(thdCenter.x, thdCenter.y, thdCenter.z);
            tubeLineMesh.isPickable = true;
            tubeLineMesh.isLinkMesh = false;
            tubeLineMesh.isEffectMesh = false;
            tubeLineMesh.effectType = DTDWeb.Mesh.MESH_EFFECT_TYPE.NORMAL;
            tubeLineMesh.material = this._DTDWeb.modelManager.getMaterialFromRGBA(tubeLine.COLOR_R, tubeLine.COLOR_G, tubeLine.COLOR_B, 255);
            tubeLineMesh.computeWorldMatrix(true);
            if (this._DTDWeb.useFreeze) {
                tubeLineMesh.alwaysSelectAsActiveMesh = true;
            }

            tubeLineMesh.thd1 = thd1;
            tubeLineMesh.thd2 = thd2;
            tubeLineMesh.thdCenter = thdCenter;
            tubeLineMesh.radius = radius;
            tubeLineMesh.symbolType = tubeLine.GUBUN;
            tubeLineMesh.symbolProperty = tubeLine;

            tubeLineMeshes.push(tubeLineMesh);

            this._DTDWeb.modelManager.addMesh(fileName, meshId, tubeLineMesh);
        }

        return tubeLineMeshes;
    }

    loadTubeArc(dtdxRoot, tubeArcs) {
        const fileName = dtdxRoot.id;
        const tubeArcMeshes = [];

        for (const tubeArc of tubeArcs) {
            const meshId = `[${fileName}]${tubeArc.HANDLE}`;

            const thdCenter = this.getVector3FromString(tubeArc.THD_CENTER);
            const radius = DTDWeb.Utility.GetMillimeterFromInchString(tubeArc.THD_OD) * DTDWeb.KEPCOENC.IMPORT_SCALE;

            const tubeArcMesh = BABYLON.MeshBuilder.CreateSphere(meshId, { diameter: radius * 2 });
            tubeArcMesh.id = meshId;
            tubeArcMesh.parent = dtdxRoot;
            tubeArcMesh.position.set(thdCenter.x, thdCenter.y, thdCenter.z);
            tubeArcMesh.isPickable = true;
            tubeArcMesh.isLinkMesh = false;
            tubeArcMesh.isEffectMesh = false;
            tubeArcMesh.effectType = DTDWeb.Mesh.MESH_EFFECT_TYPE.NORMAL;
            tubeArcMesh.material = this._DTDWeb.modelManager.getMaterialFromRGBA(tubeArc.COLOR_R, tubeArc.COLOR_G, tubeArc.COLOR_B, 255);
            tubeArcMesh.computeWorldMatrix(true);
            if (this._DTDWeb.useFreeze) {
                tubeArcMesh.alwaysSelectAsActiveMesh = true;
            }

            tubeArcMesh.thdCenter = thdCenter;
            tubeArcMesh.radius = radius;
            tubeArcMesh.symbolType = tubeArc.GUBUN;
            tubeArcMesh.symbolProperty = tubeArc;

            tubeArcMeshes.push(tubeArcMesh);

            this._DTDWeb.modelManager.addMesh(fileName, meshId, tubeArcMesh);
        }

        return tubeArcMeshes;
    }

    async loadSymbolDTDX(dtdxRoot, symbolProperties) {
        const fileName = dtdxRoot.id;
        const symbolType = symbolProperties[0].GUBUN;
        const scale = DTDWeb.KEPCOENC.IMPORT_SCALE / DTDWeb.KEPCOENC.MM_SCALE;

        const symbolMeshes = [];
        const symbolCenterPositions = [];

        for (const symbolProperty of symbolProperties) {
            const symbolId = symbolProperty.HANDLE;
            const symbol = symbolProperty.SYMBOL;

            if (!DTDWeb.KEPCOENC.SYMBOL_TABLE[symbol]) {
                console.error(`ERROR: ${symbolId} SYMBOL: "${symbol}" is unknown.`);
                console.error(symbolProperty);
                continue;
            }

            if (symbolProperty.GUBUN !== DTDWeb.KEPCOENC.SYMBOL_TABLE[symbol].TYPE) {
                console.error(`ERROR: ${symbolId} Dismatch Type ${symbolProperty.GUBUN}(json), ${DTDWeb.KEPCOENC.SYMBOL_TABLE[symbol].TYPE}(SYMBOL_TABLE)`);
                console.error(symbolProperty);
                continue;
            }

            let symbolCenterString;
            if (symbolType === 'INST_VALVE' || symbolType === 'PLATE') {
                symbolCenterString = symbolProperty.THD1 + symbolProperty.THD2;
            }
            else {
                symbolCenterString = symbolProperty.THD_CENTER;
            }

            let isFoundSamePosition = false;
            for (const symbolCenterPosition of symbolCenterPositions) {
                if (symbolCenterPosition === symbolCenterString) {
                    isFoundSamePosition = true;
                }
            }

            if (isFoundSamePosition) {
                console.warn(`${symbolId}(${symbolType}) has same position symbol.`);
                continue;
            }

            symbolCenterPositions.push(symbolCenterString);

            let symbolMesh = undefined;

            if (this._symbolMeshDictionary[symbol]) {
                const originSymbolMesh = this._symbolMeshDictionary[symbol];
                symbolMesh = originSymbolMesh.createInstance(symbolId);
                symbolMesh.position.set(originSymbolMesh.meshData.pivot[0], originSymbolMesh.meshData.pivot[1], originSymbolMesh.meshData.pivot[2]);
                symbolMesh.rotation = BABYLON.Vector3.Zero();

                symbolMesh.meshData = new MeshData();
                symbolMesh.meshData.parameterGroupTableArray = DTDWeb.ParameterController.CreateParameterGroupTableArray(symbolId, fileName);
                symbolMesh.isLinkMesh = true;
                symbolMesh.linkId = originSymbolMesh.id;

                this.addSymbolMeshParameters(symbolMesh, symbolProperty);

                if (originSymbolMesh.meshData) {
                    DTDWeb.ParameterController.MergeParameterGroupTableArray(originSymbolMesh.meshData.parameterGroupTableArray, symbolMesh.meshData.parameterGroupTableArray);
                }
                symbolMesh.connectorOrigins = [...originSymbolMesh.connectorOrigins];
            }
            else {
                const symbolUrl = DTDWeb.KEPCOENC.SYMBOL_TABLE[symbol].DTDX_URL;

                const symbolDTDFormat = await this._DTDWeb.modelManager.loadDTDXFile(symbolUrl, true, true);
                if (symbolDTDFormat === undefined) {
                    console.error(`ERROR: Cannot read DTDX file(SYMBOL: ${symbol}, URL: ${symbolUrl}).`);
                    return;
                }

                const materialArray = this._DTDWeb.modelManager.loadMaterials(symbolDTDFormat.materialDataArray);
                const symbolMeshes = this._DTDWeb.modelManager.loadMeshes(dtdxRoot, symbolDTDFormat.meshDataDictionary, materialArray, true);
                symbolMesh = symbolMeshes[0];

                symbolMesh.isLinkMesh = false;

                this.addSymbolMeshParameters(symbolMesh, symbolProperty);

                DTDWeb.ParameterController.ModifyMeshParameter(symbolMesh, DTDWeb.Parameter.PARAMETER_KEY_TEXT.ID, symbolId);
                DTDWeb.ParameterController.ModifyMeshParameter(symbolMesh, DTDWeb.Parameter.PARAMETER_KEY_TEXT.FILE_NAME, fileName);

                symbolMesh.connectorOrigins = [];
                const connectorDataDictionary = symbolDTDFormat.connectorDataDictionary;
                Object.keys(connectorDataDictionary).forEach((connectorDataId) => {
                    connectorDataDictionary[connectorDataId].forEach((connectorData) => {
                        const pivot = new BABYLON.Vector3(symbolMesh.meshData.pivot[0], symbolMesh.meshData.pivot[1], symbolMesh.meshData.pivot[2]);
                        const connectorOrigin = connectorData.origin.subtract(pivot).scale(scale);
                        symbolMesh.connectorOrigins.push(connectorOrigin);
                    });
                });

                this._symbolMeshDictionary[symbol] = symbolMesh;
            }

            let thdCenter = this.getVector3FromString(symbolProperty.THD_CENTER);
            if (symbolType === 'INST_VALVE' || symbolType === 'PLATE') {
                const thd1 = this.getVector3FromString(symbolProperty.THD1);
                const thd2 = this.getVector3FromString(symbolProperty.THD2);

                if (thd2.x === 0 && thd2.y === 0 && thd2.z === 0) {
                    thdCenter = thd1.clone();

                    symbolMesh.thd1 = thd1;
                }
                else {
                    thdCenter = BABYLON.Vector3.Center(thd1, thd2);
                    if (symbolType === 'PLATE') {
                        thdCenter.y = Math.min(thd1.y, thd2.y);
                    }

                    symbolMesh.thd1 = thd1;
                    symbolMesh.thd2 = thd2;

                }
            }
            symbolMesh.thdCenter = thdCenter;

            const meshId = `[${fileName}]${symbolId}`;

            symbolMesh.id = meshId;
            symbolMesh.parent = dtdxRoot;
            symbolMesh.position.set(thdCenter.x, thdCenter.y, thdCenter.z);
            symbolMesh.scaling = new BABYLON.Vector3(scale, scale, scale);
            symbolMesh.isPickable = true;
            symbolMesh.isEffectMesh = false;
            symbolMesh.effectType = DTDWeb.Mesh.MESH_EFFECT_TYPE.NORMAL;

            if (symbolMesh.material) {
                if (symbolMesh.subMeshes.length === 1) {
                    symbolMesh.material = this._DTDWeb.modelManager.getMaterialFromRGBA(
                        symbolProperty.COLOR_R, symbolProperty.COLOR_G, symbolProperty.COLOR_B, Math.round(symbolMesh.material.alpha * 255));
                } else {
                    const multiMaterial = new BABYLON.MultiMaterial(`${symbolMesh.id}_materials`, this._scene);
                    for (const subMaterial of symbolMesh.material.subMaterials) {
                        multiMaterial.subMaterials.push(this._DTDWeb.modelManager.getMaterialFromRGBA(
                            symbolProperty.COLOR_R, symbolProperty.COLOR_G, symbolProperty.COLOR_B, Math.round(subMaterial.alpha * 255)));
                    }
                    symbolMesh.material = multiMaterial;
                }
            }

            symbolMesh.computeWorldMatrix(true);

            if (this._DTDWeb.useFreeze) {
                symbolMesh.alwaysSelectAsActiveMesh = true;
            }

            symbolMesh.symbolType = symbolProperty.GUBUN;
            symbolMesh.symbolProperty = symbolProperty;

            symbolMeshes.push(symbolMesh);

            this._DTDWeb.modelManager.addMesh(fileName, meshId, symbolMesh);
        }

        return symbolMeshes;
    }

    findConnectedTubeLineMesh(mesh, tubeLineMeshes, callback) {
        const centerWorld = mesh.getBoundingInfo().boundingBox.centerWorld;

        let closestDistance = Infinity;
        for (const tubeLineMesh of tubeLineMeshes) {
            if (tubeLineMesh.intersectsMesh(mesh)) {
                let distance = BABYLON.Vector3.DistanceSquared(tubeLineMesh.position, centerWorld);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    mesh.connectedTubeLineMesh = tubeLineMesh;
                }
            }
        }

        if (callback) {
            callback();
        }
    }

    rotateSymbolToConnectedTubeLineMesh(mesh, tubeLineMeshes, callback) {
        const centerWorld = mesh.getBoundingInfo().boundingBox.centerWorld;

        let closestDistance = Infinity;
        for (const tubeLineMesh of tubeLineMeshes) {
            if (tubeLineMesh.intersectsPoint(centerWorld)) {
                const thd1 = tubeLineMesh.thd1;
                const thd2 = tubeLineMesh.thd2;

                const distance1 = BABYLON.Vector3.DistanceSquared(thd1, centerWorld);
                const distance2 = BABYLON.Vector3.DistanceSquared(thd2, centerWorld);

                let distance = Math.min(distance1, distance2);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    mesh.connectedTubeLineMesh = tubeLineMesh;
                }
            }
        }

        // 연결 되어있는 TubeLine 메시의 끝 점을 바라보도록 lookAt
        if (mesh.connectedTubeLineMesh) {
            const tubeLineMesh = mesh.connectedTubeLineMesh;
            const thd1 = tubeLineMesh.thd1;
            const thd2 = tubeLineMesh.thd2;

            const distance1 = BABYLON.Vector3.DistanceSquared(thd1, centerWorld);
            const distance2 = BABYLON.Vector3.DistanceSquared(thd2, centerWorld);

            const lookAtPoint = distance1 > distance2 ? thd1 : thd2;

            mesh.lookAt(lookAtPoint);
        }

        if (callback) {
            callback();
        }
    }

    getEulerAnglesFromDirectionString(directionString) {
        if (directionString === undefined || directionString.length === 0) {
            console.error('ERROR: DIRECTION is undefined or empty.');
            return BABYLON.Vector3.Zero();
        }

        const ANGLE_90 = BABYLON.Tools.ToRadians(90);
        const ANGLE_180 = BABYLON.Tools.ToRadians(180);

        switch (directionString) {
            case 'NS':
                return BABYLON.Vector3.Zero();
            case 'SN':
                return new BABYLON.Vector3(0, ANGLE_180, 0);
            case 'WE':
                return new BABYLON.Vector3(0, -ANGLE_90, 0);
            case 'EW':
                return new BABYLON.Vector3(0, ANGLE_90, 0);
            case 'UD':
                return new BABYLON.Vector3(-ANGLE_90, 0, 0);
            case 'DU':
                return new BABYLON.Vector3(ANGLE_90, 0, 0);
            default:
                console.error(`ERROR: ${directionString} is unknown direction.`);
                return BABYLON.Vector3.Zero();
        }
    }

    getEulerAnglesFromTeeLongDirectionString(directionString) {
        if (directionString === undefined || directionString.length === 0) {
            console.error('ERROR: DIRECTION is undefined or empty.');
            return BABYLON.Vector3.Zero();
        }

        const ANGLE_90 = BABYLON.Tools.ToRadians(90);
        const ANGLE_180 = BABYLON.Tools.ToRadians(180);

        switch (directionString) {
            case 'NS':
                return new BABYLON.Vector3(0, 0, ANGLE_90);
            case 'SN':
                return new BABYLON.Vector3(0, 0, -ANGLE_90);
            case 'WE':
                return BABYLON.Vector3.Zero();
            case 'EW':
                return new BABYLON.Vector3(0, 0, ANGLE_180);
            case 'UD':
                return new BABYLON.Vector3(0, 0, ANGLE_90);
            case 'DU':
                return new BABYLON.Vector3(0, 0, -ANGLE_90);
            default:
                console.error(`ERROR: ${directionString} is unknown direction.`);
                return BABYLON.Vector3.Zero();
        }
    }

    getColorFromRGBString(inputColorR, inputColorG, inputColorB) {
        const colorR = Number(inputColorR) / 255;
        const colorG = Number(inputColorG) / 255;
        const colorB = Number(inputColorB) / 255;

        return new BABYLON.Color3(colorR, colorG, colorB);
    }

    getVector3FromString(inputVector3String) {
        inputVector3String = inputVector3String.replace('(', '').replace(')', '');
        const splitString = inputVector3String.split(',');

        return new BABYLON.Vector3(Number(splitString[0]), Number(splitString[2]), Number(splitString[1])).scale(DTDWeb.KEPCOENC.IMPORT_SCALE);
    }

    createConnectorSpheres(symbolMesh) {
        // 연결 지점 Debug용 Sphere 생성
        const connectorOrigins = symbolMesh.connectorOrigins;
        if (connectorOrigins === undefined || connectorOrigins.length === 0) {
            return;
        }
        const diameter = DTDWeb.Utility.GetMillimeterFromInchString('3/8') * 2 * DTDWeb.KEPCOENC.IMPORT_SCALE;
        const color = BABYLON.Color3.Random();
        const colorR = parseInt(color.r * 255).toString();
        const colorG = parseInt(color.g * 255).toString();
        const colorB = parseInt(color.b * 255).toString();
        for (let connectorIndex = 0; connectorIndex < connectorOrigins.length; connectorIndex++) {
            const connectorSphere = BABYLON.MeshBuilder.CreateSphere(`${symbolMesh.id}_Connector_${connectorIndex + 1}`, { diameter });
            connectorSphere.setParent(symbolMesh);
            connectorSphere.setPositionWithLocalVector(connectorOrigins[connectorIndex]);
            connectorSphere.isPickable = false;
            connectorSphere.isLinkMesh = false;
            connectorSphere.material = modelManager.getMaterialFromRGBA(colorR, colorG, colorB, 255);
        }
    }

    addSymbolMeshParameters(symbolMesh, symbolProperty) {
        const parameterGroupTable = {
            group: DTDWeb.Parameter.PARAMETER_GROUP_TEXT.SYMBOL,
            parameterDictionary: {
            }
        };
        parameterGroupTable.parameterDictionary[DTDWeb.Parameter.PARAMETER_KEY_TEXT.HANDLE] = symbolProperty.HANDLE;

        if (symbolProperty.GUBUN === 'ROOT_VALVE') {
            parameterGroupTable.parameterDictionary[DTDWeb.Parameter.PARAMETER_KEY_TEXT.TAG] = symbolProperty.TAG;
        }

        symbolMesh.meshData.parameterGroupTableArray.push(parameterGroupTable);
    }

    addLineTubeConnectorData(tubeLineMeshes) {
        const tubeLineGroupDictionary = {};
        const fileName = tubeLineMeshes[0].parent.id;

        for (const tubeLineMesh of tubeLineMeshes) {
            const lineGroup = tubeLineMesh.symbolProperty.LINE_GROUP;
            const lineSeq = tubeLineMesh.symbolProperty.LINE_SEQ;
            if (!lineGroup || !lineSeq) {
                continue;
            }

            if (!tubeLineGroupDictionary[lineGroup]) {
                tubeLineGroupDictionary[lineGroup] = {};
            }
            const tubeLineSeqDictionary = tubeLineGroupDictionary[lineGroup];
            if (tubeLineSeqDictionary[lineSeq]) {
                console.error(`ERROR: LINE_SEQ(${lineSeq}), LINE_GROUP(${lineGroup}) is duplicate.`);
            }
            else {
                tubeLineSeqDictionary[lineSeq] = tubeLineMesh;
            }
        }

        const connectorDataId = `[${fileName}]0`;
        const connectorDataDictionary = {};
        connectorDataDictionary[connectorDataId] = [];
        const lineGroups = Object.keys(tubeLineGroupDictionary);
        for (const lineGroup of lineGroups) {
            const tubeLineSeqDictionary = tubeLineGroupDictionary[lineGroup];
            const lineSeqKeys = Object.keys(tubeLineSeqDictionary);
            if (lineSeqKeys.length === 0) {
                continue;
            }
            lineSeqKeys.sort((a, b) => {
                const numberA = Number(a);
                const numberB = Number(b);

                if (numberA > numberB) {
                    return 1;
                }
                if (numberA < numberB) {
                    return -1;
                }

                return 0;
            });

            const sequenceLineMeshes = [];
            for (const lineSeqKey of lineSeqKeys) {
                sequenceLineMeshes.push(tubeLineSeqDictionary[lineSeqKey]);
            }

            const connectorDatas = connectorDataDictionary[connectorDataId];

            const rootValve = this._rootValveLineGroupDictionary[lineGroup];

            let lineSequence = 0;
            let connectorData = new ConnectorData();
            connectorData.id = connectorDataId;
            connectorData.elementOwner = rootValve.id;
            connectorData.elementConnect = '-1';
            connectorData.origin = rootValve.thdCenter;
            connectorData.lineSequence = lineSequence++;
            connectorDatas.push(connectorData);

            for (let sequenceIndex = 0; sequenceIndex < sequenceLineMeshes.length; sequenceIndex++) {
                let previousConnectorData = connectorDatas[connectorDatas.length - 1];
                let origin = previousConnectorData.origin;

                let lineMesh = sequenceLineMeshes[sequenceIndex];

                let lineMeshTHD1 = lineMesh.thd1;
                let lineMeshTHD2 = lineMesh.thd2;

                let distance1 = BABYLON.Vector3.Distance(origin, lineMeshTHD1);
                let distance2 = BABYLON.Vector3.Distance(origin, lineMeshTHD2);

                origin = distance1 < distance2 ? lineMeshTHD1 : lineMeshTHD2;

                connectorData = new ConnectorData();
                connectorData.id = connectorDataId;
                connectorData.elementOwner = previousConnectorData.elementOwner;
                connectorData.elementConnect = lineMesh.id;
                connectorData.origin = origin.clone();
                connectorData.lineSequence = lineSequence++;
                connectorDatas.push(connectorData);

                connectorData = new ConnectorData();
                connectorData.id = connectorDataId;
                connectorData.elementOwner = lineMesh.id;
                connectorData.elementConnect = previousConnectorData.elementOwner;
                connectorData.origin = origin.clone();
                connectorData.lineSequence = lineSequence++;
                connectorDatas.push(connectorData);
            }

            let lineMesh = sequenceLineMeshes[sequenceLineMeshes.length - 1];
            let origin = connectorDatas[connectorDatas.length - 1].origin;

            let lineMeshTHD1 = lineMesh.thd1;
            let lineMeshTHD2 = lineMesh.thd2;

            let distance1 = BABYLON.Vector3.Distance(origin, lineMeshTHD1);
            let distance2 = BABYLON.Vector3.Distance(origin, lineMeshTHD2);

            origin = distance1 > distance2 ? lineMeshTHD1 : lineMeshTHD2;

            connectorData = new ConnectorData();
            connectorData.id = connectorDataId;
            connectorData.elementOwner = lineMesh.id;
            connectorData.elementConnect = '-1';
            connectorData.origin = origin.clone();
            connectorData.lineSequence = lineSequence++;
            connectorDatas.push(connectorData);
        }

        Object.assign(this._DTDWeb.modelManager.connectorDataDictionary, connectorDataDictionary);
    }
}

export { KEPCOENCImportManager };