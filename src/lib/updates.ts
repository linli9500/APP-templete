import * as Updates from 'expo-updates';

// 定义模态框回调类型
type ModalCallback = {
  showUpdateModal?: (params: {
    title: string;
    message: string;
    type: 'info' | 'confirm';
    onConfirm?: () => void;
    onCancel?: () => void;
  }) => void;
};

// 存储模态框回调
let modalCallbacks: ModalCallback = {};

// 注册模态框回调（由 App 根组件调用）
export const registerUpdateModalCallback = (callbacks: ModalCallback) => {
  modalCallbacks = callbacks;
};

// 简单的提示类型
type SimpleModalInfo = {
  type: 'dev' | 'uptodate' | 'error' | 'update_available';
  onRestart?: () => void;
};

// 获取更新检查结果（供组件使用）
export const checkAppUpdate = async (isManual = false): Promise<SimpleModalInfo | null> => {
  if (__DEV__) {
    if (isManual) {
      return { type: 'dev' };
    } else {
      console.log('[Updates] Skipped in DEV mode');
    }
    return null;
  }

  try {
    const update = await Updates.checkForUpdateAsync();
    
    if (update.isAvailable) {
      // 1. Download the update
      await Updates.fetchUpdateAsync();
      
      // 2. Return update available info
      return { 
        type: 'update_available',
        onRestart: async () => {
          await Updates.reloadAsync();
        }
      };
    } else {
      if (isManual) {
        return { type: 'uptodate' };
      }
    }
  } catch (error) {
    console.log('[Updates] check failed:', error);
    if (isManual) {
      return { type: 'error' };
    }
  }
  
  return null;
};

// 翻译 key 映射（供 UI 使用）
export const UPDATE_MESSAGES = {
  dev: {
    title: 'settings.updates.dev_mode',
    message: 'settings.updates.dev_message',
  },
  uptodate: {
    title: 'settings.updates.up_to_date',
    message: 'settings.updates.up_to_date_message',
  },
  error: {
    title: 'common.error',
    message: 'settings.updates.check_failed',
  },
  update_available: {
    title: 'settings.updates.available',
    message: 'settings.updates.available_message',
  },
};
