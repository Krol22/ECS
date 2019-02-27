"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
class EcsEntity {
    constructor(components) {
        this.id = '';
        this.remove = false;
        this.components = [];
        this.componentTypes = {};
        this.components = components;
        this.components.forEach((component) => {
            this.componentTypes[component._type] = true;
        });
    }
    markForRemove() {
        this.remove = true;
    }
    shouldBeRemoved() {
        return this.remove;
    }
    hasComponent(componentType) {
        return !!this.componentTypes[componentType];
    }
    getComponent(componentType) {
        let component = this.components.find((component) => {
            return component._type === componentType;
        });
        if (!component) {
            throw new Error(`Entity with id: ${this.id} doesn't have component: ${componentType}`);
        }
        return component;
    }
}
exports.EcsEntity = EcsEntity;
//# sourceMappingURL=EcsEntity.js.map