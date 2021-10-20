import RBush from 'rbush';
import { Circle, circleBbox } from './Circle';

export type Ref<T> = { v: T };

export class RefCircleRbush<T extends Circle = Circle> extends RBush<Ref<T>> {
  toBBox(item: Ref<T>) {
    return circleBbox(item.v);
  }

  compareMinX(a: Ref<T>, b: Ref<T>) {
    return a.v.x - a.v.r - (b.v.x - b.v.r);
  }

  compareMinY(a: Ref<T>, b: Ref<T>) {
    return a.v.y - a.v.r - (b.v.y - b.v.r);
  }
}
