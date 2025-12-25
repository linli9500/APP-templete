import type { AxiosError } from 'axios';
import { Dimensions, Platform } from 'react-native';
import { showMessage } from 'react-native-flash-message';

export const IS_IOS = Platform.OS === 'ios';
const { width, height } = Dimensions.get('screen');

export const WIDTH = width;
export const HEIGHT = height;

import { Appearance } from 'react-native';

const getToastStyle = () => {
  const isDark = Appearance.getColorScheme() === 'dark';
  return {
    backgroundColor: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.85)',
    borderRadius: 99,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center' as const,
  };
};

const getToastTitleStyle = () => {
  const isDark = Appearance.getColorScheme() === 'dark';
  return {
    fontSize: 14,
    fontWeight: '500' as const,
    color: isDark ? '#000000' : '#ffffff',
    textAlign: 'center' as const,
  };
};

// for onError react queries and mutations
export const showError = (error: AxiosError) => {
  console.log(JSON.stringify(error?.response?.data));
  const description = extractError(error?.response?.data).trimEnd();

  // If description is short, use it as message. Otherwise use generic title.
  showMessage({
    message: description || 'Something went wrong',
    type: 'default', // Use default to avoid red/green colors overriding our style
    position: 'center',
    floating: true,
    style: getToastStyle(),
    titleStyle: getToastTitleStyle(),
    duration: 4000,
  });
};

export const showErrorMessage = (message: string = 'Something went wrong ') => {
  showMessage({
    message,
    type: 'default',
    position: 'center',
    floating: true,
    style: getToastStyle(),
    titleStyle: getToastTitleStyle(),
    duration: 4000,
  });
};

export const showSuccessMessage = (message: string) => {
  showMessage({
    message,
    type: 'default',
    position: 'center',
    floating: true,
    style: getToastStyle(),
    titleStyle: getToastTitleStyle(),
    duration: 4000,
  });
};

export const extractError = (data: unknown): string => {
  if (typeof data === 'string') {
    return data;
  }
  if (Array.isArray(data)) {
    const messages = data.map((item) => {
      return `  ${extractError(item)}`;
    });

    return `${messages.join('')}`;
  }

  if (typeof data === 'object' && data !== null) {
    const messages = Object.entries(data).map((item) => {
      const [key, value] = item;
      const separator = Array.isArray(value) ? ':\n ' : ': ';

      return `- ${key}${separator}${extractError(value)} \n `;
    });
    return `${messages.join('')} `;
  }
  return 'Something went wrong ';
};
