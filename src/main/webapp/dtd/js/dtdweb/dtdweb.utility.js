class DTDWebUtility {
    static GetFileNameFromUrl(url) {
        return url.substring(url.lastIndexOf('/') + 1);
    }

    static GetFileExtension(url) {
        return url.substring(url.lastIndexOf('.') + 1);
    }

    static GetUrlFromDTDXFileName(dtdxFileName) {
        return `${window.location.protocol}//${window.location.host}${window.location.pathname}${dtdxFileName}`;
    }

    static async LoadFileFromLocal(file, isText) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            if (isText) {
                fileReader.readAsText(file);
            }
            else {
                fileReader.readAsArrayBuffer(file);
            }

            fileReader.onload = async () => {
                try {
                    resolve(fileReader.result);
                }
                catch (error) {
                    reject(error);
                }
            }
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    }

    static async LoadFileFromUrl(url, isText) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open('GET', url, true);
            if (isText) {
                request.responseType = 'text';
            }
            else {
                request.responseType = 'blob';
            }
            request.onload = () => {
                try {
                    if (request.status !== 200) {
                        resolve(undefined);
                    }

                    if (isText) {
                        resolve(request.response);
                    }
                    else {
                        const fileReader = new FileReader();
                        fileReader.readAsArrayBuffer(request.response);
                        fileReader.onload = async () => {
                            try {
                                resolve(fileReader.result);
                            }
                            catch (error) {
                                reject(error);
                            }
                        };
                        fileReader.onerror = (error) => {
                            reject(error);
                        };
                    }
                }
                catch (error) {
                    reject(error);
                }
            };
            request.send();
        });
    }

    static DeepCopy(obj) {
        if (obj === null || typeof obj !== 'object') return obj;

        if (Array.isArray(obj)) {
            return obj.map(item => DTDWebUtility.DeepCopy(item));
        }

        const copy = {};
        for (const key in obj) {
            copy[key] = DTDWebUtility.DeepCopy(obj[key]);
        }
        return copy;
    }

    static RemoveCharCode(str, charCode) {
        return str.split('').filter(char => char.charCodeAt(0) !== charCode).join('');
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

    static MultiplyInt32(n, m) {
        n |= 0;
        m |= 0;
        const nlo = n & 0xffff;
        const nhi = n - nlo;
        return ((nhi * m | 0) + (nlo * m)) | 0;
    }

    static ComputeBoundingInfo(meshArray) {
        let minimum = new BABYLON.Vector3(Infinity, Infinity, Infinity);
        let maximum = new BABYLON.Vector3(-Infinity, -Infinity, -Infinity);

        for (let meshIndex = 0; meshIndex < meshArray.length; meshIndex++) {
            const meshMinimum = meshArray[meshIndex].getBoundingInfo().boundingBox.minimumWorld;
            const meshMaximum = meshArray[meshIndex].getBoundingInfo().boundingBox.maximumWorld;

            minimum = BABYLON.Vector3.Minimize(minimum, meshMinimum);
            maximum = BABYLON.Vector3.Maximize(maximum, meshMaximum);
        }

        return new BABYLON.BoundingInfo(minimum, maximum);
    }

    static GetPlanePositionFromPointer(scene, camera, plane, pointerX, pointerY) {
        const ray = scene.createPickingRay(pointerX, pointerY, BABYLON.Matrix.Identity(), camera, false);
        const distance = ray.intersectsPlane(plane);

        return distance !== undefined ? ray.origin.addInPlace(ray.direction.scaleInPlace(distance)) : undefined;
    }

    static GetLargestAxis(vector) {
        const absX = Math.abs(vector.x);
        const absY = Math.abs(vector.y);
        const absZ = Math.abs(vector.z);

        if (absX >= absY && absX >= absZ) {
            return 'x';
        } else if (absY >= absX && absY >= absZ) {
            return 'y';
        } else {
            return 'z';
        }
    }

    static GetLargestAxisVector(vector) {
        const largestAxis = DTDWebUtility.GetLargestAxis(vector);
        if (largestAxis === 'x') {
            return new BABYLON.Vector3(vector.x > 0 ? 1 : -1, 0, 0);
        }
        else if (largestAxis === 'y') {
            return new BABYLON.Vector3(0, vector.y > 0 ? 1 : -1, 0);
        }
        else {
            return new BABYLON.Vector3(0, 0, vector.z > 0 ? 1 : -1);
        }
    }

    static NormalizeAngle(angle) {
        let normalizedAngle = angle % (2 * Math.PI);
        if (normalizedAngle < 0) {
            normalizedAngle += 2 * Math.PI;
        }

        return normalizedAngle;
    }

    static GetMillimeterFromInchString(inchString) {
        const splitString = inchString.split('/');
        const a = Number(splitString[0]);
        const b = Number(splitString[1]);

        return a / b * 25.4;
    }

    static ShowOctreeBlocks(blocks, scene) {
        for (const block of blocks) {
            if (block.blocks) {
                DTDWebUtility.ShowOctreeBlocks(block.blocks);
            }

            if (block.entries.length > 0) {
                const { minPoint, maxPoint } = block;

                let blockMesh = new BABYLON.Mesh(`${DTDWebUtility.GetUUID()}`, scene);
                blockMesh.setBoundingInfo(new BABYLON.BoundingInfo(minPoint, maxPoint));
                blockMesh.showBoundingBox = true;
            }
        }
    }

    static GroupMeshesByProximity(meshes, range) {
        const groupMeshDictionary = {};
        for (const mesh of meshes) {
            const key = `${Math.floor(mesh.position.x / range)}_${Math.floor(mesh.position.z / range)}`;
            if (groupMeshDictionary[key] === undefined) {
                groupMeshDictionary[key] = [];
            }
            groupMeshDictionary[key].push(mesh);
        }

        return groupMeshDictionary;
    }

    static IsContainsRegexPattern(regexString) {
        const regexPattern = /\/.*?\/[gimy]*/g;

        return regexPattern.test(regexString);
    }

    static GetRegExpFromRegexString(regexString) {
        const flags = regexString.replace(/.*\/([gimy]*)$/, '$1');
        const pattern = regexString.replace(new RegExp('^/(.*?)/' + flags + '$'), '$1');

        return new RegExp(pattern, flags);
    }

    static GetStringFromUint8Array(uint8Array, encoding) {
        const textDecoder = new TextDecoder(encoding);
        return textDecoder.decode(uint8Array);
    }

    static GetEncodeUnicodeBase64(originBase64) {
        return encodeURIComponent(originBase64).replace(/%([0-9A-F]{2})/g, function (match, p1) {
            return String.fromCharCode('0x' + p1);
        });
    }

    static GetNumberFromHexString(hexString) {
        return Number(`0x${hexString}`);
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

    static ConcatTypedArrayToUint8Array(arrayBufferViews) {
        let length = 0;
        for (const arrayBufferView of arrayBufferViews) {
            length += arrayBufferView.byteLength;
        }

        let uint8Array = new Uint8Array(length);
        let offset = 0;
        for (const arrayBufferView of arrayBufferViews) {
            const uint8view = new Uint8Array(arrayBufferView.buffer, arrayBufferView.byteOffset, arrayBufferView.byteLength);
            uint8Array.set(uint8view, offset);
            offset += uint8view.byteLength;
        }

        return uint8Array
    }

    static IsHex(hex) {
        hex = '0x' + hex.toLowerCase();
        return (parseInt(hex).toString(16) === hex.replace('0x', ''));
    }

    static Sleep(milliseconds) {
        return new Promise((resolve) => {
            setTimeout(resolve, milliseconds);
        });
    }

    static GetVertexDataFromMesh(mesh) {
        return BABYLON.VertexData.ExtractFromMesh(mesh.isAnInstance ? mesh.sourceMesh : mesh).clone().transform(mesh.getWorldMatrix());
    }

    static GetVertexDataFromTriangles(triangles) {
        const positions = [];
        const indices = [];
        for (const triangle of triangles) {
            for (const point of triangle) {
                positions.push(point.x, point.y, point.z);
            }

            const index = indices.length;
            indices.push(index, index + 1, index + 2);
        }

        const normals = [];
        BABYLON.VertexData.ComputeNormals(positions, indices, normals);

        const vertexData = new BABYLON.VertexData();
        vertexData.positions = positions;
        vertexData.indices = indices;
        vertexData.normals = normals;

        return vertexData;
    }

    static GetBoxVertexDataFromTriangles(triangles) {
        let minimum = new BABYLON.Vector3(Infinity, Infinity, Infinity);
        let maximum = new BABYLON.Vector3(-Infinity, -Infinity, -Infinity);

        for (const triangle of triangles) {
            for (const point of triangle) {
                minimum = BABYLON.Vector3.Minimize(minimum, point);
                maximum = BABYLON.Vector3.Maximize(maximum, point);
            }
        }

        const boundingInfo = new BABYLON.BoundingInfo(minimum, maximum);
        const minimumWorld = boundingInfo.boundingBox.minimumWorld;
        const maximumWorld = boundingInfo.boundingBox.maximumWorld;

        var vertices = [
            minimumWorld.x, minimumWorld.y, minimumWorld.z,
            maximumWorld.x, minimumWorld.y, minimumWorld.z,
            maximumWorld.x, maximumWorld.y, minimumWorld.z,
            minimumWorld.x, maximumWorld.y, minimumWorld.z,
            minimumWorld.x, minimumWorld.y, maximumWorld.z,
            maximumWorld.x, minimumWorld.y, maximumWorld.z,
            maximumWorld.x, maximumWorld.y, maximumWorld.z,
            minimumWorld.x, maximumWorld.y, maximumWorld.z
        ];

        var indices = [
            0, 1, 2,
            0, 2, 3,
            4, 6, 5,
            4, 7, 6,
            0, 5, 1,
            0, 4, 5,
            2, 6, 7,
            2, 7, 3,
            0, 3, 7,
            0, 7, 4,
            1, 5, 6,
            1, 6, 2
        ];

        const vertexData = new BABYLON.VertexData();
        vertexData.positions = vertices;
        vertexData.indices = indices;

        return vertexData;
    }

    static IntersectTriangleAabb(triangle, boundingBox) {
        let f0 = triangle[1].subtract(triangle[0]);
        let f1 = triangle[2].subtract(triangle[1]);
        let f2 = triangle[0].subtract(triangle[2]);

        let u0 = new BABYLON.Vector3(1, 0, 0);
        let u1 = new BABYLON.Vector3(0, 1, 0);
        let u2 = new BABYLON.Vector3(0, 0, 1);

        let testVectors = [
            u0, u1, u2,
            f0.cross(f1),
            u0.cross(f0), u0.cross(f1), u0.cross(f2),
            u1.cross(f0), u1.cross(f1), u1.cross(f2),
            u2.cross(f0), u2.cross(f1), u2.cross(f2)
        ];

        for (let testVector of testVectors) {
            if (!DTDWebUtility.OverlapOnAxisAabbTriangle(boundingBox, triangle, testVector)) {
                return false;
            }
        }

        return true;
    }

    static GetTriangles(mesh) {
        const matrix = mesh.getWorldMatrix();
        const indices = mesh.getIndices();
        const positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);

        let triangles = [];
        for (let index = 0; index < indices.length; index += 3) {
            const index1 = indices[index] * 3;
            const index2 = indices[index + 1] * 3;
            const index3 = indices[index + 2] * 3;

            const triangle = [
                BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(positions[index1], positions[index1 + 1], positions[index1 + 2]), matrix),
                BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(positions[index2], positions[index2 + 1], positions[index2 + 2]), matrix),
                BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(positions[index3], positions[index3 + 1], positions[index3 + 2]), matrix),
            ];

            triangles.push(triangle);
        }

        return triangles;
    }

    static GetIntersectTriangles(boundingBox, triangles) {
        let bbTriangles = [];
        for (let triangle of triangles) {
            if (DTDWebUtility.IntersectTriangleAabb(triangle, boundingBox)) {
                bbTriangles.push(triangle);
            }
        }

        return bbTriangles;
    }

    static OverlapOnAxisAabbTriangle(boundingBox, triangle, axis) {
        let aabbInt = DTDWebUtility.GetIntervalAabbAxis(boundingBox, axis);
        let triangleInt = DTDWebUtility.GetIntervalTriangleAxis(triangle, axis);
        return ((triangleInt.min <= aabbInt.max) && (aabbInt.min <= triangleInt.max));
    }

    static GetIntervalAabbAxis(boundingBox, axis) {
        let vertex = boundingBox.vectorsWorld;
        let min = BABYLON.Vector3.Dot(axis, vertex[0]);
        let max = min;
        for (let index = 1; index < 8; index++) {
            let projection = BABYLON.Vector3.Dot(axis, vertex[index]);
            min = Math.min(projection, min);
            max = Math.max(projection, max);
        }

        return { min, max };
    }

    static GetIntervalTriangleAxis(triangle, axis) {
        let min = BABYLON.Vector3.Dot(axis, triangle[0]);
        let max = min;
        for (let index = 1; index < 3; index++) {
            let val = BABYLON.Vector3.Dot(axis, triangle[index]);
            min = Math.min(min, val);
            max = Math.max(max, val);
        }

        return { min, max };
    }

    static IntersectsMesh(boundingBox1, boundingBox2, triangles1, triangles2) {
        let intersectTriangles1 = DTDWebUtility.GetIntersectTriangles(boundingBox2, triangles1);
        let intersectTriangles2 = DTDWebUtility.GetIntersectTriangles(boundingBox1, triangles2);

        if (intersectTriangles1.length === 0 || intersectTriangles2.length === 0) {
            return { intersect: false };
        }

        return { intersect: true, intersectTriangles1, intersectTriangles2 };
    }
}

