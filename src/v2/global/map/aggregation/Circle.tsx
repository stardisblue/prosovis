import { RichEventLocalised } from '../../../selectors/mask';

export const padding = 1;
const pad = padding / 2;
export type Circle = {
  id: number;
  x: number;
  y: number;
  r: number;
  n: number;
  children: Circle[];
  data?: RichEventLocalised;
};

export function circleBbox(circle: Circle) {
  return {
    minX: circle.x - circle.r - pad,
    minY: circle.y - circle.r - pad,
    maxX: circle.x + circle.r + pad,
    maxY: circle.y + circle.r + pad,
  };
}

export function circleOverlap(a: Circle, b: Circle) {
  return (a.r + b.r + padding) ** 2 - ((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}
