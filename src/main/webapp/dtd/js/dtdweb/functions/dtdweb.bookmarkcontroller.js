import { DTDWeb } from '../dtdweb.js';

class DTDWebBookmarkController {
    constructor(dtdWeb) {
        this._DTDWeb = dtdWeb;
        this._scene = dtdWeb.scene;

        this._bookmarks = [];

        this._globalAnimateSpeed = 1;
        this._globalAnimateDelay = 1;

        this._bookmarkAnimationIndex = -1;

        this._isPlayingBookmarkAnimation = false;
        this._isForceStop = false;
    }

    get bookmarks() {
        return this._bookmarks;
    }

    get globalAnimateSpeed() {
        return this._globalAnimateSpeed;
    }

    set globalAnimateSpeed(animateSpeed) {
        this.startBookmark();

        this._globalAnimateSpeed = animateSpeed;
    }

    get globalAnimateDelay() {
        return this._globalAnimateDelay;
    }

    set globalAnimateDelay(animateDelay) {
        this.startBookmark();

        this._globalAnimateDelay = animateDelay;
    }

    startBookmark() {
        if (this._DTDWeb.functionMode !== DTDPlayer.FunctionMode.BOOKMARK) {
            this._DTDWeb.functionMode = DTDPlayer.FunctionMode.BOOKMARK;
        }
    }

    stopBookmark(isChangeModeNone) {
        this.stopBookmarkAnimation();

        if (isChangeModeNone) {
            this._DTDWeb.functionMode = DTDPlayer.FunctionMode.NONE;
        }
    }

    addBookmarkGroup(groupSequenceId, onSuccessCallback) {
        this.startBookmark();

        const addBookmarkGroup = (groupTitle) => {
            const bookmarkGroup = {
                sequenceId: groupSequenceId,
                groupTitle,
                bookmarks: []
            };

            this._bookmarks.push(bookmarkGroup);

            if (onSuccessCallback) {
                onSuccessCallback(bookmarkGroup);
            }
        };

        this._DTDWeb.popupManager.showMainPopup(DTDWeb.Popup.POPUP_TYPE.INPUT_TEXT, DTDWeb.Popup.POPUP_TITLE_TEXT.NOTICE,
            DTDWeb.Popup.POPUP_MESSAGE_TEXT.INPUT_BOOKMARK_GROUP_TITLE, addBookmarkGroup);
    }

    getBookmarkGroup(groupSequenceId) {
        const foundIndex = this._bookmarks.findIndex((bookmarkGroup) => {
            return bookmarkGroup.sequenceId === groupSequenceId;
        });

        if (foundIndex === -1) {
            console.error(`DTDWeb ERROR: Group Sequence ID(${groupSequenceId})를 찾을 수 없음.`);
            return undefined;
        }

        return this._bookmarks[foundIndex];
    }

    removeBookmarkGroup(groupSequenceId, onSuccessCallback) {
        this.startBookmark();

        if (groupSequenceId < 0 || groupSequenceId >= this._bookmarks.length) {
            console.error(`DTDWeb ERROR: Group Sequence ID(${groupSequenceId})를 찾을 수 없음.`);
            return;
        }

        this._bookmarks.splice(groupSequenceId, 1);

        // SequenceId 정리
        for (let groupIndex = 0; groupIndex < this._bookmarks.length; groupIndex++) {
            this._bookmarks[groupIndex].sequenceId = groupIndex;
        }

        if (onSuccessCallback) {
            onSuccessCallback(this._bookmarks);
        }
    }

    addBookmark(groupSequenceId, onSuccessCallback) {
        this.startBookmark();

        const bookmarkGroup = this.getBookmarkGroup(groupSequenceId);
        if (bookmarkGroup === undefined) {
            return;
        }

        const bookmarkSequenceId = bookmarkGroup.bookmarks.length;

        const cameraTransform = this._DTDWeb.cameraController.getCameraTransformJSON();
        const cameraTarget = cameraTransform.cameraTarget;
        const cameraPosition = cameraTransform.cameraPosition;
        const cameraRotation = cameraTransform.cameraRotation;

        const bookmark = {
            sequenceId: bookmarkSequenceId,
            cameraTarget,
            cameraPosition,
            cameraRotation,
            animateSpeed: 0, animateDelay: 0
        };
        bookmarkGroup.bookmarks.push(bookmark);

        if (onSuccessCallback) {
            onSuccessCallback(bookmark);
        }
    }

    getBookmark(groupSequenceId, bookmarkSequenceId) {
        const bookmarkGroup = this.getBookmarkGroup(groupSequenceId);
        if (bookmarkGroup === undefined) {
            return undefined;
        }

        if (bookmarkSequenceId < 0 || bookmarkSequenceId >= bookmarkGroup.bookmarks.length) {
            console.error(`DTDWeb ERROR: Bookmark Sequence ID(${bookmarkSequenceId})를 찾을 수 없음.`);
            return undefined;
        }

        return bookmarkGroup.bookmarks[bookmarkSequenceId];
    }

