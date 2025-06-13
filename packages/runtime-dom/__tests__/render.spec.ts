import { h } from "@vue/runtime-core";
import { render } from "@vue/runtime-dom";
// import {render,h} from '../../../public/vue.esm-browser.js'

describe("runtime-core: render", () => {
  it("happy path", () => {
    const vnode = h("div", {}, "hi");
    const container = document.createElement("div");
    render(vnode, container);
    expect(container.innerHTML).toBe("<div>hi</div>");
  });

  it("should handle array children", () => {
    const vnode = h("div", [h("p", "hello"), h("p", "world")]);
    const container = document.createElement("div");
    render(vnode, container);
    expect(container.innerHTML).toBe("<div><p>hello</p><p>world</p></div>");
  });

  it.skip("should handle have string in array children", () => {
    const vnode = h("div", [h("p", "hello"), "world"]);
    const container = document.createElement("div");
    render(vnode, container);
    expect(container.innerHTML).toBe("<div><p>hello</p>world</div>");
  });

  it("should remove el if vnode === null", () => {
    const vnode = h("div");
    const container = document.createElement("div");
    render(vnode, container);
    expect(container.innerHTML).toBe("<div></div>");
    render(null, container);
    expect(container.innerHTML).toBe("");
  });

  it("should update props", () => {
    const vnode1 = h("div", { style: { color: "red" } });
    const vnode2 = h("div", { style: { color: "blue" } });
    const container = document.createElement("div");
    render(vnode1, container);
    console.log(container.children)
    expect(container.innerHTML).toBe('<div style="color: red;"></div>');
    render(vnode2, container);
    expect(container.innerHTML).toBe('<div style="color: blue;"></div>');
  });

  it('should remove old props', () => {
    const vnode1 = h("div", { style: { color: "red" } });
    const vnode2 = h("div");
    const container = document.createElement("div");
    render(vnode1, container);
    expect(container.innerHTML).toBe('<div style="color: red;"></div>');
    render(vnode2, container);
    expect(container.innerHTML).toBe('<div></div>');
  });

  it.skip('should update children', () => {
    const vnode1 = h("div", [h("p", "hello")]);
    const vnode2 = h("div", [h("p", "world")]);
    const container = document.createElement("div");
    render(vnode1, container);
    expect(container.innerHTML).toBe('<div><p>hello</p></div>');
    render(vnode2, container);
    expect(container.innerHTML).toBe('<div><p>world</p></div>');
  });
});
