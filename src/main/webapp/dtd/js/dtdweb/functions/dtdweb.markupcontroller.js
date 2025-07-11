import { DTDWeb } from '../dtdweb.js';

class DTDWebMarkupController {
    constructor(dtdWeb) {
        this._DTDWeb = dtdWeb;
        this._engine = dtdWeb.engine;
        this._scene = dtdWeb.scene;
        this._renderCanvas = dtdWeb.renderCanvas;

        this._textAreaElement = undefined;

        this._markupMode = DTDWeb.Markup.MARKUP_MODE.DRAW_LINE;

        this._penColor = DTDWeb.Markup.DEFAULT_PEN_COLOR;
        this._penThickness = DTDWeb.Markup.DEFAULT_PEN_THICKNESS;
        this._fontColor = DTDWeb.Markup.DEFAULT_FONT_COLOR;
        this._fontSize = DTDWeb.Markup.DEFAULT_FONT_SIZE;
        this._clipartIndex = -1;

        this._drawLines = [];
        this._textRectangles = [];
        this._clipartRectangles = [];

        this._markupHistory = [];
        this._markupHistoryIndex = -1;

        this._markupCamera = undefined;
        this._utilityLayerRenderer = undefined;
        this._advancedDynamicTexture = undefined;
        this._markupRootRectangle = undefined;

        this._selectedMarkupRectangle = undefined;

        this._onPointerDownObservable = undefined;
        this._onPointerMoveObservable = undefined;
        this._onPointerUpObservable = undefined;

        this._savePopup = undefined;

        this._isInitialized = false;
    }

    get currentOptions() {
        return {
            penColor: this._penColor,
            perColorPresetIndex: DTDWeb.UI.COLORS.findIndex((color) => { return color === this._penColor }),
            penThickness: this._penThickness,
            fontColor: this._fontColor,
            fontColorPresetIndex: DTDWeb.UI.COLORS.findIndex((color) => { return color === this._fontColor }),
            fontSize: this._fontSize,
            clipartIndex: this._clipartIndex
        };
    }

    get markupMode() {
        return this._markupMode;
    }

    set markupMode(markupMode) {
        if (this._markupMode === markupMode) {
            return;
        }

        this._markupMode = markupMode;

        this.deselectAllMarkups();
    }

    get advancedDynamicTexture() {
        return this._advancedDynamicTexture;
    }

    createTextAreaElement() {
        this._textAreaElement = document.createElement('textarea');
        this._textAreaElement.id = 'markupTextArea';
        this._textAreaElement.style.position = 'absolute';
        this._textAreaElement.style.background = 'transparent';
        this._textAreaElement.style.border = 'none';
        this._textAreaElement.style.outline = 'none';
        this._textAreaElement.style.resize = 'none';
        this._textAreaElement.style.overflow = 'hidden';
        this._textAreaElement.style.fontFamily = 'NotoSansKR';
        this._textAreaElement.style.letterSpacing = '0px';
        this._textAreaElement.style.whiteSpace = 'nowrap';
        this._textAreaElement.style.display = 'none';
        this._textAreaElement.spellcheck = false;
        this._textAreaElement.placeholder = DTDWeb.Markup.MARKUP_TEXT_PLACEHOLDER;

        this._DTDWeb.playerElement.appendChild(this._textAreaElement);
    }

    disposeTextAreaElement() {
        if (this._textAreaElement) {
            this._DTDWeb.playerElement.removeChild(this._textAreaElement);
            this._textAreaElement = undefined;
        }
    }

    setTextElementStyleFromTextBlock(textBlock) {
        // Font
        const fontSize = this._DTDWeb.uiManager.divideDevicePixelRatio(textBlock.fontSizeInPixels);
        const fontColor = textBlock.color;

        this._textAreaElement.style.fontSize = `${fontSize}px`;
        this._textAreaElement.style.color = fontColor;

        // Position
        const leftInPixels = this._renderCanvas.offsetLeft + textBlock.getX();
        const topInPixels = this._renderCanvas.offsetTop + textBlock.getY();

        this._textAreaElement.style.left = `${leftInPixels + 7.5}px`;
        this._textAreaElement.style.top = `${topInPixels + 7.5}px`;

        // Size
        const widthInPixels = textBlock.getRealWidth() + 5;
        const heightInPixels = textBlock.getRealHeight() + 5;

        this._textAreaElement.style.width = `${widthInPixels}px`;
        this._textAreaElement.style.height = `${heightInPixels}px`;
        this._textAreaElement.style.maxWidth = `${widthInPixels}px`;
        this._textAreaElement.style.maxHeight = `${heightInPixels}px`;
    }

    setTextAreaElementVisible(isVisible, textBlock) {
        this._textAreaElement.style.display = isVisible ? 'block' : 'none';

        if (textBlock) {
            if (isVisible) {
                this._textAreaElement.value = textBlock.text;
            }
            else {
                textBlock.text = this._textAreaElement.value;
            }

            textBlock.isVisible = !isVisible;
        }
    }

    startMarkup(isFromModeChanger) {
        if (this._DTDWeb.functionMode !== DTDPlayer.FunctionMode.MARKUP && !isFromModeChanger) {
            this._DTDWeb.functionMode = DTDPlayer.FunctionMode.MARKUP;
        }

        if (!this._isInitialized) {
            this._DTDWeb.inputController.deselectAllMeshes();
            this._DTDWeb.cameraController.detachControl();
            this._DTDWeb.uiManager.showPointerBlocker(true);

            this._markupRootRectangle = new BABYLON.GUI.Rectangle('MarkupRectangle');
            this._markupRootRectangle.width = '100%';
            this._markupRootRectangle.height = '100%';
            this._markupRootRectangle.background = 'transparent';
            this._markupRootRectangle.thickness = 0;

            this._advancedDynamicTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('Markup', true);
            this._advancedDynamicTexture.layer.layerMask = DTDWeb.Camera.LAYER_MASK.MARKUP;
            this._advancedDynamicTexture.idealWidth = this._DTDWeb.uiManager.idealWidth;
            this._advancedDynamicTexture.renderScale = this._DTDWeb.uiManager.devicePixelRatio;
            this._advancedDynamicTexture.addControl(this._markupRootRectangle);

            this.startMarkupPointerObservable();

            if (this._textAreaElement === undefined) {
                this.createTextAreaElement();
            }

            this._isInitialized = true;
        }
    }

