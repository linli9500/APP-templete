import en from '@/translations/en.json';
import zhCN from '@/translations/zh-CN.json';
import zhTW from '@/translations/zh-TW.json';

export const resources = {
  en: {
    translation: en,
  },
  'zh-CN': {
    translation: zhCN,
  },
  'zh-TW': {
    translation: zhTW,
  },
};

export type Language = keyof typeof resources;
