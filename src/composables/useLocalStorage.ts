// 定义接口表示 localStorage 数据结构
interface StorageItem<T> {
  value: T;
  expires: number;
}

// Hook 返回的接口
interface UseLocalStorageWithExpire {
  setLocalStorageWithExpire<T>(key: string, value: T, expireTime: number): void;
  getLocalStorageWithExpire<T>(key: string): T | null;
}

export function useLocalStorageWithExpire(): UseLocalStorageWithExpire {
  // 设置带过期时间的 localStorage
  const setLocalStorageWithExpire = <T>(
    key: string,
    value: T,
    expireTime: number,
  ): void => {
    const now = new Date().getTime();
    const expires = now + expireTime;
    const item: StorageItem<T> = {
      value,
      expires,
    };
    localStorage.setItem(key, JSON.stringify(item));
  };

  // 获取带过期时间的 localStorage
  const getLocalStorageWithExpire = <T>(key: string): T | null => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return null;
    }
    const item: StorageItem<T> = JSON.parse(itemStr);
    const now = new Date().getTime();
    if (now > item.expires) {
      // 数据已过期，删除该字段
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  };

  return {
    setLocalStorageWithExpire,
    getLocalStorageWithExpire,
  };
}