    stopMarkup(isChangeModeNone) {
        this.deselectAllMarkups();
        this.clearAllMarkups(true);

        this._DTDWeb.cameraController.attachControl();
        this._DTDWeb.uiManager.hidePointerBlocker();

        if (this._advancedDynamicTexture) {
            if (this._markupRootRectangle && this._advancedDynamicTexture.getControlByName(this._markupRootRectangle.name)) {
                this._advancedDynamicTexture.removeControl(this._markupRootRectangle);
            }

            this._advancedDynamicTexture.dispose();
            this._advancedDynamicTexture = undefined;
        }

        if (this._utilityLayerRenderer) {
            this._utilityLayerRenderer.dispose();
            this._utilityLayerRenderer = undefined;
        }

        if (this._markupRootRectangle) {
            this.stopMarkupPointerObservable();

            this._markupRootRectangle.dispose();
            this._markupRootRectangle = undefined;
        }

        this.disposeTextAreaElement();

        if (this._savePopup) {
            this._DTDWeb.popupManager.hideMainPopup();
        }

        this._isInitialized = false;

        if (isChangeModeNone) {
            this._DTDWeb.functionMode = DTDPlayer.FunctionMode.NONE;
        }
    }

    clearAllMarkups(isFromStopMarkup = false) {
        if (!isFromStopMarkup) {
            this.startMarkup();
        }

        if (this._markupRootRectangle) {
            this._markupRootRectangle.clearControls();
        }

        for (const drawLine of this._drawLines) {
            this.disposeMarkup(drawLine);
        }
        this._drawLines = [];

        for (const textRectangle of this._textRectangles) {
            this.disposeMarkup(textRectangle);
        }
        this._textRectangles = [];

        for (const clipartRectangle of this._clipartRectangles) {
            this.disposeMarkup(clipartRectangle);
        }
        this._clipartRectangles = [];

        this._markupHistory = [];
        this._markupHistoryIndex = -1;

        this.onAfterMarkupAction();
    }

    addLine() {
        const multiLine = new BABYLON.GUI.MultiLine(`MarkupDrawLine)${DTDWeb.Utility.GetUUID()}`);
        multiLine.markupType = DTDWeb.Markup.MARKUP_MODE.DRAW_LINE;
        multiLine.leftInPixels = 0;
        multiLine.topInPixels = 0;
        multiLine.color = this._penColor;
        multiLine.lineWidth = this._DTDWeb.uiManager.multiplyDevicePixelRatio((this._penThickness));
        multiLine.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        multiLine.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

        this._markupRootRectangle.addControl(multiLine);

        this._DTDWeb.onAddMarkupSuccess('Line');

        return multiLine;
    }

    addText(pointerX, pointerY) {
        const name = `MarkupText_${DTDWeb.Utility.GetUUID()}`;
        const textBlock = new BABYLON.GUI.TextBlock(`${name}_TextBlock`);
        textBlock.widthInPixels = 200;
        textBlock.heightInPixels = 100;
        textBlock.background = 'transparent';
        textBlock.focusedBackground = 'transparent';
        textBlock.paddingLeftInPixels = 5;
        textBlock.paddingTopInPixels = 5;
        textBlock.color = this._fontColor;
        textBlock.fontFamily = DTDWeb.GLOBAL_FONT_FAMILY;
        textBlock.fontSizeInPixels = this._fontSize;
        textBlock.thickness = 0;
        textBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        textBlock.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

        const textRectangle = this.createMarkupRectangle(name, textBlock);
        textRectangle.markupType = DTDWeb.Markup.MARKUP_MODE.TEXT;
        textRectangle.leftInPixels = pointerX;
        textRectangle.topInPixels = pointerY;
        textRectangle.onPointerDownObservable.add(() => {
            if (this.markupMode === DTDWeb.Markup.MARKUP_MODE.TEXT) {
                textRectangle.isPointerDown = true;

                this.selectMarkup(textRectangle);
            }
        });
        textRectangle.onPointerUpObservable.add(() => {
            textRectangle.isPointerDown = false;
        });
        textRectangle.onAfterResize = () => {
            this.setTextElementStyleFromTextBlock(textBlock);
        };

        this._markupRootRectangle.addControl(textRectangle);

        this.selectMarkup(textRectangle);

        this._textRectangles.push(textRectangle);

        this.addHistory(textRectangle);

        this._DTDWeb.onAddMarkupSuccess('Text');
    }

