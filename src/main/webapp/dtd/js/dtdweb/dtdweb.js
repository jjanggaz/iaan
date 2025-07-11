import { DTDWebPlayerBridge } from './dtdweb.playerbridge.js';

import { DTDFormat_0x00200000 } from './dtdformat_0x00200000.js';

class DTDWeb {
    static GLOBAL_FONT_FAMILY = 'NotoSansKR';

    static Camera = {
        NEAR_CLIP_PLANE: 0.1,
        FAR_CLIP_PLANE: 1000,
        FOV: BABYLON.Tools.ToRadians(30),

        CAMERA_MODE: {
            FLY_MODE: 0,
            WALK_MODE: 1
        },

        CAMERA_DIRECTION: {
            HOME: 0,
            UP: 1,
            FRONT: 2,
            BACK: 3,
            LEFT: 4,
            RIGHT: 5
        },

        ANGULAR_SENSIBILITY_X: 800,
        ANGULAR_SENSIBILITY_Y: 800,

        WHEEL_PRECISION: 0.8,
        WHEEL_DELTA_PERCENTAGE: 0.05,

        PINCH_DELTA_PERCENTAGE: 0.007,

        LAYER_MASK: {
            NONE: 0x00000000,
            MESH: 0x00000001,
            MARKUP: 0x00000010,
            TOOL: 0x00000100,
            UI: 0x00001000,
        },

        CAMERA_DIRECTION_DISTANCE_OFFSET: 5,

        CAMERA_ANIMATION_FRAMERATE: 60,
        CAMERA_ANIMATION_SPEED_RATIO: 1,

        THIRD_PERSON_CAMERA_ROTATION_SPEED: 0.0005,
        THIRD_PERSON_CAMERA_POSITION_OFFSET_Y: 0.8,

        DTD_CHARACTER_ANIMATION_TYPE: {
            NONE: -1,
            IDLE: 0,
            WALK: 1,
            RUN: 2
        },

        COVERED_CAMERA_MESH_TIMEOUT_SECONDS: 5
    };

    static Mesh = {
        MESH_EFFECT_TYPE: {
            NORMAL: 0,
            HIGHLIGHT: 1,
            XRAY: 2,
            CHANGE_COLOR: 3,
            INVISIBLE: 4
        },

        MESH_CULLING_STRATEGY: BABYLON.AbstractMesh.CULLINGSTRATEGY_STANDARD,

        MESH_HIDE_POSITION: 10000
    };

    static Input = {
        CURSOR_TYPE: {
            NONE: 0,
            TRANSFORM_MOVE: 1,
            TRANSFORM_ROTATE: 2
        },

        CONTEXT_MENU_TOUCH_SECONDS: 0.5
    };

