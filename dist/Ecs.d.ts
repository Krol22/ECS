import { EcsEntity } from './EcsEntity';
import { EcsSystem } from './EcsSystem';
export declare class ECS {
    private debugging;
    private ecsStateManager;
    private isRunning;
    private entities;
    private systems;
    private inactiveSystems;
    private afterUpdateEvents;
    private isPaused;
    private loadedFrameOffset;
    constructor(options?: any);
    update(delta: number): void;
    addEntity(newEntity: EcsEntity): string;
    removeEntity(entityId: string): void;
    addSystem(newSystem: any): any;
    removeSystem(systemId: string): void;
    loadNextFrame(): void;
    loadPrevFrame(): void;
    togglePause(): void;
    _restoreFromState(stateNumber: number): void;
    private _runOrPushToAfterUpdateStack;
    private _addSystem;
    private _removeSystem;
    private _addEntity;
    private _removeEntity;
    private _afterSystemsUpdate;
    private _nextId;
    private _subscribe;
    private _removeMarkedEntities;
    __getEntities(): EcsEntity[];
    __getSystems(): EcsSystem[];
    __getInactiveSystems(): EcsSystem[];
}
