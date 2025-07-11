import { DTDWeb } from './dtdweb.js';

class DTDWebWalkModeViewController {
    constructor(dtdWeb) {
        this._DTDWeb = dtdWeb;
        this._engine = dtdWeb.engine;
        this._scene = dtdWeb.scene;

        this._firstPersonMesh = undefined;

        this._characterImportResult = undefined;
        this._characterMesh = undefined;
        this._characterAnimationGroupsArray = undefined;
        this._currentCharacterAnimationType = DTDWeb.Camera.DTD_CHARACTER_ANIMATION_TYPE.IDLE;
        this._beforeCharacterPosition = BABYLON.Vector3.Zero();

        this._direction = undefined;
        this._velocity = undefined;

        this._ray = undefined;
        this._rayHelper = undefined;

        this._onObject = false;

        this._onBeforeRenderObservable = undefined;
        this._isStopBeforeRender = false;

        this._mouseMovementX = 0;
        this._mouseMovementY = 0;
    }

    get firstPersonMesh() {
        return this._firstPersonMesh;
    }

    get isStopBeforeRender() {
        return this._isStopBeforeRender;
    }

    set isStopBeforeRender(isStopBeforeRender) {
        this._isStopBeforeRender = isStopBeforeRender;
    }

    createFirstPersonFromCameraPosition() {
        const direction = this._DTDWeb.cameraController.mainCamera.getDirection(new BABYLON.Vector3.Down());
        const ray = new BABYLON.Ray(this._DTDWeb.cameraController.mainCamera.globalPosition, direction);
        const raycastHits = this._scene.multiPickWithRay(ray);
        for (const raycastHit of raycastHits) {
            if (raycastHit.pickedMesh.name === 'WalkModeGround') {
                this.createFirstPerson(raycastHit.pickedPoint, false);
                return;
            }
        }
    }

    createFirstPerson(spawnPosition, isNeedAnimate) {
        this.releaseFirstPerson();

        if (!this._firstPersonMesh) {
            this._firstPersonMesh = BABYLON.MeshBuilder.CreateBox('FirstPersonMesh', { width: 1, height: 1, depth: 1 }, this._scene);
            this._firstPersonMesh.visibility = 0;
            this._firstPersonMesh.isPickable = false;
            this._firstPersonMesh.checkCollisions = true;
        }

        this._firstPersonMesh.position.set(spawnPosition.x, spawnPosition.y + 1, spawnPosition.z);

        this._direction = BABYLON.Vector3.Zero();
        this._velocity = BABYLON.Vector3.Zero();

        this._ray = new BABYLON.Ray();
        this._rayHelper = new BABYLON.RayHelper(this._ray);
        this._rayHelper.attachToMesh(this._firstPersonMesh, new BABYLON.Vector3(0, -1, 0), new BABYLON.Vector3(0, -1, 0), 0.1);

        this._onObject = false;

        this._isStopBeforeRender = false;

        this._DTDWeb.cameraController.setFirstPersonCameraView(true, isNeedAnimate);

        this._onBeforeRenderObservable = this._scene.onBeforeRenderObservable.add(() => {
            if (this._isStopBeforeRender || this._DTDWeb.cameraController.isMainCameraAnimating) {
                return;
            }

            this.moveFromKeyboard(this._DTDWeb.cameraController.cameraAlphaForThirdPersonMode, this._engine.getDeltaTime());
        });
    }