    static UI = {
        UI_TEXT: {
            FLY_MODE: '비행모드',
            WALK_MODE: '걷기모드',

            UP: '위',
            FRONT: '앞',
            BACK: '뒤',
            LEFT: '좌',
            RIGHT: '우',

            CATEGORY_SELECT: '동일 카테고리 전체 선택',
            CONNECT_SELECT: '연결요소 전체 선택',
            HIGHLIGHT: '하이라이트',
            XRAY: 'X-Ray',
            INVISIBLE: '감추기',
            RESET_ALL: '모든 상태 초기화',
            PATH_TRACKING: '패스 트래킹',
            SHOW_PROPERTIES: '속성보기',

            APPLY: '적용',
            INVERT_APPLY: '선택항목 제외하고 전체',
            CATEGORY_APPLY: '동일 카테고리 전체',

            SUB_CONTEXT_MENU_INVERT_APPLY: '반전\n적용',
            SUB_CONTEXT_MENU_CATEGORY_APPLY: '카테고리\n적용',

            SELECT_FLOOR: '바닥 선택 이동',
            SHOW_AVATAR: '아바타 보이기',
            MOUSE_ROTATION: '마우스 회전',

            // KEPCO E&C Custom START
            VIEW_2D: '2D보기',
            DESIGN_CHECK_2D: '2D설계점검결과',
            DESIGN_CHECK_3D: '3D설계점검결과',
            FIELD_DESIGN_CHECK: '현장설계점검결과'
            // KEPCO E&C Custom END
        },

        CONTEXT_MENU_TYPE: {
            CLASSIC: 'CLASSIC',
            CIRCLE: 'CIRCLE'
        },

        CONTEXT_MENU_BUTTON_TYPE: {
            CATEGORY_SELECT: 'ContextMenu_CategorySelect',
            CONNECT_SELECT: 'ContextMenu_ConnectSelect',
            HIGHLIGHT: 'ContextMenu_Highlight',
            XRAY: 'ContextMenu_Xray',
            INVISIBLE: 'ContextMenu_Hidden',
            RESET_ALL: 'ContextMenu_Reset',
            PATH_TRACKING: 'ContextMenu_PathTracking',
            PROPERTY: 'ContextMenu_Property',
            NOT_PICKED_RESET: 'ContextMenu_NotPickedReset',
            SPLIT_LINE: 'ContextMenu_SplitLine',

            // KEPCO E&C Custom START
            VIEW_2D: 'ContextMenu_View2D',
            DESIGN_CHECK_2D: 'ContextMenu_DesignCheck2D',
            DESIGN_CHECK_3D: 'ContextMenu_DesignCheck3D',
            FIELD_DESIGN_CHECK: 'ContextMenu_FieldDesignCheck'
            // KEPCO E&C Custom END
        },

        SUB_CONTEXT_MENU_BUTTON_TYPE: {
            APPLY: 'SubContextMenu_Apply',
            INVERT_APPLY: 'SubContextMenu_InvertApply',
            CATEGORY_APPLY: 'SubContextMenu_CategoryApply'
        },

        CONTEXT_MENU_ANIMATION_FRAMERATE: 60,

        TOAST_MARGIN_WIDTH: 30,

        COLORS: [
            '#FF0000', // Red
            '#FF6600', // Orangle
            '#FFFF00', // Yellow
            '#BBFF1B', // Light Green
            '#008000', // Green
            '#00B1EF', // Cyan
            '#002060', // Indogo
            '#70309F', // Purple
            '#000000', // Black
            '#FFFFFF'  // White
        ],

        LINE_THICKNESS: [
            1, 2, 3, 4, 5, 6
        ],

        FONT: {
            MIN_FONT_SIZE: 5,
            MAX_FONT_SIZE: 100
        }
    };

    static Popup = {
        POPUP_TYPE: {
            NOTICE: 0,
            NOTICE_WITH_CANCEL: 1,
            INPUT_TEXT: 2,
            PROGRESS: 3,
        },

        POPUP_TITLE_TEXT: {
            NOTICE: '알림',
            INTERFERENCE_CHECK: '간섭검사'
        },

        POPUP_MESSAGE_TEXT: {
            CANNOT_FOUND_CONNECTED_DATA: '연결된 부재가 없습니다.',
            CANNOT_FOUND_TARGET: '대상이 없습니다.',
            WHEN_MOVE_DISAPPEARS_WRITING: '이동하면 작성 중인 내용이 사라집니다.',
            INPUT_MARKUP_TITLE: '마크업 제목을 작성하세요.',
            INTERFERENCE_CHECK: '간섭검사 중입니다.',
            NOTHING_INTERFERENCE: '간섭 부재가 없습니다.',
            INPUT_BOOKMARK_GROUP_TITLE: '북마크 그룹을 추가하시겠습니까?'
        },

        POPUP_INPUT_TEXT_PLACEHOLDER: {
            MARKUP_TITLE: '마크업 제목',
            BOOKMARK_GROUP_TITLE: '북마크 그룹명'
        },

        POPUP_BUTTON_TEXT: {
            CONFIRM: '확인',
            CANCEL: '취소',
            YES: '예',
            NO: '아니오',
            SAVE: '저장'
        },

        MAIN_POPUP_BACKGROUND: '#3F4552',
        MAIN_POPUP_TITLE_BACKGROUND: '#31343F',
        MAIN_POPUP_BUTTON_BACKGROUND: '#30343F',
        MAIN_POPUP_PROGRESS_VALUE_BACKGROUND: '#41ADF5',

        RESIZABLE_POPUP_BACKGROUND: '#3F4552',
        RESIZABLE_POPUP_TITLE_BACKGROUND: '#31343F'
    };

