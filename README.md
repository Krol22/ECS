# ECS 

ECS is a Entity Component System written in TypeScript for developing small JS games.

## Installation

Use the npm repository to install ecs.

```bash
npm install @krol22/ecs
```

## Basic usage

First create component class that will extend EcsComponent with some data that you would like to use in your systems. 

I will create DrawComponent that will be responsible for keeping necessary data for rendering object on canvas.

```javascript
import { EcsComponent } from '@krol22/ecs';

export default class DrawComponent extends EcsComponent {
  constructor(x, y, imageUrl) {
    super('DRAW'); // You need to set component type in order to find it in your entities.
    
    this.x = x;
    this.y = y;
    this.image = imageUrl;
  }
}
```

Next you need to implement system that will be responsible for rendering our object based on DrawComponent data.

```javascript
import { EcsSystem } from '@krol22/ecs';

export default class DrawSystem extends EcsSystem {
  constructor(graphicsManager) {
    super(['DRAW']) // Only entities with component 'DRAW' will be in systemEntities property. This is auto populated when entity is added to ECS,
    
    this.graphicsManager = graphicsManager;
  }
  
  tick(delta) {
    this.systemEntities.forEach(entity => {
      const drawComponent = entity.getComponent('DRAW');
      const { x, y, imageUrl } = drawComponent;
      
      this.graphicsManager.draw(x, y, imageUrl);
    });
  }
}
```

Then you need to create actuall ECS instance and add your entities.

```javascript
import { ECS, EcsEntity } from '@krol22/ecs';

import DrawSystem from './draw.system';
import DrawComponent from './draw.component';

const graphicsManager = {
  draw: () => { /* TODO implement me */ }
};

const ecs = new ECS;

const initialize = () => {
  const drawSystem = new DrawSystem(graphicsManager);
 	
  // IMPORTANT - you need to add all systems to ecs before entites, if you change order `systemEntities` property will not be correctly populated
  ecs.addSystem(drawSystem);
  
  const player = new EcsEntity([
    new DrawComponent(0, 0, './assets/player.png'),
  ]);
  
  ecs.addEntity(player);
}

const loop = () => {
  ecs.update();
  window.requestAnimationFrame(loop);
};

initialize();
loop();

```

Done!