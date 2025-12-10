import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Settings, ChevronRight,
  MessageSquare, Eraser, Palette, Info,
  Download, Heart, Clock
} from 'lucide-react-native';
import MovingBackground from '../../components/MovingBackground';
import { GlassView, BouncyBtn } from '../../components/IslandComponents';
import { BlurView } from 'expo-blur';

// === 1. 顶部工具菜单 ===
const MENU_ITEMS = [
  { icon: MessageSquare, label: '反馈', color: '#FF9500', action: 'feedback' },
  { icon: Eraser, label: '清理', color: '#FF2D55', action: 'clear' },
  { icon: Palette, label: '皮肤', color: '#AF52DE', action: 'theme' },
  { icon: Info, label: '关于', color: '#007AFF', action: 'about' },
];

// === 模拟数据 ===
const HISTORY = [
  { id: 1, title: '复仇者联盟4：终局之战', time: '1:24:30', progress: 0.65, poster: 'https://picsum.photos/id/10/100/150' },
  { id: 2, title: '星际穿越', time: '0:45:10', progress: 0.30, poster: 'https://picsum.photos/id/20/100/150' }
];

const DOWNLOADS = [
  { id: 1, title: '黑客帝国', size: '1.2GB', poster: 'https://picsum.photos/id/30/200/300' },
  { id: 2, title: '盗梦空间', size: '850MB', poster: 'https://picsum.photos/id/40/200/300' },
  { id: 3, title: '阿凡达2', size: '2.1GB', poster: 'https://picsum.photos/id/50/200/300' },
];

