"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EcsStateManager = (function () {
    function EcsStateManager(ecs) {
        this.ecs = ecs;
        this.numberOfSavedStates = 10;
        this.lastEcsStates = [];
    }
    EcsStateManager.prototype.saveState = function (delta) {
        var newState = this._createStateFromEcs(delta);
        this.lastEcsStates.push(newState);
        if (this.lastEcsStates.length > this.numberOfSavedStates + 1) {
            this.lastEcsStates = this.lastEcsStates.slice(1, this.lastEcsStates.length);
        }
    };
    EcsStateManager.prototype.getState = function (stateNumber) {
        return this.lastEcsStates[this.lastEcsStates.length - stateNumber - 2];
    };
    EcsStateManager.prototype._createStateFromEcs = function (delta) {
        var state = {
            date: new Date(),
            entities: {},
            delta: delta,
        };
        var entities = this.ecs.__getEntities();
        entities.forEach(function (entity) {
            state.entities[entity.id] = JSON.parse(JSON.stringify(entity));
        });
        return state;
    };
    return EcsStateManager;
}());
exports.default = EcsStateManager;
//# sourceMappingURL=EcsStateManager.js.map