    addClipart(clipartIndex, pointerX, pointerY) {
        const CLIPART = DTDWeb.Markup.CLIPART_IMAGES[clipartIndex];
        const clipartUrl = `${CLIPART.RELATIVE_URL}`;
        const hasSize = CLIPART.imageWidth !== undefined && CLIPART.imageHeight !== undefined;
        const name = `MarkupClipart_${DTDWeb.Utility.GetUUID()}`;
        const clipartImage = new BABYLON.GUI.Image(`${name}_Image`, clipartUrl);
        clipartImage.widthInPixels = hasSize ? CLIPART.imageWidth : 200;
        clipartImage.heightInPixels = hasSize ? CLIPART.imageHeight : 200;
        clipartImage.background = 'transparent';
        clipartImage.domImage.style.padding = '0px';
        clipartImage.domImage.style.margin = '0px';

        const clipartRectangle = this.createMarkupRectangle(name, clipartImage);
        clipartRectangle.markupType = DTDWeb.Markup.MARKUP_MODE.CLIPART;
        clipartRectangle.leftInPixels = pointerX - (clipartRectangle.widthInPixels / 2);
        clipartRectangle.topInPixels = pointerY - (clipartRectangle.heightInPixels / 2);
        clipartRectangle.onPointerDownObservable.add(() => {
            if (this.markupMode === DTDWeb.Markup.MARKUP_MODE.CLIPART) {
                clipartRectangle.isPointerDown = true;

                this.selectMarkup(clipartRectangle);
            }
        });
        clipartRectangle.onPointerUpObservable.add(() => {
            clipartRectangle.isPointerDown = false;
        });

        this._markupRootRectangle.addControl(clipartRectangle);

        this.selectMarkup(clipartRectangle);

        this._clipartRectangles.push(clipartRectangle);

        this.addHistory(clipartRectangle);

        this._DTDWeb.onAddMarkupSuccess(`Clipart_${this._clipartIndex}`);

        this._clipartIndex = -1;
    }

    createMarkupRectangle(name, guiControl) {
        const borderSize = 8;
        const resizeSphereSize = 16;

        const minimumWidth = guiControl.widthInPixels * 0.1;
        const minimumHeight = guiControl.widthInPixels * 0.1;

        guiControl.leftInPixels = 0;
        guiControl.topInPixels = 0;
        guiControl.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        guiControl.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        guiControl.getX = () => {
            return this._DTDWeb.uiManager.divideDevicePixelRatio(resizableRectangle.leftInPixels) + resizeSphereSize - borderSize;
        };

        guiControl.getY = () => {
            return this._DTDWeb.uiManager.divideDevicePixelRatio(resizableRectangle.topInPixels) + resizeSphereSize - borderSize;
        };

        guiControl.getRealWidth = () => {
            return this._DTDWeb.uiManager.divideDevicePixelRatio(guiControl.widthInPixels) - resizeSphereSize;
        };

        guiControl.getRealHeight = () => {
            return this._DTDWeb.uiManager.divideDevicePixelRatio(guiControl.heightInPixels) - resizeSphereSize;
        };

        const moveableRectangle = new BABYLON.GUI.Rectangle(`${name}_MoveableRectangle`);
        moveableRectangle.widthInPixels = guiControl.widthInPixels + (borderSize * 2);
        moveableRectangle.heightInPixels = guiControl.heightInPixels + (borderSize * 2);
        moveableRectangle.background = 'transparent';
        moveableRectangle.color = '#3886BB';
        moveableRectangle.thickness = this._DTDWeb.uiManager.multiplyDevicePixelRatio(borderSize);
        moveableRectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        moveableRectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

        const resizableRectangle = new BABYLON.GUI.Rectangle(`${name}_ResizableRectangle`);
        resizableRectangle.widthInPixels = moveableRectangle.widthInPixels + resizeSphereSize / 2;
        resizableRectangle.heightInPixels = moveableRectangle.heightInPixels + resizeSphereSize / 2;
        resizableRectangle.thickness = 0;
        resizableRectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        resizableRectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        resizableRectangle.contentGUIControl = guiControl;
        resizableRectangle.moveableRectangle = moveableRectangle;
        resizableRectangle.addControl(moveableRectangle);
        resizableRectangle.addControl(guiControl);

        resizableRectangle.resizeSpheres = [];
        for (let index = 0; index < 8; index++) {
            const resizeSphere = new BABYLON.GUI.Rectangle(`${name}_ResizeSphere_${index + 1}`);
            resizeSphere.left = '0%';
            resizeSphere.top = '0%';
            switch (index) {
                case 0:
                    resizeSphere.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                    resizeSphere.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                    break;
                case 1:
                    resizeSphere.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
                    resizeSphere.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                    break;
                case 2:
                    resizeSphere.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
                    resizeSphere.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                    break;
                case 3:
                    resizeSphere.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                    resizeSphere.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
                    break;
                case 4:
                    resizeSphere.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
                    resizeSphere.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
                    break;
                case 5:
                    resizeSphere.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                    resizeSphere.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
                    break;
                case 6:
                    resizeSphere.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
                    resizeSphere.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
                    break;
                case 7:
                    resizeSphere.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
                    resizeSphere.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
                    break;
            }

            resizeSphere.background = 'white';
            resizeSphere.color = 'black';
            resizeSphere.widthInPixels = resizeSphereSize;
            resizeSphere.heightInPixels = resizeSphereSize;
            resizeSphere.thickness = 1;
            resizeSphere.cornerRadius = this._DTDWeb.uiManager.multiplyDevicePixelRatio(100);
            resizeSphere.positionIndex = index;
            resizableRectangle.resizeSpheres.push(resizeSphere);
            resizableRectangle.addControl(resizeSphere);
        }

        for (const resizeSphere of resizableRectangle.resizeSpheres) {
            let lastPointerX;
            let lastPointerY;

            let pointerMoveBeforeRenderObservable;
            resizeSphere.onPointerDownObservable.add(() => {
                resizableRectangle.isResizing = true;

                lastPointerX = this._scene.pointerX;
                lastPointerY = this._scene.pointerY;

                pointerMoveBeforeRenderObservable = this._scene.onBeforeRenderObservable.add(() => {
                    const deltaX = Math.round(this._DTDWeb.uiManager.multiplyDevicePixelRatio(this._scene.pointerX - lastPointerX));
                    const deltaY = Math.round(this._DTDWeb.uiManager.multiplyDevicePixelRatio(this._scene.pointerY - lastPointerY));
                    lastPointerX = this._scene.pointerX;
                    lastPointerY = this._scene.pointerY;

                    switch (resizeSphere.horizontalAlignment) {
                        case BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT:
                            if (deltaX < 0 || (deltaX > 0 && guiControl.widthInPixels - deltaX > minimumWidth)) {
                                resizableRectangle.leftInPixels = this._DTDWeb.uiManager.divideDevicePixelRatio(resizableRectangle.leftInPixels + deltaX);
                                resizableRectangle.resize(this._DTDWeb.uiManager.divideDevicePixelRatio(guiControl.widthInPixels - deltaX), undefined);
                            }
                            break;
                        case BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT:
                            if (deltaX > 0 || (deltaX < 0 && guiControl.widthInPixels + deltaX > minimumWidth)) {
                                resizableRectangle.resize(this._DTDWeb.uiManager.divideDevicePixelRatio(guiControl.widthInPixels + deltaX), undefined);
                            }
                            break;
                    }

                    switch (resizeSphere.verticalAlignment) {
                        case BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP:
                            if (deltaY < 0 || (deltaY > 0 && guiControl.heightInPixels - deltaY > minimumHeight)) {
                                resizableRectangle.topInPixels = this._DTDWeb.uiManager.divideDevicePixelRatio(resizableRectangle.topInPixels + deltaY);
                                resizableRectangle.resize(undefined, this._DTDWeb.uiManager.divideDevicePixelRatio(guiControl.heightInPixels - deltaY));
                            }
                            break;
                        case BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM:
                            if (deltaY > 0 || (deltaY < 0 && guiControl.heightInPixels + deltaY > minimumHeight)) {
                                resizableRectangle.resize(undefined, this._DTDWeb.uiManager.divideDevicePixelRatio(guiControl.heightInPixels + deltaY));
                            }
                            break;
                    }
                });
            });

            resizeSphere.onPointerUpObservable.add(() => {
                resizableRectangle.isResizing = false;

                this._scene.onBeforeRenderObservable.remove(pointerMoveBeforeRenderObservable);
            });
        }

        resizableRectangle.select = () => {
            for (const resizeSphere of resizableRectangle.resizeSpheres) {
                resizeSphere.isVisible = true;
            }
        };

        resizableRectangle.deselect = () => {
            for (const resizeSphere of resizableRectangle.resizeSpheres) {
                resizeSphere.isVisible = false;
            }
        };

        resizableRectangle.resize = (controlWidth, controlHeight) => {
            if (controlWidth !== undefined) {
                guiControl.widthInPixels = controlWidth;
                const moveableRectangleWidth = this._DTDWeb.uiManager.divideDevicePixelRatio(guiControl.widthInPixels) + (borderSize * 2);
                moveableRectangle.widthInPixels = moveableRectangleWidth;
                resizableRectangle.widthInPixels = moveableRectangleWidth + resizeSphereSize / 2;
            }

            if (controlHeight !== undefined) {
                guiControl.heightInPixels = controlHeight;
                const moveableRectangleHeight = this._DTDWeb.uiManager.divideDevicePixelRatio(guiControl.heightInPixels) + (borderSize * 2);
                moveableRectangle.heightInPixels = moveableRectangleHeight;
                resizableRectangle.heightInPixels = moveableRectangleHeight + resizeSphereSize / 2;
            }

            if (resizableRectangle.onAfterResize) {
                resizableRectangle.onAfterResize();
            }
        }

        return resizableRectangle;
    }

