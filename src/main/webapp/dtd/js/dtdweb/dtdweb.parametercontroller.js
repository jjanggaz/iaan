import { DTDWeb } from './dtdweb.js';

class DTDWebParameterController {
    constructor(dtdWeb) {
        this._DTDWeb = dtdWeb;
        this._scene = dtdWeb.scene;

        // Parameter Panel UI Start
        this._isParameterPanelVisible = false;

        this._parameterStackPanel = undefined;
        this._parameterScrollViewer = undefined;

        this._titleTextBlock = undefined;
        this._titleRectangle = undefined;

        this._groupTextBlocks = [];
        this._groupRectangles = [];

        this._keyTextBlocks = [];
        this._valueTextBlocks = [];
        this._keyValueRectangles = [];

        this.initializeParameterPanel();
        // Parameter Panel UI End
    }

    get isParameterPanelVisible() {
        return this._isParameterPanelVisible;
    }

    getMeshesParameters(keyValueJsonArray) {
        const foundMeshes = keyValueJsonArray === undefined ?
            this._DTDWeb.modelManager.getMeshes() : this.getMeshesByParameters(keyValueJsonArray, false);
        const foundMeshesParameters = [];

        for (const foundMesh of foundMeshes) {
            const foundMeshParameter = this.getParametersByMesh(foundMesh);
            if (foundMeshParameter && Object.keys(foundMeshParameter).length > 0) {
                foundMeshesParameters.push(foundMeshParameter);
            }
        }

        return foundMeshesParameters;
    }

    getClassificatedParameters() {
        const meshes = this._DTDWeb.modelManager.getMeshes();

        const meshesParameters = {};
        const classificatedParameters = {};
        for (const mesh of meshes) {
            if (mesh === undefined) {
                continue;
            }

            const meshData = mesh.meshData;
            if (meshData === undefined) {
                continue;
            }

            const parameterGroupTableArray = meshData.parameterGroupTableArray;
            if (parameterGroupTableArray === undefined || parameterGroupTableArray.length === 0) {
                continue;
            }

            for (const parameterGroupTable of parameterGroupTableArray) {
                const parameterDictionary = parameterGroupTable.parameterDictionary;
                if (parameterDictionary === undefined) {
                    continue;
                }

                for (const key in parameterDictionary) {
                    const value = parameterDictionary[key];

                    if (classificatedParameters[key] === undefined) {
                        classificatedParameters[key] = {};
                    }

                    if (classificatedParameters[key][value] === undefined) {
                        classificatedParameters[key][value] = [];
                    }

                    let meshParameter = meshesParameters[mesh.id];
                    if (meshParameter === undefined) {
                        meshParameter = this.getParametersByMesh(mesh);
                        meshesParameters[mesh.id] = meshParameter;
                    }

                    classificatedParameters[key][value].push(meshParameter);
                }
            }
        }

        return classificatedParameters;
    }

    getParametersByMesh(mesh) {
        const meshData = mesh.meshData;
        if (meshData === undefined) {
            return undefined;
        }

        const parameterGroupTableArray = meshData.parameterGroupTableArray;
        if (parameterGroupTableArray === undefined || parameterGroupTableArray.length === 0) {
            return undefined;
        }

        const parameters = {};
        for (const parameterGroupTable of parameterGroupTableArray) {
            const parameterDictionary = parameterGroupTable.parameterDictionary;
            if (parameterDictionary === undefined) {
                continue;
            }

            for (const parameterKey in parameterDictionary) {
                // const key = DTDWebParameterController.GetLocalizationParameterKey(parameterKey, 'ENG');
                // parameters[key] = parameterDictionary[parameterKey];
                parameters[parameterKey] = parameterDictionary[parameterKey];
            }
        }

        return parameters;
    }

