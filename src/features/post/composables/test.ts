import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Bold from "@tiptap/extension-bold";
import AppTableExtension from "@post/extensions/app-table";
import Image from "@tiptap/extension-image";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Strike from "@tiptap/extension-strike";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Placeholder from "@tiptap/extension-placeholder";
import { useEditor } from "@tiptap/vue-3";
import Blockquote from "@tiptap/extension-blockquote";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import Heading from "@tiptap/extension-heading";
import Code from "@tiptap/extension-code";
import { AppCodeBlock } from "@/components/editor/extensions/app-code-block";
import Link from "@tiptap/extension-link";
import { all, createLowlight } from "lowlight";

export default function useAppEditor(editable: boolean = true) {
  const lowlight = createLowlight(all);

  // you can also register languages

  const editor = useEditor({
    extensions: [
      Document,
      Placeholder.configure({
        placeholder: "Write something …",
      }),
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
      Image.configure({
        allowBase64: true,
      }),
      AppTableExtension,
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
    ],
    editable,
  });

  return {
    editor,
  };
}
