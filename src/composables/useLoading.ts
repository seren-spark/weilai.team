import LoadingPage from "@/components/loading/LoadingPage.vue";
import { createApp } from "vue";

let loadingInstance: any = null;
let loadingContainer: HTMLElement | null = null;

/**
 * 显示全局加载动画
 */
export function showLoading() {
  // 如果已经存在加载实例，则不重复创建


  if (loadingInstance) {
    return;
  }

  // 创建挂载容器
  loadingContainer = document.createElement("div");
  loadingContainer.id = "global-loading-container";
  // 确保容器在最上层
  loadingContainer.style.position = "fixed";
  loadingContainer.style.top = "0";
  loadingContainer.style.left = "0";
  loadingContainer.style.width = "100%";
  loadingContainer.style.height = "100%";
  loadingContainer.style.zIndex = "9999";
  document.body.appendChild(loadingContainer);

  // 创建并挂载加载组件
  loadingInstance = createApp(LoadingPage);
  loadingInstance.mount(loadingContainer);
}

/**
 * 隐藏全局加载动画
 */
export function hideLoading() {
  console.log("hideLoading");

  if (loadingInstance && loadingContainer) {
    loadingInstance.unmount();
    document.body.removeChild(loadingContainer);
    loadingInstance = null;
    loadingContainer = null;
  }
}

/**
 * 加载动画封装函数，返回一个对象包含显示和隐藏方法
 */
export function useLoading() {
  return {
    show: showLoading,
    hide: hideLoading,
  };
}