    static Parameter = {
        PARAMETER_GROUP_TEXT: {
            BASE_INFORMATION: '기본정보',
            ETC: '기타',

            KOR_BASE_INFORMATION: '기본정보',
            KOR_ETC: '기타',

            ENG_BASE_INFORMATION: 'Basic',
            ENG_ETC: 'ETC',

            // KEPCO E&C Custom START
            SYMBOL: 'Symbol'
            // KEPCO E&C Custom END
        },

        PARAMETER_KEY_TEXT: {
            NAME: '이름',
            ID: '아이디',
            FILE_NAME: '파일명',
            FAMILY_NAME: '패밀리 이름',
            FAMILY_TYPE: '패밀리 유형',
            CATEGORY: '카테고리',
            VIEW: '뷰이름',

            KOR_NAME: '이름',
            KOR_FILE_NAME: '파일명',
            KOR_ID: '아이디',
            KOR_FAMILY_NAME: '패밀리 이름',
            KOR_FAMILY_TYPE: '패밀리 유형',
            KOR_CATEGORY: '카테고리',
            KOR_VIEW: '뷰이름',

            ENG_NAME: 'Name',
            ENG_FILE_NAME: 'File Name',
            ENG_ID: 'ID',
            ENG_FAMILY_NAME: 'Family Name',
            ENG_FAMILY_TYPE: 'Family Type',
            ENG_CATEGORY: 'Category',
            ENG_VIEW: 'View',

            // KEPCO E&C Custom START
            HANDLE: 'HANDLE',
            TAG: 'TAG'
            // KEPCO E&C Custom END
        },

        PARAMETER_VALUE_TEXT: {
            PIPE: '배관',
            PIPE_FITTING: '배관 부속류',
            FLOOR: '바닥',

            KOR_PIPE: '배관',
            KOR_PIPE_FITTING: '배관 부속류',
            KOR_FLOOR: '바닥',

            ENG_PIPE: 'Pipe',
            ENG_PIPE_FITTING: 'Pipe Fitting',
            ENG_FLOOR: 'Floor',

            // KEPCO E&C Custom START
            CLAMP: 'Clamp',
            MOUNTING_PLATE: 'Mounting Plate',
            UNION: 'Union',
            INSTRUMENT_VALVE: 'Instrument Valve',
            ROOT_VALVE: 'Root Valve',
            TEE: 'Tee'
            // KEPCO E&C Custom END
        }
    };

    static Markup = {
        MARKUP_MODE: {
            NONE: 0,
            DRAW_LINE: 1,
            TEXT: 2,
            CLIPART: 3
        },

        CLIPART_IMAGES: [
            { RELATIVE_URL: `${DTDPlayer.IMAGE_DIRECTORY}/markup/clipart/note_01_cloud.svg` },
            { RELATIVE_URL: `${DTDPlayer.IMAGE_DIRECTORY}/markup/clipart/note_02_cloud.svg` },
            { RELATIVE_URL: `${DTDPlayer.IMAGE_DIRECTORY}/markup/clipart/note_03.svg` },
            { RELATIVE_URL: `${DTDPlayer.IMAGE_DIRECTORY}/markup/clipart/note_03_bg100.svg` },
            { RELATIVE_URL: `${DTDPlayer.IMAGE_DIRECTORY}/markup/clipart/note_04.svg` },
            { RELATIVE_URL: `${DTDPlayer.IMAGE_DIRECTORY}/markup/clipart/note_04_bg100.svg` },
            { RELATIVE_URL: `${DTDPlayer.IMAGE_DIRECTORY}/markup/clipart/note_05.svg` },
            { RELATIVE_URL: `${DTDPlayer.IMAGE_DIRECTORY}/markup/clipart/note_05_bg100.svg` },
            { RELATIVE_URL: `${DTDPlayer.IMAGE_DIRECTORY}/markup/clipart/note_06.svg` },
            { RELATIVE_URL: `${DTDPlayer.IMAGE_DIRECTORY}/markup/clipart/note_06_bg100.svg` },
            { RELATIVE_URL: `${DTDPlayer.IMAGE_DIRECTORY}/markup/clipart/note_07.svg` },
            { RELATIVE_URL: `${DTDPlayer.IMAGE_DIRECTORY}/markup/clipart/note_07_bg100.svg` },
        ],

        MARKUP_TEXT_PLACEHOLDER: '텍스트를 입력하세요.',

        DEFAULT_PEN_COLOR: '#FF0000',
        DEFAULT_PEN_THICKNESS: 2,
        DEFAULT_FONT_COLOR: '#FFFFFF',
        DEFAULT_FONT_SIZE: 14
    };

