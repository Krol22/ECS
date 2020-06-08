"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventAggregator_1 = require("./EventAggregator");
var EcsEntity_1 = require("./EcsEntity");
var EcsStateManager_1 = require("./EcsStateManager");
var ECS = (function () {
    function ECS(options) {
        if (options === void 0) { options = {}; }
        this.isRunning = false;
        this.entities = [];
        this.systems = [];
        this.inactiveSystems = [];
        this.afterUpdateEvents = [];
        this._subscribe();
        this.ecsStateManager = new EcsStateManager_1.default(this);
    }
    ECS.prototype.update = function (delta) {
        this.isRunning = true;
        this.systems.forEach(function (system) {
            system.tick(delta);
        });
        this._afterSystemsUpdate();
        this._removeMarkedEntities();
    };
    ECS.prototype.addEntity = function (newEntity) {
        newEntity.id = this._nextId();
        this._runOrPushToAfterUpdateStack(this._addEntity, newEntity);
        return newEntity.id;
    };
    ECS.prototype.removeEntity = function (entityId) {
        this._runOrPushToAfterUpdateStack(this._removeEntity, entityId);
    };
    ECS.prototype.addSystem = function (newSystem) {
        newSystem.id = this._nextId();
        this._runOrPushToAfterUpdateStack(this._addSystem, newSystem);
        return newSystem.id;
    };
    ECS.prototype.removeSystem = function (systemId) {
        this._runOrPushToAfterUpdateStack(this._removeSystem, systemId);
    };
    ECS.prototype._restoreFromState = function (stateNumber) {
        var _this = this;
        this.isRunning = false;
        var state = this.ecsStateManager.getState(stateNumber);
        if (!state || !Object.keys(state.entities).length) {
            return;
        }
        this.entities = [];
        Object.keys(state.entities).forEach(function (key) {
            var entity = new EcsEntity_1.EcsEntity(JSON.parse(JSON.stringify(state.entities[key].components)));
            entity.id = state.entities[key].id;
            _this.entities.push(entity);
        });
        this.systems.forEach(function (system) {
            system.setEntities(_this.entities);
        });
        if (stateNumber !== -1) {
            this.systems.forEach(function (system) {
                system.tick(state.delta);
            });
            this._afterSystemsUpdate();
        }
        this.isRunning = true;
    };
    ECS.prototype._runOrPushToAfterUpdateStack = function (callback) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        callback = callback.bind(this);
        if (!this.isRunning) {
            callback.apply(void 0, args);
        }
        else {
            this.afterUpdateEvents.push(function () { return callback.apply(void 0, args); });
        }
    };
    ECS.prototype._addSystem = function (newSystem) {
        this.systems.push(newSystem);
    };
    ECS.prototype._removeSystem = function (systemId) {
        var systemIndex = this.systems.findIndex(function (system) { return systemId === system.id; });
        if (!systemIndex) {
            systemIndex = this.inactiveSystems.findIndex(function (system) { return systemId === system.id; });
        }
        this.systems.splice(systemIndex, 1);
    };
    ECS.prototype._addEntity = function (newEntity) {
        this.entities.push(newEntity);
        EventAggregator_1.default.publish('onCreateEntity', newEntity);
    };
    ECS.prototype._removeEntity = function (entityId) {
        var entityIndex = this.entities.findIndex(function (entity) {
            return entity.id === entityId;
        });
        if (entityIndex < 0) {
            return;
        }
        this.entities.splice(entityIndex, 1);
        EventAggregator_1.default.publish('onRemoveEntity', entityId);
    };
    ECS.prototype._afterSystemsUpdate = function () {
        this.afterUpdateEvents.forEach(function (callback) {
            callback();
        });
        this.afterUpdateEvents = [];
    };
    ECS.prototype._nextId = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    ECS.prototype._subscribe = function () {
        var _this = this;
        EventAggregator_1.default.subscribe('onDisableSystem', function (systemId) {
            _this._runOrPushToAfterUpdateStack(function () {
                var systemIndex = _this.systems.findIndex(function (system) {
                    return system.id === systemId;
                });
                _this.inactiveSystems.push(_this.systems[systemIndex]);
                _this.systems.splice(systemIndex, 1);
            });
        });
        EventAggregator_1.default.subscribe('onEnableSystem', function (systemId) {
            _this._runOrPushToAfterUpdateStack(function () {
                var systemIndex = _this.inactiveSystems.findIndex(function (system) {
                    return system.id === systemId;
                });
                _this.systems.push(_this.inactiveSystems[systemIndex]);
                _this.inactiveSystems.splice(systemIndex, 1);
            });
        });
    };
    ECS.prototype._removeMarkedEntities = function () {
        var _this = this;
        var markedToRemoveEntities = this.entities.filter(function (entity) { return entity.shouldBeRemoved(); });
        markedToRemoveEntities.forEach(function (entity) {
            _this.removeEntity(entity.id);
        });
    };
    ECS.prototype.__getEntities = function () { return this.entities; };
    ECS.prototype.__getSystems = function () { return this.systems; };
    ECS.prototype.__getInactiveSystems = function () { return this.inactiveSystems; };
    return ECS;
}());
exports.ECS = ECS;
//# sourceMappingURL=Ecs.js.map