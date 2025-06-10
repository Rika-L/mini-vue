import { reactive, watch } from "@vue/reactivity";

describe("api: watch", () => {
  it("happy path", () => {
    const state = reactive({ count: 0 });
    let dummy = 0;
    watch(state, (newValue) => {
      dummy = newValue.count;
    });
    expect(dummy).toBe(0);
    state.count++;
    expect(dummy).toBe(1);
  });
});
