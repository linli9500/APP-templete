import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Text } from '@/components/ui/text';
import { translate } from '@/lib';

export interface ConfirmModalProps {
  /** 是否显示弹窗 */
  visible: boolean;
  /** 弹窗标题 */
  title: string;
  /** 弹窗内容/描述 */
  message: string;
  /** 确认按钮文字，默认"确定" */
  confirmText?: string;
  /** 取消按钮文字，默认"取消" */
  cancelText?: string;
  /** 确认按钮是否为危险操作（红色样式） */
  isDestructive?: boolean;
  /** 是否显示取消按钮，默认 true */
  showCancel?: boolean;
  /** 确认按钮回调 */
  onConfirm: () => void;
  /** 取消按钮回调 */
  onCancel: () => void;
  /** 是否正在加载中 */
  isLoading?: boolean;
}

/**
 * 通用确认弹窗组件
 * 替代系统原生 Alert.alert，提供统一的 UI 风格
 */
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  isDestructive = false,
  showCancel = true,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-center items-center bg-black/50 px-6">
        <View 
          className="w-full max-w-sm bg-[#F5F5F0] dark:bg-neutral-900 rounded-3xl p-6 shadow-xl"
        >
          {/* 标题 */}
          <Text className="text-xl font-bold text-black dark:text-white text-center mb-3">
            {title}
          </Text>
          
          {/* 内容 */}
          <Text className="text-base text-neutral-600 dark:text-neutral-400 text-center leading-relaxed mb-6">
            {message}
          </Text>

          {/* 按钮区域 */}
          <View className={`flex-row ${showCancel ? 'justify-between space-x-3' : 'justify-center'}`}>
            {/* 取消按钮 */}
            {showCancel && (
              <TouchableOpacity
                onPress={onCancel}
                disabled={isLoading}
                className="flex-1 py-3.5 rounded-full border border-neutral-300 dark:border-neutral-600"
                activeOpacity={0.7}
              >
                <Text className="text-center font-semibold text-neutral-700 dark:text-neutral-300">
                  {cancelText || translate('common.cancel')}
                </Text>
              </TouchableOpacity>
            )}

            {/* 确认按钮 */}
            <TouchableOpacity
              onPress={onConfirm}
              disabled={isLoading}
              className={`flex-1 py-3.5 rounded-full ${
                isDestructive 
                  ? 'bg-red-500' 
                  : 'bg-black dark:bg-white'
              } ${isLoading ? 'opacity-50' : ''}`}
              activeOpacity={0.7}
            >
              <Text className={`text-center font-semibold ${
                isDestructive 
                  ? 'text-white' 
                  : 'text-white dark:text-black'
              }`}>
                {isLoading ? '...' : (confirmText || translate('common.confirm'))}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

/**
 * 单按钮信息弹窗（用于成功/错误提示）
 */
export interface InfoModalProps {
  visible: boolean;
  title: string;
  message: string;
  buttonText?: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  visible,
  title,
  message,
  buttonText,
  type = 'info',
  onClose,
}) => {
  // 根据类型选择图标
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      default:
        return 'ℹ';
    }
  };

  const getIconBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50 px-6">
        <View 
          className="w-full max-w-sm bg-[#F5F5F0] dark:bg-neutral-900 rounded-3xl p-6 shadow-xl items-center"
        >
          {/* 图标 */}
          <View className={`w-14 h-14 rounded-full ${getIconBgColor()} items-center justify-center mb-4`}>
            <Text className="text-2xl text-white font-bold">{getIcon()}</Text>
          </View>

          {/* 标题 */}
          <Text className="text-xl font-bold text-black dark:text-white text-center mb-2">
            {title}
          </Text>
          
          {/* 内容 */}
          <Text className="text-base text-neutral-600 dark:text-neutral-400 text-center leading-relaxed mb-6">
            {message}
          </Text>

          {/* 确定按钮 */}
          <TouchableOpacity
            onPress={onClose}
            className="w-full py-3.5 rounded-full bg-black dark:bg-white"
            activeOpacity={0.7}
          >
            <Text className="text-center font-semibold text-white dark:text-black">
              {buttonText || translate('common.confirm')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
