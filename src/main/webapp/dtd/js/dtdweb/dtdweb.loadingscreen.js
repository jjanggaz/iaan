class DTDWebLoadingScreen {
    constructor(dtdWeb) {
        this._DTDWeb = dtdWeb;

        this._loadingScreenDiv = this._DTDWeb.loadingScreenDiv;
        this._loadModelProgress = this._DTDWeb.loadingScreenProgress;

        this._fileCount = 0;
        this._fileIndex = 0;
    }

    displayLoadingUI() {
        this._loadingScreenDiv.style.display = 'block';
        this._loadModelProgress.value = 0;
    }

    hideLoadingUI(isHideImmediately) {
        if (isHideImmediately) {
            this._loadingScreenDiv.style.display = 'none';
        }
        else {
            setTimeout(() => {
                this._loadingScreenDiv.style.display = 'none';
            }, 500);
        }
    }

    setFileIndex(fileIndex) {
        this._fileIndex = fileIndex;
    }

    setFileCount(fileCount) {
        this._fileCount = fileCount;
    }

    loadingFileComplete() {
        this._loadModelProgress.value = (this._fileIndex + 1) / this._fileCount * 100;
    }

    addPercentage(percentage) {
        const percentageValue = (1 / this._fileCount) * (percentage);
        this._loadModelProgress.value += percentageValue;
    }

    setPercentage(percentage) {
        const percentageValue = (1 / this._fileCount) * (percentage);
        this._loadModelProgress.value = (this._fileIndex / this._fileCount * 100) + percentageValue;
    }
}

export { DTDWebLoadingScreen };