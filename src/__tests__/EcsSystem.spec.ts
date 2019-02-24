import { EcsSystem, EcsEntity, EcsComponent } from '../';
import EventAggregator from '../EventAggregator';

class TestSystem extends EcsSystem {
    tick () { }
}

const fakeComponent1 = new EcsComponent('test');
const fakeComponent2 = new EcsComponent('test_type');
const fakeComponent3 = new EcsComponent('test_invalid_type');

const fakeEntitiy1 = new EcsEntity([fakeComponent1, fakeComponent2]);
const fakeEntitiy2 = new EcsEntity([fakeComponent2, fakeComponent3]);
const fakeEntitiy3 = new EcsEntity([fakeComponent1, fakeComponent3]);
const fakeEntitiy4 = new EcsEntity([fakeComponent1]);

const fakeEntities = [
    fakeEntitiy1,
    fakeEntitiy2,
    fakeEntitiy3,
    fakeEntitiy4,
];

describe('EcsSystem', () => {
    it('should be defined', () => {
        expect(EcsSystem).toBeDefined();
    });

    describe('Instance', () => {
        let testInstance: TestSystem;

        beforeAll(() => {
            spyOn(EventAggregator, 'publish');
        });

        describe('setEntities', () => {
            it('should get only entities that components are type test and test_type', () => {
                testInstance = new TestSystem(['test', 'test_type']);
                testInstance.setEntities(fakeEntities);

                expect(testInstance.__getSystemEntities()).toContain(fakeEntitiy1);
            });
        });

        describe('setActive', () => {
            it('should publish onEnableSystem event when isActive is changed to true', () => {
                testInstance = new TestSystem([]);
                testInstance.setIsActive(true);

                expect(EventAggregator.publish).toHaveBeenCalledWith('onEnableSystem', jasmine.any(String));
            });

            it('should publish onDisableSystem event when isActive is changed to false', () => {
                testInstance = new TestSystem([]);
                testInstance.setIsActive(false);

                expect(EventAggregator.publish).toHaveBeenCalledWith('onDisableSystem', jasmine.any(String));
            });
        });

        describe('events', () => {
            let eventCallbacks: Object;

            beforeEach(() => {
                eventCallbacks = {};
                spyOn(EventAggregator, 'subscribe').and.callFake((eventName: string, eventCallback: Function) => {
                    eventCallbacks[eventName] = eventCallback;
                });
            });

            it('should push entity if is valid on onCreateEntity event', () => {
                let eventName = 'onCreateEntity';
                testInstance = new TestSystem(['test']);

                eventCallbacks[eventName](fakeEntitiy4);
                eventCallbacks[eventName](fakeEntitiy3);

                expect(testInstance.__getSystemEntities()).toContain(fakeEntitiy4);
                expect(testInstance.__getSystemEntities()).not.toContain(fakeEntitiy3);
            });

            it('should remove entity from systemEntities on onRemoveEntity event', () => {
                testInstance = new TestSystem(['test', 'test_type']);

                eventCallbacks['onCreateEntity'](fakeEntitiy1);
                expect(testInstance.__getSystemEntities()).toContain(fakeEntitiy1);

                eventCallbacks['onRemoveEntity'](fakeEntitiy1.id);
                expect(testInstance.__getSystemEntities().length).toBe(0);
            });
        });
    });
});
