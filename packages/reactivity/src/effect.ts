export function effect(fn, options?) {
  // 创建一个响应式effect 数据变化后可以重新执行

  // 创建一个effect 只要依赖变化了就要执行回调
  const _effect = new ReactiveEffect(fn, () => {
    // scheduler
    _effect.run();
  });
  _effect.run();

  if (options) {
    Object.assign(_effect, options);
  }

  const runner = _effect.run.bind(_effect);
  runner.effect = _effect; // 可以在run方法上获取到effect的引用
  return runner; // 外界可以调用run
}

export let activeEffect;

function preCleanEffect(effect) {
  effect._depsLength = 0;
  effect._trackId++; // 每次执行id 都是+1 如果当前同一个effect执行 id就是相同的
}

function postCleanEffect(effect) {
  if (effect.deps.length > effect._depsLength) {
    for (let i = effect._depsLength; i < effect.deps.length; i++) {
      cleanDepEffect(effect.deps[i], effect); // 删除映射表中对应的effect
    }
    effect.deps.length = effect._depsLength; // 更新依赖列表的长度
  }
}

class ReactiveEffect {
  _trackId = 0; // 用于记录当前effect执行了几次
  deps = [];
  _depsLength = 0;
  _running = 0;
  public active = true; // 创建的effect是响应式的
  // fn是用户编写的函数
  // 如果fn中以来的数据发生变化后 需要重新调用 -> run()
  constructor(public fn, public scheduler) {}

  run() {
    // 让fn执行
    if (!this.active) {
      return this.fn();
    }

    // 保存最后的effect 并在执行完成后重新赋值
    let lastEffect = activeEffect;
    try {
      activeEffect = this;

      // effect重新执行前 需要将上一次的依赖清理掉

      preCleanEffect(this);

      this._running++;
      return this.fn(); // 依赖收集
    } finally {
      this._running--;
      postCleanEffect(this);
      activeEffect = lastEffect;
    }
  }
  stop() {
    this.active = false; // 后续实现
  }
}

// _trackId 用于记录执行次数 放置一个属性在当前effect中多次依赖收集 只收集一次
// 拿到上次的依的最后一个和这次的比较
// 相同的复用 不相同的先清理 再重新收集

function cleanDepEffect(dep, effect) {
  dep.delete(effect);
  if (dep.size === 0) {
    dep.cleanup(); // 如果map为空 则删除这个属性
  }
}

// 双向记忆
export function trackEffect(effect, dep) {
  // 需要重新去收集依赖 将不需要的移除

  if (dep.get(effect) !== effect._trackId) {
    dep.set(effect, effect._trackId); // 更新id

    let oldDep = effect.deps[effect._depsLength];
    // 如果没有存过
    if (oldDep !== dep) {
      if (oldDep) {
        // 删除老的
        cleanDepEffect(oldDep, effect);
      }
      // 换成新的
      effect.deps[effect._depsLength++] = dep;
    } else {
      effect._depsLength++;
    }
  }
  // // 让effect和dep关联
  // effect.deps[effect._depsLength++] = dep;
}

export function triggerEffects(dep) {
  for (const effect of dep.keys()) {
    if (!effect._running) { // 如果不是正在执行 才能执行
      if (effect.scheduler) {
        effect.scheduler();
      }
    }
  }
}
