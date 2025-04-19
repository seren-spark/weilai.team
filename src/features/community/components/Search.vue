<script setup lang="ts">
import { useRequest } from "@/composables/useRequest";
import type { ArticleList, Data, UserData, UserInfo } from "@/types/community";
import { debounce } from "@community/composables/search";
import { Icon } from "@iconify/vue";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const isVisible = ref(false);
const router = useRouter();
const searchValue = ref();
const { executeRequest, data } = useRequest();
const searchList = ref<ArticleList[]>([]);
const filterList = ref<ArticleList[]>([]);
const searchUserList = ref<UserInfo[]>([]);
const filterUserList = ref<UserInfo[]>([]);
const route = useRoute();
const path = route.path;
console.log(route);

const pathArr = path.split("/").slice(1);
// 接受父组件传来的函数
const props = defineProps({
  typeId: {
    type: Number,
    default: 0,
  },
  isUser: {
    type: Boolean,
    default: false,
  },
});

// 用于记录已经出现的标题
const titleMap = new Map<string, boolean>();
let body = document.body as HTMLElement;
body.addEventListener("click", handleClick);
// 监视输入框的输入
const debouncedSearchTitle = debounce((newValue) => searchTitle(newValue), 300);
const debouncedSearchUser = debounce((newValue) => searchUser(newValue), 300);
watch(searchValue, (newValue) => {
  if (!props.isUser) {
    if (newValue) {
      debouncedSearchTitle(newValue);
    } else {
      filterList.value = [];
    }
  } else {
    if (newValue) {
      debouncedSearchUser(newValue);
    } else {
      filterUserList.value = [];
    }
  }
});
// 获取搜索列表

async function searchUser(content = "", pageNumber = 1, pageSize = 10) {
  await executeRequest({
    url: `/user/searchUser?content=${content}&pageNumber=${pageNumber}&pageSize=${pageSize} `,
    method: "get",
  });
  let res = data.value as UserData;
  searchUserList.value = res.data.searchUsers;

  filterUserList.value = res.data.searchUsers;
  titleMap.clear();
  filterUserList.value = [];
  searchUserList.value.forEach((user) => {
    if (!titleMap.has(user.name)) {
      filterUserList.value.push(user);
      titleMap.set(user.name, true);
    }
  });
}
async function searchTitle(condition = "", type = 0) {
  await executeRequest({
    url: `/post/selectAll?condition=${condition}&type=${props.typeId || type}`,
    method: "get",
  });
  let res = data.value as Data;
  console.log(res);
  searchList.value = res.data.records;
  titleMap.clear();
  filterList.value = [];
  searchList.value.forEach((title) => {
    if (!titleMap.has(title.title)) {
      filterList.value.push(title);
      titleMap.set(title.title, true);
    }
  });
}
// 防止input框失去焦点时搜索列表消失
function handleClick(e: Event) {
  let target = e.target as HTMLElement;
  if (
    target.classList.contains("search_input") ||
    target.classList.contains("search_item")
  ) {
    isVisible.value = true;
  } else {
    isVisible.value = false;
  }
}
function skip(e: Event) {
  if (searchValue.value) {
    router.push(
      `/${pathArr[0]}/${pathArr[1]}/${pathArr[2]}/${searchValue.value}`,
    );
  } else {
    router.push(`/${pathArr[0]}/${pathArr[1]}/${pathArr[2]}`);
  }
}
</script>

