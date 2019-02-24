"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventAggregator_1 = require("./EventAggregator");
class ECS {
    constructor() {
        this.isRunning = false;
        this.entities = [];
        this.systems = [];
        this.inactiveSystems = [];
        this.afterUpdateEvents = [];
        this._subscribe();
    }
    update(delta) {
        this.isRunning = true;
        this.systems.forEach((system) => {
            system.tick(delta);
        });
        this._afterSystemsUpdate();
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