import { EcsEntity } from './EcsEntity';
export declare abstract class EcsSystem {
    private componentTypes;
    id: string;
    private isActive;
    protected systemEntities: Array<EcsEntity>;
    abstract tick(delta: number): void;
    constructor(componentTypes: Array<string>);
    setComponentTypes(componentTypes: Array<string>): void;
    setIsActive(active: boolean): void;
    getIsActive(): boolean;
    setEntities(entities: Array<EcsEntity>): void;
    private _isEntityForSystem(entity);
    private _subscribe();
    __getComponentTypes(): string[];
    __getSystemEntities(): EcsEntity[];
}
