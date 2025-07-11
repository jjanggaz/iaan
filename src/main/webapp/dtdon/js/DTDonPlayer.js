class DTDonPlayer {
    // DTDon Root(Relative)
    static DTDON_DIRECTORY = '/DTDon';
    // DTDon Third-Party Directory(Relative)
    static THIRDPARTY_SCRIPT_DIRECTORY = `${DTDonPlayer.DTDON_DIRECTORY}/js/third-party`;
    // DTDon UI Image Directory(Relative)
    static IMAGE_DIRECTORY = `${DTDonPlayer.DTDON_DIRECTORY}/images`;
    // DTDon CSS Directory(Relative)
    static CSS_DIRECTORY = `${DTDonPlayer.DTDON_DIRECTORY}/css`;

    static COLYSEUS_SERVER_HOST = 'ws://210.91.59.80:5055';
    static RTC_SIGNAL_SERVER_HOST = 'ws://210.91.59.76:5059';

    static FILE_UPLOAD_API_URL = `${DTDonPlayer.COLYSEUS_SERVER_HOST.replace('ws', 'http')}/file_upload`;
    static FILE_DOWNLOAD_API_URL = `${DTDonPlayer.COLYSEUS_SERVER_HOST.replace('ws', 'http')}/file_download`;

    static PreloadScripts = [
        {
            id: 'colyseus',
            src: '/colyseus/colyseus.js'
        }
    ];

    static IsPreloading = false;
    static IsPreloaded = false;
    static PreloadedCount = 0;

    constructor(dtdPlayer) {
        this._DTDPlayer = dtdPlayer;

        this._DTDon = undefined;

        this._userContainer = undefined;
        this._chatContainer = undefined;
    }

    async InitializeDTDon(options) {
        const scripts = document.getElementsByTagName('script');
        let playerScriptSrc = undefined;
        for (const script of scripts) {
            const src = script.getAttribute('src');
            if (src && src.includes('DTDonPlayer.js')) {
                playerScriptSrc = src;
                break;
            }
        }

        if (playerScriptSrc) {
            const rootDirectory = playerScriptSrc.replace('/js/DTDonPlayer.js', '');
            if (DTDonPlayer.DTDON_DIRECTORY !== rootDirectory) {
                DTDonPlayer.DTDON_DIRECTORY = rootDirectory;
                DTDonPlayer.THIRDPARTY_SCRIPT_DIRECTORY = `${DTDonPlayer.DTDON_DIRECTORY}/js/third-party`;
                DTDonPlayer.IMAGE_DIRECTORY = `${DTDonPlayer.DTDON_DIRECTORY}/images`;
                DTDonPlayer.CSS_DIRECTORY = `${DTDonPlayer.DTDON_DIRECTORY}/css`;
            }

            if (!DTDonPlayer.IsPreloading && !DTDonPlayer.IsPreloaded) {
                this.preloadScript(0);
            }
        }

        await this.waitForPreload();

        const { colyseusServerHost, rtcSignalServerHost, userContainer, chatContainer } = options;
        if (colyseusServerHost) {
            DTDonPlayer.COLYSEUS_SERVER_HOST = colyseusServerHost;
            DTDonPlayer.FILE_UPLOAD_API_URL = `${colyseusServerHost.replace('ws', 'http')}/file_upload`;
            DTDonPlayer.FILE_DOWNLOAD_API_URL = `${colyseusServerHost.replace('ws', 'http')}/file_download`;
        }
        if (rtcSignalServerHost) {
            DTDonPlayer.RTC_SIGNAL_SERVER_HOST = rtcSignalServerHost;
        }

        if (userContainer) {
            this._userContainer = userContainer;

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = `${DTDonPlayer.CSS_DIRECTORY}/usercontainer.css`;

            document.getElementsByTagName('head')[0].appendChild(link);
        }
        else {
            console.warn('DTDonPlayer.InitializeDTDon userContainer is undefined.');
        }

        if (chatContainer) {
            this._chatContainer = chatContainer;

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = `${DTDonPlayer.CSS_DIRECTORY}/chatcontainer.css`;

            document.getElementsByTagName('head')[0].appendChild(link);
        }
        else {
            console.warn('DTDonPlayer.InitializeDTDon chatContainer is undefined.');
        }

        const DTDon = (await import('./dtdon/dtdon.js')).DTDon;
        this._DTDon = new DTDon(this, this._DTDPlayer);
        await this._DTDon.initializeDTDonModules();
    }

    SetUserProfile(userProfile) {
        this._DTDon.userProfile = userProfile;
    }

    ConnectToColyseusServer() {
        this._DTDon.connectToColyseusServer();
    }

    // Internal Logic Start
    get userContainer() {
        return this._userContainer;
    }

    get chatContainer() {
        return this._chatContainer;
    }

    preloadScript(scriptIndex) {
        if (scriptIndex === 0) {
            DTDonPlayer.IsPreloading = true;
            DTDonPlayer.PreloadedCount = 0;
        }

        const script = DTDonPlayer.PreloadScripts[scriptIndex];
        if (script === undefined) {
            return;
        }

        if (document.getElementById(script.id)) {
            this.onLoadScript();
        }
        else {
            const scriptElement = document.createElement('script');
            scriptElement.id = script.id;
            scriptElement.src = `${DTDonPlayer.THIRDPARTY_SCRIPT_DIRECTORY}${script.src}`;
            scriptElement.onload = () => {
                this.onLoadScript();
            };
            document.head.appendChild(scriptElement);
        }
    }

    onLoadScript() {
        DTDonPlayer.PreloadedCount += 1;

        if (DTDonPlayer.PreloadedCount === DTDonPlayer.PreloadScripts.length) {
            DTDonPlayer.IsPreloading = false;
            DTDonPlayer.IsPreloaded = true;
        }
        else {
            this.preloadScript(DTDonPlayer.PreloadedCount);
        }
    }

    waitForPreload() {
        return new Promise((resolve) => {
            const checkPreloadInterval = setInterval(() => {
                if (DTDonPlayer.IsPreloaded) {
                    clearInterval(checkPreloadInterval);
                    resolve();
                }
            }, 100);
        });
    }
    // Internal Logic End
}