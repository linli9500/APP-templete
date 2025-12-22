import { useLocalSearchParams, Stack } from 'expo-router';
import { WebView } from 'react-native-webview';
import { StyleSheet } from 'react-native';

export default function WebViewScreen() {
  const params = useLocalSearchParams<{ url: string; title?: string }>();
  
  return (
    <>
      <Stack.Screen options={{ title: params.title || 'Web View' }} />
      <WebView 
        source={{ uri: params.url }} 
        style={styles.container}
        startInLoadingState
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
