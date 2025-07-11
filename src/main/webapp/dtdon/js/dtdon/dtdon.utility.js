class DTDonUtility {
    static GetRandomColor() {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);

        return `rgb(${r}, ${g}, ${b})`;
    }

    static GetUUID() {
        if (!crypto.randomUUID) {
            crypto.randomUUID = () => {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                    const r = Math.random() * 16 | 0;
                    const v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            };
        }

        return crypto.randomUUID();
    }

    // 유니코드 대응
    static GetBase64FromString(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
            return String.fromCharCode('0x' + p1);
        }));
    }

    static GetBase64FromBlob(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onloadend = () => {
                const base64String = reader.result.replace(/^data:.+;base64,/, '');
                resolve(base64String);
            };

            reader.onerror = (error) => {
                reject(error);
            };

            reader.readAsDataURL(blob);
        });
    }

    static GetBlobFromBase64(base64, mimeType) {
        const cleanedBase64 = base64.replace(/^data:[a-zA-Z]+\/[a-zA-Z]+;base64,/, '');

        try {
            const byteCharacters = atob(cleanedBase64);
            const byteNumbers = new Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            return new Blob([byteArray], { type: mimeType });
        } catch (error) {
            return undefined;
        }
    }

    static GetDataUrlFromBase64(base64String) {
        return `data:image/jpeg;base64,${base64String}`;
    }

    static GetFileExtension(fileName) {
        const index = fileName.lastIndexOf('.');
        return index !== -1 ? fileName.substring(index + 1) : '';
    }

    static GetFormattedNowDateTime(format) {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');

        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return format.replace('yyyy', year).replace('MM', month).replace('dd', day).
            replace('HH', hours).replace('mm', minutes).replace('ss', seconds);
    }
}

export { DTDonUtility };