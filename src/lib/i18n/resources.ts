import en from '@/translations/en';
import zhCN from '@/translations/zh-CN';
import zhTW from '@/translations/zh-TW';

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
