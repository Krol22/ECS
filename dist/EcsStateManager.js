"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EcsStateManager {
    constructor(ecs) {
        this.ecs = ecs;
        this.numberOfSavedStates = 10;
        this.lastEcsStates = [];
    }
    saveState(delta) {
        const newState = this._createStateFromEcs(delta);
        this.lastEcsStates.push(newState);
        if (this.lastEcsStates.length > this.numberOfSavedStates + 1) {
            this.lastEcsStates = this.lastEcsStates.slice(1, this.lastEcsStates.length);
        }
    }
    getState(stateNumber) {
        return this.lastEcsStates[this.lastEcsStates.length - stateNumber - 2];
    }
    _createStateFromEcs(delta) {
        let state = {
            date: new Date(),
            entities: {},
            delta,
        };
        const entities = this.ecs.__getEntities();
        entities.forEach(entity => {
            state.entities[entity.id] = JSON.parse(JSON.stringify(entity));
        });
        return state;
    }
}
exports.default = EcsStateManager;
//# sourceMappingURL=EcsStateManager.js.map