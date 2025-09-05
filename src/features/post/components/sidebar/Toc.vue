<script setup lang="ts">
import { type Editor } from "@tiptap/vue-3";
import { items } from "../../composables/tocItems";
import { onMounted, ref, type Ref } from "vue";
import { TextSelection } from "@tiptap/pm/state";

interface TocItem {
  id: string;
  text: string;
  level: number;
  offset: number;
  children?: TocItem[];
}
interface Item {
  id: string;
  text: string;
  level: number;
  pos: number;
  textContent: string;
}

const props = defineProps<{
  editor: Editor | undefined;
  containerSelector?: string;
}>();

const tocList: Ref<TocItem[]> = ref([]);
const scrollDOM = ref<HTMLElement | null>(null);

// oldToc
const getToc = () => {
  if (!props.editor) return;
  let baseIndex: number = 0;
  let maxLevel: number | null = null;
  let stack: TocItem[] = [];

  props.editor?.state.doc.forEach((node, offset) => {
    if (node.type.name === "heading") {
      const headingText = node.textContent;
      const headingLevel = node.attrs.level;
      const id = `heading-${offset}`;
      if (maxLevel === null || headingLevel > maxLevel) {
        maxLevel = headingLevel;
        baseIndex++;
      }

      const newItem: TocItem = {
        id, //添加id 用来锚点
        text: headingText,
        level: baseIndex,
        offset: offset,
      };

      stack.push(newItem);
    }
  });

  tocList.value = stack;
};

props.editor?.on("transaction", () => {
  getToc();
});
props.editor?.on("update", () => {
  console.log("update");

  getToc(); // 重新生成目录
});

// const scrollToHeading = (top: number) => {
//   // const heading = container.querySelector(`h1, h2, h3, h4, h5, h6[id="${id}"]`);
//   // const offsetTop=

//   if (scrollDOM.value) {
//     //   scrollDOM.value.scrollTo({
//     //     top,
//     //     left: 0,
//     //     behavior: "smooth",
//     //   });

//     // if (scrollDOM.value == document.querySelector("html")) {
//     const containerTop = scrollDOM.value.getBoundingClientRect().top;
//     const contentTop =
//       document
//         .querySelector(".article-detail__content")
//         ?.getBoundingClientRect().top ||
//       document.querySelector(".app-detail_content")?.getBoundingClientRect()
//         .top ||
//       0;
//     console.log(containerTop, contentTop);

//     scrollDOM.value.scrollTo({
//       top: top + contentTop - containerTop,
//       left: 0,
//       behavior: "smooth",
//     });
//     // }
//   }
// };

onMounted(() => {
  getToc();
  scrollDOM.value =
    (document.querySelector(".app-editor__scroll") as HTMLElement) ||
    (document.querySelector("html") as HTMLElement);
});
//new Toc
function onItemClick(e: Event, id: string) {
  if (props.editor) {
    const element = props.editor?.view.dom.querySelector(
      `[data-toc-id="${id}"`,
    ) as Element;
    const pos = props.editor?.view.posAtDOM(element, 0); //获取元素位置
    const tr = props.editor?.view.state.tr; //用于修改编辑器状态

    tr.setSelection(new TextSelection(tr.doc.resolve(pos))); //将光标移到对应位置

    props.editor?.view.dispatch(tr); //提交事务 更新编辑器状态

    props.editor?.view.focus(); //让编辑器重新获得焦点

    if (history.pushState) {
      // eslint-disable-line
      //history.pushState：修改浏览器地址栏中的 URL（添加锚点），不会刷新页面。
      history.pushState(null, "", `#${id}`); // eslint-disable-line
    }

    //注意scrollDOM用的是old Toc
    if (scrollDOM.value) {
      scrollDOM.value.scrollTo({
        top: element?.getBoundingClientRect().top + window.scrollY,

        behavior: "smooth",
      });
    }
  }
}
</script>

<template>
  <!-- 老版 -->
  <!-- <div v-if="tocList.length" class="toc">
    <ul
      class="toc__list"
      @click="
        (event) => {
          const target = event.target as HTMLElement;
          const link = target.closest('li');
          if (link) {
            const offset = link.dataset.offset;
            if (offset) scrollToHeading(+offset);
          }
        }
      "
    >

      <li
        v-for="item in tocList"
        :key="item.offset"
        class="toc__item"
        :class="`toc__item--level${item.level}`"
        :data-offset="item.offset"
        :data-level="item.level"
      >
        {{ item.text }}
      </li>
    </ul>
  </div> -->
  <div v-if="items.length" class="toc">
    <ul class="toc__list">
      <a
        v-for="item in items"
        :key="item.pos"
        class="toc__item"
        :class="`toc__item--level${item.level}`"
        :data-offset="item.pos"
        :data-level="item.level"
        :href="'#' + item.id"
        @click.prevent="onItemClick($event, item.id)"
      >
        {{ (item as Item).textContent }}
      </a>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.toc {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  &__list {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    --main-color: #425aef;
    --main-color-bg: #4259ef0d;
  }

  &__item {
    cursor: pointer;
    padding-left: 0;
    list-style: none;
    padding: 0.5rem 1rem;
    border-radius: var(--radius);
    color: var(--secondary-foreground);

    &--level1 {
      font-size: 1rem;
    }

    &--level2 {
      font-size: 1rem;
      padding-left: 1.5rem;
    }

    &--level3 {
      font-size: 0.8rem;
      padding-left: 2rem;
    }

    &--level4 {
      font-size: 0.75rem;
      padding-left: 2.45rem;
    }
    &--level5 {
      font-size: 0.7rem;
      padding-left: 3rem;
    }
    &--level6 {
      font-size: 0.6rem;
      padding-left: 3.5rem;
    }

    &--active {
      color: var(--main-color);
      background-color: var(--main-color-bg);
    }
  }
}
</style>
