/**
 * 智能API Token管理器
 * 支持内存存储和持久化存储
 */
export class TokenManager {
  private static instance: TokenManager;
  private memoryStorage: Map<string, string> = new Map();
  private readonly STORAGE_KEY = "smartApiTokens";

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  constructor() {
    this.loadFromStorage();
  }

  /**
   * 设置token
   */
  setToken(teamId: string, token: string, persistent = true) {
    this.memoryStorage.set(teamId, token);

    if (persistent) {
      this.saveToStorage();
    }

    console.log(
      `[${teamId.toUpperCase()}] Token已设置${persistent ? "并持久化" : ""}`,
    );
  }

  /**
   * 获取token
   */
  getToken(teamId: string): string | undefined {
    return this.memoryStorage.get(teamId);
  }

  /**
   * 清除token
   */
  clearToken(teamId: string, clearStorage: boolean = true) {
    this.memoryStorage.delete(teamId);

    if (clearStorage) {
      this.saveToStorage();
    }

    console.log(`[${teamId.toUpperCase()}] Token已清除`);
  }

  /**
   * 检查token是否存在
   */
  hasToken(teamId: string): boolean {
    return this.memoryStorage.has(teamId);
  }

  /**
   * 获取所有token
   */
  getAllTokens(): Record<string, string> {
    return Object.fromEntries(this.memoryStorage);
  }

  /**
   * 清除所有token
   */
  clearAllTokens() {
    this.memoryStorage.clear();
    localStorage.removeItem(this.STORAGE_KEY);
    console.log("所有智能API tokens已清除");
  }

  /**
   * 从localStorage加载token
   */
  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const tokens = JSON.parse(stored);
        Object.entries(tokens).forEach(([teamId, token]) => {
          this.memoryStorage.set(teamId, token as string);
        });
        console.log("智能API tokens已从localStorage恢复");
      }
    } catch (error) {
      console.warn("恢复token失败:", error);
    }
  }

  /**
   * 保存token到localStorage
   */
  private saveToStorage() {
    try {
      const tokens = Object.fromEntries(this.memoryStorage);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tokens));
    } catch (error) {
      console.warn("保存token失败:", error);
    }
  }
}