<template>
  <div class="search_container">
    <div class="search">
      <div class="search_input_box">
        <span class="search-icon">
          <Icon
            icon="bitcoin-icons:search-filled"
            color="#b9c2d0"
            font-size="26px"
          />
        </span>
        <input
          placeholder="请输入关键词"
          class="search_input"
          ref="inputRef"
          @keydown.enter="
            () => {
              skip(searchValue);
            }
          "
          v-model="searchValue"
          @focus="isVisible = true"
        />
      </div>

      <div class="search_list" v-show="searchValue && isVisible && !isUser">
        <div class="search_empty" v-if="!filterList.length">未找到搜索结果</div>
        <div class="search_item" v-for="item in filterList" :key="item.id">
          <a @click="router.push(`/community/comprehensive/hot/${item.title}`)">
            <span>{{ item.title }}</span>
          </a>
        </div>
      </div>
      <div class="search_list" v-show="searchValue && isVisible && isUser">
        <div class="search_empty" v-if="!filterUserList.length">
          未找到搜索结果
        </div>
        <div
          v-for="item in filterUserList"
          class="search_item"
          :key="item.userId"
        >
          <a @click="router.push(`/community/comprehensive/user/${item.name}`)">
            <span>{{ item.name }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.search_container {
  margin-bottom: 10px;
  height: 45px;
}
.search {
  float: right;
  position: relative;
  &_input_box {
    position: relative;
  }
  input {
    text-decoration: none;
    list-style: none;
    outline-style: none;
    width: 250px;
    height: 45px;
    border: 1px solid #d0d9e4;
    border-radius: 25px;
    padding: var(--padding);
    padding-left: 30px;
    font-size: 0.95rem;
  }
  .search-icon {
    position: absolute;
    top: 50%;
    left: 2%;
    transform: translateY(-50%);
  }
  &_list {
    padding: 8px 10px;
    position: absolute;
    width: 110%;
    transform: translateX(-5%);
    border-radius: var(--radius);
    background-color: white;
    box-shadow:
      0px 2px 5px rgba(0, 0, 0, 0.1),
      inset 0px 0.2px 0.5px rgba(0, 0, 0, 0.24);
  }
  &_empty {
    width: 100%;
    height: 150px;
    text-align: center;
    line-height: 150px;
    font-size: 15px;
    color: var(--secondary-foreground);
    cursor: default;
  }
  &_item {
    display: flex;
    align-items: center;
    padding: 3px 2px;
    font-size: 15px;
    color: var(--secondary-foreground);
    a {
      cursor: pointer;
      width: 100%;
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      font-size: 13px;
      text-overflow: ellipsis;
    }
    &:hover {
      background-color: #f8f8fa;
    }
  }
}

@media screen and (max-width: 768px) {
  .search_container {
    align-items: center;
    justify-content: center;
    background-color: #fafafa;
    display: flex;
    position: fixed;
    z-index: 5;
    top: 3.4rem;
    height: 3.8rem;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
  }
  .search {
    width: 90%;
    float: right;
    background-color: #fafafa;
    position: relative;
    &_input_box {
      position: relative;
      width: 100%;
    }
    input {
      text-decoration: none;
      list-style: none;
      outline-style: none;
      width: 100%;
      height: 3rem;
      border: 1px solid #d0d9e4;
      border-radius: 25px;
      padding: 5px 10px;
      padding-left: 2.5rem;
    }
    .search-icon {
      position: absolute;
      top: 50%;
      left: 2%;
      transform: translateY(-50%);
    }
    &_list {
      border-radius: var(--radius);
      background-color: white;
      box-shadow:
        0px 2px 5px rgba(0, 0, 0, 0.1),
        inset 0px 0.2px 0.5px rgba(0, 0, 0, 0.24);
    }
    &_empty {
      width: 100%;
      height: 150px;
      text-align: center;
      line-height: 150px;
      font-size: 1rem;
      color: var(--secondary-foreground);
      cursor: default;
    }
    &_item {
      padding: 5px 6px;
      color: var(--secondary-foreground);
      a {
        width: 100%;
        font-size: 15px;
        display: -webkit-box;
        -webkit-line-clamp: 1; //行数
        text-overflow: ellipsis; //省略号
        -webkit-box-orient: vertical;
        overflow: hidden;
        white-space: normal;
        word-break: break-all;
      }
      &:hover {
        background-color: #f8f8fa;
      }
    }
  }
}

@media screen and (max-width: 1300px) and (min-width: 900px) {
  .search_container {
    margin-bottom: 10px;
    height: 35px;
  }
  .search {
    float: right;
    position: relative;
    &_input_box {
      position: relative;
    }
    input {
      text-decoration: none;
      list-style: none;
      outline-style: none;
      font-size: 0.9vw;
      width: 200px;
      height: 30px;
      border: 1px solid #d0d9e4;
      border-radius: 25px;
      padding: 5px 5px;
      padding-left: 20px;
    }
    .search-icon {
      position: absolute;

      top: 50%;
      left: 2%;
      transform: translateY(-50%);
      svg {
        font-size: 16px !important;
      }
    }
    &_list {
      padding: 8px 10px;
      position: absolute;
      width: 110%;
      transform: translateX(-5%);
      border-radius: var(--radius);
      background-color: white;
      box-shadow:
        0px 2px 5px rgba(0, 0, 0, 0.1),
        inset 0px 0.2px 0.5px rgba(0, 0, 0, 0.24);
    }
    &_empty {
      width: 100%;
      height: 150px;
      text-align: center;
      line-height: 150px;
      font-size: 15px;
      color: var(--secondary-foreground);
      cursor: default;
    }
    &_item {
      display: flex;
      align-items: center;
      padding: 3px 2px;
      font-size: 15px;
      color: var(--secondary-foreground);
      a {
        cursor: pointer;
        width: 100%;
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        font-size: 13px;
        text-overflow: ellipsis;
      }
      &:hover {
        background-color: #f8f8fa;
      }
    }
  }
}
</style>
