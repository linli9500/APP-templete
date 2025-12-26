import { Env } from '@env';
import React from 'react';
import { ScrollView, View, TouchableOpacity, Share as RNShare, Platform, Linking, Modal } from 'react-native';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { useColorScheme } from 'nativewind';
import type { TxKeyPath } from '@/lib';
import { Stack, useRouter } from 'expo-router';
import * as StoreReview from 'expo-store-review';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Item } from '@/components/settings/item';
import { ItemsContainer } from '@/components/settings/items-container';
import { LanguageItem } from '@/components/settings/language-item';
import { SharePoster } from '@/components/settings/share-poster';
import { ThemeItem } from '@/components/settings/theme-item';
import { Text, FocusAwareStatusBar } from '@/components/ui';
import { ConfirmModal, InfoModal } from '@/components/ui/confirm-modal';
import { 
  Share, Support, Website, Rate, ArrowRight, 
  Crown, Info, Shield, Document, Palette, Language, Logout, Trash
} from '@/components/ui/icons';
import { translate } from '@/lib';
import { useSupabase } from '@/hooks/use-supabase';
import { supabase } from '@/lib/supabase';

const BackIcon = () => (
    <View className="w-10 h-10 rounded-full bg-black dark:bg-neutral-800 justify-center items-center">
        <ArrowRight color="white" className="rotate-180" />
    </View>
);

