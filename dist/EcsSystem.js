"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventAggregator_1 = require("./EventAggregator");
class EcsSystem {
    constructor(componentTypes) {
        this.componentTypes = componentTypes;
        this.id = '';
        this.isActive = true;
        this.systemEntities = [];
        this._subscribe();
    }
    setComponentTypes(componentTypes) {
        this.componentTypes = componentTypes;
    }
    setIsActive(active) {
        this.isActive = active;
        EventAggregator_1.default.publish(active ? 'onEnableSystem' : 'onDisableSystem', this.id);
    }
    getIsActive() {
        return this.isActive;
    }
    setEntities(entities) {
        this.systemEntities = [];
        this.systemEntities = entities.filter(this._isEntityForSystem.bind(this));
    }
    _isEntityForSystem(entity) {
        let isSystemEntity = this.componentTypes.some(componentType => {
            return entity.hasComponent(componentType);
        });
        if (!isSystemEntity) {
            return false;
        }
        let isAlreadyInSystem = this.systemEntities.some(systemEntity => entity.id === systemEntity.id);
        if (isAlreadyInSystem) {
            return false;
        }
        return true;
    }
    _subscribe() {
        EventAggregator_1.default.subscribe('onCreateEntity', (entity) => {
            if (this._isEntityForSystem(entity)) {
                this.systemEntities.push(entity);
            }
        });
        EventAggregator_1.default.subscribe('onRemoveEntity', (entityId) => {
            let entityIndex = this.systemEntities.findIndex((entity) => {
                return entity.id === entityId;
            });
            if (entityIndex < 0) {
                return;
            }
            this.systemEntities.splice(entityIndex, 1);
        });
    }
    __getComponentTypes() { return this.componentTypes; }
    __getSystemEntities() { return this.systemEntities; }
}
exports.EcsSystem = EcsSystem;
//# sourceMappingURL=EcsSystem.js.map