    disposeMarkup(markupControl, fromDeselectAllMarkups) {
        if (markupControl === undefined) {
            return;
        }

        // 무한 루프 방지
        if (!fromDeselectAllMarkups && markupControl === this._selectedMarkupRectangle) {
            this.deselectAllMarkups();
        }

        const index = this._markupHistory.findIndex((historyControl) => {
            return historyControl.name === markupControl.name;
        });
        if (index > -1) {
            this._markupHistory.splice(index, 1);
            if (this._markupHistoryIndex <= index) {
                this._markupHistoryIndex -= 1;
            }
        }

        if (markupControl.markupType === DTDWeb.Markup.MARKUP_MODE.DRAW_LINE) {
            const index = this._drawLines.findIndex((drawLine) => {
                return drawLine.name === markupControl.name;
            });
            if (index > -1) {
                this._drawLines.splice(index, 1);
            }
        }
        else if (markupControl.markupType === DTDWeb.Markup.MARKUP_MODE.TEXT ||
            markupControl.markupType === DTDWeb.Markup.MARKUP_MODE.CLIPART) {
            if (markupControl.markupType === DTDWeb.Markup.MARKUP_MODE.TEXT) {
                const index = this._textRectangles.findIndex((textRectangle) => {
                    return textRectangle.name === markupControl.name;
                });
                if (index > -1) {
                    this._textRectangles.splice(index, 1);
                }
            }
            else {
                const index = this._clipartRectangles.findIndex((clipartRectangle) => {
                    return clipartRectangle.name === markupControl.name;
                });
                if (index > -1) {
                    this._clipartRectangles.splice(index, 1);
                }
            }

            markupControl.clearControls();

            if (markupControl.resizeSpheres) {
                for (const resizeSphere of markupControl.resizeSpheres) {
                    resizeSphere.dispose();
                }

                markupControl.resizeSpheres = undefined;
            }

            if (markupControl.moveableRectangle) {
                markupControl.moveableRectangle.dispose();
                markupControl.moveableRectangle = undefined;
            }

            if (markupControl.contentGUIControl) {
                markupControl.contentGUIControl.dispose();
                markupControl.contentGUIControl = undefined;
            }
        }

        if (this._markupRootRectangle && this._markupRootRectangle.containsControl(markupControl)) {
            this._markupRootRectangle.removeControl(markupControl);
        }

        markupControl.dispose();
    }

