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

  it('should update children (text to text)', () => {
    const vnode1 = h("div", "hello");
    const vnode2 = h("div", "world");
    const container = document.createElement("div");
    render(vnode1, container);
    expect(container.innerHTML).toBe('<div>hello</div>');
    render(vnode2, container);
    expect(container.innerHTML).toBe('<div>world</div>');
  });

  it('should update children (text to null)', () => {
    const vnode1 = h("div", "hello");
    const vnode2 = h("div");
    const container = document.createElement("div");
    render(vnode1, container);
    expect(container.innerHTML).toBe('<div>hello</div>');
    render(vnode2, container);
    expect(container.innerHTML).toBe('<div></div>');
  });

  it('should update children (text to array)', () => {
    const vnode1 = h("div", "hello");
    const vnode2 = h("div", [h("p", "world")]);
    const container = document.createElement("div");
    render(vnode1, container);
    expect(container.innerHTML).toBe('<div>hello</div>');
    render(vnode2, container);
    expect(container.innerHTML).toBe('<div><p>world</p></div>');
  });

  it.skip('should update children (array to array)', () => {
    const vnode1 = h("div", [h("p", "hello"), h("p", "world")]);
    const vnode2 = h("div", [h("p", "hello"), h("p", "diff")]);
    const container = document.createElement("div");
    render(vnode1, container);
    expect(container.innerHTML).toBe('<div><p>hello</p><p>world</p></div>');
    render(vnode2, container);
    expect(container.innerHTML).toBe('<div><p>hello</p><p>diff</p></div>');
  });

  it('should update children (array to text)', () => {
    const vnode1 = h("div", [h("p", "hello"), h("p", "world")]);
    const vnode2 = h("div", "hello");
    const container = document.createElement("div");
    render(vnode1, container);
    expect(container.innerHTML).toBe('<div><p>hello</p><p>world</p></div>');
    render(vnode2, container);
    expect(container.innerHTML).toBe('<div>hello</div>');
  });

  it('should update children(array to null)',()=>{
    const vnode1 = h("div", [h("p", "hello"), h("p", "world")]);
    const vnode2 = h("div");
    const container = document.createElement("div");
    render(vnode1, container);
    expect(container.innerHTML).toBe('<div><p>hello</p><p>world</p></div>');
    render(vnode2, container);
    expect(container.innerHTML).toBe('<div></div>');
  })

  it('should update children(null to array)', () => {
    const vnode1 = h("div");
    const vnode2 = h("div", [h("p", "hello"), h("p", "world")]);
    const container = document.createElement("div");
    render(vnode1, container);
    expect(container.innerHTML).toBe('<div></div>');
    render(vnode2, container);
    expect(container.innerHTML).toBe('<div><p>hello</p><p>world</p></div>');
  });

  it('should update children(null to text)', () => {
    const vnode1 = h("div");
    const vnode2 = h("div", "hello");
    const container = document.createElement("div");
    render(vnode1, container);
    expect(container.innerHTML).toBe('<div></div>');
    render(vnode2, container);
    expect(container.innerHTML).toBe('<div>hello</div>');
  });

  it('should update children(null to null)', () => {
    const vnode1 = h("div");
    const vnode2 = h("div");
    const container = document.createElement("div");
    render(vnode1, container);
    expect(container.innerHTML).toBe('<div></div>');
    render(vnode2, container);
    expect(container.innerHTML).toBe('<div></div>');
  });
});
