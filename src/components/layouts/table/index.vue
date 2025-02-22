<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import tableIndex from "@/components/layouts/table/menu/table.vue";
import { contextMenuInstance } from "./index";
import { HyperFormula } from "hyperformula";
// 通过ref定义变量
const hotTableContainer = ref<HTMLElement | null>(null);
const customContextMenu = ref<HTMLElement | null>(null);
const menuVisible = ref(false);

const menuPosition = ref({ x: 0, y: 0 });
const selectedCell = ref({ row: 0, col: 0 });

let hotInstance: Handsontable | null = null;
let menu: contextMenuInstance | null = null;
let menuOptions: any;
let menuExtraOptions: any;
// 初始化 Handsontable 实例
const initHandsontable = () => {
  if (hotTableContainer.value) {
    hotInstance = new Handsontable(hotTableContainer.value, {
      data: Handsontable.helper.createSpreadsheetData(10, 10),
      licenseKey: "non-commercial-and-evaluation",
      formulas: {
        engine: HyperFormula,
      },
      rowHeaders: true,
      colHeaders: true,
      mergeCells: true,
      copyPaste: true,
      contextMenu: false, // 禁用默认右键菜单
      afterOnCellMouseDown: (_, coords) => {
        selectedCell.value = coords;
      },
    });

    menu = new contextMenuInstance(hotInstance);
    menuOptions = menu.getCustomOptions();
    menuExtraOptions = menu.getQuickOptions();
    hotInstance.addHook("afterSelectionEnd", (row, column, row2, column2) => {
      menu?.updateSelectCell([row, column, row2, column2]);
    });
    // 获取 ContextMenu 插件并监听右键事件
    const contextmenu = hotInstance.getPlugin("contextMenu") as any;
    contextmenu.eventManager.addEventListener(
      hotInstance.rootElement,
      "contextmenu",
      (event: MouseEvent) => {
        event.preventDefault();
        showCustomMenu(event);
      },
    );
  }
};

// 显示自定义菜单
const showCustomMenu = (event: MouseEvent) => {
  menuVisible.value = true;
  menuPosition.value = { x: event.clientX, y: event.clientY };
};

// 隐藏自定义菜单
const hideCustomMenu = () => {
  menuVisible.value = false;
};
const handleGlobalClick = (event: MouseEvent) => {
  const menuElement = customContextMenu.value;
  if (menuElement && !menuElement.contains(event.target as Node)) {
    hideCustomMenu();
  }
};
// 在组件挂载后初始化 Handsontable
onMounted(() => {
  initHandsontable();

  // 隐藏自定义菜单的全局事件
  document.addEventListener("click", handleGlobalClick);
});

// 在组件销毁前移除事件监听器并销毁 Handsontable 实例
onBeforeUnmount(() => {
  document.removeEventListener("click", handleGlobalClick);
  hotInstance?.destroy();
});
</script>

<style>
.handsontable-container {
  width: 100%;
  height: 400px;
}

.custom-context-menu {
  position: absolute;
  background: var(--jjext-color-layer-4);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 0;
}
</style>
<template>
  <div ref="hotTableContainer" class="handsontable-container"></div>
  <div
    v-if="menuVisible"
    class="custom-context-menu"
    ref="customContextMenu"
    :style="{
      top: `${menuPosition.y + 10}px`,
      left: `${menuPosition.x + 10}px`,
    }"
  >
    <!-- 渲染菜单 -->
    <tableIndex :options="menuOptions" :quick-options="menuExtraOptions" />
  </div>
</template>
<style>
.handsontable td,
.handsontable th {
  background-color: unset;
}
</style>
