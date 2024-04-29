export class PriorityQueue<T> {
  private queue: T[];
  private comparator: (a: T, b: T) => number;

  constructor(comparator: (a: T, b: T) => number) {
    this.queue = [];
    this.comparator = comparator;
  }

  get = () => this.queue;

  enqueue = (newItem: T) => {
    let index = 0;
    while (
      this.queue[index] &&
      this.comparator(this.queue[index], newItem) >= 0
    )
      index++;
    this.queue.splice(index, 0, newItem);
  };

  dequeue = () => this.queue.splice(0, 1)?.[0];

  isEmpty = () => this.queue.length === 0;

  size = () => this.queue.length;
}
