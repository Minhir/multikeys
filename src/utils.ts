type NodeMap<K, V, T extends "weak" | null = null> = T extends "weak"
  ? // @ts-expect-error
    WeakMap<K, V>
  : Map<K, V>;

export class Node<K, V, T extends "weak" | null = null> {
  has: boolean;
  val: V | undefined;
  next: NodeMap<K, Node<K, V, T>, T>;
  private createMap: () => NodeMap<K, Node<K, V, T>, T>;

  constructor(createMap: () => NodeMap<K, Node<K, V, T>, T>) {
    this.has = false;
    this.val = undefined;
    this.createMap = createMap;
    this.next = createMap();
  }

  set(value: V): void {
    this.has = true;
    this.val = value;
  }

  removeValue(): void {
    this.has = false;
    this.val = undefined;
  }

  new(): Node<K, V, T> {
    return new Node<K, V, T>(this.createMap);
  }

  getNode(keys: readonly K[]): Node<K, V, T> | undefined {
    let curNode: Node<K, V, T> = this;

    for (const key of keys) {
      const nextNode = curNode.next.get(key);

      if (!nextNode) {
        return;
      }

      curNode = nextNode;
    }

    return curNode;
  }

  getNodeOrCreateNew(keys: readonly K[]): Node<K, V, T> {
    let curNode: Node<K, V, T> = this;

    for (const key of keys) {
      const nextNode = curNode.next.get(key);

      if (nextNode) {
        curNode = nextNode;
        continue;
      }

      const newNode = this.new();

      curNode.next.set(key, newNode);
      curNode = newNode;
    }

    return curNode;
  }
}
