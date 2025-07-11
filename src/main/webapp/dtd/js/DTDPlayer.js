class DTDPlayer {
    // DTDWeb Root(Relative)
    static DTDWEB_DIRECTORY = '/DTDWeb';
    // DTDWeb Third-Party Directory(Relative)
    static THIRDPARTY_SCRIPT_DIRECTORY = `${DTDPlayer.DTDWEB_DIRECTORY}/js/third-party`;
    // DTDWeb Texture Directory(Relative)
    static TEXTURE_DIRECTORY = `${DTDPlayer.DTDWEB_DIRECTORY}/textures`;
    // DTDWeb UI Image Directory(Relative)
    static IMAGE_DIRECTORY = `${DTDPlayer.DTDWEB_DIRECTORY}/images`;
    // DTDWeb UI GLTF Directory(Relative)
    static GLTF_DIRECTORY = `${DTDPlayer.DTDWEB_DIRECTORY}/gltf`;
    // DTDWeb Font Directory(Relative)
    static FONT_DIRECTORY = `${DTDPlayer.DTDWEB_DIRECTORY}/fonts`;

    static FunctionMode = {
        NONE: 0,
        MARKUP: 1,
        PATH_TRACKING: 2,
        INTERFERENCE_CHECK: 3,
        BOOKMARK: 4
    };

    constructor() {
        this._DTDWebPlayerBridge = undefined;

        this.OnCanvasResized = (width, height) => {
            console.log('OnCanvasResized', width, height);
        };

        this.OnContentsAllLoaded = () => {
            console.log('OnContentsAllLoaded');
        };

        this.OnSelected = (parameters) => {
            console.log('OnSelect', parameters);
        };

        this.OnFunctionModeChanged = (beforeFunctionMode, currentFunctionMode) => {
            console.log(`OnFunctionModeChanged before:${beforeFunctionMode}, current:${currentFunctionMode}`);
        };

        this.OnClickProperty = (parameters) => {
            console.log('OnClickProperty', parameters);
        };

        this.OnAddMarkupSuccess = (markupType) => {
            console.log(`OnAddMarkupSuccess: ${markupType}`);
        };

        this.OnAfterMarkupAction = (hasPrevious, hasNext) => {
            console.log(`OnAfterMarkupAction hasPrevious:${hasPrevious}, hasNext:${hasNext}`);
        };

        this.OnPathTrackingEnd = () => {
            console.log('OnPathTrackingEnd');
        };

        this.OnInterferenceCheckEnd = (successResult) => {
            console.log(`OnInterferenceCheckEnd: ${successResult}`);
        };

        this._currentFunctionMode = DTDPlayer.FunctionMode.NONE;

        // for DTDon START
        this.OnClickShareMarkupButton = (base64String) => {
            console.log('OnClickShareMarkupButton', base64String);
        };
        // for DTDon END

        // KEPCO E&C Custom START
        this.On2DView = undefined;
        this.On2DDesignCheckResult = undefined;
        this.On3DDesignCheckResult = undefined;
        this.OnFieldDesignCheckResult = undefined;
        // KEPCO E&C Custom END
    }

    InitializeOptions(options) {
        this._DTDWebPlayerBridge.initializeOptions(options);
    }

    OpenURL(uris, isUrl) {
        this._DTDWebPlayerBridge.openURL(uris, isUrl === undefined ? true : isUrl);
    }

    OpenURLFromFilePathsParameter() {
        const urlParameters = window.location.search.substring(1).split('&');
        for (const urlParameter of urlParameters) {
            const parameter = urlParameter.split('=');
            if (parameter[0] === 'filePaths') {
                const filePaths = parameter[1];
                if (filePaths === undefined) {
                    return;
                }

                const urls = [];
                const relativePaths = filePaths.split(',');
                for (const relativePath of relativePaths) {
                    urls.push(`${window.location.protocol}//${window.location.host}/${relativePath}`);
                }

                this.OpenURL(urls, true);
            }
        }
    }

    SaveDTDX(fileName) {
        return this._DTDWebPlayerBridge.saveDTDX(fileName);
    }

    CloseAll() {
        this._DTDWebPlayerBridge.closeAll();
    }

    GetFunctionMode() {
        return this._currentFunctionMode;
    }

    SetFunctionMode(functionMode) {
        if (this._currentFunctionMode === functionMode) {
            return;
        }

        const previousFunctionMode = this._currentFunctionMode;

        this._DTDWebPlayerBridge.stopPreviousFunctionMode(previousFunctionMode);
        this._DTDWebPlayerBridge.startFunctionMode(functionMode);

        this._currentFunctionMode = functionMode;

        if (previousFunctionMode !== this._currentFunctionMode) {
            this.OnFunctionModeChanged(previousFunctionMode, this._currentFunctionMode);
        }
    }

    // Key-Value JSON
    // Ex.: [[{key: 'id', value: '123456'}]]
    // AND: [[{key: 'id', value: '123456'}, {key: 'Category', value: 'Pipe'}]]
    // OR: [[{key: 'id', value: '123456'}], [{key: 'id', value: '7891011'}]]
    // AND & OR: [[{key: 'id', value: '123456'}, {key: 'Category', value: 'Pipe'}], [{key: 'id', value: '7891011'}]]
    // Regex(Start with 'STB'): [[{key: 'Family Type', value: '/^STB/'}]]

    // Select Deselect Start
    Select(keyValueJson) {
        this._DTDWebPlayerBridge.select(keyValueJson);
    }

    UnSelect(keyValueJson) {
        this._DTDWebPlayerBridge.deselect(keyValueJson);
    }

    UnSelectAll() {
        this._DTDWebPlayerBridge.deselectAll();
    }
    // Select Deselect End

    // Camera Control Start
    SelectAndFit(keyValueJson, isXrayCoveredMesh) {
        this._DTDWebPlayerBridge.selectAndFit(keyValueJson, isXrayCoveredMesh);
    }

    Fit(keyValueJson, isXrayCoveredMesh) {
        this._DTDWebPlayerBridge.fit(keyValueJson, isXrayCoveredMesh);
    }
    // Camera Control End

    // Camera Move Animation Start
    MoveCameraToTransformJSON(cameraTransform, onAfterAnimateEndCallback) {
        this._DTDWebPlayerBridge.moveCameraFromJSON(cameraTransform, onAfterAnimateEndCallback);
    }
    // Camera Move Animation End

    // Parameter Control Start
    GetElementDataList(keyValueJson) {
        return this._DTDWebPlayerBridge.getElementDataList(keyValueJson);
    }

    GetClassificatedElementDataList() {
        return this._DTDWebPlayerBridge.getClassificatedElementDataList();
    }
    // Parameter Control End

    // Mesh Effect Start
    EffectHighlight(keyValueJson) {
        this._DTDWebPlayerBridge.effectHighlight(keyValueJson, false);
    }

    EffectHighlightOther(keyValueJson) {
        this._DTDWebPlayerBridge.effectHighlight(keyValueJson, true);
    }

    EffectXray(keyValueJson) {
        this._DTDWebPlayerBridge.effectXray(keyValueJson, false);
    }

    EffectXrayOther(keyValueJson) {
        this._DTDWebPlayerBridge.effectXray(keyValueJson, true);
    }

    EffectChangeColor(keyValueJson, colorR, colorG, colorB, alpha) {
        this._DTDWebPlayerBridge.effectChangeColor(keyValueJson, false, colorR, colorG, colorB, alpha);
    }

    EffectChangeColorOther(keyValueJson, colorR, colorG, colorB, alpha) {
        this._DTDWebPlayerBridge.effectChangeColor(keyValueJson, true, colorR, colorG, colorB, alpha);
    }

    EffectInvisible(keyValueJson) {
        this._DTDWebPlayerBridge.effectInvisible(keyValueJson, false);
    }

    EffectInvisibleOther(keyValueJson) {
        this._DTDWebPlayerBridge.effectInvisible(keyValueJson, true);
    }

    ResetEffect(keyValueJson) {
        this._DTDWebPlayerBridge.resetEffect(keyValueJson);
    }

    ResetAllEffect() {
        this._DTDWebPlayerBridge.resetAllEffect();
    }
    // Mesh Effect End

    // Move Camera to Direction Start
    MoveCameraToHome() {
        this._DTDWebPlayerBridge.moveCameraToHome();
    }

    MoveCameraToUp() {
        this._DTDWebPlayerBridge.moveCameraToUp();
    }

    MoveCameraToFront() {
        this._DTDWebPlayerBridge.moveCameraToFront();
    }

    MoveCameraToBack() {
        this._DTDWebPlayerBridge.moveCameraToBack();
    }

    MoveCameraToLeft() {
        this._DTDWebPlayerBridge.moveCameraToLeft();
    }

    MoveCameraToRight() {
        this._DTDWebPlayerBridge.moveCameraToRight();
    }
    // Move Camera to Direction End

    // Covered Camera Meshes Effect X-ray Start
    PlayEffectXrayCoveredCamera(keyValueJson) {
        this._DTDWebPlayerBridge.playEffectXrayCoveredCameraMeshes(keyValueJson);
    }

    StopEffectXrayCoveredCamera() {
        this._DTDWebPlayerBridge.stopEffectXrayCoveredCameraMeshes();
    }
    // Covered Camera Meshes Effect X-ray End

    // UI Helper Start //
    GetPresetColors() {
        return this._DTDWebPlayerBridge.getPresetColors();
    }
    // UI Helper End //

    // Markup Start //
    StartMarkup() {
        this._DTDWebPlayerBridge.startMarkup();
    }

    StopMarkup() {
        this._DTDWebPlayerBridge.stopMarkup(true);
    }

    UndoMarkup() {
        this._DTDWebPlayerBridge.undoMarkup();
    }

    RedoMarkup() {
        this._DTDWebPlayerBridge.redoMarkup();
    }

    ClearAllMarkups() {
        this._DTDWebPlayerBridge.clearAllMarkups();
    }

    SetMarkupPenColor(hexColor) {
        this._DTDWebPlayerBridge.setMarkupPenColor(hexColor);
    }

    SetMarkupPenThickness(thickness) {
        this._DTDWebPlayerBridge.setMarkupPenThickness(thickness);
    }

    SetMarkupFontColor(hexColor) {
        this._DTDWebPlayerBridge.setMarkupFontColor(hexColor);
    }

    SetMarkupFontSize(fontSize) {
        this._DTDWebPlayerBridge.setMarkupFontSize(fontSize);
    }

    GetMarkupClipartImageUrls() {
        return this._DTDWebPlayerBridge.getMarkupClipartImageUrls();
    }

    SetMarkupClipartIndex(clipartIndex) {
        this._DTDWebPlayerBridge.setMarkupClipartIndex(clipartIndex);
    }

    GetMarkupCurrentOptions() {
        return this._DTDWebPlayerBridge.getMarkupCurrentOptions();
    }

    SaveMarkup(onSuccessCallback) {
        this._DTDWebPlayerBridge.saveMarkup(onSuccessCallback);
    }

    LoadMarkupByURL(url) {
        this._DTDWebPlayerBridge.loadMarkupByUrl(url);
    }

    LoadMarkupByBase64String(base64String, isChangeMarkupMode = true) {
        this._DTDWebPlayerBridge.loadMarkupByBase64String(base64String, isChangeMarkupMode);
    }
    // Markup End

    // Path Tracking Start
    PausePathTracking() {
        this._DTDWebPlayerBridge.pausePathTracking();
    }

    ResumePathTracking() {
        this._DTDWebPlayerBridge.resumePathTracking();
    }

    StopPathTracking() {
        this._DTDWebPlayerBridge.stopPathTracking();
    }
    // PathTracking End

    // Interference Check Start
    StartInterferenceCheck(keyValueJson1, keyValueJson2) {
        this._DTDWebPlayerBridge.runInterferenceCheck(keyValueJson1, keyValueJson2, this.OnInterferenceCheckEnd);
    }

    StopInterferenceCheck() {
        this._DTDWebPlayerBridge.stopInterferenceCheck();
    }

    MoveCameraToInterferencePoint(pointIndex, onAfterMoveCallback) {
        this._DTDWebPlayerBridge.moveCameraToInterferencePoint(pointIndex, onAfterMoveCallback);
    }
    // Interference Check End

    // Bookmark Start
    AddBookmarkGroup(groupSequenceId, onSuccessCallback) {
        this._DTDWebPlayerBridge.addBookmarkGroup(groupSequenceId, onSuccessCallback);
    }

    RemoveBookmarkGroup(groupSequenceId, onSuccessCallback) {
        this._DTDWebPlayerBridge.removeBookmarkGroup(groupSequenceId, onSuccessCallback);
    }

    AddBookmark(groupSequenceId, onSuccessCallback) {
        this._DTDWebPlayerBridge.addBookmark(groupSequenceId, onSuccessCallback);
    }

    RemoveBookmark(groupSequenceId, bookmarkSequenceId, onSuccessCallback) {
        this._DTDWebPlayerBridge.removeBookmark(groupSequenceId, bookmarkSequenceId, onSuccessCallback);
    }

    GetAllBookmarks() {
        return this._DTDWebPlayerBridge.getAllBookmarks();
    }

    SetBookmarkAnimateSpeed(groupSequenceId, bookmarkSequenceId, animateSpeed) {
        this._DTDWebPlayerBridge.setBookmarkAnimateSpeed(groupSequenceId, bookmarkSequenceId, animateSpeed);
    }

    SetBookmarkAnimateDelay(groupSequenceId, bookmarkSequenceId, animateDelay) {
        this._DTDWebPlayerBridge.setBookmarkAnimateDelay(groupSequenceId, bookmarkSequenceId, animateDelay);
    }

    SetBookmarkGlobalAnimateSpeed(animateSpeed) {
        this._DTDWebPlayerBridge.setBookmarkGlobalAnimateSpeed(animateSpeed);
    }

    SetBookmarkGlobalAnimateDelay(animateDelay) {
        this._DTDWebPlayerBridge.setBookmarkGlobalAnimateDelay(animateDelay);
    }

    PlayBookmarkAnimation(groupSequenceId, isReverse, onStateChangedCallback) {
        this._DTDWebPlayerBridge.playBookmarkAnimation(groupSequenceId, isReverse, false, onStateChangedCallback);
    }

    PlayRepeatBookmarkAnimation(groupSequenceId, isReverse, onStateChangedCallback) {
        this._DTDWebPlayerBridge.playBookmarkAnimation(groupSequenceId, isReverse, true, onStateChangedCallback);
    }

    StopBookmarkAnimation() {
        this._DTDWebPlayerBridge.stopBookmarkAnimation();
    }

    SaveBookmark() {
        return this._DTDWebPlayerBridge.saveBookmark();
    }

    LoadBookmark(bookmarks) {
        return this._DTDWebPlayerBridge.loadBookmark(bookmarks);
    }
    // Bookmark End

    // UI Start
    ShowToastMessage(message, showSeconds = 2.5) {
        this._DTDWebPlayerBridge.showToastMessage(message, showSeconds);
    }

    HideToastMessage() {
        this._DTDWebPlayerBridge.hideToastMessage();
    }

    SetOnScreenKeyHelperVisible(isVisible) {
        this._DTDWebPlayerBridge.setOnScreenKeyHelperVisible(isVisible);
    }
    // UI End

    // for DTDon START
    GetRenderCanvasForStreaming() {
        return this._DTDWebPlayerBridge.getRenderCanvasForStreaming();
    }

    SetJoinedDTDonChatRoom(hasJoined) {
        this._DTDWebPlayerBridge.setJoinedDTDonChatRoom(hasJoined);
    }

    AddDTDonPlayer(lobbySessionId) {
        this._DTDWebPlayerBridge.addDTDonPlayer(lobbySessionId);
    }

    UpdateDTDonPlayerPosition(lobbySessionId, position) {
        this._DTDWebPlayerBridge.updateDTDonPlayerPosition(lobbySessionId, position);
    }

    UpdateDTDonPlayerRotation(lobbySessionId, rotation) {
        this._DTDWebPlayerBridge.updateDTDonPlayerRotation(lobbySessionId, rotation);
    }

    RemoveDTDonPlayer(lobbySessionId) {
        this._DTDWebPlayerBridge.removeDTDonPlayer(lobbySessionId);
    }
    // for DTDon END

    // KEPCO E&C Custom START
    MoveCameraToRootValvePosition(rootValveTag, isXrayCoveredMesh) {
        this._DTDWebPlayerBridge.moveCameraToRootValvePosition(rootValveTag, isXrayCoveredMesh);
    }

    StartRootValvePathTracking(rootValveTag, animateDelay, animateSpeed, cameraRadius) {
        this._DTDWebPlayerBridge.runRootValvePathTracking(rootValveTag, animateDelay, animateSpeed, cameraRadius);
    }
    // KEPCO E&C Custom END
}

