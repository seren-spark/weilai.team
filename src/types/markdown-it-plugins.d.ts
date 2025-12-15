declare module "markdown-it-task-lists" {
  import type MarkdownIt from "markdown-it";

  interface TaskListsOptions {
    enabled?: boolean;
    label?: boolean;
    labelAfter?: boolean;
  }

  const markdownItTaskLists: (
    md: MarkdownIt,
    options?: TaskListsOptions,
  ) => void;
  export = markdownItTaskLists;
}

declare module "markdown-it-katex" {
  import type MarkdownIt from "markdown-it";

  interface KatexOptions {
    throwOnError?: boolean;
    errorColor?: string;
    [key: string]: any;
  }

  const markdownItKatex: (md: MarkdownIt, options?: KatexOptions) => void;
  export = markdownItKatex;
}
declare module "markdown-it-texmath" {
  import type MarkdownIt from "markdown-it";

  interface Delimiter {
    left: string;
    right: string;
    display: boolean;
  }

  interface TexMathOptions {
    engine?: any;
    delimiters?: string | Delimiter[];
    katexOptions?: {
      throwOnError?: boolean;
      errorColor?: string;
      [key: string]: any;
    };
  }

  const markdownItTexMath: (md: MarkdownIt, options?: TexMathOptions) => void;
  export = markdownItTexMath;
}