<template>
  <div class="smart-api-demo">
    <h1>🚀 智能API适配器演示</h1>
    <p class="description">零配置智能适配，自动识别各种API格式</p>

    <!-- 团队选择器 -->
    <div class="team-selector">
      <button
        v-for="team in teams"
        :key="team.id"
        @click="selectTeam(team.id)"
        :class="['team-btn', { active: selectedTeam === team.id }]"
      >
        {{ team.name }}
        <span class="team-format">{{ team.format }}</span>
      </button>
    </div>

    <!-- API调用按钮 -->
    <div class="api-actions">
      <button @click="getUsers" :disabled="loading">
        {{ loading ? "请求中..." : "获取用户列表" }}
      </button>
      <button @click="createUser" :disabled="loading">
        {{ loading ? "创建中..." : "创建用户" }}
      </button>
      <button @click="getPaginatedUsers" :disabled="loading">
        {{ loading ? "请求中..." : "获取分页数据" }}
      </button>
    </div>

    <!-- 响应结果 -->
    <div class="response-display">
      <h3>响应结果</h3>
      <pre>{{ JSON.stringify(responseData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { smartUserService } from "../api/services/smart-user-service";
import type { StandardResponse } from "../api/types";

// 响应式数据
const selectedTeam = ref("team-a");
const loading = ref(false);
const responseData = ref<StandardResponse | null>(null);

const teams = [
  { id: "team-a", name: "团队A", format: "{code, data, message}" },
  { id: "team-b", name: "团队B", format: "{status, data, msg}" },
  { id: "team-c", name: "团队C", format: "{success, data, message}" },
];

// 选择团队
const selectTeam = (teamId: string) => {
  selectedTeam.value = teamId;
  responseData.value = null;
};

// 获取用户列表
const getUsers = async () => {
  loading.value = true;
  try {
    const result = await smartUserService.getTeamUsers(selectedTeam.value);
    responseData.value = result;
    console.log(`[${selectedTeam.value.toUpperCase()}] 用户列表:`, result);
  } catch (error) {
    console.error("获取用户列表失败:", error);
    responseData.value = {
      success: false,
      data: null,
      message: "获取用户列表失败",
      code: 500,
      timestamp: Date.now(),
    };
  } finally {
    loading.value = false;
  }
};

// 创建用户
const createUser = async () => {
  loading.value = true;
  try {
    const userData = {
      name: `新用户_${Date.now()}`,
      email: `user_${Date.now()}@example.com`,
    };
    const result = await smartUserService.createUser(
      selectedTeam.value,
      userData,
    );
    responseData.value = result;
    console.log(`[${selectedTeam.value.toUpperCase()}] 创建用户:`, result);
  } catch (error) {
    console.error("创建用户失败:", error);
    responseData.value = {
      success: false,
      data: null,
      message: "创建用户失败",
      code: 500,
      timestamp: Date.now(),
    };
  } finally {
    loading.value = false;
  }
};

// 获取分页数据
const getPaginatedUsers = async () => {
  loading.value = true;
  try {
    const result = await smartUserService.getUsersPaginated(
      selectedTeam.value,
      {
        page: 1,
        pageSize: 10,
      },
    );
    responseData.value = result;
    console.log(`[${selectedTeam.value.toUpperCase()}] 分页数据:`, result);
  } catch (error) {
    console.error("获取分页数据失败:", error);
    responseData.value = {
      success: false,
      data: null,
      message: "获取分页数据失败",
      code: 500,
      timestamp: Date.now(),
    };
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.smart-api-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.description {
  color: #666;
  margin-bottom: 20px;
}

.team-selector {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.team-btn {
  padding: 10px 20px;
  border: 2px solid #e1e5e9;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.team-btn:hover {
  border-color: #3498db;
}

.team-btn.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.team-format {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 4px;
}

.api-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.api-actions button {
  padding: 10px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.api-actions button:hover:not(:disabled) {
  background: #0056b3;
}

.api-actions button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.response-display {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

.response-display h3 {
  margin-top: 0;
  margin-bottom: 12px;
  color: #333;
}

.response-display pre {
  background: #2d3748;
  color: #e2e8f0;
  padding: 16px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.5;
  overflow-x: auto;
  margin: 0;
}
</style>
