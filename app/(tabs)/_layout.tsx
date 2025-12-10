import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Home, Grid3X3, User } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  // 底部安全区高度，用于调整图标位置
  const bottomInset = insets.bottom > 0 ? insets.bottom - 10 : 10;

  return (
    <>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#999',
          tabBarShowLabel: true,

          // === 关键设置：让 Tab 栏绝对定位且透明 ===
          tabBarStyle: {
            position: 'absolute', // 1. 绝对定位，内容才能滚到它下面
            bottom: 25,           // 2. 悬浮距离底部
            left: 20,             // 3. 左右留白，形成胶囊感
            right: 20,
            height: 70,           // 固定高度
            borderRadius: 35,     // 大圆角
            backgroundColor: 'transparent', // 4. 必须透明
            borderTopWidth: 0,    // 去掉安卓默认边框
            elevation: 0,         // 去掉安卓默认阴影
            shadowColor: '#000',  // iOS 阴影
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
          },
          // === 关键设置：调整 Label 样式 ===
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            marginBottom: 8, // 文字稍微靠上
          },
          // === 关键设置：调整 Icon 样式 ===
          tabBarIconStyle: {
            marginTop: 8, // 图标稍微靠下
          },

          // === 核心：使用 BlurView 作为背景 ===
          tabBarBackground: () => (
            <BlurView
              intensity={80} // 模糊强度
              tint="light"   // 亮色毛玻璃
              style={{
                ...StyleSheet.absoluteFillObject, // 撑满整个 TabBar
                borderRadius: 35, // 跟随 TabBar 的圆角
                overflow: 'hidden',
                backgroundColor: 'rgba(255,255,255,0.4)', // 叠加一层半透明白，防止背景太花
              }}
            />
          ),
        }}>

        <Tabs.Screen
          name="index"
          options={{
            title: '首页',
            tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          }}
        />

        <Tabs.Screen
          name="category"
          options={{
            title: '分类',
            tabBarIcon: ({ color }) => <Grid3X3 size={24} color={color} />,
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: '我的',
            tabBarIcon: ({ color }) => <User size={24} color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}