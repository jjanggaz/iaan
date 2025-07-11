import { DTDon } from './dtdon.js';

class DTDonUser {
    constructor(playerSchema) {
        this._playerSchema = playerSchema;

        this._lobbySessionId = playerSchema.playerLobbyId;

        this._name = playerSchema.playerName;
        this._nickname = playerSchema.playerNickName;
        this._company = playerSchema.companyName;
        this._deviceIndex = playerSchema.deviceName;
        this._initial = this._name ? this._name.substr(0, 1).toUpperCase() : '';
        if (!this._initial) {
            this._initial = this._nickname ? this._nickname.substr(0, 1).toUpperCase() : '';
        }

        this._personalColor = DTDon.Utility.GetRandomColor();
    }

    get playerSchema() {
        return this._playerSchema;
    }

    get lobbySessionId() {
        return this._lobbySessionId;
    }

    get name() {
        return this._name;
    }

    get nickname() {
        return this._nickname;
    }

    get company() {
        return this._company;
    }

    get deviceIndex() {
        return this._deviceIndex;
    }

    get deviceName() {
        switch (this._deviceIndex) {
            case DTDon.Colyseus.DEVICE_NAME.ADMIN:
                return 'PC';
            case DTDon.Colyseus.DEVICE_NAME.ARUSER:
                return 'Assist';
            default:
                return 'AR';
        }
    }

    get initial() {
        return this._initial;
    }

    get personalColor() {
        return this._personalColor;
    }
}

export { DTDonUser };