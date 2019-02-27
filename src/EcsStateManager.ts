import { ECS } from "./Ecs";

class EcsStateManager {
    public numberOfSavedStates: number = 10;
    private lastEcsStates: Object[] = [];

    constructor(private ecs: ECS) {}

    saveState(delta: number) {
        const newState = this._createStateFromEcs(delta);

        this.lastEcsStates.push(newState);

        if (this.lastEcsStates.length > this.numberOfSavedStates + 1) {
            this.lastEcsStates = this.lastEcsStates.slice(1, this.lastEcsStates.length);
        }

    }

    getState(stateNumber: number) {
        return this.lastEcsStates[this.lastEcsStates.length - stateNumber - 2];
    }

    private _createStateFromEcs(delta: number) {
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

export default EcsStateManager;