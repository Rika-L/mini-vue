import { reactive, ref, watch, watchEffect } from "@vue/reactivity";

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

  it("should handle ref", () => {
    const state = ref(0);
    let dummy = 0;
    watch(state, (newValue) => {
      dummy = newValue;
    });
    expect(dummy).toBe(0);
    state.value++;
    expect(dummy).toBe(1);
  });

  it("should handle function", () => {
    const state = reactive({ count: 0 });
    let dummy = 0;
    watch(
      () => state.count,
      (newValue) => {
        dummy = newValue;
      }
    );
    expect(dummy).toBe(0);
    state.count++;
    expect(dummy).toBe(1);
  });

  it("show handle immediate option", () => {
    const state = reactive({ count: 0 });
    let dummy = -1;
    watch(
      state,
      (newValue) => {
        dummy = newValue.count;
      },
      { immediate: true }
    );
    expect(dummy).toBe(0);
  });

  it("watchEffect", () => {
    const state = reactive({ count: 0 });
    let dummy = 0;
    watchEffect(() => {
      dummy = state.count;
    });
    expect(dummy).toBe(0);
    state.count++;
    expect(dummy).toBe(1);
  });

  it("stopping the watcher (effect)", () => {
    const state = reactive({ count: 0 });
    let dummy;
    const stop: any = watchEffect(() => {
      dummy = state.count;
    });
    expect(dummy).toBe(0);

    stop();
    state.count++;
    // should not update
    expect(dummy).toBe(0);
  });
});
