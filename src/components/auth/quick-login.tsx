import React from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, View, showErrorMessage, showSuccessMessage } from '@/components/ui';
import { useSignIn } from '@/hooks/use-sign-in';
import { useRouter } from 'expo-router';

export const QuickLogin = () => {
  const { signInWithPassword } = useSignIn();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  // Hardcoded test credentials (DEV ONLY)
  // TODO: Replace with your actual development test account
  const TEST_EMAIL = "pivot9572@gmail.com"; 
  const TEST_PASS = "aa123456";

  if (!__DEV__) return null;

  const handleQuickLogin = async () => {
    try {
      setLoading(true);
      await signInWithPassword({ email: TEST_EMAIL, password: TEST_PASS });
      showSuccessMessage('Dev Login Success');
      router.replace('/');
    } catch (error: any) {
      console.error("Dev Login Error:", error);
       showErrorMessage(`Dev Login Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="absolute bottom-10 right-4 z-50">
      <TouchableOpacity 
        onPress={handleQuickLogin}
        disabled={loading}
        className="bg-neutral-800/80 rounded-full px-4 py-2 flex-row items-center space-x-2"
        style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}
      >
         {loading ? <ActivityIndicator color="white" size="small" /> : <Text className="text-white text-xs font-bold uppercase tracking-wider">⚡ Dev Login</Text>}
      </TouchableOpacity>
    </View>
  );
};
