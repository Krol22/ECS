import { EcsEntity, EcsComponent } from '../';

describe('EcsEntity', () => {
    const fakeComponents = [
        new EcsComponent('component1'),
        new EcsComponent('component2'),
    ];

    it('should be defined', () => {
        expect(EcsEntity).toBeDefined();
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
    });

    describe('markForRemove', () => {
        it('should mark entity to for remove', () => {
            let ecsEntity = new EcsEntity(fakeComponents);

            expect(ecsEntity.shouldBeRemoved()).toBe(false);
        });
    });

});