const FAVORITES = [
  { id: 1, title: '肖申克的救赎', poster: 'https://picsum.photos/id/60/200/300' },
  { id: 2, title: '教父', poster: 'https://picsum.photos/id/70/200/300' },
  { id: 3, title: '蝙蝠侠：黑暗骑士', poster: 'https://picsum.photos/id/80/200/300' },
  { id: 4, title: '泰坦尼克号', poster: 'https://picsum.photos/id/90/200/300' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  const HEADER_HEIGHT = 60;
  const HEADER_TOP = Platform.OS === 'ios' ? insets.top : insets.top + 10;
  const PADDING_TOP = HEADER_TOP + HEADER_HEIGHT + 20;

  const handleMenuPress = (action: string) => {
    if (action === 'clear') Alert.alert('清理完成', '已释放 234MB 空间');
    else if (action === 'feedback') Alert.alert('提示', '跳转反馈页面');
  };

  return (
      <View style={styles.container}>
        <MovingBackground />
        {/* 顶部防遮挡 Blur */}
        <BlurView intensity={30} tint="light" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top, zIndex: 99 }} />

        {/* === 悬浮用户信息头部 === */}
        <GlassView
            style={[styles.floatingHeader, { top: HEADER_TOP, height: HEADER_HEIGHT }]}
            intensity={80}
        >
          <Image source={{ uri: 'https://i.pravatar.cc/150?u=8' }} style={styles.avatarSmall} />

          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>Zinat</Text>
            <View style={styles.vipBadge}>
              <Text style={styles.vipText}>VIP 2025.10 到期</Text>
            </View>
          </View>

          <BouncyBtn glass={false} style={styles.headerRightBtn}>
            <Settings size={20} color="#333" />
          </BouncyBtn>
        </GlassView>

        <ScrollView
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: PADDING_TOP, paddingBottom: 160 }}
            showsVerticalScrollIndicator={false}
        >

          {/* === 1. 工具菜单 Grid (完美对标高级筛选) === */}
          <View style={styles.menuGrid}>
            {MENU_ITEMS.map((item, idx) => (
                // 这里使用了 GlassView 来包裹，确保质感一致
                <GlassView key={idx} intensity={60} style={styles.glassMenuItemWrapper}>
                  <BouncyBtn glass={false} style={styles.menuItemContent} onPress={() => handleMenuPress(item.action || '')}>
                    {/* 图标不再有沉重的背景色，而是直接显示颜色，更轻盈 */}
                    <item.icon size={22} color={item.color} style={{marginBottom: 6}} />
                    <Text style={styles.menuLabel}>{item.label}</Text>
                  </BouncyBtn>
                </GlassView>
            ))}
          </View>

          {/* === 2. 历史记录 (继续观看) === */}
          <SectionHeader title="继续观看" icon={Clock} rightText="清除" onRightPress={() => {}} />

          {HISTORY.map((item) => (
              <GlassView key={item.id} style={styles.historyItem} intensity={50}>
                <View style={styles.hPosterBox}>
                  <Image source={{ uri: item.poster }} style={styles.hPoster} />
                  <GlassView style={styles.timeTag} intensity={80}><Text style={styles.timeText}>{item.time}</Text></GlassView>
                </View>
                <View style={styles.hInfo}>
                  <Text style={styles.hTitle} numberOfLines={1}>{item.title}</Text>
                  <View style={styles.progressRow}>
                    <View style={styles.progressBg}>
                      <View style={[styles.progressFill, { width: `${item.progress * 100}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{Math.round(item.progress * 100)}%</Text>
                  </View>
                  <Text style={styles.continueText}>上次看到 23:40</Text>
                </View>
                <BouncyBtn glass={false} style={styles.playBtnSmall}>
                  <ChevronRight size={14} color="#FFF" />
                </BouncyBtn>
              </GlassView>
          ))}

          {/* === 3. 本地缓存 (横向滚动) === */}
          <SectionHeader title="本地缓存" icon={Download} rightText="管理" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll} contentContainerStyle={styles.hScrollContent}>
            {DOWNLOADS.map(item => (
                <BouncyBtn key={item.id} style={styles.vCard}>
                  <Image source={{ uri: item.poster }} style={styles.vPoster} />
                  <View style={styles.downloadBadge}>
                    <Text style={styles.downloadSize}>{item.size}</Text>
                  </View>
                  <Text style={styles.vTitle} numberOfLines={1}>{item.title}</Text>
                </BouncyBtn>
            ))}
          </ScrollView>

          {/* === 4. 我的收藏 (横向滚动) === */}
          <SectionHeader title="我的收藏" icon={Heart} rightText="全部" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll} contentContainerStyle={styles.hScrollContent}>
            {FAVORITES.map(item => (
                <BouncyBtn key={item.id} style={styles.vCard}>
                  <Image source={{ uri: item.poster }} style={styles.vPoster} />
                  <Text style={styles.vTitle} numberOfLines={1}>{item.title}</Text>
                </BouncyBtn>
            ))}
          </ScrollView>

        </ScrollView>
      </View>
  );
}

// 辅助组件
const SectionHeader = ({ title, icon: Icon, rightText, onRightPress }: any) => (
    <View style={styles.sectionHeader}>
      <View style={{flexDirection:'row', alignItems:'center', gap: 6}}>
        {Icon && <Icon size={16} color="#333" />}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <BouncyBtn glass={false} onPress={onRightPress}>
        <Text style={styles.clearText}>{rightText} {'>'}</Text>
      </BouncyBtn>
    </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },

  // 头部样式
  floatingHeader: {
    position: 'absolute', left: 16, right: 16, zIndex: 100,
    borderRadius: 32,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)',
    backgroundColor: 'rgba(255,255,255,0.85)', // 提高不透明度，增加质感
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10,
  },
  avatarSmall: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#FFF' },
  headerInfo: { marginLeft: 10, flex: 1 },
  headerName: { fontSize: 15, fontWeight: '700', color: '#000' },
  vipBadge: { backgroundColor: '#1C1C1E', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginTop: 2 },
  vipText: { fontSize: 9, color: '#FFD700', fontWeight: '700' },
  headerRightBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 20 },

  // === 关键修改：菜单 Grid (对标高级筛选) ===
  menuGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12 // 间距
  },
  glassMenuItemWrapper: {
    flex: 1,
    borderRadius: 20, // 大圆角，接近分类页的 24，但因为这里小一点，20比较协调
    overflow: 'hidden',
    // 这里的 paddingVertical: 12 严格对标分类页的 filterCard
  },
  menuItemContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12, // 这里的 12 就是你要的高度一致的关键
  },
  // 移除了 iconCircle 背景，看起来更干净，像分类页的 Header
  menuLabel: {
    color: '#333',
    fontSize: 12,
    fontWeight: '600'
  },

  // 标题栏
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 8, paddingHorizontal: 4 },
  sectionTitle: { color: '#000', fontSize: 16, fontWeight: '700' },
  clearText: { color: '#8E8E93', fontSize: 12, fontWeight: '500' },

  // 历史记录
  historyItem: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 20, marginBottom: 10, backgroundColor: 'rgba(255,255,255,0.5)' },
  hPosterBox: { width: 60, height: 86, borderRadius: 10, overflow: 'hidden', marginRight: 12 },
  hPoster: { width: '100%', height: '100%' },
  timeTag: { position: 'absolute', bottom: 3, right: 3, paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 },
  timeText: { color: '#000', fontSize: 8, fontWeight: 'bold' },
  hInfo: { flex: 1, justifyContent: 'center' },
  hTitle: { color: '#000', fontSize: 14, fontWeight: '700', marginBottom: 6 },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  progressBg: { height: 3, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 1.5, flex: 1, marginRight: 8 },
  progressFill: { height: '100%', backgroundColor: '#007AFF', borderRadius: 1.5 },
  progressText: { color: '#007AFF', fontSize: 10, fontWeight: '600' },
  continueText: { color: '#999', fontSize: 10 },
  playBtnSmall: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#007AFF', alignItems: 'center', justifyContent: 'center' },

  // 横向滚动
  hScroll: { marginHorizontal: -20, marginBottom: 10 },
  hScrollContent: { paddingHorizontal: 20, paddingRight: 6 },

  // 竖版卡片
  vCard: { marginRight: 12, width: 96 },
  vPoster: { width: 96, height: 136, borderRadius: 12, marginBottom: 6, backgroundColor: '#DDD' },
  vTitle: { fontSize: 12, color: '#333', fontWeight: '600', textAlign: 'center' },

  // 缓存标记
  downloadBadge: {
    position: 'absolute', top: 4, right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 4, paddingVertical: 2,
    borderRadius: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)'
  },
  downloadSize: { color: '#FFF', fontSize: 8, fontWeight: 'bold' }
});