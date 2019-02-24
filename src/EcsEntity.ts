import { EcsComponent } from './EcsComponent';

interface IComponentTypes {
    [key: string]: boolean
};

export class EcsEntity {
    public id: string = '';

    private remove: boolean = false;
    private components: Array<EcsComponent> = [];
    private componentTypes: IComponentTypes = {};

    constructor(components: EcsComponent[]) {
        this.components = components;
        this.components.forEach((component: EcsComponent) => {
            this.componentTypes[component._type] = true;
        });
    }

    markForRemove(): void {
        this.remove = true;
    }

    shouldBeRemoved(): boolean {
        return this.remove;
    }

    hasComponent(componentType: string): boolean {
        return !!this.componentTypes[componentType];
    }

    getComponent(componentType: string): EcsComponent {
        let component = this.components.find((component: EcsComponent) => {
            return component._type === componentType;
        });

        if (!component) {
            throw new Error(`Entity with id: ${this.id} doesn't have component: ${componentType}`);
        }

        return component;
    }
}