const DTDPlayers = [];

class DTDPlayerElement extends HTMLElement {
    static PreloadScripts = [
        {
            id: 'msgpackJs',
            src: `/msgpack/msgpack.min.js`
        },
        {
            id: 'earcutJs',
            src: `/earcut/earcut.min.js`
        },
        {
            id: 'piexifJs',
            src: '/piexifjs/piexif.min.js'
        },
        // {
        //     id: 'havokPhysicsJs',
        //     src: `/babylonjs/havok/HavokPhysics_umd.js`
        // },
        {
            id: 'babylonJs',
            src: `/babylonjs/babylon.js`
        },
        {
            id: 'babylonLoaderJs',
            src: `/babylonjs/loaders/babylonjs.loaders.min.js`
        },
        {
            id: 'babylonGUIJs',
            src: `/babylonjs/gui/babylon.gui.min.js`
        },
        {
            id: 'babylonGridMaterial',
            src: `/babylonjs/materialsLibrary/babylon.gridMaterial.min.js`
        }
    ];

    static IsPreloading = false;
    static IsPreloaded = false;
    static PreloadedCount = 0;

    constructor() {
        super();
    }

    preloadScript(scriptIndex) {
        if (scriptIndex === 0) {
            DTDPlayerElement.IsPreloading = true;
            DTDPlayerElement.PreloadedCount = 0;
        }

        const script = DTDPlayerElement.PreloadScripts[scriptIndex];
        if (script === undefined) {
            return;
        }

        if (document.getElementById(script.id)) {
            this.onLoadScript();
        }
        else {
            const scriptElement = document.createElement('script');
            scriptElement.id = script.id;
            scriptElement.src = `${DTDPlayer.THIRDPARTY_SCRIPT_DIRECTORY}${script.src}`;
            scriptElement.onload = () => {
                this.onLoadScript();
            };
            document.head.appendChild(scriptElement);
        }
    }

