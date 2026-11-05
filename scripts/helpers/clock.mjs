// A small clock for media scheduling tests, independent of Node's experimental timers.
export const mockClock = (t) => {
  const tasks = new Map();
  let now = 0;
  let nextId = 0;
  t.mock.method(globalThis, 'setTimeout', (callback, delay = 0) => {
    const id = ++nextId;
    tasks.set(id, { callback, at: now + delay });
    return id;
  });
  t.mock.method(globalThis, 'clearTimeout', (id) => tasks.delete(id));
  return (duration = 100) => {
    const end = now + duration;
    while (tasks.size) {
      const [id, task] = [...tasks].sort((a, b) => a[1].at - b[1].at)[0];
      if (task.at > end) break;
      now = task.at;
      tasks.delete(id);
      task.callback();
    }
    now = end;
  };
};
