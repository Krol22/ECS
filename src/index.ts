import { EcsSystem } from './EcsSystem';
import { ECS } from './Ecs';
import { EcsComponent } from './EcsComponent';
import { EcsEntity } from './EcsEntity';

export * from './Ecs';
export * from './EcsComponent';
export * from './EcsEntity';
export * from './EcsSystem';

const button = document.querySelector('#button');
const toggleButton = document.querySelector('#pause-button');
const prevButton = document.querySelector('#prev-frame');
const nextButton = document.querySelector('#next-frame');

const text = document.querySelector('#text');

button.addEventListener('click', () => {
    ecs._restoreFromState(7);
});

toggleButton.addEventListener('click', () => {
    ecs.togglePause();
});

prevButton.addEventListener('click', () => {
    ecs.loadPrevFrame();
});

nextButton.addEventListener('click', () => {
    ecs.loadNextFrame();
});

interface ITestComponent extends EcsComponent {
    test: string,
    counter: number,
}

const testComponentType = 'TEST';

class TestSystem extends EcsSystem {
    tick(delta: number): void {
        this.systemEntities.forEach(entity => {
            const testComponent = entity.getComponent(testComponentType) as ITestComponent;
            testComponent.counter += 1;
            text.innerHTML = `${testComponent.counter}`;
        });
    }
}

const testComponentImpl: ITestComponent = {
    _type: testComponentType,
    test: 'Test component name',
    counter: 0,
};

const entity = new EcsEntity([ testComponentImpl ]);
const testSystem = new TestSystem([testComponentType])

const ecs = new ECS();
ecs.addEntity(entity);
ecs.addSystem(testSystem);

function loop() {
    ecs.update(0);
    setTimeout(() => {
        window.requestAnimationFrame(loop);
    }, 500);
}

loop();

