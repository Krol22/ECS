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
            component[method] = component[method].bind(component, entity);
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

    getComponent(componentType: string): EcsComponent | EcsComponent[] {
        let component = this.components.filter((component: EcsComponent) => {
            return component._type === componentType;
        });

        if (!component.length) {
            throw new Error(`Entity with id: ${this.id} doesn't have component: ${componentType}`);
        }

        if (component.length === 1) {
            return component[0];
        }

        return component;
    }
}
