import { EcsComponent } from './EcsComponent';

interface IComponentTypes {
    [key: string]: boolean
};

const injectEntityReference = (entity: EcsEntity, component: any) => {
    Object
        .getOwnPropertyNames(component.__proto__)
        .filter((methodName: string) => methodName !== 'constructor')
        .filter((method: string) => {
            return typeof component[method] === 'function';
        })
        .forEach((method: string) => {
            console.log(method);
            component[method] = component[method].bind(entity);
        });

};

export class EcsEntity {
    public id: string = '';

    private remove: boolean = false;
    private components: Array<EcsComponent> = [];
    private componentTypes: IComponentTypes = {};

    constructor(components: EcsComponent[]) {
        this.components = components;
        this.components.forEach((component: any) => {
            this.componentTypes[component._type] = true;

            injectEntityReference(this, component);
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
