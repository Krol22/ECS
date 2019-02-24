import { ECS } from './ECS';

export * from './Ecs';
export * from './EcsComponent';
export * from './EcsEntity';
export * from './EcsSystem';

let ecs = new ECS();

console.log(ecs);