export interface WeakValueHandler<K extends object, V> {
  val?: V;
  next: WeakMap<K, this>;
}

export interface ValueHandler<K, V> {
  val?: V;
  next: Map<K, this>;
}

type Handler<K, V> = ValueHandler<K, V> | WeakValueHandler<any, V>;

export function getLastValueHandler<K, V>(
  handler: Handler<K, V>,
  keys: readonly K[],
  createHandler?: () => Handler<K, V>,
): Handler<K, V> | undefined {
  let curHandler = handler;

  for (const key of keys) {
    const nextHandler = curHandler.next.get(key);

    if (nextHandler) {
      curHandler = nextHandler;
      continue;
    }

    if (!createHandler) {
      return;
    }

    const newHandler = createHandler();

    curHandler.next.set(key, newHandler as any);
    curHandler = newHandler;
  }

  return curHandler;
}