export default function Options() {
  const { signOut, session } = useSupabase();
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? 'white' : 'black';
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [shareModalVisible, setShareModalVisible] = React.useState(false);
  const shareViewRef = React.useRef<View>(null);

  // Delete Account 弹窗状态
  const [deleteConfirmVisible, setDeleteConfirmVisible] = React.useState(false);
  const [deleteResultModal, setDeleteResultModal] = React.useState<{
    visible: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ visible: false, type: 'success', message: '' });
  const [isDeleting, setIsDeleting] = React.useState(false);

  // 保存到相册弹窗状态
  const [saveModal, setSaveModal] = React.useState<{
    visible: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  }>({ visible: false, type: 'success', title: '', message: '' });

  const handleShare = () => {
    setShareModalVisible(true);
  };

  const handleSaveToAlbum = async () => {
    try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            setSaveModal({
              visible: true,
              type: 'info',
              title: translate('share.permission_required'),
              message: translate('share.album_permission_message'),
            });
            return;
        }

        if (shareViewRef.current) {
            const uri = await captureRef(shareViewRef, {
                format: 'png',
                quality: 1,
            });

            await MediaLibrary.saveToLibraryAsync(uri);
            setSaveModal({
              visible: true,
              type: 'success',
              title: translate('share.saved'),
              message: translate('share.saved'),
            });
            setShareModalVisible(false);
        }
    } catch (e) {
        console.error(e);
        setSaveModal({
          visible: true,
          type: 'error',
          title: translate('common.error'),
          message: translate('share.save_failed'),
        });
    }
  };

  const handleShareImage = async () => {
    try {
        if (shareViewRef.current) {
            const uri = await captureRef(shareViewRef, {
                format: 'png',
                quality: 1,
            });
            
            await RNShare.share({
                url: uri, // iOS supports file path
                title: Env.APP_NAME,
                message: Env.APP_NAME, // Android needs message
            });
            setShareModalVisible(false);
        }
    } catch (e) {
        console.error(e);
    }
  };

  const handleRate = async () => {
    if (await StoreReview.hasAction()) {
      StoreReview.requestReview();
    } else {
      // Fallback
      if (Platform.OS === 'ios' && Env.APPLE_STORE_ID) {
         const url = `itms-apps://itunes.apple.com/app/id${Env.APPLE_STORE_ID}?action=write-review`;
         Linking.openURL(url);
      } else if (Platform.OS === 'android') {
         // Open play store
         Linking.openURL(`market://details?id=${Env.PACKAGE}`);
      }
    }
  };

  const openWeb = (url?: string, titleKey?: TxKeyPath) => {
    if (!url) return;
    router.push({
        pathname: '/webview',
        params: { url, title: titleKey ? translate(titleKey) : '' }
    });
  };

  const handleDeleteAccount = () => {
    setDeleteConfirmVisible(true);
  };

  const executeDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase.rpc('delete_user_account');
      if (error) throw error;
      
      setDeleteConfirmVisible(false);
      await signOut();
      router.replace('/login');
      // 显示成功提示
      setDeleteResultModal({
        visible: true,
        type: 'success',
        message: translate('settings.delete_account.success'),
      });
    } catch (e) {
      console.error(e);
      setDeleteConfirmVisible(false);
      // 显示错误提示
      setDeleteResultModal({
        visible: true,
        type: 'error',
        message: translate('settings.delete_account.error'),
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-[#F5F5F0] dark:bg-neutral-900 px-6" style={{ paddingTop: insets.top }}>
        <FocusAwareStatusBar />
        
        {/* Custom Header */}
        <View className="flex-row items-center justify-between mt-6 mb-8">
            <TouchableOpacity onPress={() => router.back()}>
                <View className="w-8 h-8 rounded-full bg-black dark:bg-neutral-800 justify-center items-center" style={{ transform: [{ rotate: '180deg' }] }}>
                    <ArrowRight color="white" width={16} height={16} />
                </View>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-black dark:text-white flex-1 text-center pr-8">
                {translate('settings.title')}
            </Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          {/* 账户与偏好 */}
          <ItemsContainer title="settings.account_preferences">
            <ThemeItem />
            <LanguageItem />
            <Item 
                text="settings.subscription"
                icon={<Crown color={iconColor} width={20} height={20} />}
                onPress={() => router.push('/subscription')} 
            />
          </ItemsContainer>

          {/* 通用 */}
          <ItemsContainer title="settings.generale">
            <Item 
                text="settings.website" 
                icon={<Website color={iconColor} width={20} height={20} />} 
                onPress={() => openWeb(Env.WEBSITE_URL, 'settings.website')}
            />
            <Item 
                text="settings.rate" 
                icon={<Rate color={iconColor} width={20} height={20} />} 
                onPress={handleRate}
            />
            <Item 
                text="settings.share" 
                icon={<Share color={iconColor} width={20} height={20} />} 
                onPress={handleShare} 
            />
            <Item 
                text="settings.about"
                icon={<Info color={iconColor} width={20} height={20} />}
                onPress={() => router.push('/about')} 
            />
          </ItemsContainer>
          
          {/* 法律信息 */}
          <ItemsContainer title="settings.legal">
            <Item 
                text="settings.privacy"
                icon={<Shield color={iconColor} width={20} height={20} />}
                onPress={() => openWeb(Env.PRIVACY_URL, 'settings.privacy')} 
            />
            <Item 
                text="settings.terms"
                icon={<Document color={iconColor} width={20} height={20} />}
                onPress={() => openWeb(Env.TERMS_URL, 'settings.terms')} 
            />
          </ItemsContainer>

          {/* 支持 */}
          <ItemsContainer title="settings.support">
            <Item 
                text="settings.support" 
                icon={<Support color={iconColor} width={20} height={20} />} 
            />
          </ItemsContainer>

          {/* 危险操作 */}
          <ItemsContainer title="settings.delete_account.title">
            <Item 
                text="settings.delete_account.title"
                icon={<Trash color="#EF4444" width={20} height={20} />}
                onPress={handleDeleteAccount}
                // @ts-ignore
                textColor="text-red-500"
            />
          </ItemsContainer>

          {/* 开发测试（仅开发模式） */}
          {__DEV__ && (
            <ItemsContainer title="settings.support">
              <Item 
                  text="settings.test_animation" 
                  onPress={() => router.push('/test-animation')} 
              />
              <Item 
                  text="settings.screenshot_test" 
                  onPress={() => router.push('/screenshot-test')} 
              />
            </ItemsContainer>
          )}


          {session && (
            <View className="mt-8 mb-4 items-center">
               <TouchableOpacity 
                  onPress={async () => {
                     await signOut();
                     // 登出后回到首页 (Insight 页面)
                     router.replace('/');
                  }}
                  className="bg-black dark:bg-white rounded-full py-3 px-8 min-w-[150px] items-center"
               >
                  <Text className="text-white dark:text-black font-bold text-base">{translate('settings.logout')}</Text>
               </TouchableOpacity>
            </View>
          )}

          <View className="items-center mb-8">
            <Text className="text-sm text-gray-400 dark:text-neutral-500 font-medium">
              {Env.VERSION ?? '1.0.0'} (594)
            </Text>
          </View>
        </ScrollView>

        <Modal
            animationType="slide"
            transparent={true}
            visible={shareModalVisible}
            onRequestClose={() => setShareModalVisible(false)}
        >
            <View className="flex-1 justify-center items-center bg-black/80">
                <View className="bg-transparent mb-8">
                     <ViewShot ref={shareViewRef} options={{ format: "png", quality: 1 }}>
                        <SharePoster />
                     </ViewShot>
                </View>

                <View className="flex-row space-x-4">
                    <TouchableOpacity 
                        onPress={handleSaveToAlbum}
                        className="bg-white px-6 py-3 rounded-full flex-row items-center"
                    >
                         <Text className="text-black font-bold mr-2">⬇️ {translate('share.download')}</Text>
                    </TouchableOpacity>

                    {Platform.OS === 'ios' && (
                        <TouchableOpacity 
                            onPress={handleShareImage}
                            className="bg-black border border-white/20 px-6 py-3 rounded-full flex-row items-center"
                        >
                            <Text className="text-white font-bold mr-2">↗️ {translate('share.share')}</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity 
                    onPress={() => setShareModalVisible(false)}
                    className="absolute top-12 right-6 p-2 bg-white/20 rounded-full"
                >
                    <Text className="text-white font-bold">✕ Close</Text>
                </TouchableOpacity>
            </View>
        </Modal>
      </View>

      {/* Delete Account 确认弹窗 */}
      <ConfirmModal
        visible={deleteConfirmVisible}
        title={translate('settings.delete_account.confirm_title')}
        message={translate('settings.delete_account.confirm_message')}
        confirmText={translate('common.confirm')}
        cancelText={translate('common.cancel')}
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={executeDeleteAccount}
        onCancel={() => setDeleteConfirmVisible(false)}
      />

      {/* Delete Account 结果弹窗 */}
      <InfoModal
        visible={deleteResultModal.visible}
        title={deleteResultModal.type === 'success' 
          ? translate('settings.delete_account.title') 
          : translate('common.error')}
        message={deleteResultModal.message}
        type={deleteResultModal.type}
        onClose={() => setDeleteResultModal({ ...deleteResultModal, visible: false })}
      />

      {/* 保存到相册结果弹窗 */}
      <InfoModal
        visible={saveModal.visible}
        title={saveModal.title}
        message={saveModal.message}
        type={saveModal.type}
        onClose={() => setSaveModal({ ...saveModal, visible: false })}
      />
    </>
  );
}
