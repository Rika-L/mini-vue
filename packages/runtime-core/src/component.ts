import { reactive } from "@vue/reactivity";
import { hasOwn, isFunction } from "@vue/shared";

export function createComponentInstance(vnode) {
  const instance = {
    data: null, // 组件的状态
    vnode, // 虚拟节点
    subTree: null, // 子树
    isMounted: false, // 是否挂载
    update: null, // 更新
    props: {},
    attrs: {},
    propsOptions: vnode.type.props, // 用户声明的属性
    component: null,
    proxy: null, // 用来代理props attrs data 让用户更方便的访问
  };

  return instance;
}

// 组件实例和原始props 初始化属性
const initProps = (instance, rawProps) => {
  const props = {};
  const attrs = {};

  const propsOptions = instance.propsOptions || {}; // 组件中定义的
  if (rawProps) {
    for (let key in rawProps) {
      // 用所有的来分裂
      const value = rawProps[key]; // value String | number 应该对props作校验
      if (key in propsOptions) {
        // propsOptions[key]
        props[key] = value;
      } else {
        attrs[key] = value;
      }
    }
  }

  instance.props = reactive(props);
  instance.attrs = attrs;
};

const publicProperty = {
  $attrs: (instance) => instance.attrs,
};

const handler = {
  get(target, key) {
    const { data, props } = target;

    if (data && hasOwn(data, key)) {
      return data[key];
    } else if (props && hasOwn(props, key)) {
      return props[key];
    }

    // 对于一些无法修改的属性 $slots $attrs $slots => instance.slots
    const getter = publicProperty[key]; // 通过不同的策略来访问对应的方法
    if (getter) {
      return getter(target);
    }
  },
  set(target, key, value) {
    const { data, props } = target;
    if (data && hasOwn(data, key)) {
      data[key] = value;
    } else if (props && hasOwn(props, key)) {
      props[key] = value;
      console.warn("props is readonly");
    }
    return true;
  },
};

export function setupComponent(instance) {
  const { vnode } = instance;
  initProps(instance, vnode.props);

  instance.proxy = new Proxy(instance, handler);

  const { data, render } = vnode.type;
  if (!isFunction(data)) return console.warn("data should be function");

  // data中可以拿到props
  instance.data = reactive(data.call(instance.proxy));

  instance.render = render;
}
