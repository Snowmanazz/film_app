import React, { useRef } from 'react';
import {
    Animated,
    Pressable,
    StyleSheet,
    Platform,
    StyleProp,
    ViewStyle
} from 'react-native';
import { BlurView } from 'expo-blur';

// === 1. 毛玻璃容器 (GlassView) ===
interface GlassViewProps {
    style?: StyleProp<ViewStyle>;
    intensity?: number;
    children?: React.ReactNode;
    tint?: 'light' | 'dark' | 'default';
}

export const GlassView: React.FC<GlassViewProps> = ({
                                                        style,
                                                        intensity = 50,
                                                        children,
                                                        tint = 'light'
                                                    }) => {
    return (
        <BlurView
            intensity={intensity}
            tint={tint}
            style={[styles.glassDefault, style]}
        >
            {children}
        </BlurView>
    );
};

// === 2. 弹跳按钮 (BouncyBtn) ===
interface BouncyBtnProps {
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
    children?: React.ReactNode;
    glass?: boolean; // 是否开启毛玻璃背景
    scaleTo?: number; // 按下时的缩放比例

    // === 关键修复：添加 active 属性 ===
    // 即使组件内部逻辑没用到它，加上这一行也能防止 TS 报错
    active?: boolean;
}

export const BouncyBtn: React.FC<BouncyBtnProps> = ({
                                                        style,
                                                        onPress,
                                                        children,
                                                        glass = false,
                                                        scaleTo = 0.96,
                                                        active // 解构出来但不一定非要用，只是为了从 props 里剔除，防止传给底层 View 导致警告
                                                    }) => {
    // 使用 useRef 保持动画值
    const scaleVal = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleVal, {
            toValue: scaleTo,
            useNativeDriver: true,
            speed: 20,
            bounciness: 10,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleVal, {
            toValue: 1,
            useNativeDriver: true,
            speed: 20,
            bounciness: 10,
        }).start();
    };

    const animatedStyle = { transform: [{ scale: scaleVal }] };

    // 如果启用了 glass 模式，用 BlurView 包裹
    if (glass) {
        return (
            <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
                <Animated.View style={[animatedStyle, style]}>
                    <BlurView intensity={30} tint="light" style={styles.btnInner}>
                        {children}
                    </BlurView>
                </Animated.View>
            </Pressable>
        );
    }

    // 普通模式 (glass=false)
    return (
        <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
            <Animated.View style={[style, animatedStyle]}>
                {children}
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    glassDefault: {
        overflow: 'hidden',
        // 给个默认背景色防止安卓上 BlurView 失效时完全透明
        backgroundColor: Platform.OS === 'android' ? 'rgba(255,255,255,0.6)' : undefined,
    },
    btnInner: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }
});