    onLoadScript() {
        DTDPlayerElement.PreloadedCount += 1;

        if (DTDPlayerElement.PreloadedCount === DTDPlayerElement.PreloadScripts.length) {
            DTDPlayerElement.IsPreloading = false;
            DTDPlayerElement.IsPreloaded = true;
        }
        else {
            this.preloadScript(DTDPlayerElement.PreloadedCount);
        }
    }

    waitForPreload() {
        return new Promise((resolve) => {
            const checkPreloadInterval = setInterval(() => {
                if (DTDPlayerElement.IsPreloaded) {
                    clearInterval(checkPreloadInterval);
                    resolve();
                }
            }, 100);
        });
    }

    async connectedCallback() {
        const scripts = document.getElementsByTagName('script');
        let playerScriptSrc = undefined;
        for (const script of scripts) {
            const src = script.getAttribute('src');
            if (src && src.includes('DTDPlayer.js')) {
                playerScriptSrc = src;
                break;
            }
        }

        if (playerScriptSrc) {
            const rootDirectory = playerScriptSrc.replace('/js/DTDPlayer.js', '');
            if (DTDPlayer.DTDWEB_DIRECTORY !== rootDirectory) {
                DTDPlayer.DTDWEB_DIRECTORY = rootDirectory;
                DTDPlayer.THIRDPARTY_SCRIPT_DIRECTORY = `${DTDPlayer.DTDWEB_DIRECTORY}/js/third-party`;
                DTDPlayer.TEXTURE_DIRECTORY = `${DTDPlayer.DTDWEB_DIRECTORY}/textures`;
                DTDPlayer.IMAGE_DIRECTORY = `${DTDPlayer.DTDWEB_DIRECTORY}/images`;
                DTDPlayer.GLTF_DIRECTORY = `${DTDPlayer.DTDWEB_DIRECTORY}/gltf`;
                DTDPlayer.FONT_DIRECTORY = `${DTDPlayer.DTDWEB_DIRECTORY}/fonts`;
            }

            if (!DTDPlayerElement.IsPreloading && !DTDPlayerElement.IsPreloaded) {
                this.preloadScript(0);
            }
        }

        await this.waitForPreload();

        const playerId = DTDPlayers.length + 1;

        this.style.overflow = 'hidden';

        const isStandalone = this.getAttribute('standalone') === 'true';
        const isCreateFileSelector = this.getAttribute('createfileselector') === 'true';
        const fileSelectorHeight = 50;
        const contentTop = isCreateFileSelector ? fileSelectorHeight : 0;

        const playerStyle = document.createElement('style');
        playerStyle.textContent = `
            canvas {
                -webkit-user-select: none;
            }

            #markupTextArea::-webkit-input-placeholder {
                color: #91A0AC;
            }
            #markupTextArea::-moz-placeholder {
                color: #91A0AC;  
            }

            @font-face {
                font-family: 'NotoSansKR';
                src: url('${DTDPlayer.FONT_DIRECTORY}/NotoSansKR-Regular.ttf');
            }
        `;
        this.appendChild(playerStyle);

        const loadingScreenDiv = document.createElement('div');
        loadingScreenDiv.id = `loadingScreenDiv_${playerId}`;
        loadingScreenDiv.style.position = 'absolute';
        loadingScreenDiv.style.left = '0px';
        loadingScreenDiv.style.top = `${contentTop}px`;
        loadingScreenDiv.style.width = '100%';
        loadingScreenDiv.style.height = `calc(100% - ${contentTop}px)`;
        loadingScreenDiv.style.background = '#1E1E1E';
        loadingScreenDiv.style.zIndex = '9999';
        loadingScreenDiv.style.display = 'none';
        this.appendChild(loadingScreenDiv);

        const loadingScreenLogoImg = document.createElement('img');
        loadingScreenLogoImg.id = `loadingScreenLogoImg_${playerId}`;
        loadingScreenLogoImg.src = `${DTDPlayer.IMAGE_DIRECTORY}/dtd_logo.png`;
        loadingScreenLogoImg.style.position = 'absolute';
        loadingScreenLogoImg.style.left = 'calc(50% - 50px)';
        loadingScreenLogoImg.style.top = 'calc(40% - 50px)';
        loadingScreenLogoImg.style.width = '100px';
        loadingScreenLogoImg.style.height = '100px';
        loadingScreenDiv.appendChild(loadingScreenLogoImg);

        const loadingScreenProgress = document.createElement('progress');
        loadingScreenProgress.id = `loadingScreenProgress_${playerId}`;
        loadingScreenProgress.value = 0;
        loadingScreenProgress.max = 100;
        loadingScreenProgress.style.position = 'absolute';
        loadingScreenProgress.style.left = '50%';
        loadingScreenProgress.style.top = '50%';
        loadingScreenProgress.style.width = '50%';
        loadingScreenProgress.style.height = '3px';
        loadingScreenProgress.style.transform = 'translate(-50%, -55%)';
        loadingScreenProgress.style.background = '#131313';
        loadingScreenProgress.style.color = '#41ADF5';
        loadingScreenProgress.style.border = 'none';
        loadingScreenDiv.appendChild(loadingScreenProgress);

        const loadingScreenProgressStyle = document.createElement('style');
        loadingScreenProgressStyle.textContent = `
            #loadingScreenProgress_${playerId}::-webkit-progress-bar {
                background-color: #131313;
            }
            #loadingScreenProgress_${playerId}::-webkit-progress-value {
                background-color: #41ADF5;
            }
            #loadingScreenProgress_${playerId}::-moz-progress-bar {
                background-color: #131313;
            }
        `;
        loadingScreenDiv.appendChild(loadingScreenProgressStyle);

        const renderCanvas = document.createElement('canvas');
        renderCanvas.id = `renderCanvas_${playerId}`;
        renderCanvas.style.position = 'absolute';
        renderCanvas.style.left = '0px';
        renderCanvas.style.top = `${contentTop}px`;
        renderCanvas.style.width = '100%';
        renderCanvas.style.height = `calc(100% - ${contentTop}px)`;
        renderCanvas.style.background = '#202020';
        renderCanvas.style.display = 'none';
        renderCanvas.style.outlineStyle = 'none';
        this.appendChild(renderCanvas);

        // createfileselector 속성이 'true'면 상단바 보이기
        if (isCreateFileSelector) {
            const topPanelDiv = document.createElement('div');
            topPanelDiv.id = `topPanelDiv_${playerId}`;
            topPanelDiv.style.position = 'absolute';
            topPanelDiv.style.left = '0px';
            topPanelDiv.style.top = '0px';
            topPanelDiv.style.width = '100%';
            topPanelDiv.style.height = `${fileSelectorHeight}px`;
            topPanelDiv.style.padding = '0px';
            topPanelDiv.style.border = 'none';
            topPanelDiv.style.background = '#474648';
            this.appendChild(topPanelDiv);

            const topPanelIconImg = document.createElement('img');
            topPanelIconImg.id = `topPanelIconImg_${playerId}`;
            topPanelIconImg.src = `${DTDPlayer.IMAGE_DIRECTORY}/dtd_logo.png`;
            topPanelIconImg.style.position = 'absolute';
            topPanelIconImg.style.left = '10px';
            topPanelIconImg.style.top = '0px';
            topPanelIconImg.style.width = '50px';
            topPanelIconImg.style.height = '50px';
            topPanelDiv.appendChild(topPanelIconImg);

            const topPanelFileSelector = document.createElement('input');
            topPanelFileSelector.id = `topPanelFileSelector_${playerId}`;
            topPanelFileSelector.type = 'file';
            // KEPCO E&C Custom START
            topPanelFileSelector.accept = '.dtdx, .bobj, .json';
            // KEPCO E&C Custom END
            topPanelFileSelector.multiple = true;
            topPanelFileSelector.style.display = 'none';
            topPanelFileSelector.onchange = (event) => {
                const files = event.target.files;
                if (files && files.length > 0) {
                    if (this.dtdPlayer) {
                        this.dtdPlayer.OpenURL(files, false);
                    }
                }
            };
            topPanelDiv.appendChild(topPanelFileSelector);

            const topPanelFileSelectorLabel = document.createElement('label');
            topPanelFileSelectorLabel.id = `topPanelFileSelectorLabel_${playerId}`;
            topPanelFileSelectorLabel.htmlFor = `topPanelFileSelector_${playerId}`;
            topPanelFileSelectorLabel.style.position = 'absolute';
            topPanelFileSelectorLabel.style.left = '60px';
            topPanelFileSelectorLabel.style.top = '13px';
            topPanelFileSelectorLabel.style.width = '80px';
            topPanelFileSelectorLabel.style.color = 'white';
            topPanelFileSelectorLabel.style.fontSize = '0.9em';
            topPanelFileSelectorLabel.style.fontFamily = 'NotoSansKR';
            topPanelFileSelectorLabel.style.textAlign = 'center';
            topPanelFileSelectorLabel.textContent = '파일열기';
            topPanelDiv.appendChild(topPanelFileSelectorLabel);

            const topPanelSaveFileButton = document.createElement('input');
            topPanelSaveFileButton.id = `topPanelSaveFileButton_${playerId}`;
            topPanelSaveFileButton.type = 'button';
            topPanelSaveFileButton.style.display = 'none';
            topPanelSaveFileButton.onclick = async () => {
                try {
                    const fileHandler = await window.showSaveFilePicker({
                        types: [{
                            description: 'DTDesigner Data Files',
                            accept: { 'application/x-custom': ['.dtdx'] },
                            excludeAcceptAllOption: true
                        }]
                    });

                    const saveDTDXBlob = this.dtdPlayer.SaveDTDX(fileHandler.name);
                    if (saveDTDXBlob) {
                        let stream = await fileHandler.createWritable();
                        await stream.write(saveDTDXBlob);
                        await stream.close();
                    }
                }
                catch (error) {
                    if (error.name === 'AbortError') {
                    }
                    else {
                        console.error(error);
                    }
                }
            };
            topPanelDiv.appendChild(topPanelSaveFileButton);

            const topPanelSaveFileLabel = document.createElement('label');
            topPanelSaveFileLabel.id = `topPanelSaveFileLabel_${playerId}`;
            topPanelSaveFileLabel.htmlFor = `topPanelSaveFileButton_${playerId}`;
            topPanelSaveFileLabel.style.position = 'absolute';
            topPanelSaveFileLabel.style.left = '125px';
            topPanelSaveFileLabel.style.top = '13px';
            topPanelSaveFileLabel.style.width = '80px';
            topPanelSaveFileLabel.style.color = 'white';
            topPanelSaveFileLabel.style.fontSize = '0.9em';
            topPanelSaveFileLabel.style.textAlign = 'center';
            topPanelSaveFileLabel.style.fontFamily = 'NotoSansKR';
            topPanelSaveFileLabel.textContent = '파일저장';
            topPanelDiv.appendChild(topPanelSaveFileLabel);

            const topPanelCloseAllButton = document.createElement('button');
            topPanelCloseAllButton.id = `topPanelCloseAllButton_${playerId}`;
            topPanelCloseAllButton.style.display = 'none';
            topPanelCloseAllButton.onclick = () => {
                if (topPanelFileSelector) {
                    topPanelFileSelector.value = '';
                }

                if (this.dtdPlayer) {
                    this.dtdPlayer.CloseAll();
                }
            };
            topPanelDiv.appendChild(topPanelCloseAllButton);

            const topPanelCloseAllLabel = document.createElement('label');
            topPanelCloseAllLabel.id = `topPanelCloseAllLabel_${playerId}`;
            topPanelCloseAllLabel.htmlFor = `topPanelCloseAllButton_${playerId}`;
            topPanelCloseAllLabel.style.position = 'absolute';
            topPanelCloseAllLabel.style.left = '190px';
            topPanelCloseAllLabel.style.top = '13px';
            topPanelCloseAllLabel.style.width = '80px';
            topPanelCloseAllLabel.style.color = 'white';
            topPanelCloseAllLabel.style.fontSize = '0.9em';
            topPanelCloseAllLabel.style.textAlign = 'center';
            topPanelCloseAllLabel.style.fontFamily = 'NotoSansKR';
            topPanelCloseAllLabel.textContent = '모두닫기';
            topPanelDiv.appendChild(topPanelCloseAllLabel);
        }

        this.dtdPlayer = new DTDPlayer();
        this.dtdPlayer.playerElement = this;
        this.dtdPlayer.renderCanvas = renderCanvas;
        this.dtdPlayer.loadingScreenDiv = loadingScreenDiv;
        this.dtdPlayer.loadingScreenProgress = loadingScreenProgress;

        DTDPlayers.push(this.dtdPlayer);

        import('./dtdweb/dtdweb.js').then((DTDWebModule) => {
            const dtdWeb = new DTDWebModule.DTDWeb(this.dtdPlayer, isStandalone);
            dtdWeb.initializeDTDWebModules().then(() => {
                dtdWeb.initializeEngine({
                    useWebGPU: false,
                    useAntialiasing: true,
                    useAdaptToDeviceRatio: true,
                    usePreserveDrawingBuffer: true,
                    disableWebGL2Support: false,
                    useStencil: true,
                }).then(() => {
                    if (this.onload) {
                        this.onload();
                    }
                });
            });
        });
    }
}

customElements.define('dtd-player', DTDPlayerElement);