import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        {/* (tabs) 文件夹对应底部导航栏 */}
        <Stack.Screen name="(tabs)" />
        {/* video/[id] 对应播放页，设为从底部弹出效果 */}
        <Stack.Screen name="video/[id]" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}