    static Bookmark = {
        ANIMATE_SPEED_OFFSET: 2
    };

    // KEPCO E&C Custom START
    static KEPCOENC = {
        SYMBOL_TABLE: {},

        IMPORT_SCALE: 0.001,

        MM_SCALE: 0.001
    };
    // KEPCO E&C Custom END

    // Controller Classes
    static CameraController = undefined;
    static WalkModeViewController = undefined;
    static InputController = undefined;
    static ParameterController = undefined;

    // Manager Classes
    static ModelManager = undefined;
    static UIManager = undefined;
    static PopupManager = undefined;

    // Loading Screen Class
    static LoadingScreen = undefined;

    // Utility Class
    static Utility = undefined;

    // Function Controller Classes
    static PathTrackingController = undefined;
    static InterferenceChechController = undefined;
    static MarkupController = undefined;
    static BookmarkController = undefined;

    // for DTDon START
    static DTDonManager = undefined;
    // for DTDon END

    // KEPCO E&C Custom START
    static KEPCOENCController = undefined;
    static KEPCOENCImportManager = undefined;
    // KEPCO E&C Custom END

    constructor(dtdPlayer, isStandalone) {
        this._playerBridge = new DTDWebPlayerBridge(this, dtdPlayer);

        this._isStandalone = isStandalone;

        this._engine = undefined;
        this._scene = undefined;

        this._playerElement = dtdPlayer.playerElement;
        this._renderCanvas = dtdPlayer.renderCanvas;
        this._loadingScreenDiv = dtdPlayer.loadingScreenDiv;
        this._loadingScreenProgress = dtdPlayer.loadingScreenProgress;

        this._isTouchDevice = false;

        this._havokInstance = undefined;
        this._havokPlugin = undefined;

        // Babylon.js Engine Options
        this._useWebGPU = false;
        this._useAntialiasing = true;
        this._useAdaptToDeviceRatio = true;
        this._usePreserveDrawingBuffer = true;
        this._useStencil = true;

        // DTDWeb Options
        this._useFreeze = true;
        this._useInstance = true;
        this._usePBRMaterial = false;
        this._useGridGround = false;
        this._useScreenKeyHelper = true;
        this._showDebugLayer = false;

        // Controllers
        this._cameraController = undefined;
        this._walkModeViewController = undefined;
        this._inputController = undefined;
        this._parameterController = undefined;

        // Managers
        this._modelManager = undefined;
        this._uiManager = undefined;
        this._popupManager = undefined;

        // Functions
        this._markupController = undefined;
        this._pathTrackingController = undefined;
        this._interferenceCheckController = undefined;
        this._bookmarkController = undefined;
        this._currentFunctionMode = DTDPlayer.FunctionMode.NONE;

        // for DTDon START
        this._dtdonManager = undefined;

        this._hasJoinedDTDonChatRoom = false;
        // for DTDon END

        // KEPCO E&C Custom START
        this._kepcoEncController = undefined;
        this._kepcoEncImportManager = undefined;
        // KEPCO E&C Custom END
    }

    // Getter and Setter Start
    get isStandalone() {
        return this._isStandalone;
    }

    get engine() {
        return this._engine;
    }

    get scene() {
        return this._scene;
    }

    get playerElement() {
        return this._playerElement;
    }

    get renderCanvas() {
        return this._renderCanvas;
    }

    get loadingScreenDiv() {
        return this._loadingScreenDiv;
    }

    get loadingScreenProgress() {
        return this._loadingScreenProgress;
    }

