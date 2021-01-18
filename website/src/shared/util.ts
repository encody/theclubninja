export function bound(min: number, x: number, max: number): number {
  return Math.min(max, Math.max(x, min));
}

export function multiple(x: number, factor: number) {
  return Math.floor(x / factor) * factor;
}

interface Orderable {
  order: number;
}

export function orderable(a: Orderable, b: Orderable) {
  return a.order - b.order;
}