    removeSelectedMarkup() {
        if (this._selectedMarkupRectangle === undefined) {
            return;
        }

        const selectedMarkupControl = this._selectedMarkupRectangle;
        const selectedHistoryIndex = this._markupHistory.findIndex((historyControl) => {
            return historyControl.name === selectedMarkupControl.name;
        });
        if (selectedHistoryIndex <= -1) {
            return;
        }

        this.deselectAllMarkups();

        selectedMarkupControl.isVisible = false;
        this._markupHistory.splice(selectedHistoryIndex, 1);

        let invisibleMinimumIndex = this._markupHistory.length;
        for (let historyIndex = 0; historyIndex < this._markupHistory.length; historyIndex++) {
            const markup = this._markupHistory[historyIndex];

            if (markup && !markup.isVisible) {
                invisibleMinimumIndex = historyIndex;
                break;
            }
        }

        if (invisibleMinimumIndex === this._markupHistory.length) {
            this._markupHistory.push(selectedMarkupControl);
        }
        else {
            this._markupHistory.splice(invisibleMinimumIndex, 0, selectedMarkupControl);
        }

        this._markupHistoryIndex = invisibleMinimumIndex;

        this.onAfterMarkupAction();
    }

    addHistory(markupControl) {
        const currentMarkupHistoryIndex = this._markupHistoryIndex;
        this.disposeLostHistory(currentMarkupHistoryIndex + 1);

        this._markupHistory.push(markupControl);
        this._markupHistoryIndex = currentMarkupHistoryIndex + 1;

        this.onAfterMarkupAction();
    }

    undoHistory() {
        this.startMarkup();

        if (this._markupHistoryIndex >= 0) {
            this.deselectAllMarkups();

            const markup = this._markupHistory[this._markupHistoryIndex];
            if (markup) {
                if (markup.isVisible) {
                    markup.isVisible = false;
                    this._markupHistoryIndex -= 1;
                }
                else {
                    markup.isVisible = true;
                }
            }
        }

        this.onAfterMarkupAction();
    }

    redoHistory() {
        this.startMarkup();

        if (this._markupHistoryIndex + 1 < this._markupHistory.length) {
            this.deselectAllMarkups();

            this._markupHistoryIndex += 1;

            const markup = this._markupHistory[this._markupHistoryIndex];
            if (markup) {
                markup.isVisible = true;
            }
        }

        this.onAfterMarkupAction();
    }

    disposeLostHistory(disposeIndex) {
        for (let markupIndex = this._markupHistory.length - 1; markupIndex >= disposeIndex; markupIndex--) {
            this.disposeMarkup(this._markupHistory[markupIndex]);
        }
    }

    // DTDPlayer로 hasPrevious, hasNext 존재 알림
    onAfterMarkupAction() {
        this._DTDWeb.onAfterMarkupAction(this._markupHistoryIndex >= 0, this._markupHistoryIndex + 1 < this._markupHistory.length);
    }

    selectMarkup(markupRectangle) {
        if (this._selectedMarkupRectangle !== markupRectangle) {
            this.deselectAllMarkups();
        }

        this._selectedMarkupRectangle = markupRectangle;

        this._selectedMarkupRectangle.select();
        this._selectedMarkupRectangle.moveableRectangle.isVisible = true;

        if (this._selectedMarkupRectangle.markupType === DTDWeb.Markup.MARKUP_MODE.TEXT) {
            const textBlock = this._selectedMarkupRectangle.contentGUIControl;

            this.setTextAreaElementVisible(true, textBlock);
            this.setTextElementStyleFromTextBlock(textBlock);
        }
    }

    deselectAllMarkups() {
        if (this._selectedMarkupRectangle) {
            if (this._selectedMarkupRectangle.markupType === DTDWeb.Markup.MARKUP_MODE.TEXT) {
                const textBlock = this._selectedMarkupRectangle.contentGUIControl;

                this.setTextAreaElementVisible(false, textBlock);

                if (textBlock.text === '') {
                    this.disposeMarkup(this._selectedMarkupRectangle, true);
                }
            }

            this._selectedMarkupRectangle = undefined;
        }

        for (const textRectangle of this._textRectangles) {
            textRectangle.deselect();
            textRectangle.moveableRectangle.isVisible = false;
        }

        for (const clipartRectangle of this._clipartRectangles) {
            clipartRectangle.deselect();
            clipartRectangle.moveableRectangle.isVisible = false;
        }
    }

    setPenColor(hexColor) {
        this.startMarkup();

        this.markupMode = DTDWeb.Markup.MARKUP_MODE.DRAW_LINE;

        this._penColor = hexColor;
    }

    setPenThickness(thickness) {
        this.startMarkup();

        this.markupMode = DTDWeb.Markup.MARKUP_MODE.DRAW_LINE;

        this._penThickness = Number(thickness);
    }

    setFontColor(hexColor) {
        this.startMarkup();

        this.markupMode = DTDWeb.Markup.MARKUP_MODE.TEXT;

        this._fontColor = hexColor;

        if (this._selectedMarkupRectangle &&
            this._selectedMarkupRectangle.markupType === DTDWeb.Markup.MARKUP_MODE.TEXT) {
            this._selectedMarkupRectangle.contentGUIControl.color = this._fontColor;
            this.setTextElementStyleFromTextBlock(this._selectedMarkupRectangle.contentGUIControl);
        }
    }

    setFontSize(fontSize) {
        this.startMarkup();

        this.markupMode = DTDWeb.Markup.MARKUP_MODE.TEXT;

        this._fontSize = fontSize;

        if (this._selectedMarkupRectangle &&
            this._selectedMarkupRectangle.markupType === DTDWeb.Markup.MARKUP_MODE.TEXT) {
            this._selectedMarkupRectangle.contentGUIControl.fontSizeInPixels = this._fontSize;
            this.setTextElementStyleFromTextBlock(this._selectedMarkupRectangle.contentGUIControl);
        }
    }

    setClipartIndex(clipartIndex) {
        this.startMarkup();

        this.markupMode = DTDWeb.Markup.MARKUP_MODE.CLIPART;

        if (this._clipartIndex === clipartIndex || clipartIndex >= DTDWeb.Markup.CLIPART_IMAGES.length) {
            return;
        }

        this._clipartIndex = clipartIndex;
    }

