<script setup lang="ts">
import { type Editor } from "@tiptap/vue-3";
import { Icon } from "@iconify/vue";

const props = defineProps<{
  editor: Editor | undefined;
}>();

const addImage = () => {
  const url = window.prompt("URL");

  if (url) {
    props.editor?.chain().focus().setImage({ src: url }).run();
  }
};
//有效
const addTable = () => {
  const cols = 3;
  const rows = 3;
  const editor = props.editor;
  // 插入表格
  if (editor) {
    const { tr } = editor.state;
    const { from } = tr.selection;
    // 创建表格节点
    const tableNode = editor.schema.nodes.table.create(null, [
      // 表头行
      editor.schema.nodes.tableRow.create(
        null,
        Array.from({ length: cols }, (_, i) =>
          editor.schema.nodes.tableHeader.create(null, [
            editor.schema.nodes.paragraph.create(null),
          ]),
        ),
      ),
      // 数据行
      ...Array.from({ length: rows }, () =>
        editor.schema.nodes.tableRow.create(
          null,
          Array.from({ length: cols }, () =>
            editor.schema.nodes.tableCell.create(null, [
              editor.schema.nodes.paragraph.create(),
            ]),
          ),
        ),
      ),
    ]);
    //创建空段落节点
    const paragraphNode = editor.schema.nodes.paragraph.create();
    // 同时插入表格和段落
    tr.insert(from, [tableNode, paragraphNode]);
    editor.view.dispatch(tr);
  }
};
</script>

<template>
  <div class="menu-bar">
    <ul class="menu-bar__list">
      <!-- 文本加粗 -->
      <li
        class="menu-bar__item"
        :class="{ 'is-active': props.editor?.isActive('bold') }"
        @click="editor?.chain().focus().toggleBold().run()"
      >
        <Icon icon="solar:text-bold-bold-duotone"></Icon>
      </li>
      <!-- 文本斜体 -->
      <li
        class="menu-bar__item"
        :class="{ 'is-active': props.editor?.isActive('italic') }"
        @click="editor?.chain().focus().toggleItalic().run()"
      >
        <Icon icon="ph:text-italic-duotone"></Icon>
      </li>
      <!--  文本下划线-->
      <li
        class="menu-bar__item"
        :class="{ 'is-active': props.editor?.isActive('underline') }"
        @click="editor?.chain().focus().toggleUnderline().run()"
      >
        <Icon icon="ph:text-underline-duotone"></Icon>
      </li>
      <!--  <li
        class="menu-bar__item"
        :class="{ 'is-active': props.editor?.isActive('bold') }"
        @click="editor?.chain().focus().setColor('#958DF1').run()"
      >
        <Icon icon="ic:outline-color-lens"></Icon>
      </li> -->

      <!-- 设置文字颜色 -->
      <li
        class="menu-bar__item"
        :class="{ 'is-active': props.editor?.isActive('color') }"
      >
        <input
          class="color_picker"
          type="color"
          @input="
            editor
              ?.chain()
              .focus()
              .setColor(($event?.target as HTMLInputElement)?.value)
              .run()
          "
          :value="editor?.getAttributes('textStyle').color"
        />
        <Icon icon="ic:outline-color-lens"></Icon>
      </li>
      <!-- 添加表格 editor.commands.insertTable({ rows: 3, cols: 3, withHeaderRow: false })

-->
      <!-- 老版为自定义添加type为appTable的node  文件名为AppTable.vue   app-table.ts  还要在useAppEditor添加扩展 -->
         <!-- <li
        class="menu-bar__item"
        :class="{ 'is-active': props.editor?.isActive('bold') }"
        @click="
          editor
            ?.chain()
            .focus()
            .insertContent({
              type: 'appTable',
            })
            .run()
        "
      ></li> -->
      <li
        class="menu-bar__item"
        :class="{ 'is-active': props.editor?.isActive('table') }"
        @click="
          editor?.commands.insertTable({
            rows: 4,
            cols: 4,
            withHeaderRow: true,
          })
        "
      >
        <Icon icon="si:table-duotone"></Icon>
      </li>
      <!-- 添加图片链接 -->
      <li
        class="menu-bar__item"
        :class="{ 'is-active': props.editor?.isActive('imgage') }"
        @click="addImage"
      >
        <Icon icon="ph:picture-in-picture-duotone"></Icon>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.menu-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;

  &__list {
    height: 100%;
    margin: 1rem 0;
    padding: 0.5rem 1rem;
    background-color: #fff;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    border-radius: 0.5rem;
    border: 0.125rem solid #eef0f2;
  }

  &__item {
    padding: 0.5rem;
    border: 1px solid #e8eaee;
    border-radius: 0.5rem;
    cursor: pointer;
    margin: 0 0.25rem;
    position: relative;
    .color_picker {
      opacity: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      outline-style: n;
      border-style: none;
      &:focus {
        outline: none;
        border-color: #80bdff; /* 可选：添加自定义边框颜色 */
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25); /* 可选：添加柔和的高亮阴影 */
      }
    }
  }
}

.is-active {
  background-color: #e5e5e5;
}
</style>
