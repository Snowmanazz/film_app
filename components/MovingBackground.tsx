import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

// 定义光球组件
const Blob = ({ color, size, top, left, duration, delay }: any) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Y轴随机浮动
    translateY.value = withRepeat(
      withTiming(Math.random() * 100 - 50, { duration: duration, easing: Easing.inOut(Easing.ease) }),
      -1, true
    );
    // X轴随机浮动
    translateX.value = withRepeat(
      withTiming(Math.random() * 80 - 40, { duration: duration * 1.2, delay: delay }),
      -1, true
    );
    // 大小轻微呼吸
    scale.value = withRepeat(
      withTiming(1.1, { duration: duration * 1.5 }),
      -1, true
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { translateX: translateX.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[{
        position: 'absolute', top, left, width: size, height: size, borderRadius: size / 2,
        backgroundColor: color, opacity: 0.5,
      }, style]}
    />
  );
};

export default function MovingBackground() {
  return (
    <View style={StyleSheet.absoluteFill}>
      {/* iOS 风格的蓝紫光晕 */}
      <Blob color="#4facfe" size={300} top={-50} left={-50} duration={8000} delay={0} />
      <Blob color="#a18cd1" size={250} top={height / 3} left={width - 150} duration={9000} delay={1000} />
      <Blob color="#fbc2eb" size={280} top={height - 300} left={-80} duration={7000} delay={2000} />
      {/* 覆盖一层高斯模糊，让光球晕开 */}
      <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
    </View>
  );
}