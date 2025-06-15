import { h, render } from "@vue/runtime-dom";

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