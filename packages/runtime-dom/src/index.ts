export * from "@vue/reactivity";

import { nodeOps } from "./nodeOps";
import patchProp from "./patchProp";

// 将节点操作和属性操作合并
const renderOptions = Object.assign({ patchProp }, nodeOps);
function createRenderer() {}
