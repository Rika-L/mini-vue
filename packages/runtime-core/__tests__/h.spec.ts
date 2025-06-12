import { h } from "@vue/runtime-core";
import { ShapeFlags } from "@vue/shared";

describe("runtime-core: h", () => {
  it("should create an object with __v_isVnode", () => {
    const vnode = h("div");
    expect(vnode["__v_isVnode"]).toBe(true);
  });

  it("should generate true shapeFlag", () => {
    const vnode1 = h("div");
    expect(vnode1.shapeFlag).toBe(ShapeFlags.ELEMENT);
    const vnode2 = h("div", {}, [1, 2]);
    expect(vnode2.shapeFlag).toBe(
      ShapeFlags.ELEMENT | ShapeFlags.ARRAY_CHILDREN
    );
    const vnode3 = h('div',{},"hello")
    expect(vnode3.shapeFlag).toBe(ShapeFlags.ELEMENT | ShapeFlags.TEXT_CHILDREN)
  });

  it('should handle two args with props', () => {
    const vnode = h('div',{style:"red"})
    expect(vnode.props.style).toBe("red")    
  });

  it('should handle two args with children', () => {
    const vnode2 = h('div','hello')
   const vnode1 = h('div', vnode2)
   expect(vnode1.children).include(vnode2) 
  });

  it('should handle args more then 3', () => {
    const vnode = h('div',{},"a","b")
    expect(vnode.children).include("a")
    expect(vnode.children).include("b")
  });
});
