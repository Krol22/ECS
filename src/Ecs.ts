import EventAggregator from './EventAggregator';

import { EcsEntity } from './EcsEntity';
import { EcsSystem } from './EcsSystem';
import EcsStateManager from './EcsStateManager';

export class ECS {
    // private debugging: boolean = false;
    private ecsStateManager: EcsStateManager;
    private isRunning: boolean = false;

    private entities: Array<EcsEntity> = [];
    private systems: Array<EcsSystem> = [];
    private inactiveSystems: Array<EcsSystem> = [];

    private afterUpdateEvents: Array<Function> = [];

    /* Debugging properties */
    // private isPaused: boolean = false;
    // private loadedFrameOffset: number = 0;

    constructor(options: any = {}) {
        this._subscribe();

        // const { debugging } = options;
        // this.debugging = debugging;
        this.ecsStateManager = new EcsStateManager(this);
    }

    update (delta: number) {
        this.isRunning = true;

        // if (this.isPaused) {
        //     return;
        // }

        this.systems.forEach((system) => {
            system.tick(delta);
        });
        this._afterSystemsUpdate();
        // this.ecsStateManager.saveState(delta);
        this._removeMarkedEntities();
    }

    addEntity(newEntity: EcsEntity) {
        newEntity.id = this._nextId();
        this._runOrPushToAfterUpdateStack(this._addEntity, newEntity);

        return newEntity.id;
    }

    removeEntity(entityId: string) {
        this._runOrPushToAfterUpdateStack(this._removeEntity, entityId);
    }

    addSystem(newSystem: any) {
        newSystem.id = this._nextId();
        this._runOrPushToAfterUpdateStack(this._addSystem, newSystem);

        return newSystem.id;
    }

    removeSystem(systemId: string) {
        this._runOrPushToAfterUpdateStack(this._removeSystem, systemId);
    }

    /* Debugging interface */
    // loadNextFrame() {
    //     this.loadedFrameOffset = this.loadedFrameOffset === -1 ? -1 : this.loadedFrameOffset - 1;
    //     this._restoreFromState(this.loadedFrameOffset);
    // }

    // loadPrevFrame() {
    //     const { numberOfSavedStates } = this.ecsStateManager;
    //     this.loadedFrameOffset = this.loadedFrameOffset >= numberOfSavedStates
    //         ? this.loadedFrameOffset = numberOfSavedStates
    //         : this.loadedFrameOffset += 1;

    //     this._restoreFromState(this.loadedFrameOffset);
    // }

    // togglePause() {
    //     this.isPaused = !this.isPaused;
    // }

    // importStateFromJSON() { }
    // exportStateToJSON() { }

    _restoreFromState(stateNumber: number) {
        this.isRunning = false;

        // Restore state
        const state: any = this.ecsStateManager.getState(stateNumber);
        if (!state || !Object.keys(state.entities).length) {
            return;
        }

        // Restore entities,
        this.entities = [];
        Object.keys(state.entities).forEach(key => {
            const entity = new EcsEntity(JSON.parse(JSON.stringify(state.entities[key].components)));
            entity.id = state.entities[key].id;
            this.entities.push(entity);
        });
        this.systems.forEach(system => {
            system.setEntities(this.entities);
        });

        // Allow ecs to update once;
        if (stateNumber !== -1) {
            this.systems.forEach((system) => {
                system.tick(state.delta);
            });
            this._afterSystemsUpdate();
        }

        this.isRunning = true;
    }

    private _runOrPushToAfterUpdateStack(callback: Function, ...args: any[]) {
        callback = callback.bind(this);
        if (!this.isRunning) {
            callback(...args);
        } else {
            this.afterUpdateEvents.push(() => callback(...args));
        }
    }

    private _addSystem(newSystem: EcsSystem) {
        this.systems.push(newSystem);
    }

    private _removeSystem(systemId: string) {
        let systemIndex = this.systems.findIndex((system: EcsSystem) => systemId === system.id);

        if (!systemIndex) {
            systemIndex = this.inactiveSystems.findIndex((system: EcsSystem) => systemId === system.id);
        }

        this.systems.splice(systemIndex, 1);
    }

    private _addEntity(newEntity: EcsEntity) {
        this.entities.push(newEntity);
        EventAggregator.publish('onCreateEntity', newEntity);
    }

    private _removeEntity(entityId: string) {
        let entityIndex = this.entities.findIndex((entity) => {
            return entity.id === entityId;
        });

        if (entityIndex < 0) {
            return;
        }

        this.entities.splice(entityIndex, 1);
        EventAggregator.publish('onRemoveEntity', entityId);
    }

    private _afterSystemsUpdate () {
        this.afterUpdateEvents.forEach((callback) => {
            callback();
        });

        this.afterUpdateEvents = [];
    }

    private _nextId () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    private _subscribe ( ) {
        EventAggregator.subscribe('onDisableSystem', (systemId: string) => {
            this._runOrPushToAfterUpdateStack(() => {
                let systemIndex = this.systems.findIndex((system: EcsSystem) => {
                    return system.id === systemId;
                });

                this.inactiveSystems.push(this.systems[systemIndex]);
                this.systems.splice(systemIndex, 1);
            });
        });

        EventAggregator.subscribe('onEnableSystem', (systemId: string) => {
            this._runOrPushToAfterUpdateStack(() => {
                let systemIndex = this.inactiveSystems.findIndex((system: EcsSystem) => {
                    return system.id === systemId;
                });

                this.systems.push(this.inactiveSystems[systemIndex]);
                this.inactiveSystems.splice(systemIndex, 1);
            });
        });
    }

    private _removeMarkedEntities() {
        const markedToRemoveEntities = this.entities.filter((entity: EcsEntity) => entity.shouldBeRemoved());
        markedToRemoveEntities.forEach((entity: EcsEntity) => {
            this.removeEntity(entity.id);
        });
    }

    // for testing purposes
    public __getEntities (): EcsEntity[] { return this.entities; }
    public __getSystems (): EcsSystem[] { return this.systems; }
    public __getInactiveSystems (): EcsSystem[] { return this.inactiveSystems; }
}
