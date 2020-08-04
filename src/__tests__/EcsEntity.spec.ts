import { EcsEntity, EcsComponent } from '../';

describe('EcsEntity', () => {
    const fakeComponents = [
        new EcsComponent('component1'),
        new EcsComponent('component2'),
    ];

    it('should be defined', () => {
        expect(EcsEntity).toBeDefined();
    });

    describe('constructor', () => {
        it ('should inject entity reference to each component method', () => {
            class FakeComponent extends EcsComponent {
                constructor() {
                    super('FAKE');
                }

                testMethod(entity?: EcsEntity) {
                    return entity;
                }
            }

            const fakeComponent = new FakeComponent();
            const ecsEntity: EcsEntity = new EcsEntity([fakeComponent]);
            const fakeComponentInstance = ecsEntity.getComponent('FAKE') as FakeComponent;
            const result = fakeComponentInstance.testMethod() as any;

            expect(result).toBe(ecsEntity);
        });
    });

    describe('hasComponent', () => {
        it('should return true if entity has component with provided type', () => {
            let ecsEntity = new EcsEntity(fakeComponents);

            expect(ecsEntity.hasComponent('component1')).toBe(true);
        });

        it('should return false if entity doesn\'t have component with provided type', () => {
            let ecsEntity = new EcsEntity(fakeComponents);

            expect(ecsEntity.hasComponent('component3')).toBe(false);
        });
    });

    describe('getComponent', () => {
        it('should return component from entity', () => {
            let ecsEntity = new EcsEntity(fakeComponents);

            expect(Object.assign({}, ecsEntity.getComponent('component1'))).toEqual({ _type: 'component1', });
        });

        it('should throw an error when entity doesn\'t have component', () => {
            let ecsEntity = new EcsEntity(fakeComponents);
            ecsEntity.id = 'testId';

            expect(() => { ecsEntity.getComponent('no-component'); }).toThrowError('Entity with id: testId doesn\'t have component: no-component');
        });

        it('should return array of components of same type if there is more than one', () => {
            const ecsEntity = new EcsEntity([fakeComponents[0], fakeComponents[0]]);

            const components = ecsEntity.getComponent('component1') as EcsComponent[];
            expect(components.length).toBe(2);

            expect(components[0]._type).toBe('component1');
        });
    });

    describe('markForRemove', () => {
        it('should mark entity to for remove', () => {
            let ecsEntity = new EcsEntity(fakeComponents);

            expect(ecsEntity.shouldBeRemoved()).toBe(false);
        });
    });

});