    async createCharacter() {
        this._characterImportResult = await BABYLON.SceneLoader.ImportMeshAsync('', `${DTDPlayer.GLTF_DIRECTORY}/`, 'DTDCharacter.glb', this._scene);

        this._characterMesh = this._characterImportResult.meshes[0];
        this._characterMesh.skeleton = this._characterImportResult.skeletons[0];
        this._characterAnimationGroupsArray = this._characterImportResult.animationGroups;
        this._characterAnimationGroupsArray[DTDWeb.Camera.DTD_CHARACTER_ANIMATION_TYPE.IDLE].play(true);
        this._currentCharacterAnimationType = DTDWeb.Camera.DTD_CHARACTER_ANIMATION_TYPE.IDLE;

        const characterChildMeshes = this._characterMesh.getChildMeshes();

        this._characterMesh.setBoundingInfo(DTDWeb.Utility.ComputeBoundingInfo(characterChildMeshes));

        this._characterMesh.parent = this._firstPersonMesh;
        this._characterMesh.position.y -= this._characterMesh.getBoundingInfo().boundingBox.centerWorld.y;
        this._characterMesh.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
        this._characterMesh.checkCollisions = true;
        this._characterMesh.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5);
        this._characterMesh.ellipsoidOffset = new BABYLON.Vector3(0, 1, 0);
    }

    releaseFirstPerson() {
        if (this._onBeforeRenderObservable) {
            this._scene.onBeforeRenderObservable.remove(this._onBeforeRenderObservable);
            this._onBeforeRenderObservable = undefined;
        }

        if (this._characterImportResult) {
            this.releaseCharacter();
        }

        if (this._rayHelper) {
            this._rayHelper.dispose();
            this._rayHelper = undefined;
        }

        if (this._firstPersonMesh) {
            if (this._firstPersonMesh.actionManager) {
                this._firstPersonMesh.actionManager.dispose();
                this._firstPersonMesh.actionManager = undefined;
            }

            this._firstPersonMesh.dispose();
            this._firstPersonMesh = undefined;
        }
    }

    releaseCharacter() {
        if (this._characterImportResult) {
            for (const characterMesh of this._characterImportResult.meshes) {
                characterMesh.dispose(true, true);
            }
            this._characterImportResult.meshes.length = 0;

            for (const characterSkeleton of this._characterImportResult.skeletons) {
                characterSkeleton.dispose();
            }
            this._characterImportResult.skeletons.length = 0;

            for (const characterAnimationGroup of this._characterImportResult.animationGroups) {
                characterAnimationGroup.dispose();
            }
            this._characterImportResult.animationGroups.length = 0;

            for (const characterGeometry of this._characterImportResult.geometries) {
                characterGeometry.dispose();
            }
            this._characterImportResult.geometries.length = 0;

            this._characterImportResult = undefined;
        }

        this._characterMesh = undefined;
        this._characterAnimationGroupsArray = undefined;
        this._currentCharacterAnimationType = DTDWeb.Camera.DTD_CHARACTER_ANIMATION_TYPE.NONE;

        if (this.dtdCharacterBoundingBox) {
            this.dtdCharacterBoundingBox.dispose();
            this.dtdCharacterBoundingBox = undefined;
        }
    }

    moveFromKeyboard(cameraAlpha, deltaTime) {
        const isRun = this._DTDWeb.inputController.getKeyStatus('16'); // Shift
        const isJump = this._DTDWeb.inputController.getKeyStatus('32'); // Space
        const isRotationLeft = this._DTDWeb.inputController.getKeyStatus('81'); // Q
        const isRotationRight = this._DTDWeb.inputController.getKeyStatus('69'); // E
        const isMoveForward = this._DTDWeb.inputController.getKeyStatus('87'); // W
        const isMoveBackward = this._DTDWeb.inputController.getKeyStatus('83'); // A
        const isMoveLeft = this._DTDWeb.inputController.getKeyStatus('65'); // S
        const isMoveRight = this._DTDWeb.inputController.getKeyStatus('68'); // D

        const isMove = isMoveForward || isMoveBackward || isMoveLeft || isMoveRight;

        const cameraTargetOffset = new BABYLON.Vector3(this._characterMesh ? 5 : 0, DTDWeb.Camera.THIRD_PERSON_CAMERA_POSITION_OFFSET_Y, 0);
        this._DTDWeb.cameraController.mainCamera.target.copyFrom(this._firstPersonMesh.position.add(cameraTargetOffset));

        if (!this._DTDWeb.inputController.isMouseRotation) {
            if (isRotationLeft) {
                this._DTDWeb.cameraController.mainCamera.alpha = BABYLON.Scalar.Lerp(this._DTDWeb.cameraController.mainCamera.alpha, this._DTDWeb.cameraController.mainCamera.alpha + DTDWeb.Camera.THIRD_PERSON_CAMERA_ROTATION_SPEED, deltaTime);
            }
            if (isRotationRight) {
                this._DTDWeb.cameraController.mainCamera.alpha = BABYLON.Scalar.Lerp(this._DTDWeb.cameraController.mainCamera.alpha, this._DTDWeb.cameraController.mainCamera.alpha - DTDWeb.Camera.THIRD_PERSON_CAMERA_ROTATION_SPEED, deltaTime);
            }
        }

        const pick = this._scene.pickWithRay(this._ray);
        if (pick) {
            this._onObject = pick.hit;
        }

        const viewAngleY = 2 * Math.PI - cameraAlpha;

        if (this._characterMesh) {
            this._characterMesh.setParent(undefined);
            this._characterMesh.rotation.y = viewAngleY - Math.PI / 2;
        }

        this._firstPersonMesh.rotation.y = viewAngleY;

        this._direction.x = -(Number(isMoveForward) - Number(isMoveBackward));
        this._direction.z = Number(isMoveRight) - Number(isMoveLeft);
        this._direction.normalize();

        this._velocity.x = 0;
        if (isMoveForward || isMoveBackward) {
            this._velocity.x = this._direction.x * deltaTime / (isRun ? 150 : 300);
        }

        this._velocity.y -= deltaTime / 3000;
        if (this._onObject) {
            this._velocity.y = Math.max(0, this._velocity.y);
        }

        this._velocity.z = 0;
        if (isMoveLeft || isMoveRight) {
            this._velocity.z = this._direction.z * deltaTime / (isRun ? 150 : 300);
        }

        if (isJump && this._onObject) {
            this._velocity.y = 0.1;
            this._onObject = false;
        }

        const rotationAxis = BABYLON.Matrix.RotationAxis(BABYLON.Axis.Y, viewAngleY);
        const rotatedVelocity = BABYLON.Vector3.TransformCoordinates(this._velocity, rotationAxis);

        if (this._characterMesh) {
            let dtdCharacterAnimationType = DTDWeb.Camera.DTD_CHARACTER_ANIMATION_TYPE.NONE;

            if (isRun) {
                dtdCharacterAnimationType = DTDWeb.Camera.DTD_CHARACTER_ANIMATION_TYPE.RUN;
            }
            else if (isMove) {
                dtdCharacterAnimationType = DTDWeb.Camera.DTD_CHARACTER_ANIMATION_TYPE.WALK;
            }
            else {
                dtdCharacterAnimationType = DTDWeb.Camera.DTD_CHARACTER_ANIMATION_TYPE.IDLE;
            }

            if (this._currentCharacterAnimationType !== dtdCharacterAnimationType) {
                this._characterAnimationGroupsArray[this._currentCharacterAnimationType].stop();
                this._characterAnimationGroupsArray[dtdCharacterAnimationType].play(true);
                this._currentCharacterAnimationType = dtdCharacterAnimationType;
            }

            this._beforeCharacterPosition.copyFrom(this._characterMesh.position);

            if (isRun) {
                this._characterMesh.position.addInPlace(rotatedVelocity);
            }
            else {
                this._characterMesh.moveWithCollisions(rotatedVelocity);
            }

            const diffrentCharacterPosition = this._characterMesh.position.subtract(this._beforeCharacterPosition);

            this._firstPersonMesh.position.addInPlace(diffrentCharacterPosition);
            this._characterMesh.setParent(this._firstPersonMesh);
        }
        else {
            this._firstPersonMesh.moveWithCollisions(rotatedVelocity);
        }
    }

    updateMouseMovement(event) {
        this._mouseMovementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        this._mouseMovementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        this._DTDWeb.cameraController.mainCamera.alpha -= this._mouseMovementX * this._engine.getDeltaTime() * 0.00005;
        this._DTDWeb.cameraController.mainCamera.beta -= this._mouseMovementY * this._engine.getDeltaTime() * 0.00005;
    }
}

export { DTDWebWalkModeViewController };