    startMarkupPointerObservable() {
        this.stopMarkupPointerObservable();

        let isPointerDown = false;

        let multiLine = undefined;
        let lines = [];

        let lastPointerX = 0;
        let lastPointerY = 0;

        this._onPointerDownObservable = this._markupRootRectangle.onPointerDownObservable.add(() => {
            if (this._markupRootRectangle === undefined || this._DTDWeb.popupManager.isDoNotControl) {
                return;
            }

            isPointerDown = true;

            switch (this._markupMode) {
                case DTDWeb.Markup.MARKUP_MODE.DRAW_LINE:
                    const line = { x: this._scene.pointerX, y: this._scene.pointerY };
                    lines.push(line);

                    multiLine = this.addLine();
                    multiLine.add(line);
                    return;
                case DTDWeb.Markup.MARKUP_MODE.TEXT:
                case DTDWeb.Markup.MARKUP_MODE.CLIPART:
                    lastPointerX = this._scene.pointerX;
                    lastPointerY = this._scene.pointerY;

                    let isSelectMarkup = false;
                    if (this._markupMode === DTDWeb.Markup.MARKUP_MODE.TEXT) {
                        if (this._selectedMarkupRectangle) {
                            for (const textRectangle of this._textRectangles) {
                                if (textRectangle.isPointerDown) {
                                    isSelectMarkup = true;
                                    break;
                                }
                            }

                            if (!isSelectMarkup) {
                                this.deselectAllMarkups();
                            }
                        }
                        else {
                            this.addText(this._scene.pointerX, this._scene.pointerY);
                        }
                    }
                    else {
                        for (const clipartRectangle of this._clipartRectangles) {
                            if (clipartRectangle.isPointerDown) {
                                isSelectMarkup = true;
                                break;
                            }
                        }

                        if (!isSelectMarkup) {
                            this.deselectAllMarkups();
                            if (this._clipartIndex >= 0) {
                                this.addClipart(this._clipartIndex, this._scene.pointerX, this._scene.pointerY);
                            }
                        }
                    }
                    return;
            }
        });

        this._onPointerMoveObservable = this._markupRootRectangle.onPointerMoveObservable.add(() => {
            if (!isPointerDown || this._markupRootRectangle === undefined || this._DTDWeb.popupManager.isDoNotControl) {
                return;
            }

            switch (this._markupMode) {
                case DTDWeb.Markup.MARKUP_MODE.DRAW_LINE:
                    if (multiLine) {
                        const line = { x: this._scene.pointerX, y: this._scene.pointerY };
                        lines.push(line);

                        multiLine.add(line);
                    }
                    return;
                case DTDWeb.Markup.MARKUP_MODE.TEXT:
                case DTDWeb.Markup.MARKUP_MODE.CLIPART:
                    if (this._selectedMarkupRectangle && !this._selectedMarkupRectangle.isResizing) {
                        const deltaX = this._DTDWeb.uiManager.multiplyDevicePixelRatio((this._scene.pointerX - lastPointerX));
                        const deltaY = this._DTDWeb.uiManager.multiplyDevicePixelRatio((this._scene.pointerY - lastPointerY));
                        lastPointerX = this._scene.pointerX;
                        lastPointerY = this._scene.pointerY;

                        this._selectedMarkupRectangle.leftInPixels = this._DTDWeb.uiManager.divideDevicePixelRatio(this._selectedMarkupRectangle.leftInPixels + deltaX);
                        this._selectedMarkupRectangle.topInPixels = this._DTDWeb.uiManager.divideDevicePixelRatio(this._selectedMarkupRectangle.topInPixels + deltaY);

                        if (this._selectedMarkupRectangle.markupType === DTDWeb.Markup.MARKUP_MODE.TEXT) {
                            this.setTextElementStyleFromTextBlock(this._selectedMarkupRectangle.contentGUIControl);
                        }
                    }
                    return;
            }
        });

        this._onPointerUpObservable = this._markupRootRectangle.onPointerUpObservable.add(() => {
            isPointerDown = false;

            if (this._markupRootRectangle === undefined || this._DTDWeb.popupManager.isDoNotControl) {
                return;
            }

            switch (this._markupMode) {
                case DTDWeb.Markup.MARKUP_MODE.DRAW_LINE:
                    if (lines.length > 1) {
                        this._drawLines.push(multiLine);
                        this.addHistory(multiLine);
                    }
                    else {
                        this.disposeMarkup(multiLine);
                    }

                    multiLine = undefined;
                    lines = [];
                    return;
                case DTDWeb.Markup.MARKUP_MODE.TEXT:
                case DTDWeb.Markup.MARKUP_MODE.CLIPART:
                    return;
            }
        });
    }

    stopMarkupPointerObservable() {
        if (this._markupRootRectangle === undefined) {
            return;
        }

        if (this._onPointerDownObservable) {
            this._markupRootRectangle.onPointerDownObservable.remove(this._onPointerDownObservable);
            this._onPointerDownObservable = undefined;
        }

        if (this._onPointerMoveObservable) {
            this._markupRootRectangle.onPointerMoveObservable.remove(this._onPointerMoveObservable);
            this._onPointerMoveObservable = undefined;
        }

        if (this._onPointerUpObservable) {
            this._markupRootRectangle.onPointerUpObservable.remove(this._onPointerUpObservable);
            this._onPointerUpObservable = undefined;
        }
    }

