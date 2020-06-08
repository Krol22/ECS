import { ECS } from "./Ecs";
declare class EcsStateManager {
    private ecs;
    numberOfSavedStates: number;
    private lastEcsStates;
    constructor(ecs: ECS);
    saveState(delta: number): void;
    getState(stateNumber: number): Object;
    private _createStateFromEcs(delta);
}
export default EcsStateManager;
