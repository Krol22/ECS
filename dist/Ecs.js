"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventAggregator_1 = require("./EventAggregator");
const EcsEntity_1 = require("./EcsEntity");
const EcsStateManager_1 = require("./EcsStateManager");
class ECS {
    constructor(options = {}) {
        this.debugging = false;
        this.isRunning = false;
        this.entities = [];
        this.systems = [];
        this.inactiveSystems = [];
        this.afterUpdateEvents = [];
        this.isPaused = false;
        this.loadedFrameOffset = 0;
        this._subscribe();
        const { debugging } = options;
        this.debugging = debugging;
        this.ecsStateManager = new EcsStateManager_1.default(this);
    }
    update(delta) {
        this.isRunning = true;
        if (this.isPaused) {
            return;
        }
        this.systems.forEach((system) => {
            system.tick(delta);
        });
        this._afterSystemsUpdate();
        this.ecsStateManager.saveState(delta);
        this._removeMarkedEntities();
    }
    addEntity(newEntity) {
        newEntity.id = this._nextId();
        this._runOrPushToAfterUpdateStack(this._addEntity, newEntity);
        return newEntity.id;
    }
    removeEntity(entityId) {
        this._runOrPushToAfterUpdateStack(this._removeEntity, entityId);
    }
    addSystem(newSystem) {
        newSystem.id = this._nextId();
        this._runOrPushToAfterUpdateStack(this._addSystem, newSystem);
        return newSystem.id;
    }
    removeSystem(systemId) {
        this._runOrPushToAfterUpdateStack(this._removeSystem, systemId);
    }
    loadNextFrame() {
        this.loadedFrameOffset = this.loadedFrameOffset === -1 ? -1 : this.loadedFrameOffset - 1;
        this._restoreFromState(this.loadedFrameOffset);
    }
    loadPrevFrame() {
        const { numberOfSavedStates } = this.ecsStateManager;
        this.loadedFrameOffset = this.loadedFrameOffset >= numberOfSavedStates
            ? this.loadedFrameOffset = numberOfSavedStates
            : this.loadedFrameOffset += 1;
        this._restoreFromState(this.loadedFrameOffset);
    }
    togglePause() {
        this.isPaused = !this.isPaused;
    }
    _restoreFromState(stateNumber) {
        this.isRunning = false;
        const state = this.ecsStateManager.getState(stateNumber);
        if (!state || !Object.keys(state.entities).length) {
            return;
        }
        this.entities = [];
        Object.keys(state.entities).forEach(key => {
            const entity = new EcsEntity_1.EcsEntity(JSON.parse(JSON.stringify(state.entities[key].components)));
            entity.id = state.entities[key].id;
            this.entities.push(entity);
        });
        this.systems.forEach(system => {
            system.setEntities(this.entities);
        });
        if (stateNumber !== -1) {
            this.systems.forEach((system) => {
                system.tick(state.delta);
            });
            this._afterSystemsUpdate();
        }
        this.isRunning = true;
    }
    _runOrPushToAfterUpdateStack(callback, ...args) {
        callback = callback.bind(this);
        if (!this.isRunning) {
            callback(...args);
        }
        else {
            this.afterUpdateEvents.push(() => callback(...args));
        }
    }
    _addSystem(newSystem) {
        this.systems.push(newSystem);
    }
    _removeSystem(systemId) {
        let systemIndex = this.systems.findIndex((system) => systemId === system.id);
        if (!systemIndex) {
            systemIndex = this.inactiveSystems.findIndex((system) => systemId === system.id);
        }
        this.systems.splice(systemIndex, 1);
    }
    _addEntity(newEntity) {
        this.entities.push(newEntity);
        EventAggregator_1.default.publish('onCreateEntity', newEntity);
    }
    _removeEntity(entityId) {
        let entityIndex = this.entities.findIndex((entity) => {
            return entity.id === entityId;
        });
        if (entityIndex < 0) {
            return;
        }
        this.entities.splice(entityIndex, 1);
        EventAggregator_1.default.publish('onRemoveEntity', entityId);
    }
    _afterSystemsUpdate() {
        this.afterUpdateEvents.forEach((callback) => {
            callback();
        });
        this.afterUpdateEvents = [];
    }
    _nextId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    _subscribe() {
        EventAggregator_1.default.subscribe('onDisableSystem', (systemId) => {
            this._runOrPushToAfterUpdateStack(() => {
                let systemIndex = this.systems.findIndex((system) => {
                    return system.id === systemId;
                });
                this.inactiveSystems.push(this.systems[systemIndex]);
                this.systems.splice(systemIndex, 1);
            });
        });
        EventAggregator_1.default.subscribe('onEnableSystem', (systemId) => {
            this._runOrPushToAfterUpdateStack(() => {
                let systemIndex = this.inactiveSystems.findIndex((system) => {
                    return system.id === systemId;
                });
                this.systems.push(this.inactiveSystems[systemIndex]);
                this.inactiveSystems.splice(systemIndex, 1);
            });
        });
    }
    _removeMarkedEntities() {
        const markedToRemoveEntities = this.entities.filter((entity) => entity.shouldBeRemoved());
        markedToRemoveEntities.forEach((entity) => {
            this.removeEntity(entity.id);
        });
    }
    __getEntities() { return this.entities; }
    __getSystems() { return this.systems; }
    __getInactiveSystems() { return this.inactiveSystems; }
}
exports.ECS = ECS;
//# sourceMappingURL=Ecs.js.map