    saveMarkup(onSuccessCallback) {
        this.startMarkup();

        this.deselectAllMarkups();

        const saveMarkup = async (title) => {
            const screenshot = await this._DTDWeb.cameraController.createScreenshotUsingLayerMask(
                DTDWeb.Camera.LAYER_MASK.MESH | DTDWeb.Camera.LAYER_MASK.MARKUP
            );

            const mainCamera = this._DTDWeb.cameraController.mainCamera;
            const projectionMatrix = mainCamera.getProjectionMatrix();
            const center = this._DTDWeb.modelManager.getRootBoundingCenter();

            const cameraTransformJSON = this._DTDWeb.cameraController.getCameraTransformJSON();
            cameraTransformJSON.matrix = {
                farClipPlane: mainCamera.maxZ, fieldOfView: Math.round(BABYLON.Tools.ToDegrees(mainCamera.fov)), nearClipPlane: mainCamera.minZ,
                projectionMatrix: {
                    e00: projectionMatrix.m[0], e01: projectionMatrix.m[1], e02: projectionMatrix.m[2], e03: projectionMatrix.m[3],
                    e10: projectionMatrix.m[4], e11: projectionMatrix.m[5], e12: projectionMatrix.m[6], e13: projectionMatrix.m[7],
                    e20: projectionMatrix.m[8], e21: projectionMatrix.m[9], e22: projectionMatrix.m[10], e23: projectionMatrix.m[11],
                    e30: projectionMatrix.m[12], e31: projectionMatrix.m[13], e32: projectionMatrix.m[14], e33: projectionMatrix.m[15]
                }
            };
            cameraTransformJSON.roommbox = '';
            cameraTransformJSON.spatialLoaderLossyScale = { x: 1, y: 1, z: 1 };
            cameraTransformJSON.spatialLoaderPosition = { x: center.x, y: center.y, z: center.z };
            cameraTransformJSON.title = title;
            cameraTransformJSON.type = 'PC';

            const userComment = JSON.stringify(cameraTransformJSON);

            const base64Data = screenshot.split(',')[1];
            const binaryString = atob(base64Data);
            const exifObj = piexif.load(binaryString);

            exifObj['Exif'][piexif.ExifIFD.UserComment] = DTDWeb.Utility.GetEncodeUnicodeBase64(userComment);

            const exifBytes = piexif.dump(exifObj);
            const newScreenshot = piexif.insert(exifBytes, screenshot);

            if (onSuccessCallback) {
                onSuccessCallback(title, newScreenshot);
            }

            return newScreenshot;
        };

        this._savePopup = this._DTDWeb.popupManager.showMainPopup(DTDWeb.Popup.POPUP_TYPE.INPUT_TEXT, DTDWeb.Popup.POPUP_TITLE_TEXT.NOTICE,
            DTDWeb.Popup.POPUP_MESSAGE_TEXT.INPUT_MARKUP_TITLE, saveMarkup);
    }

