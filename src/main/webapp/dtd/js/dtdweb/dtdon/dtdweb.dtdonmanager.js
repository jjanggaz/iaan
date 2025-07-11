class DTDWebDTDonManager {
    constructor(dtdWeb) {
        this._DTDWeb = dtdWeb;

        this._players = {};
    }

    addPlayer(lobbySessionId) {
        const isNeedUnfreeze = this._DTDWeb.modelManager.isActiveMeshesFrozen;
        if (isNeedUnfreeze) {
            this._DTDWeb.modelManager.unfreezeActiveMeshes();
        }

        const playerMesh = BABYLON.MeshBuilder.CreateCylinder(`player-${lobbySessionId}`, { diameterBottom: 0 });
        playerMesh.material = this._DTDWeb.modelManager.getMaterialFromRGBA(255, 0, 0, 255);
        playerMesh.renderingGroupId = 1;

        this._players[lobbySessionId] = {
            playerMesh
        }

        if (isNeedUnfreeze) {
            this._DTDWeb.modelManager.freezeActiveMeshes();
        }

        return this._players[lobbySessionId];
    }

    updatePlayerPosition(lobbySessionId, position) {
        let player = this._players[lobbySessionId];
        if (player === undefined) {
            player = this.addPlayer(lobbySessionId);
        }

        const playerMesh = player.playerMesh;
        if (playerMesh) {
            playerMesh.position.set(position.x, position.y, position.z);
        }
    }

    updatePlayerRotation(lobbySessionId, rotation) {
        const player = this._players[lobbySessionId];
        if (player === undefined) {
            return;
        }

        const playerMesh = player.playerMesh;
        if (playerMesh) {
            playerMesh.rotationQuaternion = new BABYLON.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w);
        }
    }

    removePlayer(lobbySessionId) {
        const player = this._players[lobbySessionId];
        if (player === undefined) {
            return;
        }

        const isNeedUnfreeze = this._DTDWeb.modelManager.isActiveMeshesFrozen;
        if (isNeedUnfreeze) {
            this._DTDWeb.modelManager.unfreezeActiveMeshes();
        }

        const playerMesh = player.playerMesh;
        if (playerMesh) {
            playerMesh.dispose();
            player.playerMesh = undefined;
        }

        delete this._players[lobbySessionId];

        if (isNeedUnfreeze) {
            this._DTDWeb.modelManager.freezeActiveMeshes();
        }
    }
}

export { DTDWebDTDonManager };