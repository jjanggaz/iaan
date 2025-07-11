class DTDonRTCSignaler {
    constructor() {
        this._signalWebSocket = undefined;

        this._onConnected = undefined;
        this._onDisconnected = undefined;
        this._onProduce = undefined;
        this._onConsume = undefined;
        this._onProcessConsume = undefined;
        this._onError = undefined;

        this._peerConnection = undefined;
    }

    connect(signalServerHost, roomId) {
        this._signalWebSocket = new WebSocket(signalServerHost);

        this._signalWebSocket.onopen = () => {
            this.sendPacket('connect', roomId);
        };

        this._signalWebSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.resultFrom && data.resultMessage) {
                this.onReceivedResultMessage(data.resultFrom, data.resultMessage);
            }
        };

        this._signalWebSocket.onclose = () => {
            console.log('DTDonRTCSignaler WebSocket closed.');
        };

        this._signalWebSocket.onerror = (error) => {
            if (this._onError) {
                this._onError(error);
            }
        };
    }

    disconnect() {
        this.sendPacket('disconnect', '');

        if (this._peerConnection) {
            this._peerConnection.close();
            this._peerConnection = undefined;
        }

        if (this._signalWebSocket && this._signalWebSocket.OPEN) {
            this._signalWebSocket.close();
            this._signalWebSocket = undefined;
        }
    }

    produce(streamId, offer) {
        this.sendPacket('produce', JSON.stringify({
            streamId,
            offer
        }));
    }

    consume(streamId) {
        this.sendPacket('consume', streamId);
    }

    processConsume(streamId, answer) {
        this.sendPacket('processConsume', JSON.stringify({
            streamId,
            answer
        }));
    }

    sendPacket(eventName, message) {
        if (this._signalWebSocket === undefined) {
            console.error('ERROR: Signal Server가 연결되지 않았습니다.');
            return;
        }

        this._signalWebSocket.send(JSON.stringify({
            eventName,
            message
        }));
    }

    onReceivedResultMessage(resultFrom, resultMessage) {
        console.log('DTDonRTCSignaler From: ', resultFrom);
        console.log('DTDonRTCSignaler Message: ', resultMessage);

        if (resultMessage['error']) {
            if (this._onError) {
                this._onError(resultMessage['error']);
            }
            return;
        }

        switch (resultFrom) {
            case 'connect':
                if (this._onConnected) {
                    this._onConnected();
                }
                return;
            case 'disconnect':
                if (this._onDisconnected) {
                    this._onDisconnected();
                }
                return;
            case 'produce':
                if (this._onProduce) {
                    this._onProduce(resultMessage['answer']);
                }
                return;
            case 'consume':
                if (this._onConsume) {
                    this._onConsume(resultMessage['offer']);
                }
                return;
            case 'processConsume':
                if (this._onProcessConsume) {
                    this._onProcessConsume();
                }
                return;
        }

    }
}

export { DTDonRTCSignaler };