    createMarkupViewPopup(base64String) {
        const canvasSize = this._DTDWeb.uiManager.getCanvasPixelRatioSize();
        const getDOMImageSize = (domImage) => {
            const imageWidth = domImage.width;
            const imageHeight = domImage.height;

            let scaleFactor;
            if (canvasSize.width > canvasSize.height) {
                scaleFactor = imageHeight / targetHeight;
            }
            else {
                scaleFactor = imageWidth / targetWidth;
            }

            return {
                width: imageWidth / scaleFactor,
                height: imageHeight / scaleFactor
            };
        };

        const popupName = `Markup_${DTDWeb.Utility.GetUUID()}`;
        const markupImage = new BABYLON.GUI.Image(`${popupName}_Image`, base64String);
        const targetWidth = canvasSize.width * 0.7;
        const targetHeight = canvasSize.height * 0.7;
        if (markupImage.domImage.width > 0 && markupImage.domImage.height > 0) {
            const imageSize = getDOMImageSize(markupImage.domImage);

            markupImage.widthInPixels = imageSize.width;
            markupImage.heightInPixels = imageSize.width;
        }
        else {
            markupImage.widthInPixels = targetWidth;
            markupImage.heightInPixels = targetHeight;
        }
        markupImage.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
        markupImage.onImageLoadedObservable.add(() => {
            const imageSize = getDOMImageSize(markupImage.domImage);

            if (markupPopup) {
                markupPopup.resize(imageSize.width, imageSize.height);
            }

            const widthInPixels = this._DTDWeb.uiManager.divideDevicePixelRatio(markupPopup.widthInPixels);
            const heightInPixels = this._DTDWeb.uiManager.divideDevicePixelRatio(markupPopup.heightInPixels);
            const centerPoint = this._DTDWeb.uiManager.getCenterPoint(widthInPixels, heightInPixels);

            markupPopup.leftInPixels = centerPoint.leftInPixels;
            markupPopup.topInPixels = centerPoint.topInPixels;
        });

        const markupPopup = this._DTDWeb.popupManager.createResizablePopup(popupName, '마크업뷰', markupImage);

        try {
            const hasJoinedDTDonChatRoom = this._DTDWeb.hasJoinedDTDonChatRoom;
            if (hasJoinedDTDonChatRoom) {
                const shareMarkupImage = new BABYLON.GUI.Image(`${popupName}ShareMarkup_Image`,
                    `${DTDPlayer.IMAGE_DIRECTORY}/share.png`);
                shareMarkupImage.leftInPixels = 3;
                shareMarkupImage.topInPixels = 0;
                shareMarkupImage.widthInPixels = 20;
                shareMarkupImage.heightInPixels = 20;
                shareMarkupImage.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                shareMarkupImage.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
                shareMarkupImage.alpha = 1;

                const shareMarkupTextBlock = new BABYLON.GUI.TextBlock(`${popupName}ShareMarkup_TextBlock`, '채팅으로 보내기');
                shareMarkupTextBlock.leftInPixels = 25;
                shareMarkupTextBlock.topInPixels = 0;
                shareMarkupTextBlock.widthInPixels = 80;
                shareMarkupTextBlock.height = '100%';
                shareMarkupTextBlock.color = 'white';
                shareMarkupTextBlock.fontFamily = DTDWeb.GLOBAL_FONT_FAMILY;
                shareMarkupTextBlock.fontSize = 12;
                shareMarkupTextBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
                shareMarkupTextBlock.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
                shareMarkupTextBlock.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                shareMarkupTextBlock.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

                const shareMarkupRectangle = new BABYLON.GUI.Rectangle(`${popupName}ShareMarkup_Rectangle`);
                shareMarkupRectangle.leftInPixels = 0;
                shareMarkupRectangle.topInPixels = markupPopup.titleRectangle.heightInPixels + 1;
                shareMarkupRectangle.widthInPixels = 110;
                shareMarkupRectangle.heightInPixels = 28;
                shareMarkupRectangle.background = 'rgb(0, 0, 0, 0.6)';
                shareMarkupRectangle.cornerRadius = this._DTDWeb.uiManager.multiplyDevicePixelRatio(5);
                shareMarkupRectangle.thickness = 0;
                shareMarkupRectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                shareMarkupRectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                shareMarkupRectangle.onPointerClickObservable.add(() => {
                    this._DTDWeb.onClickShareMarkupButton(base64String);
                });
                shareMarkupRectangle.addControl(shareMarkupImage);
                shareMarkupRectangle.addControl(shareMarkupTextBlock);

                markupPopup.additionalControls.push(shareMarkupRectangle);
                markupPopup.addControl(shareMarkupRectangle);
            }

            const exifObj = piexif.load(base64String);
            if (exifObj["Exif"][piexif.ExifIFD.UserComment]) {
                const userComment = exifObj["Exif"][piexif.ExifIFD.UserComment];
                const userCommentString = DTDWeb.Utility.RemoveCharCode(userComment, 0);
                if (userCommentString.length > 0) {
                    const moveMarkupAction = () => {
                        const userComment = JSON.parse(userCommentString);

                        const title = userComment.title;
                        const cameraPosition = userComment.cameraPosition;
                        const cameraTarget = userComment.cameraTarget === undefined ? cameraPosition : userComment.cameraTarget;
                        const cameraRotation = userComment.cameraRotation;
                        this._DTDWeb.cameraController.moveCameraFromJSON(cameraTarget, cameraPosition, cameraRotation);

                        if (this._DTDWeb.functionMode === DTDPlayer.FunctionMode.MARKUP) {
                            this.stopMarkup(true);
                        }
                    };

                    const locationImage = new BABYLON.GUI.Image(`${popupName}Location_Image`,
                        `${DTDPlayer.IMAGE_DIRECTORY}/location_on.png`);
                    locationImage.leftInPixels = 3;
                    locationImage.topInPixels = 0;
                    locationImage.widthInPixels = 20;
                    locationImage.heightInPixels = 20;
                    locationImage.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                    locationImage.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
                    locationImage.alpha = 1;

                    const locationTextBlock = new BABYLON.GUI.TextBlock(`${popupName}Location_TextBlock`, '마크업 이동');
                    locationTextBlock.leftInPixels = -5;
                    locationTextBlock.topInPixels = 0;
                    locationTextBlock.widthInPixels = 58;
                    locationTextBlock.height = '100%';
                    locationTextBlock.color = 'white';
                    locationTextBlock.fontFamily = DTDWeb.GLOBAL_FONT_FAMILY;
                    locationTextBlock.fontSize = 12;
                    locationTextBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
                    locationTextBlock.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
                    locationTextBlock.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
                    locationTextBlock.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

                    const moveMarkupRectangle = new BABYLON.GUI.Rectangle(`${popupName}MoveMarkup_Rectangle`);
                    moveMarkupRectangle.leftInPixels = -1;
                    moveMarkupRectangle.topInPixels = markupPopup.titleRectangle.heightInPixels + 1;
                    moveMarkupRectangle.widthInPixels = 85;
                    moveMarkupRectangle.heightInPixels = 28;
                    moveMarkupRectangle.background = 'rgb(0, 0, 0, 0.6)';
                    moveMarkupRectangle.cornerRadius = this._DTDWeb.uiManager.multiplyDevicePixelRatio(5);
                    moveMarkupRectangle.thickness = 0;
                    moveMarkupRectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
                    moveMarkupRectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                    moveMarkupRectangle.onPointerClickObservable.add(() => {
                        if (this._DTDWeb.functionMode === DTDPlayer.FunctionMode.MARKUP) {
                            this._DTDWeb.popupManager.showMainPopup(DTDWeb.Popup.POPUP_TYPE.NOTICE_WITH_CANCEL, DTDWeb.Popup.POPUP_TITLE_TEXT.NOTICE,
                                DTDWeb.Popup.POPUP_MESSAGE_TEXT.WHEN_MOVE_DISAPPEARS_WRITING, moveMarkupAction, false);
                        }
                        else {
                            moveMarkupAction();
                        }
                    });
                    moveMarkupRectangle.addControl(locationImage);
                    moveMarkupRectangle.addControl(locationTextBlock);

                    markupPopup.additionalControls.push(moveMarkupRectangle);
                    markupPopup.addControl(moveMarkupRectangle);
                }
            }
        }
        catch { }

        this._DTDWeb.uiManager.addGUIControl(markupPopup);
    }

    loadMarkup(url, base64String, isChangeMarkupMode) {
        if (isChangeMarkupMode) {
            this.startMarkup();
        }

        if (this._DTDWeb.functionMode === DTDPlayer.FunctionMode.MARKUP) {
            this.deselectAllMarkups();
        }

        if (url) {
            let imageUrl = url;
            if (!url.toLowerCase().startsWith('http')) {
                imageUrl = DTDWeb.Utility.GetUrlFromDTDXFileName(url);
            }
            fetch(imageUrl).then((response) => {
                response.blob().then((blob) => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        this.createMarkupViewPopup(event.target.result);
                    };
                    reader.readAsDataURL(blob);
                });
            });
        }
        else if (base64String) {
            this.createMarkupViewPopup(base64String);
        }
    }
}

export { DTDWebMarkupController };