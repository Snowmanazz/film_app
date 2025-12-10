import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Filter, ChevronDown, RefreshCw } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
// 计算高级筛选 4列 布局：(屏幕宽 - 外部padding40 - 中间gap24) / 4
const GRID_ITEM_WIDTH = (width - 40 - 24) / 4;

// 数据源
const CATEGORIES = ['全部影片', '电影', '电视剧', '综艺', '动漫', '纪录片'];
const FILTERS = {
  genre: ['全部', '动作', '喜剧', '爱情', '科幻', '悬疑', '惊悚', '恐怖'],
  year: ['全部', '2025', '2024', '2023', '2022', '2021', '2010s', '更早'],
  region: ['全部', '大陆', '美国', '日本', '韩国', '英国', '法国', '其他']
};
const MOVIES = Array(12).fill(0).map((_, i) => ({
  id: i, title: `示例影片 ${i+1}`, score: '9.2', year: '2023', tags: '科幻 / 冒险',
  poster: `https://picsum.photos/id/${30+i}/200/300`
}));

// 弹性按钮组件
const BouncyBtn = ({ children, onPress, active, style }: any) => {
  const scale = useSharedValue(1);
  const handlePressIn = () => { scale.value = withSpring(0.95); };
  const handlePressOut = () => { scale.value = withSpring(1); };
  const handlePress = () => {
    Haptics.selectionAsync();
    onPress && onPress();
  };
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <TouchableOpacity onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handlePress} activeOpacity={0.9}>
      <Animated.View style={[style, animatedStyle, active && styles.activeChip]}>
        {React.Children.map(children, child => {
          if (React.isValidElement(child) && child.type === Text) {
             return React.cloneElement(child as any, { style: [child.props.style, active && styles.activeChipText] });
          }
          return children;
        })}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function FilterScreen() {
  const router = useRouter();
  const [activeCat, setActiveCat] = useState('全部影片');
  const [selections, setSelections] = useState({ genre: '全部', year: '全部', region: '全部' });
  const [rating, setRating] = useState(7);

  // 渲染 4列 Grid
  const RenderSection = ({ title, data, type }: any) => (
    <View style={styles.sectionBox}>
      <Text style={styles.sectionLabel}>{title}</Text>
      <View style={styles.gridContainer}>
        {data.map((item: string) => (
          <BouncyBtn
            key={item}
            active={(selections as any)[type] === item}
            onPress={() => setSelections(prev => ({ ...prev, [type]: item }))}
            style={styles.gridItem}
          >
            <Text style={styles.gridText}>{item}</Text>
          </BouncyBtn>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>影片分类</Text>
          <Text style={styles.headerSub}>探索不同类型的精彩内容</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

          {/* 1. 顶部横向分类 (Pills) */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
            {CATEGORIES.map(cat => (
              <BouncyBtn key={cat} active={activeCat === cat} onPress={() => setActiveCat(cat)} style={styles.catPill}>
                <Text style={styles.catText}>{cat}</Text>
              </BouncyBtn>
            ))}
          </ScrollView>

          {/* 2. 高级筛选区 (白底卡片) */}
          <View style={styles.filterCard}>
            <View style={styles.filterHeaderRow}>
              <Filter size={16} color="#FF3B30" />
              <Text style={styles.filterHeaderTitle}>高级筛选</Text>
            </View>

            <RenderSection title="影片类型" data={FILTERS.genre} type="genre" />
            <RenderSection title="上映年份" data={FILTERS.year} type="year" />
            <RenderSection title="地区" data={FILTERS.region} type="region" />

            {/* 评分滑块 */}
            <View style={styles.sliderBox}>
              <View style={styles.sliderRow}>
                <Text style={styles.sectionLabel}>最低评分</Text>
                <Text style={styles.ratingNum}>{rating.toFixed(1)}分以上</Text>
              </View>
              <Slider
                style={{width: '100%', height: 40}}
                minimumValue={0} maximumValue={10} step={0.5} value={rating} onValueChange={setRating}
                minimumTrackTintColor="#FF3B30" maximumTrackTintColor="#F2F2F7" thumbTintColor="#FF3B30"
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderTag}>0分</Text><Text style={styles.sliderTag}>10分</Text>
              </View>
            </View>
          </View>

          {/* 3. 结果列表 (3列) */}
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>分类结果</Text>
            <TouchableOpacity style={styles.sortBtn}>
              <Text style={styles.sortText}>最新上映</Text>
              <ChevronDown size={14} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.movieGrid}>
            {MOVIES.map(m => (
              <TouchableOpacity key={m.id} style={styles.movieCard} activeOpacity={0.8} onPress={() => router.push(`/video/${m.id}`)}>
                <View style={styles.posterBox}>
                  <Image source={{ uri: m.poster }} style={styles.poster} />
                  <View style={styles.scoreTag}><Text style={styles.scoreText}>{m.score}</Text></View>
                  <View style={styles.yearTag}><Text style={styles.yearText}>{m.year}</Text></View>
                </View>
                <Text style={styles.movieTitle} numberOfLines={1}>{m.title}</Text>
                <Text style={styles.movieMeta}>{m.tags}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 加载更多 */}
          <TouchableOpacity style={styles.loadMore}>
            <RefreshCw size={14} color="#666" />
            <Text style={styles.loadMoreText}>加载更多</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' }, // 改为深色背景配合你的 HTML 风格
  header: { padding: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  headerSub: { fontSize: 13, color: '#888', marginTop: 4 },

  hScroll: { paddingHorizontal: 20, marginBottom: 20 },
  catPill: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#1E1E1E', marginRight: 10, borderWidth: 1, borderColor: '#333'
  },
  catText: { color: '#FFF', fontSize: 13 },

  filterCard: {
    backgroundColor: '#1E1E1E', marginHorizontal: 20, borderRadius: 16, padding: 16, marginBottom: 20
  },
  filterHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 15 },
  filterHeaderTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },

  sectionBox: { marginBottom: 15 },
  sectionLabel: { color: '#888', fontSize: 12, marginBottom: 8 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  gridItem: {
    width: GRID_ITEM_WIDTH, alignItems: 'center', paddingVertical: 8,
    borderRadius: 8, backgroundColor: '#2C2C2C'
  },
  gridText: { color: '#CCC', fontSize: 12 },

  activeChip: { backgroundColor: '#FF3B30' },
  activeChipText: { color: '#FFF', fontWeight: 'bold' },

  sliderBox: { marginTop: 5 },
  sliderRow: { flexDirection: 'row', justifyContent: 'space-between' },
  ratingNum: { color: '#FF3B30', fontSize: 12, fontWeight: 'bold' },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  sliderTag: { color: '#666', fontSize: 10 },

  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 10, alignItems: 'center' },
  resultTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#1E1E1E', padding: 6, borderRadius: 8 },
  sortText: { color: '#AAA', fontSize: 12 },

  movieGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, gap: 10 },
  movieCard: { width: (width - 50) / 3, marginBottom: 15 },
  posterBox: {
    width: '100%', aspectRatio: 2/3, borderRadius: 8, overflow: 'hidden', backgroundColor: '#333', marginBottom: 6, position: 'relative'
  },
  poster: { width: '100%', height: '100%' },
  scoreTag: { position: 'absolute', bottom: 0, left: 0, backgroundColor: 'rgba(255,59,48,0.9)', paddingHorizontal: 6, paddingVertical: 2, borderTopRightRadius: 8 },
  scoreText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  yearTag: { position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 4, borderRadius: 4 },
  yearText: { color: '#FFF', fontSize: 10 },
  movieTitle: { color: '#FFF', fontSize: 13, fontWeight: '600' },
  movieMeta: { color: '#666', fontSize: 11 },

  loadMore: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6, paddingVertical: 20 },
  loadMoreText: { color: '#666', fontSize: 13 }
});