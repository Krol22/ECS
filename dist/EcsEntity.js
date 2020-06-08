"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
var EcsEntity = (function () {
    function EcsEntity(components) {
        var _this = this;
        this.id = '';
        this.remove = false;
        this.components = [];
        this.componentTypes = {};
        this.components = components;
        this.components.forEach(function (component) {
            _this.componentTypes[component._type] = true;
        });
    }
    EcsEntity.prototype.markForRemove = function () {
        this.remove = true;
    };
    EcsEntity.prototype.shouldBeRemoved = function () {
        return this.remove;
    };
    EcsEntity.prototype.hasComponent = function (componentType) {
        return !!this.componentTypes[componentType];
    };
    EcsEntity.prototype.getComponent = function (componentType) {
        var component = this.components.find(function (component) {
            return component._type === componentType;
        });
        if (!component) {
            throw new Error("Entity with id: " + this.id + " doesn't have component: " + componentType);
        }
        return component;
    };
    return EcsEntity;
}());
exports.EcsEntity = EcsEntity;
//# sourceMappingURL=EcsEntity.js.map