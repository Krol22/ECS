# Paula

Paula is a Entity Component System written in TypeScript.

## Installation

Use the npm repository to install paula.

```bash
npm install @krol22/paula
```

## Basic usage

```javascript
import { ECS, EcsSystem, EcsEntity } from '@krol22/paula';

const iterationType = 'ITERATION';

// Define your system
class IteratingSystem extends EcsSystem {
    tick(delta) {
        this.systemEntites.forEach((iterationEntity) => {
            const iterationComponent = entity.getComponent(iterationType);

            iterationComponent.value += 1;
        });
    }
}

const iteratingSystem = new IteratingSystem([iterationType]);

