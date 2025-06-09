import { effect, isRef, reactive, ref, toRef, toRefs, unRef } from "@vue/reactivity";


describe('ref', () => {
    it("should be reactive", () => {
    const a = ref(1);
    let dummy;
    let calls = 0;
    effect(() => {
      calls++;
      dummy = a.value;
    });
    expect(calls).toBe(1);
    expect(dummy).toBe(1);
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
    // same value should not trigger
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
  });

    it("should make nested properties reactive", () => {
    const a = ref({
      count: 1,
    });
    let dummy;
    effect(() => {
      dummy = a.value.count;
    });
    expect(dummy).toBe(1);
    a.value.count = 2;
    expect(dummy).toBe(2);
  });


    it("isRef", () => {
    const a = ref(1);
    const user = reactive({
      age: 1,
    });
    expect(isRef(a)).toBe(true);
    expect(isRef(1)).toBe(false);
    expect(isRef(user)).toBe(false);
  });

   it("unRef", () => {
    const a = ref(1);
    expect(unRef(a)).toBe(1);
    expect(unRef(1)).toBe(1);
  });

  it('toRef', () => {
    const a = reactive({count: 1})
    const count = toRef(a, 'count')
    expect(count.value).toBe(1)
    expect(isRef(count)).toBe(true)
    // set
    count.value = 2
    expect(a.count).toBe(2)
  });

  it('toRefs', () => {
    const a = reactive({count: 1})
    const {count} = toRefs(a)
    expect(count.value).toBe(1)
    expect(isRef(count)).toBe(true)
    // set
    count.value = 2
    expect(a.count).toBe(2)
  });
});