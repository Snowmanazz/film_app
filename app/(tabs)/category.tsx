import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Filter, ChevronDown, ChevronUp, Search } from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS
} from 'react-native-reanimated';
import MovingBackground from '../../components/MovingBackground';
import { GlassView, BouncyBtn } from '../../components/IslandComponents';
import { getAppConfig, searchVideos } from '../../app/api/endpoints';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const GRID_ITEM_WIDTH = (width - 40 - 32 - 24) / 4;
const MOVIE_ITEM_WIDTH = (width - 30 - 20) / 3;

export default function CategoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [filters, setFilters] = useState<any>({ genre: [], year: [], region: [] });
  
  const [activeMain, setActiveMain] = useState('all');
  const [selections, setSelections] = useState({ genre: '全部', year: '全部', region: '全部' });
  const [rating, setRating] = useState(7.0);
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // === 初始加载配置 ===
  useEffect(() => {
    getAppConfig().then(res => {
      setCategories(res.categories);
      setFilters(res.filters);
      // Set initial active main category if available
      if (res.categories.length > 0) setActiveMain(res.categories[0].id);
    });
  }, []);

  // === 监听筛选变化加载列表 ===
  useEffect(() => {
    setLoading(true);
    searchVideos({
      category: activeMain,
      genre: selections.genre === '全部' ? '' : selections.genre,
      year: selections.year === '全部' ? '' : selections.year,
      region: selections.region === '全部' ? '' : selections.region,
      minRating: rating
    }).then(res => {
      setMovies(res.list);
      setLoading(false);
    });
  }, [activeMain, selections, rating]);


  // === 动画优化 ===
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0); // 存储真实高度
  const animHeight = useSharedValue(0);
  const animRotate = useSharedValue(0);

  const toggleFilter = () => {
    if (!expanded) {
      // 展开：高度设为测量到的真实高度，速度 250ms
      animHeight.value = withTiming(contentHeight, { duration: 250, easing: Easing.out(Easing.quad) });
      animRotate.value = withTiming(180, { duration: 250 });
    } else {
      // 收起：高度归零
      animHeight.value = withTiming(0, { duration: 250, easing: Easing.out(Easing.quad) });
      animRotate.value = withTiming(0, { duration: 250 });
    }
    setExpanded(!expanded);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: animHeight.value,
    opacity: animHeight.value === 0 ? 0 : 1, // 收起时完全隐藏防止触摸
    overflow: 'hidden'
  }));

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${animRotate.value}deg` }]
  }));

  // 头部高度
  const HEADER_HEIGHT = 56;
  const HEADER_TOP = Platform.OS === 'ios' ? insets.top : insets.top + 10;
  // 内容起始位置 = 头部位置 + 高度 + 间距
  const CONTENT_PADDING_TOP = HEADER_TOP + HEADER_HEIGHT + 15;

  const RenderGrid = ({ data = [], type }: any) => (
    <View style={styles.gridContainer}>
      {data.map((item: string) => (
        <BouncyBtn
          key={item} active={(selections as any)[type] === item}
          onPress={() => setSelections(prev => ({ ...prev, [type]: item }))}
          style={[styles.gridItem, { width: GRID_ITEM_WIDTH }]}
        >
          <Text style={[styles.gridText, (selections as any)[type] === item && styles.activeText]}>{item}</Text>
        </BouncyBtn>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <MovingBackground />

      {/* 头部固定 */}
      <GlassView
        style={[styles.floatingHeader, { top: HEADER_TOP, height: HEADER_HEIGHT }]}
        intensity={90}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 4 }}
        >
          {categories.map(cat => (
            <BouncyBtn
              key={cat.id} active={activeMain === cat.id} onPress={() => setActiveMain(cat.id)}
              glass={false}
              style={[styles.headerPill, activeMain === cat.id && styles.activeHeaderPill]}
            >
              <Text style={[styles.headerPillText, activeMain === cat.id && styles.activePillText]}>{cat.name}</Text>
            </BouncyBtn>
          ))}
        </ScrollView>
        <View style={styles.searchIconWrap}><Search size={18} color="#666" /></View>
      </GlassView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: CONTENT_PADDING_TOP, paddingBottom: 160 }}
      >
        {/* === 高级筛选 === */}
        <GlassView style={styles.filterCard} intensity={50}>
          <BouncyBtn glass={false} style={styles.cardHeaderBtn} onPress={toggleFilter}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
              <Filter size={16} color="#007AFF" />
              <Text style={styles.cardTitle}>高级筛选</Text>
              {!expanded && (
                <Text style={styles.summaryText} numberOfLines={1}>
                  {selections.genre} · {selections.year} · {selections.region}
                </Text>
              )}
            </View>
            <Animated.View style={arrowStyle}>
               <ChevronDown size={18} color="#666" />
            </Animated.View>
          </BouncyBtn>

          {/* 动画容器 */}
          <Animated.View style={animatedStyle}>
            {/* 这里的 View 用来测量真实内容高度 */}
            <View
              style={{ paddingTop: 10, position: 'absolute', width: '100%' }}
              onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
            >
              <View style={styles.divider} />
              <View style={styles.sectionBox}><Text style={styles.sectionLabel}>类型</Text><RenderGrid data={filters.genre} type="genre" /></View>
              <View style={styles.sectionBox}><Text style={styles.sectionLabel}>年份</Text><RenderGrid data={filters.year} type="year" /></View>
              <View style={styles.sliderBox}>
                <View style={styles.sliderHeader}>
                  <Text style={styles.sectionLabel}>评分</Text>
                  <Text style={styles.ratingValue}>{rating.toFixed(1)}分+</Text>
                </View>
                <Slider
                  style={{ width: '100%', height: 40 }} minimumValue={0} maximumValue={10} step={0.5} value={rating} onValueChange={setRating}
                  minimumTrackTintColor="#007AFF" maximumTrackTintColor="rgba(0,0,0,0.1)" thumbTintColor="#007AFF"
                />
              </View>
            </View>
          </Animated.View>
        </GlassView>

        {/* === 结果列表 === */}
        <View style={styles.sortBar}>
          <Text style={styles.resultTitle}>分类结果</Text>
          <BouncyBtn style={styles.sortBtn} glass={true}><Text style={styles.sortText}>最新上映</Text><ChevronDown size={14} color="#666" /></BouncyBtn>
        </View>
        
        {loading ? (
            <View style={{height: 200, justifyContent:'center', alignItems:'center'}}>
               <ActivityIndicator color="#007AFF" />
            </View>
        ) : (
          <View style={styles.movieGrid}>
            {movies.map(m => (
              <BouncyBtn key={m.id} style={[styles.movieItem, { width: MOVIE_ITEM_WIDTH }]} onPress={() => router.push(`/video/${m.id}`)}>
                <Image source={{ uri: m.poster }} style={styles.poster} />
                <GlassView style={styles.scoreBadge} intensity={70}><Text style={styles.scoreText}>{m.score}</Text></GlassView>
                <Text style={styles.movieTitle} numberOfLines={1}>{m.title}</Text>
              </BouncyBtn>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  floatingHeader: {
    position: 'absolute', left: 16, right: 16, zIndex: 100,
    borderRadius: 28,
    flexDirection: 'row', alignItems: 'center', paddingLeft: 4, paddingRight: 40,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)',
    backgroundColor: 'rgba(255,255,255,0.85)'
  },
  headerPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 4 },
  activeHeaderPill: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  headerPillText: { fontSize: 13, color: '#666', fontWeight: '600' },
  activePillText: { color: '#007AFF' },
  searchIconWrap: { position: 'absolute', right: 4, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },

  filterCard: { marginHorizontal: 20, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 24, marginBottom: 20 },
  cardHeaderBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingVertical: 4 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#000' },
  summaryText: { fontSize: 12, color: '#888', marginLeft: 10, flex: 1 },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginBottom: 15 },

  sectionBox: { marginBottom: 15 },
  sectionLabel: { fontSize: 13, color: '#8E8E93', marginBottom: 8, fontWeight: '500' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  gridItem: { paddingVertical: 8, alignItems: 'center', borderRadius: 12 },
  gridText: { fontSize: 12, color: '#555', fontWeight: '500' },
  activeText: { color: '#007AFF', fontWeight: 'bold' },

  sliderBox: { marginTop: 5 },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: -5 },
  ratingValue: { fontSize: 13, color: '#007AFF', fontWeight: '700' },

  sortBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  resultTitle: { fontSize: 20, fontWeight: '700' },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14 },
  sortText: { fontSize: 13, color: '#666', fontWeight: '500' },
  movieGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, gap: 10 },
  movieItem: { padding: 5, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.5)' },
  poster: { width: '100%', aspectRatio: 2/3, borderRadius: 12, marginBottom: 8 },
  scoreBadge: { position: 'absolute', bottom: 10, right: 10, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 8 },
  scoreText: { color: '#000', fontSize: 10, fontWeight: 'bold' },
  movieTitle: { fontSize: 13, color: '#000', fontWeight: '600', textAlign: 'center', paddingBottom: 4 },
});