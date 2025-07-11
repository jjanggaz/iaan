class DTDon {
    static Colyseus = {
        DEVICE_NAME: {
            ADMIN: 0,
            ARUSER: 1,
            USER: 2
        },

        COMMAND_TYPE: {
            REQUEST: 0,
            REQUEST_CANCEL: 1,
            INVITE: 2,
            LOBBY_ROOM: 3,
            CHAT_ROOM: 4,
            REQUEST_GROUP: 5,
            REQUEST_GROUP_CANCEL: 6,
            INVITE_GROUP: 7
        },

        CHAT_ROOM_TALK_TYPE: {
            ALERT: 0,
            NOTICE: 1,
            MESSAGE: 2,
            SHARE: 3,
            KICKOUT: 8
        },

        SHARE_TYPE: {
            NONE: 0,
            TEXT: 1, // 텍스트
            CHAT_NOTICE: 2,
            SCREEN: 3, // 화면 공유
            SCREEN_TOOLS: 4,
            SCREEN_CLOSE: 5,
            LOCATION: 6,
            RECORDING: 7,
            FILE: 8
        }
    };

    static UI = {
        CHAT_PANEL_TYPE: {
            LOADING: 0,
            USER_LIST: 1,
            REQUEST_CALL: 2,
            RECEIVED_CALL: 3,
            CANCELED_CALL: 4,
            CHAT: 5
        }
    };

    static RTC = {
        VIDEO_TYPE: {
            NONE: 0,
            WEBCAM: 1,
            CANVAS: 2
        },

        AUDIO_TYPE: {
            NONE: 0,
            MICROPHONE: 1
        },

        VIDEO_WIDTH: 1280,
        VIDEO_HEIGHT: 720,
        VIDEO_FRAMERATE: 60,
        VIDEO_CODEC: 'H.264'
    };

    static LobbyManager = undefined;
    static ChatManager = undefined;

    static RTCManager = undefined;

    static UIManager = undefined;
    static PopupManager = undefined;

    static Utility = undefined;

    static User = undefined;

    constructor(dtdonPlayer, dtdPlayer) {
        this._DTDonPlayer = dtdonPlayer;

        // DTDPlayer: DTDWeb Player
        this._DTDPlayer = dtdPlayer;
        this._DTDPlayerElement = dtdPlayer.playerElement;

        this._colyseusClient = undefined;

        this._lobbyManager = undefined;
        this._chatManager = undefined;

        this._rtcManager = undefined;

        this._uiManager = undefined;
        this._popupManager = undefined;

        this._userProfile = undefined;
    }

    get DTDPlayer() {
        return this._DTDPlayer;
    }

    get DTDPlayerElement() {
        return this._DTDPlayerElement;
    }

    get DTDPlayerCanvas() {
        return this._DTDPlayer.GetRenderCanvasForStreaming();
    }

    get userContainer() {
        return this._DTDonPlayer.userContainer;
    }

    get chatContainer() {
        return this._DTDonPlayer.chatContainer;
    }

    get colyseusClient() {
        return this._colyseusClient;
    }

    get lobbyManager() {
        return this._lobbyManager;
    }

    get chatManager() {
        return this._chatManager;
    }

    get rtcManager() {
        return this._rtcManager;
    }

    get uiManager() {
        return this._uiManager;
    }

    get popupManager() {
        return this._popupManager;
    }

    get userProfile() {
        return this._userProfile;
    }

    set userProfile(userProfile) {
        const playerSchema = {
            playerName: userProfile.name,
            playerNickName: userProfile.nickname,
            companyName: userProfile.company,
            deviceName: DTDon.Colyseus.DEVICE_NAME.ADMIN
        };

        this._userProfile = new DTDon.User(playerSchema);
    }

    async initializeDTDonModules() {
        if (DTDon.LobbyManager === undefined) {
            DTDon.LobbyManager = (await import('./colyseus/dtdon.lobbymanager.js')).DTDonLobbyManager;
        }

        if (DTDon.ChatManager === undefined) {
            DTDon.ChatManager = (await import('./colyseus/dtdon.chatmanager.js')).DTDonChatManager;
        }

        if (DTDon.RTCManager === undefined) {
            DTDon.RTCManager = (await import('./rtc/dtdon.rtcmanager.js')).DTDonRTCManager;
        }

        if (DTDon.UIManager === undefined) {
            DTDon.UIManager = (await import('./dtdon.uimanager.js')).DTDonUIManager;
        }

        if (DTDon.PopupManager === undefined) {
            DTDon.PopupManager = (await import('./dtdon.popupmanager.js')).DTDonPopupManager;
        }

        if (DTDon.Utility === undefined) {
            DTDon.Utility = (await import('./dtdon.utility.js')).DTDonUtility;
        }

        if (DTDon.User === undefined) {
            DTDon.User = (await import('./dtdon.user.js')).DTDonUser;
        }

        this._lobbyManager = new DTDon.LobbyManager(this);
        this._chatManager = new DTDon.ChatManager(this);

        this._rtcManager = new DTDon.RTCManager(this);

        this._uiManager = new DTDon.UIManager(this);
        this._popupManager = new DTDon.PopupManager(this);

        this._DTDPlayer.OnCanvasResized = (width, height) => {
            this._rtcManager.onDTDPlayerCanvasResized(width, height);
        };

        this._DTDPlayer.OnClickShareMarkupButton = (base64String) => {
            this._chatManager.sendAttachmentByBase64(base64String);
        };
    }

    async connectToColyseusServer() {
        this._colyseusClient = new Colyseus.Client(DTDonPlayer.COLYSEUS_SERVER_HOST);

        await this._lobbyManager.joinLobby();
    }
}

export { DTDon };