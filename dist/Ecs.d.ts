import { EcsEntity } from './EcsEntity';
import { EcsSystem } from './EcsSystem';
export declare class ECS {
    private ecsStateManager;
    private isRunning;
    private entities;
    private systems;
    private inactiveSystems;
    private afterUpdateEvents;
    constructor(options?: any);
    update(delta: number): void;
    addEntity(newEntity: EcsEntity): string;
    removeEntity(entityId: string): void;
    addSystem(newSystem: any): any;
    removeSystem(systemId: string): void;
    _restoreFromState(stateNumber: number): void;
    private _runOrPushToAfterUpdateStack(callback, ...args);
    private _addSystem(newSystem);
    private _removeSystem(systemId);
    private _addEntity(newEntity);
    private _removeEntity(entityId);
    private _afterSystemsUpdate();
    private _nextId();
    private _subscribe();
    private _removeMarkedEntities();
    __getEntities(): EcsEntity[];
    __getSystems(): EcsSystem[];
    __getInactiveSystems(): EcsSystem[];
}
