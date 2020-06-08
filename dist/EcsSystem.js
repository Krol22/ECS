"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventAggregator_1 = require("./EventAggregator");
var EcsSystem = (function () {
    function EcsSystem(componentTypes) {
        this.componentTypes = componentTypes;
        this.id = '';
        this.isActive = true;
        this.systemEntities = [];
        this._subscribe();
    }
    EcsSystem.prototype.setComponentTypes = function (componentTypes) {
        this.componentTypes = componentTypes;
    };
    EcsSystem.prototype.setIsActive = function (active) {
        this.isActive = active;
        EventAggregator_1.default.publish(active ? 'onEnableSystem' : 'onDisableSystem', this.id);
    };
    EcsSystem.prototype.getIsActive = function () {
        return this.isActive;
    };
    EcsSystem.prototype.setEntities = function (entities) {
        this.systemEntities = [];
        this.systemEntities = entities.filter(this._isEntityForSystem.bind(this));
    };
    EcsSystem.prototype._isEntityForSystem = function (entity) {
        var isSystemEntity = this.componentTypes.some(function (componentType) {
            return entity.hasComponent(componentType);
        });
        if (!isSystemEntity) {
            return false;
        }
        var isAlreadyInSystem = this.systemEntities.some(function (systemEntity) { return entity.id === systemEntity.id; });
        if (isAlreadyInSystem) {
            return false;
        }
        return true;
    };
    EcsSystem.prototype._subscribe = function () {
        var _this = this;
        EventAggregator_1.default.subscribe('onCreateEntity', function (entity) {
            if (_this._isEntityForSystem(entity)) {
                _this.systemEntities.push(entity);
            }
        });
        EventAggregator_1.default.subscribe('onRemoveEntity', function (entityId) {
            var entityIndex = _this.systemEntities.findIndex(function (entity) {
                return entity.id === entityId;
            });
            if (entityIndex < 0) {
                return;
            }
            _this.systemEntities.splice(entityIndex, 1);
        });
    };
    EcsSystem.prototype.__getComponentTypes = function () { return this.componentTypes; };
    EcsSystem.prototype.__getSystemEntities = function () { return this.systemEntities; };
    return EcsSystem;
}());
exports.EcsSystem = EcsSystem;
//# sourceMappingURL=EcsSystem.js.map