    get isMobile() {
        return /X11|Android|iPhone|iPad/i.test(navigator.userAgent);
    }

    get isTouchDevice() {
        return this._isTouchDevice;
    }

    get havokInstance() {
        return this._havokInstance;
    }

    get havokPlugin() {
        return this._havokPlugin;
    }

    get scaleFactor() {
        return this._engine.getHardwareScalingLevel() * window.devicePixelRatio;
    }

    get useWebGPU() {
        return this._useWebGPU;
    }

    get useFreeze() {
        return this._useFreeze;
    }

    get useInstance() {
        return this._useInstance;
    }

    get usePBRMaterial() {
        return this._usePBRMaterial;
    }

    get useGridGround() {
        return this._useGridGround;
    }

    get useScreenKeyHelper() {
        return this._useScreenKeyHelper;
    }

    get cameraController() {
        return this._cameraController;
    }

    get walkModeViewController() {
        return this._walkModeViewController;
    }

    get inputController() {
        return this._inputController;
    }

    get parameterController() {
        return this._parameterController;
    }

    get modelManager() {
        return this._modelManager;
    }

    get uiManager() {
        return this._uiManager;
    }

    get popupManager() {
        return this._popupManager;
    }

    get markupController() {
        return this._markupController;
    }

    get pathTrackingController() {
        return this._pathTrackingController;
    }

    get interferenceCheckController() {
        return this._interferenceCheckController;
    }

    get bookmarkController() {
        return this._bookmarkController;
    }

    // for DTDon START
    get dtdonManager() {
        return this._dtdonManager;
    }

    get hasJoinedDTDonChatRoom() {
        return this._hasJoinedDTDonChatRoom;
    }

    set hasJoinedDTDonChatRoom(hasJoined) {
        this._hasJoinedDTDonChatRoom = hasJoined;
    }
    // for DTDon END

    get functionMode() {
        return this._playerBridge.functionMode;
    }

    set functionMode(functionMode) {
        this._playerBridge.functionMode = functionMode;
    }
    // Getter and Setter End

    // KEPCO E&C Custom START
    get kepcoEncController() {
        return this._kepcoEncController;
    }

    get kepcoEncImportManager() {
        return this._kepcoEncImportManager;
    }
    // KEPCO E&C Custom END

    async initializeDTDWebModules() {
        if (DTDWeb.CameraController === undefined) {
            DTDWeb.CameraController = (await import('./dtdweb.cameracontroller.js')).DTDWebCameraController;
        }

        if (DTDWeb.WalkModeViewController === undefined) {
            DTDWeb.WalkModeViewController = (await import('./dtdweb.walkmodeviewcontroller.js')).DTDWebWalkModeViewController;
        }

        if (DTDWeb.InputController === undefined) {
            DTDWeb.InputController = (await import('./dtdweb.inputcontroller.js')).DTDWebInputController;
        }

        if (DTDWeb.ParameterController === undefined) {
            DTDWeb.ParameterController = (await import('./dtdweb.parametercontroller.js')).DTDWebParameterController;
        }

        if (DTDWeb.ModelManager === undefined) {
            DTDWeb.ModelManager = (await import('./dtdweb.modelmanager.js')).DTDWebModelManager;
        }

        if (DTDWeb.UIManager === undefined) {
            DTDWeb.UIManager = (await import('./dtdweb.uimanager.js')).DTDWebUIManager;
        }

        if (DTDWeb.PopupManager === undefined) {
            DTDWeb.PopupManager = (await import('./dtdweb.popupmanager.js')).DTDWebPopupManager;
        }

        if (DTDWeb.LoadingScreen === undefined) {
            DTDWeb.LoadingScreen = (await import('./dtdweb.loadingscreen.js')).DTDWebLoadingScreen;
        }

        if (DTDWeb.Utility === undefined) {
            DTDWeb.Utility = (await import('./dtdweb.utility.js')).DTDWebUtility;
        }

        if (DTDWeb.MarkupController === undefined) {
            DTDWeb.MarkupController = (await import('./functions/dtdweb.markupcontroller.js')).DTDWebMarkupController;
        }

        if (DTDWeb.PathTrackingController === undefined) {
            DTDWeb.PathTrackingController = (await import('./functions/dtdweb.pathtrackingcontroller.js')).DTDWebPathTrackingController;
        }

        if (DTDWeb.InterferenceChechController === undefined) {
            DTDWeb.InterferenceChechController = (await import('./functions/dtdweb.interferencecheckcontroller.js')).DTDWebInterferenceCheckController;
        }

        if (DTDWeb.BookmarkController === undefined) {
            DTDWeb.BookmarkController = (await import('./functions/dtdweb.bookmarkcontroller.js')).DTDWebBookmarkController;
        }

        // for DTDon START
        if (DTDWeb.DTDonManager === undefined) {
            DTDWeb.DTDonManager = (await import('./dtdon/dtdweb.dtdonmanager.js')).DTDWebDTDonManager;
        }
        // for DTDon END

        // KEPCO E&C Custom START
        if (DTDWeb.KEPCOENCController === undefined) {
            DTDWeb.KEPCOENCController = (await import('./kepco_enc/dtdweb.kepcoenccontroller.js')).KEPCOENCController;
        }

        if (DTDWeb.KEPCOENCImportManager === undefined) {
            DTDWeb.KEPCOENCImportManager = (await import('./kepco_enc/dtdweb.kepcoencimportmanager.js')).KEPCOENCImportManager;
        }
        // KEPCO E&C Custom END
    }

