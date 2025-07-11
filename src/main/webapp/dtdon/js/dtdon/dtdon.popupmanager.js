import { DTDonAddUserToGroupPopup } from './gui/popup/dtdon.addusertogrouppopup.js';

class DTDonPopupManager {
    constructor(dtdon) {
        this._DTDon = dtdon;

        this._addUserToGroupPopup = undefined;
    }

    get addUserToGroupPopup() {
        return this._addUserToGroupPopup;
    }

    createAddUserToGroupPopup() {
        this._addUserToGroupPopup = new DTDonAddUserToGroupPopup(this._DTDon);
        this._addUserToGroupPopup.createPopup();
        this._addUserToGroupPopup.hidePopup();
    }

    showAddUserToGroupPopup() {
        if (this._addUserToGroupPopup) {
            this._addUserToGroupPopup.showPopup();
        }
    }

    hideAddUserToGroupPopup() {
        if (this._addUserToGroupPopup) {
            this._addUserToGroupPopup.hidePopup();
        }
    }
}

export { DTDonPopupManager };