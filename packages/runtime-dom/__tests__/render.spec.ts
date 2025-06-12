import { h } from "@vue/runtime-core";
import { render } from "@vue/runtime-dom";

describe("runtime-core: render", () => {
  it("happy path", () => {
    const vnode = h("div", {}, "hi");
    const container = document.createElement("div");
    console.log(vnode)
    render(vnode, container);
    expect(container.innerHTML).toBe("<div>hi</div>");
  });

  it("should handle array children", () => {
    const vnode = h("div", [h("p", "hello"), h("p", "world")]);
    const container = document.createElement("div");
    render(vnode, container);
    expect(container.innerHTML).toBe("<div><p>hello</p><p>world</p></div>");
  });

  it.skip("should handle have string in array children", ()=>{
    const vnode = h("div", [h("p", "hello"), "world"]);
    const container = document.createElement("div");
    render(vnode, container);
    expect(container.innerHTML).toBe("<div><p>hello</p>world</div>");
  })
});