    async initializeEngine(options) {
        this._isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

        this._useWebGPU = false;
        this._useAntialiasing = true;
        this._useAdaptToDeviceRatio = true;
        this._usePreserveDrawingBuffer = true;
        this._useStencil = true;
        this._disableWebGL2Support = false;

        // Options
        if (options) {
            this._useWebGPU = options.useWebGPU === undefined ? this._useWebGPU : options.useWebGPU;
            this._useAntialiasing = options.useAntialiasing === undefined ? this._useAntialiasing : options.useAntialiasing;
            this._useAdaptToDeviceRatio = options.useAdaptToDeviceRatio === undefined ? this._useAdaptToDeviceRatio : options.useAdaptToDeviceRatio;
            this._usePreserveDrawingBuffer = options.usePreserveDrawingBuffer === undefined ? this._usePreserveDrawingBuffer : options.usePreserveDrawingBuffer;
            this._useStencil = options.useStencil === undefined ? this._useStencil : options.useStencil;
            this._disableWebGL2Support = options.disableWebGL2Support === undefined ? this._disableWebGL2Support : options.disableWebGL2Support;
        }

        if (this._useWebGPU) {
            const engineOptions = {
                antialiasing: this._useAntialiasing,
                adaptToDeviceRatio: this._useAdaptToDeviceRatio
            };
            this._engine = new BABYLON.WebGPUEngine(this._renderCanvas, engineOptions);
            await this._engine.initAsync();
        }
        else {
            const engineOptions = {
                preserveDrawingBuffer: this._usePreserveDrawingBuffer,
                stencil: this._useStencil,
                disableWebGL2Support: this._disableWebGL2Support
            };
            this._engine = new BABYLON.Engine(this._renderCanvas, this._useAntialiasing, engineOptions, this._useAdaptToDeviceRatio);
        }

        if (this.isMobile) {
            this._engine.setHardwareScalingLevel(Math.max(0.6, 1 / window.devicePixelRatio));
        }
        else {
            this._engine.setHardwareScalingLevel(1 / window.devicePixelRatio);
        }

        this._engine.doNotHandleContextLost = true;

        this._engine.loadingScreen = new DTDWeb.LoadingScreen(this);
        this._engine.loadingScreen.hideLoadingUI(true);

        const resizeEngine = () => {
            this._engine.resize();

            if (this._uiManager) {
                this._uiManager.initializeIdealWidth();
                this._uiManager.initializeRenderScale();
            }

            if (this._renderCanvas) {
                this._playerBridge.onCanvasResized(this._renderCanvas.width, this._renderCanvas.height);
            }
        };

        window.addEventListener('resize', () => {
            resizeEngine();
        });

        this._resizeObserver = new ResizeObserver(() => {
            resizeEngine();
        });
        this._resizeObserver.observe(this._renderCanvas);

        this._engine.runRenderLoop(() => {
            if (this._scene) {
                this._scene.render();
            }
        });

        // this._havokInstance = await HavokPhysics();
    }