String.prototype.toUtf8Array = function () {
    const utf8 = [];
    for (let i = 0; i < this.length; i++) {
        let charcode = this.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6),
                0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12),
                0x80 | ((charcode >> 6) & 0x3f),
                0x80 | (charcode & 0x3f));
        }
        else {
            i++;
            charcode = 0x10000 + (((charcode & 0x3ff) << 10)
                | (this.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >> 18),
                0x80 | ((charcode >> 12) & 0x3f),
                0x80 | ((charcode >> 6) & 0x3f),
                0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
};

String.prototype.toUtf16Array = function () {
    const buffer = new ArrayBuffer(this.length * 2);
    const bufView = new Uint16Array(buffer);
    for (let i = 0, strLen = this.length; i < strLen; i++) {
        bufView[i] = this.charCodeAt(i);
    }
    return bufView;
};

String.prototype.hashCode = function () {
    let hash1 = 5381;
    let hash2 = hash1;

    let s = this.toUtf16Array();
    while (s.length > 0) {
        let c = s[0];
        hash1 = ((hash1 << 5) + hash1) ^ c;

        if (s.length <= 1)
            break;

        c = s[1];
        hash2 = ((hash2 << 5) + hash2) ^ c;

        s = s.slice(s.length > 1 ? 2 : 1);
    }

    return new Int32Array([hash1 + DTDWebUtility.MultiplyInt32(hash2, 1566083941)])[0];
};

export { DTDWebUtility };