    getMeshesByParameters(keyValueJsonArray, isFindOnlyOne) {
        for (const keyValueJson of keyValueJsonArray) {
            for (const keyValue of keyValueJson) {
                keyValue['key'] = DTDWebParameterController.GetLocalizedParameterKey(keyValue['key']);
            }
        }

        const meshes = this._DTDWeb.modelManager.getMeshes();
        const resultMeshes = [];

        for (const mesh of meshes) {
            const meshData = mesh.meshData;
            if (meshData === undefined) {
                continue;
            }

            const parameterGroupTableArray = meshData.parameterGroupTableArray;
            if (parameterGroupTableArray === undefined || parameterGroupTableArray.length === 0) {
                continue;
            }

            for (const parameterGroupTable of parameterGroupTableArray) {
                for (const keyValueJson of keyValueJsonArray) {
                    let isCorrect = true;
                    for (const keyValue of keyValueJson) {
                        const key = keyValue['key'];
                        const value = keyValue['value'];

                        let regexKey = undefined;
                        let regexValue = undefined;
                        const isRegexKey = DTDWeb.Utility.IsContainsRegexPattern(key);
                        if (isRegexKey) {
                            regexKey = DTDWeb.Utility.GetRegExpFromRegexString(key);
                        }
                        const isRegexValue = DTDWeb.Utility.IsContainsRegexPattern(value);
                        if (isRegexValue) {
                            regexValue = DTDWeb.Utility.GetRegExpFromRegexString(value);
                        }

                        if (key === 'group') {
                            if (parameterGroupTable.group !== value) {
                                isCorrect = false;
                                break;
                            }
                        }
                        else {
                            const parameterDictionary = parameterGroupTable.parameterDictionary;
                            if (parameterGroupTable.parameterDictionary === undefined) {
                                isCorrect = false;
                                break;
                            }

                            const foundKeys = [];
                            if (isRegexKey) {
                                for (const parameterKey in parameterDictionary) {
                                    if (parameterKey.match(regexKey)) {
                                        foundKeys.push(parameterKey);
                                    }
                                }
                            }
                            else {
                                if (parameterDictionary[key]) {
                                    foundKeys.push(key);
                                }
                            }

                            let isNeedBreak = foundKeys.length === 0;
                            for (const foundKey of foundKeys) {
                                if (isRegexValue) {
                                    if (!parameterDictionary[foundKey].match(regexValue)) {
                                        isNeedBreak = true;
                                        break;
                                    }
                                }
                                else {
                                    if (value !== '' && parameterDictionary[key] !== value) {
                                        isNeedBreak = true;
                                        break;
                                    }
                                }
                            }

                            if (isNeedBreak) {
                                isCorrect = false;
                                break;
                            }
                        }
                    }

                    if (isCorrect) {
                        resultMeshes.push(mesh);
                        if (isFindOnlyOne) {
                            return resultMeshes;
                        }
                    }
                }
            }
        }

        if (isFindOnlyOne) {
            return undefined;
        }

        return resultMeshes;
    }

    getSameCategoryMeshes(mesh) {
        let sameCategoryMeshes = [];

        const meshData = mesh.meshData;
        if (meshData && meshData.parameterGroupTableArray) {
            const key = DTDWeb.Parameter.PARAMETER_KEY_TEXT.CATEGORY;
            const category = meshData.parameterGroupTableArray[0].parameterDictionary[key];
            if (category) {
                const keyValueJson = [[{ key, value: category }]];
                sameCategoryMeshes = this.getMeshesByParameters(keyValueJson);
            }
        }

        return sameCategoryMeshes;
    }