    initializeOptions(options) {
        this._useFreeze = true;
        this._useInstance = true;
        this._usePBRMaterial = false;
        this._useScreenKeyHelper = true;
        this._showDebugLayer = false;

        if (options) {
            this._useFreeze = options.useFreeze === undefined ? this._useFreeze : options.useFreeze;
            this._useInstance = options.useInstance === undefined ? this._useInstance : options.useInstance;
            this._usePBRMaterial = options.usePBRMaterial === undefined ? this._usePBRMaterial : options.usePBRMaterial;
            this._useGridGround = options.useGridGround === undefined ? this._useGridGround : options.useGridGround;
            this._useScreenKeyHelper = options.useScreenKeyHelper === undefined ? this._useScreenKeyHelper : options.useScreenKeyHelper;
            this._showDebugLayer = options.showDebugLayer === undefined ? this._showDebugLayer : options.showDebugLayer;
        }
    }

    createScene() {
        this.closeScene();

        this._renderCanvas.style.display = 'block';

        this._scene = new BABYLON.Scene(this._engine);
        this._scene.autoClear = true;
        this._scene.clearColor = new BABYLON.Color3(20 / 255, 20 / 255, 20 / 255);
        this._scene.shadowsEnabled = false;
        this._scene.useClonedMeshMap = true;
        this._scene.useGeometryIdsMap = true;
        this._scene.useMaterialMeshMap = true;
        this._scene.useRightHandedSystem = false;
        this._scene.collisionEnabled = true;
        this._scene.skipPointerMovePicking = true;
        this._scene.blockMaterialDirtyMechanism = true;
        if (this._useFreeze) {
            this._scene.skipFrustumClipping = true;
        }
        if (this._showDebugLayer) {
            this._scene.debugLayer.show();
        }

        this._scene.clearCachedVertexData();

        this._scene.getBoundingBoxRenderer().frontColor = new BABYLON.Color3(176 / 255, 121 / 255, 32 / 255);
        this._scene.getBoundingBoxRenderer().backColor = new BABYLON.Color3(176 / 255, 121 / 255, 32 / 255);

        // this._havokPlugin = new BABYLON.HavokPlugin(true, this._havokInstance);
        // this._scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), this._havokPlugin);

        BABYLON.Mesh.INSTANCEDMESH_SORT_TRANSPARENT = true;

        this._cameraController = new DTDWeb.CameraController(this);
        this._walkModeViewController = new DTDWeb.WalkModeViewController(this);
        this._inputController = new DTDWeb.InputController(this);
        this._parameterController = new DTDWeb.ParameterController(this);

        this._modelManager = new DTDWeb.ModelManager(this);
        this._uiManager = new DTDWeb.UIManager(this);
        // KEPCO E&C Custom START
        this._uiManager.setOnScreenKeyHelperVisible(false);
        // KEPCO E&C Custom END
        this._popupManager = new DTDWeb.PopupManager(this);

        this._markupController = new DTDWeb.MarkupController(this);
        this._pathTrackingController = new DTDWeb.PathTrackingController(this);
        this._interferenceCheckController = new DTDWeb.InterferenceChechController(this);
        this._bookmarkController = new DTDWeb.BookmarkController(this);

        // for DTDon START
        this._dtdonManager = new DTDWeb.DTDonManager(this);
        // for DTDon END

        // KEPCO E&C Custom START
        this._kepcoEncController = new DTDWeb.KEPCOENCController(this);
        this._kepcoEncImportManager = new DTDWeb.KEPCOENCImportManager(this);
        // KEPCO E&C Custom END
    }

