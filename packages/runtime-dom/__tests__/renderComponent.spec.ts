import { h, render } from "@vue/runtime-dom";
import { a } from "vitest/dist/chunks/suite.d.FvehnV49";

// import {render,h} from '../../../public/vue.esm-browser.js'

describe('render: renderComponent', () => {
  it('should render component', () => {
  const VueComponent = {
    data() {
      return {
        msg: 'hello'
      }
    },
    render() {
      // this == 组件的示例
      return h('div', this.msg);
    }
  }
  const container = document.createElement('div');
  // 组件由两个虚拟节点组成 h(VueComponent) 产生的是组件的虚拟节点
  // render函数返回的虚拟节点才是最重要渲染的内容 = subTree
  render(h(VueComponent), container)
  expect(container.innerHTML).toBe('<div>hello</div>');
  });

  // 区分attrs 和 props
  // 属性 attrs(非响应式) props(响应式)
  // 在开发模式下 attrs 是响应式的
  // 在生产模式下 attrs 是非响应式的   
  it('should distinguish attrs and props', () => {
    const VueComponent = {
      props: {
        b: String
      },
      render(proxy) {
        return h("div", proxy.$attrs.a + proxy.b);
      }
    }
    const container = document.createElement('div');
    render(h(VueComponent, { a: "hello", b: "world" }), container);
    expect(container.innerHTML).toBe('<div>helloworld</div>');
  })

  it.skip('should update component', () => {
    const VueComponent = {
      data() {
        return {
          msg: 'hello'
        }
      },
      render() {
        return h('div', this.msg);
      }
    }
    // 更新组件
    const container = document.createElement('div');
    render(h(VueComponent), container);
    expect(container.innerHTML).toBe('<div>hello</div>');

    
    render(h(VueComponent), container);
    expect(container.innerHTML).toBe('<div>world</div>');

  });
});