    removeBookmark(groupSequenceId, bookmarkSequenceId, onSuccessCallback) {
        this.startBookmark();

        const bookmarkGroup = this.getBookmarkGroup(groupSequenceId);
        if (bookmarkGroup === undefined) {
            return;
        }

        const bookmark = this.getBookmark(groupSequenceId, bookmarkSequenceId);
        if (bookmark === undefined) {
            return;
        }

        const bookmarks = bookmarkGroup.bookmarks;
        bookmarks.splice(bookmarkSequenceId, 1);

        // SequenceId 정리
        for (let bookmarkIndex = 0; bookmarkIndex < bookmarks.length; bookmarkIndex++) {
            bookmarks[bookmarkIndex].sequenceId = bookmarkIndex;
        }

        if (onSuccessCallback) {
            onSuccessCallback(bookmarkGroup);
        }
    }

    setBookmarkAnimateSpeed(groupSequenceId, bookmarkSequenceId, animateSpeed) {
        this.startBookmark();

        const bookmarkGroup = this.getBookmarkGroup(groupSequenceId);
        if (bookmarkGroup === undefined) {
            return;
        }

        const bookmark = this.getBookmark(groupSequenceId, bookmarkSequenceId);
        if (bookmark === undefined) {
            return;
        }

        bookmark.animateSpeed = animateSpeed;
    }

    setBookmarkAnimateDelay(groupSequenceId, bookmarkSequenceId, animateDelay) {
        this.startBookmark();

        const bookmarkGroup = this.getBookmarkGroup(groupSequenceId);
        if (bookmarkGroup === undefined) {
            return;
        }

        const bookmark = this.getBookmark(groupSequenceId, bookmarkSequenceId);
        if (bookmark === undefined) {
            return;
        }

        bookmark.animateDelay = animateDelay;
    }

    playBookmarkAnimation(groupSequenceId, isReverse, isRepeat, onStateChangedCallback) {
        this.startBookmark();

        if (this._isPlayingBookmarkAnimation) {
            return;
        }

        const bookmarkGroup = this.getBookmarkGroup(groupSequenceId);
        if (bookmarkGroup === undefined) {
            return;
        }

        const bookmarks = isReverse ? [...bookmarkGroup.bookmarks].reverse() : bookmarkGroup.bookmarks;
        if (bookmarks.length === 0) {
            console.error(`DTDWeb ERROR: ${bookmarkGroup.groupTitle}(${groupSequenceId}) 그룹 북마크 없음.`);
            return;
        }

        this._isPlayingBookmarkAnimation = true;
        this._isForceStop = false;
        this._DTDWeb.cameraController.detachControl();

        let bookmarkAnimationIndex = 0;
        const bookmarkAnimation = async () => {
            if (this._isForceStop) {
                return;
            }

            if (isRepeat && bookmarkAnimationIndex === bookmarks.length) {
                bookmarkAnimationIndex = 0;
            }

            if (bookmarkAnimationIndex < bookmarks.length) {
                const bookmark = bookmarks[bookmarkAnimationIndex];
                const sequenceId = bookmark.sequenceId;
                const cameraTarget = bookmark.cameraTarget;
                const cameraPosition = bookmark.cameraPosition;
                const cameraRotation = bookmark.cameraRotation;
                const animateSpeed = (bookmark.animateSpeed === 0 ? this._globalAnimateSpeed : bookmark.animateSpeed)
                    * DTDWeb.Bookmark.ANIMATE_SPEED_OFFSET;
                const animateDelay = bookmark.animateDelay === 0 ? this._globalAnimateDelay : bookmark.animateDelay;

                if (bookmarkAnimationIndex > -1) {
                    await DTDWeb.Utility.Sleep(animateDelay * 1000);
                    if (this._isForceStop) {
                        return;
                    }
                }

                if (onStateChangedCallback) {
                    onStateChangedCallback(sequenceId, 'Start');
                }

                this._DTDWeb.cameraController.moveCameraFromJSON(
                    cameraTarget, cameraPosition, cameraRotation, animateSpeed, () => {
                        if (onStateChangedCallback) {
                            onStateChangedCallback(sequenceId, 'End');
                        }

                        bookmarkAnimationIndex += 1;
                        bookmarkAnimation();
                    });
            }
            else {
                this._isPlayingBookmarkAnimation = false;
                this._isForceStop = false;

                this._DTDWeb.cameraController.attachControl();
            }
        };

        bookmarkAnimation();
    }

    stopBookmarkAnimation() {
        this.startBookmark();

        if (!this._isPlayingBookmarkAnimation) {
            return;
        }

        this._DTDWeb.cameraController.stopMainCameraAnimation();
        this._DTDWeb.cameraController.attachControl();

        this._isPlayingBookmarkAnimation = false;
        this._isForceStop = true;
    }

    loadBookmark(bookmarks) {
        if (bookmarks === undefined) {
            return undefined;
        }

        this.stopBookmarkAnimation();

        bookmarks = typeof bookmarks === 'string' ? JSON.parse(bookmarks) : bookmarks;

        for (const bookmark of bookmarks) {
            const groupSequenceId = bookmark.sequenceId;
            const foundIndex = this._bookmarks.findIndex((bookmarkGroup) => {
                return bookmarkGroup.sequenceId === groupSequenceId;
            });

            if (foundIndex === -1) {
                this._bookmarks.push(bookmark);
            }
            else {
                this._bookmarks[foundIndex] = bookmark;
            }
        }

        return this._bookmarks;
    }
}

export { DTDWebBookmarkController };