    closeScene() {
        if (this._cameraController) {
            this._cameraController = undefined;
        }

        if (this._walkModeViewController) {
            this._walkModeViewController = undefined;
        }

        if (this._inputController) {
            this._inputController = undefined;
        }

        if (this._parameterController) {
            this._parameterController = undefined;
        }

        if (this._modelManager) {
            this._modelManager = undefined;
        }

        if (this._uiManager) {
            this._uiManager = undefined;
        }

        if (this._pathTrackingController) {
            this._pathTrackingController = undefined;
        }

        if (this._markupController) {
            this._markupController = undefined;
        }

        if (this._interferenceCheckController) {
            this._interferenceCheckController = undefined;
        }

        if (this._bookmarkController) {
            this._bookmarkController = undefined;
        }

        // for DTDon START
        if (this._dtdonManager) {
            this._dtdonManager = undefined;
        }
        // for DTDon END

        // KEPCO E&C Custom START
        if (this._kepcoEncController) {
            this._kepcoEncController = undefined;
        }

        if (this._kepcoEncImportManager) {
            this._kepcoEncImportManager = undefined;
        }
        // KEPCO E&C Custom END

        if (this._havokPlugin) {
            this._havokPlugin.dispose();
            this._havokPlugin = undefined;
        }

        if (this._scene) {
            this._scene.dispose();
            this._scene = undefined;
        }

        this._renderCanvas.style.display = 'none';
    }

    async onOpenURL(uris, isUrl) {
        if (this._scene === undefined) {
            this.createScene();
        }

        this.functionMode = DTDPlayer.FunctionMode.NONE;

        this._engine.displayLoadingUI();
        this._engine.loadingScreen.setFileCount(uris.length);

        let success = 0;
        for (let urlIndex = 0; urlIndex < uris.length; urlIndex++) {
            this._engine.loadingScreen.setFileIndex(urlIndex);

            const uri = uris[urlIndex];
            const extension = DTDWeb.Utility.GetFileExtension(isUrl ? uri : uri.name).toLowerCase();

            if (extension === 'dtdx' || extension === 'bobj') {
                if (await this._modelManager.loadDTDXFile(uri, isUrl)) {
                    success += 1;
                }
            }
            // KEPCO E&C Custom START
            else if (extension === 'json') {
                if (await this._kepcoEncImportManager.importFile(uri, isUrl)) {
                    success += 1;
                }
            }
            // KEPCO E&C Custom END

            this._engine.loadingScreen.loadingFileComplete();
        }

        this._engine.hideLoadingUI();

        if (success > 0) {
            this._modelManager.onModelLoaded();
        }
        else {
            this.closeScene();
        }
    }

    saveDTDX(fileName) {
        const fileMeshDictionary = this._modelManager.fileMeshDictionary;
        const fileNames = Object.keys(fileMeshDictionary);
        if (fileNames.length > 0) {
            return DTDFormat_0x00200000.Save(fileName, fileMeshDictionary, this._modelManager.connectorDataDictionary);
        }

        return undefined;
    }

    // KEPCO E&C Custom START
    onClick2DViewButton(rootValveParameters) {
        this._playerBridge.onClick2DViewButton(rootValveParameters);
    }

    onClick2DDesignCheckResultButton(rootValveParameters) {
        this._playerBridge.onClick2DDesignCheckResultButton(rootValveParameters);
    }

    onClick3DDesignCheckResultButton(rootValveParameters) {
        this._playerBridge.onClick3DDesignCheckResultButton(rootValveParameters);
    }

    onClickFieldDesignCheckResultButton(rootValveParameters) {
        this._playerBridge.onClickFieldDesignCheckResultButton(rootValveParameters);
    }
    // KEPCO E&C Custom END

    onModelLoaded() {
        this._playerBridge.onModelLoaded();
    }

    onSelected(parameters) {
        this._playerBridge.onSelected(parameters);
    }

    onClickProperty(parameters) {
        this._playerBridge.onClickProperty(parameters);
    }

    onAddMarkupSuccess(markupType) {
        this._playerBridge.onAddMarkupSuccess(markupType);
    }

    onAfterMarkupAction(hasPrevious, hasNext) {
        this._playerBridge.onAfterMarkupAction(hasPrevious, hasNext);
    }

    onPathTrackingEnd() {
        this._playerBridge.onPathTrackingEnd();
    }

    // for DTDon START
    onClickShareMarkupButton(base64String) {
        this._playerBridge.onClickShareMarkupButton(base64String);
    }
    // for DTDon END
}

export { DTDWeb };