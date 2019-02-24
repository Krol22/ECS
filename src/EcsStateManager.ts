import { ECS } from "./Ecs";

interface IAppState {
    date: Date,
    entities: Object,
}

class EcsStateManager {
    public numberOfSavedStates: number = 3;
    private lastEcsStates: Object[] = [];

    constructor(private ecs: ECS) {}

    saveState() {
        const newState = this._createStateFromEcs();

        this.lastEcsStates.push(newState);

        if (this.lastEcsStates.length > this.numberOfSavedStates) {
            this.lastEcsStates.splice(1, this.lastEcsStates.length);
        }

        console.log(this.lastEcsStates);
        debugger;
    }

    private _createStateFromEcs() {
        let state = {
            date: new Date(),
            entities: {},
        };
        const entities = this.ecs.__getEntities();
        entities.forEach(entity => {
            state.entities[entity.id] = entity;
        });

        return state;
    }
}

export default EcsStateManager;