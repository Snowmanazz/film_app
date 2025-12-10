import React from 'react';
import { StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur'; // 使用原生模糊

interface SoftCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  blur?: boolean; // 是否开启毛玻璃模式
}

export default function SoftCard({ children, style, blur = false }: SoftCardProps) {
  if (blur && Platform.OS === 'ios') {
    return (
      <BlurView intensity={30} tint="light" style={[styles.card, styles.blurCard, style]}>
        {children}
      </BlurView>
    );
  }

  return (
    // Android 或非模糊模式使用纯白背景 + 高级阴影
    <BlurView intensity={0} style={[styles.card, styles.solidCard, style]}>
       {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20, // iOS 风格的大圆角
    overflow: 'hidden',
    marginBottom: 16,
  },
  solidCard: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#8E8E93',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, // 极其柔和的阴影
    shadowRadius: 12,
    elevation: 3,
  },
  blurCard: {
    backgroundColor: 'rgba(255,255,255,0.6)', // 半透明
  }
});