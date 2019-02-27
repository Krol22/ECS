"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const EcsSystem_1 = require("./EcsSystem");
const Ecs_1 = require("./Ecs");
const EcsEntity_1 = require("./EcsEntity");
__export(require("./Ecs"));
__export(require("./EcsComponent"));
__export(require("./EcsEntity"));
__export(require("./EcsSystem"));
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
const testComponentType = 'TEST';
class TestSystem extends EcsSystem_1.EcsSystem {
    tick(delta) {
        this.systemEntities.forEach(entity => {
            const testComponent = entity.getComponent(testComponentType);
            testComponent.counter += 1;
            text.innerHTML = `${testComponent.counter}`;
        });
    }
}
const testComponentImpl = {
    _type: testComponentType,
    test: 'Test component name',
    counter: 0,
};
const entity = new EcsEntity_1.EcsEntity([testComponentImpl]);
const testSystem = new TestSystem([testComponentType]);
const ecs = new Ecs_1.ECS();
ecs.addEntity(entity);
ecs.addSystem(testSystem);
function loop() {
    ecs.update(0);
    setTimeout(() => {
        window.requestAnimationFrame(loop);
    }, 500);
}
loop();
//# sourceMappingURL=index.js.map