    addParameters(keyValueJson, group, keys, values) {
        const meshes = this.getMeshesByParameters(keyValueJson);
        if (meshes.length === 0) {
            console.error(`DTDWeb Error: Cannot found target(${keyValueJson})`);
            return;
        }

        for (const mesh of meshes) {
            const meshData = mesh.meshData;
            if (meshData && meshData.parameterGroupTableArray) {
                const parameterGroupTableArray = meshData.parameterGroupTableArray;
                let isGroupContains = false;
                let foundGroupIndex = -1;
                for (let groupIndex = 0; groupIndex < parameterGroupTableArray.length; groupIndex++) {
                    const parameterGroupTable = parameterGroupTableArray[groupIndex];
                    if (parameterGroupTable.group === group) {
                        isGroupContains = true;
                        foundGroupIndex = groupIndex;
                        break;
                    }
                }

                let parameterDictionary = undefined;
                if (isGroupContains && foundGroupIndex > -1) {
                    parameterDictionary = parameterGroupTableArray[foundGroupIndex].parameterDictionary;
                }
                else {
                    parameterDictionary = {};
                    parameterGroupTableArray.push({
                        group,
                        parameterDictionary
                    });
                }

                for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
                    if (keyIndex >= values.length) {
                        break;
                    }

                    const key = keys[keyIndex];
                    const value = values[keyIndex];

                    parameterDictionary[key] = value;
                }
            }
        }
    }

    initializeParameterPanel() {
        this._titleTextBlock = new BABYLON.GUI.TextBlock();
        this._titleTextBlock.width = '100%';
        this._titleTextBlock.height = '100%';
        this._titleTextBlock.color = 'white';
        this._titleTextBlock.fontFamily = DTDWeb.GLOBAL_FONT_FAMILY;
        this._titleTextBlock.fontSize = 12;

        this._titleCloseButton = BABYLON.GUI.Button.CreateImageOnlyButton(undefined,
            `${DTDPlayer.IMAGE_DIRECTORY}/close.png`);
        this._titleCloseButton.leftInPixels = -12;
        this._titleCloseButton.topInPixels = 0;
        this._titleCloseButton.widthInPixels = 12;
        this._titleCloseButton.heightInPixels = 12;
        this._titleCloseButton.background = 'transparent';
        this._titleCloseButton.thickness = 0;
        this._titleCloseButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this._titleCloseButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        this._titleCloseButton.onPointerClickObservable.add(() => {
            this.hideParameterPanel();
        });

        this._titleRectangle = new BABYLON.GUI.Rectangle();
        this._titleRectangle.width = '100%';
        this._titleRectangle.heightInPixels = 40;
        this._titleRectangle.background = 'transparent';
        this._titleRectangle.thickness = 0;
        this._titleRectangle.addControl(this._titleTextBlock);
        this._titleRectangle.addControl(this._titleCloseButton);

        this._parameterStackPanel = new BABYLON.GUI.StackPanel('ParameterStackPanel');
        this._parameterStackPanel.width = '100%';
        this._parameterStackPanel.paddingBottomInPixels = 20;
        this._parameterStackPanel.background = 'transparent';
        this._parameterStackPanel.isVertical = true;

        this._parameterScrollViewer = new BABYLON.GUI.ScrollViewer('ParameterScrollViewer');
        this._parameterScrollViewer.isPointerBlocker = true;
        this._parameterScrollViewer.widthInPixels = 270;
        this._parameterScrollViewer.height = '100%';
        this._parameterScrollViewer.background = 'rgb(79, 79, 79, 0.45)';
        this._parameterScrollViewer.barBackground = '#4F4F4F';
        this._parameterScrollViewer.barColor = '#D6D6D6';
        this._parameterScrollViewer.barSize = 5;
        this._parameterScrollViewer.thickness = 0;
        this._parameterScrollViewer.thumbLength = 0;
        this._parameterScrollViewer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this._parameterScrollViewer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this._parameterScrollViewer.horizontalBar.color = this._parameterScrollViewer.background;
        this._parameterScrollViewer.addControl(this._parameterStackPanel);

        let isPointerDown = false;
        let lastPointerY;
        this._parameterScrollViewer.onPointerDownObservable.add(() => {
            isPointerDown = true;
            lastPointerY = this._scene.pointerY;
        });
        this._parameterScrollViewer.onPointerMoveObservable.add(() => {
            if (!isPointerDown) {
                return;
            }
            const deltaY = this._DTDWeb.uiManager.multiplyDevicePixelRatio(this._scene.pointerY - lastPointerY);
            lastPointerY = this._scene.pointerY;

            this._parameterScrollViewer.verticalBar.value -= (deltaY * 0.001);
        });
        this._parameterScrollViewer.onPointerUpObservable.add(() => {
            isPointerDown = false;
        });
    }

    showParameterPanel(mesh) {
        const meshData = mesh.meshData;
        if (meshData === undefined) {
            return;
        }

        const parameterGroupTableArray = meshData.parameterGroupTableArray;
        if (meshData.parameterGroupTableArray === undefined || meshData.parameterGroupTableArray.length === 0) {
            return;
        }

        const devicePixelRatio = this._DTDWeb.uiManager.devicePixelRatio;

        this.clearParameterPanel();

        const titleText = parameterGroupTableArray[0].parameterDictionary[DTDWeb.Parameter.PARAMETER_KEY_TEXT.NAME];
        if (titleText) {
            this._titleTextBlock.text = titleText;
        }
        this._parameterStackPanel.addControl(this._titleRectangle);

        for (const parameterGroupTable of parameterGroupTableArray) {
            const groupText = parameterGroupTable.group;
            const groupTextBlock = new BABYLON.GUI.TextBlock(`${groupText}_TextBlock`);
            groupTextBlock.width = '100%';
            groupTextBlock.height = '100%';
            groupTextBlock.color = 'white';
            groupTextBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            groupTextBlock.paddingLeft = '3px';
            groupTextBlock.fontFamily = DTDWeb.GLOBAL_FONT_FAMILY;
            groupTextBlock.fontSize = 12;
            groupTextBlock.text = groupText;
            this._groupTextBlocks.push(groupTextBlock);

            const groupRectangle = new BABYLON.GUI.Rectangle(`${groupText}_Rectangle`);
            groupRectangle.width = '95%';
            groupRectangle.height = '30px';
            groupRectangle.background = '#3A3838';
            groupRectangle.color = '#4F4F4F';
            groupRectangle.thickness = 1 * devicePixelRatio * devicePixelRatio;
            groupRectangle.addControl(groupTextBlock);
            this._groupRectangles.push(groupRectangle);

            this._parameterStackPanel.addControl(groupRectangle);

            const parameterDictionary = parameterGroupTable.parameterDictionary;
            for (const key in parameterDictionary) {
                if (key === DTDWeb.Parameter.PARAMETER_KEY_TEXT.NAME) {
                    continue;
                }

                const groupKey = `${groupText}_${key}`;
                const keyTextBlock = new BABYLON.GUI.TextBlock(`${groupKey}_TextBlock`);
                keyTextBlock.width = '45%';
                keyTextBlock.height = '100%';
                keyTextBlock.color = 'white';
                keyTextBlock.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                keyTextBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                keyTextBlock.paddingLeft = '5px';
                keyTextBlock.fontFamily = DTDWeb.GLOBAL_FONT_FAMILY;
                keyTextBlock.fontSize = 12;
                keyTextBlock.textWrapping = true;
                keyTextBlock.text = key;
                this._keyTextBlocks.push(keyTextBlock);

                const valueTextBlock = new BABYLON.GUI.TextBlock(`${groupKey}_Value_TextBlock`, parameterDictionary[key]);
                valueTextBlock.left = '45%';
                valueTextBlock.width = '55%';
                valueTextBlock.height = '100%';
                valueTextBlock.color = 'white';
                valueTextBlock.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                valueTextBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                valueTextBlock.paddingLeft = '5px';
                valueTextBlock.fontFamily = DTDWeb.GLOBAL_FONT_FAMILY;
                valueTextBlock.fontSize = 12;
                valueTextBlock.textWrapping = true;
                valueTextBlock.text = parameterDictionary[key];
                this._valueTextBlocks.push(valueTextBlock);

                const keyValueRectangle = new BABYLON.GUI.Rectangle(`${groupKey}_Rectangle`);
                keyValueRectangle.width = '95%';
                keyValueRectangle.height = '35px';
                keyValueRectangle.background = '#434242';
                keyValueRectangle.color = '#4F4F4F';
                keyValueRectangle.thickness = 1 * devicePixelRatio * devicePixelRatio;
                keyValueRectangle.addControl(keyTextBlock);
                keyValueRectangle.addControl(valueTextBlock);
                this._keyValueRectangles.push(keyValueRectangle);

                this._parameterStackPanel.addControl(keyValueRectangle);
            }
        }

        this._parameterScrollViewer.verticalBar.value = 0;
        this._DTDWeb.uiManager.addGUIControl(this._parameterScrollViewer);
        this._DTDWeb.uiManager.setRightPanelVisible(true);

        this._isParameterPanelVisible = true;
    }

    updateParameterPanel(mesh) {
        this.clearParameterPanel();

        this.showParameterPanel(mesh);
    }

    clearParameterPanel() {
        this._titleTextBlock.text = '';
        this._parameterStackPanel.clearControls();

        if (this._keyValueRectangles.length > 0) {
            for (const keyValueRectangle of this._keyValueRectangles) {
                keyValueRectangle.clearControls();
                keyValueRectangle.dispose();
            }

            this._keyValueRectangles = [];
        }

        if (this._valueTextBlocks.length > 0) {
            for (const valueTextBlock of this._valueTextBlocks) {
                valueTextBlock.dispose();
            }

            this._valueTextBlocks = [];
        }

        if (this._keyTextBlocks.length > 0) {
            for (const keyTextBlock of this._keyTextBlocks) {
                keyTextBlock.dispose();
            }

            this._keyTextBlocks = [];
        }

        if (this._groupRectangles.length > 0) {
            for (const groupRectangle of this._groupRectangles) {
                groupRectangle.clearControls();
                groupRectangle.dispose();
            }

            this._groupRectangles = [];
        }

        if (this._groupTextBlocks.length > 0) {
            for (const groupTextBlock of this._groupTextBlocks) {
                groupTextBlock.dispose();
            }

            this._groupTextBlocks = [];
        }
    }

    hideParameterPanel() {
        this.clearParameterPanel();

        this._DTDWeb.uiManager.removeGUIControl(this._parameterScrollViewer);
        this._DTDWeb.uiManager.setRightPanelVisible(false);

        this._isParameterPanelVisible = false;
    }

    static CreateParameterGroupTableArray(id, fileName) {
        const parameterGroupTableArray = [];

        const replaceId = id.replace(`[${fileName}]`, '');

        const baseItem = new Object();
        baseItem.group = DTDWeb.Parameter.PARAMETER_GROUP_TEXT.BASE_INFORMATION;
        baseItem.parameterDictionary = {};
        baseItem.parameterDictionary[DTDWeb.Parameter.PARAMETER_KEY_TEXT.ID] = replaceId;
        baseItem.parameterDictionary[DTDWeb.Parameter.PARAMETER_KEY_TEXT.FILE_NAME] = fileName;
        parameterGroupTableArray.push(baseItem);

        return parameterGroupTableArray;
    }

    static MergeParameterGroupTableArray(sourceParameterGroupTableArray, targetParameterGroupTableArray) {
        if (!sourceParameterGroupTableArray) {
            return;
        }

        for (const originParameterGroupTable of sourceParameterGroupTableArray) {
            let isContainsGroup = false;
            for (const linkParameterGroupTable of targetParameterGroupTableArray) {
                if (linkParameterGroupTable.group === originParameterGroupTable.group) {
                    const originParameterDictionary = originParameterGroupTable.parameterDictionary;
                    const linkParameterDictionary = linkParameterGroupTable.parameterDictionary;

                    for (const originParameterKey in originParameterDictionary) {
                        if (!linkParameterDictionary[originParameterKey]) {
                            linkParameterDictionary[originParameterKey] = originParameterDictionary[originParameterKey];
                        }
                    }

                    isContainsGroup = true;
                }
            }

            if (!isContainsGroup) {
                targetParameterGroupTableArray.push(originParameterGroupTable);
            }
        }
    }

    static GetLocalizedParameterGroup(originGroup) {
        const lowerCaseGroup = originGroup.toLowerCase();
        for (const localizationGroup in DTDWeb.Parameter.PARAMETER_GROUP_TEXT) {
            if (!localizationGroup.startsWith('ENG_')) {
                continue;
            }

            const lowerCaseParameterGroup = DTDWeb.Parameter.PARAMETER_GROUP_TEXT[localizationGroup].toLowerCase();
            if (lowerCaseGroup === lowerCaseParameterGroup) {
                const localizedGroup = DTDWeb.Parameter.PARAMETER_GROUP_TEXT[localizationGroup.substring(4)];
                if (localizedGroup) {
                    return localizedGroup;

                }
            }
        }

        return originGroup;
    }

    static GetLocalizedParameterKey(key) {
        const lowerCaseKey = key.toLowerCase();
        for (const localizationKey in DTDWeb.Parameter.PARAMETER_KEY_TEXT) {
            if (!localizationKey.startsWith('ENG_')) {
                continue;
            }

            const lowerCaseParameterKey = DTDWeb.Parameter.PARAMETER_KEY_TEXT[localizationKey].toLowerCase();
            if (lowerCaseKey === lowerCaseParameterKey) {
                const localizedKey = DTDWeb.Parameter.PARAMETER_KEY_TEXT[localizationKey.substring(4)];
                if (localizedKey) {
                    return localizedKey;
                }
            }
        }

        return key;
    }

    static GetLocalizationParameterKey(key, language) {
        const lowerCaseKey = key.toLowerCase();
        for (const localizationKey in DTDWeb.Parameter.PARAMETER_KEY_TEXT) {
            if (localizationKey.startsWith('KOR_') || localizationKey.startsWith('ENG_')) {
                continue;
            }

            const lowerCaseParameterKey = DTDWeb.Parameter.PARAMETER_KEY_TEXT[localizationKey].toLowerCase();
            if (lowerCaseKey === lowerCaseParameterKey) {
                const localizedKey = `${DTDWeb.Parameter.PARAMETER_KEY_TEXT[`${language}_${localizationKey}`]}`;
                if (localizedKey) {
                    return localizedKey;
                }
            }
        }

        return key;
    }

    static ModifyMeshParameter(mesh, key, value) {
        const meshData = mesh.meshData;
        if (meshData === undefined) {
            return;
        }

        const parameterGroupTableArray = meshData.parameterGroupTableArray;
        if (parameterGroupTableArray === undefined || parameterGroupTableArray.length === 0) {
            return;
        }

        for (const parameterGroupTable of parameterGroupTableArray) {
            const parameterDictionary = parameterGroupTable.parameterDictionary;
            if (parameterDictionary === undefined || Object.keys(parameterDictionary).length === 0) {
                continue;
            }

            if (parameterDictionary[key]) {
                parameterDictionary[key] = value;
            }
        }
    }

    static GetMeshId(mesh) {
        const meshData = mesh.meshData;
        if (meshData === undefined) {
            return mesh.id;
        }

        const parameterGroupTableArray = meshData.parameterGroupTableArray;
        if (parameterGroupTableArray === undefined || parameterGroupTableArray.length === 0) {
            return mesh.id;
        }

        return parameterGroupTableArray[0].parameterDictionary[DTDWeb.Parameter.PARAMETER_KEY_TEXT.ID];
    }

    static GetMeshFileName(mesh) {
        const meshData = mesh.meshData;
        if (meshData === undefined) {
            return '';
        }

        const parameterGroupTableArray = meshData.parameterGroupTableArray;
        if (parameterGroupTableArray === undefined || parameterGroupTableArray.length === 0) {
            return '';
        }

        return parameterGroupTableArray[0].parameterDictionary[DTDWeb.Parameter.PARAMETER_KEY_TEXT.FILE_NAME];
    }
}

export { DTDWebParameterController };