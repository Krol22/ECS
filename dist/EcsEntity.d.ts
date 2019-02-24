import { EcsComponent } from './EcsComponent';
export declare class EcsEntity {
    id: string;
    private remove;
    private components;
    private componentTypes;
    constructor(components: EcsComponent[]);
    markForRemove(): void;
    shouldBeRemoved(): boolean;
    hasComponent(componentType: string): boolean;
    getComponent(componentType: string): EcsComponent;
}
