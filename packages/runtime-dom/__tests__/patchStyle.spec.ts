import patchStyle from "../src/modules/patchStyle";

describe("runtime-dom: patchStyle", () => {
  it("happy path", () => {
    const el = document.createElement("div");
    expect(el.style.color).toBe("");
    patchStyle(el, {}, { color: "red" });
    expect(el.style.color).toBe("red");
    patchStyle(el, { color: "red" }, { color: "blue" });
    expect(el.style.color).toBe("blue");
    patchStyle(el, { color: "blue" }, {});
    expect(el.style.color).toBe("");
  });
});
