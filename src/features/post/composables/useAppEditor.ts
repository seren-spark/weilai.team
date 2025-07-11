import { useEditor } from "@tiptap/vue-3";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Bold from "@tiptap/extension-bold";
import AppTableExtension from "@post/extensions/app-table";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import { Markdown } from "tiptap-markdown";
import { ref, computed, onBeforeUnmount } from "vue";

import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Code from "@tiptap/extension-code";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import Blockquote from "@tiptap/extension-blockquote";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Strike from "@tiptap/extension-strike";
import History from "@tiptap/extension-history";
import { Gapcursor } from "@tiptap/extension-gapcursor";

import Italic from "@tiptap/extension-italic";

//自定义高亮
import { AppCodeBlock } from "@/components/editor/extensions/app-code-block";

// interface UseEditorOptions {
//   content?: string;
//   placeholder?: string;
//   editable?: boolean;
//   onUpdate?: (content: string) => void;
//   onSelectionUpdate?: (selection: any) => void;
//   onFocus?: () => void;
//   onBlur?: () => void;
// }

// 扩展表格
const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      // extend the existing attributes …
      ...this.parent?.(),

      // and add a new one …
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-background-color"),
        renderHTML: (attributes) => {
          return {
            "data-background-color": attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor}`,
          };
        },
      },
    };
  },
});

// options: UseEditorOptions = {}
export default function useAppEditor(editable: boolean = true) {
  const lowlight = createLowlight(all);
  // 编辑器状态
  const isEditorReady = ref(false);
  // 创建编辑器实例
  const editor = useEditor({
    editable,
    extensions: [
      Document,
      Paragraph,
      Text,
      Blockquote,
      Code,
      AppCodeBlock.configure({
        lowlight,
      }),
      Heading.configure({
        levels: [1, 2, 3, 4],
      }),
      HorizontalRule,
      Bold,
      //图片支持base64
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          referrerpolicy: "no-referrer", // 绕过 Referer 检测
        },
      }),
      Table.configure({
        resizable: true,
      }),
      Gapcursor,
      Underline,
      ListItem,
      BulletList,
      OrderedList,
      Color,
      TextStyle,
      Strike,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Link,

      TableRow,
      TableHeader,
      // TableCell,
      CustomTableCell,

      // 排版增强
      Typography,
      Italic,
      // 文本样式
      TextStyle,

      // ctrl+z 撤销重做
      History.configure({
        // 记录量
        depth: 10,
        newGroupDelay: 1000,
      }),
      Underline,

      //表格扩展（old vision）
      // AppTableExtension,

      // Markdown 支持
      Markdown.configure({
        html: true,
        tightLists: true,
        tightListClass: "tight",
        bulletListMarker: "-",
        linkify: true,
        breaks: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],

    onDestroy: () => {
      isEditorReady.value = false;
    },
  });

  // 清理资源
  onBeforeUnmount(() => {
    if (editor.value) {
      editor.value.destroy();
    }
  });
  return {
    // 编辑器实例
    editor,
  };
}
