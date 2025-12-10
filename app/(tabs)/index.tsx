import React from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, Image, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Film } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Carousel from 'react-native-reanimated-carousel';
import MovingBackground from '../../components/MovingBackground';
import { GlassView, BouncyBtn } from '../../components/IslandComponents';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 40;
const BANNER_HEIGHT = BANNER_WIDTH * 0.56;

const BANNERS = ['https://picsum.photos/id/12/800/450', 'https://picsum.photos/id/24/800/450'];
const HOT_MOVIES = [
  { id: 1, title: '沙丘2', poster: 'https://picsum.photos/id/30/200/300', rate: '9.4' },
  { id: 2, title: '奥本海默', poster: 'https://picsum.photos/id/40/200/300', rate: '9.6' },
  { id: 3, title: '星际穿越', poster: 'https://picsum.photos/id/50/200/300', rate: '9.8' },
  { id: 4, title: '盗梦空间', poster: 'https://picsum.photos/id/60/200/300', rate: '9.2' },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // 动态计算顶部和底部间距
  const HEADER_HEIGHT = 56;
  const TOP_SPACE = insets.top + HEADER_HEIGHT + 20;

  return (
    <View style={styles.container}>
    <MovingBackground />
    {/* 顶部状态栏遮罩 */}
    <BlurView
      intensity={50}
      tint="light"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top, zIndex: 99 }}
    />
      {/* === 灵动岛悬浮头部 === */}
      <GlassView
        style={[styles.floatingHeader, { top: Platform.OS === 'ios' ? insets.top : insets.top + 10, height: HEADER_HEIGHT }]}
        intensity={80}
      >
        <View style={styles.logoBox}>
          <View style={styles.logoIcon}><Film size={18} color="#FFF" /></View>
          <Text style={styles.logoText}>影视</Text>
        </View>
        <View style={styles.searchBox}>
          <Search size={16} color="#8E8E93" style={{marginLeft: 10}} />
          <TextInput
            placeholder="搜索影片..."
            placeholderTextColor="#8E8E93"
            style={styles.searchInput}
          />
        </View>
        <Image source={{ uri: 'https://i.pravatar.cc/100' }} style={styles.avatar} />
      </GlassView>

      <ScrollView
        contentContainerStyle={{
          paddingTop: TOP_SPACE, // 关键：把内容顶下来
          paddingBottom: 130     // 关键：把底部撑上去，避开 TabBar
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* === 轮播图 === */}
        <View style={styles.carouselWrapper}>
           <GlassView style={styles.carouselGlass} intensity={40}>
             <Carousel
                loop width={BANNER_WIDTH} height={BANNER_HEIGHT} autoPlay={true}
                data={BANNERS} scrollAnimationDuration={1000}
                panGestureHandlerProps={{ activeOffsetX: [-10, 10] }}
                renderItem={({ item }) => (
                  <Image source={{ uri: item }} style={styles.bannerImg} />
                )}
             />
           </GlassView>
        </View>

        {/* === 热门推荐 === */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>热门推荐</Text>
          <BouncyBtn glass={false} onPress={() => router.push('/category')}>
             <Text style={styles.moreText}>更多 {'>'}</Text>
          </BouncyBtn>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
           {HOT_MOVIES.map(m => (
             <BouncyBtn key={m.id} style={styles.movieCard} onPress={() => router.push(`/video/${m.id}`)}>
               <Image source={{ uri: m.poster }} style={styles.poster} />
               <GlassView style={styles.rateTag} intensity={60}>
                  <Text style={styles.rateText}>{m.rate}</Text>
               </GlassView>
               <Text style={styles.movieTitle} numberOfLines={1}>{m.title}</Text>
             </BouncyBtn>
           ))}
        </ScrollView>

        {/* === 最近更新 (测试长列表防遮挡) === */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>最近更新</Text>
        </View>
        <View style={{paddingHorizontal: 20}}>
           {[1,2,3,4,5].map(i => (
             <GlassView key={i} style={styles.listRow} intensity={30}>
                <Image source={{ uri: `https://picsum.photos/id/${70+i}/100/100` }} style={styles.listImg} />
                <View style={{justifyContent: 'center', flex: 1}}>
                   <Text style={{fontWeight:'bold', fontSize: 15, color: '#333'}}>更新剧集名称 {i}</Text>
                   <Text style={{color:'#666', fontSize:12, marginTop:4}}>第 {i+5} 集 · 刚刚更新</Text>
                </View>
             </GlassView>
           ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },

  floatingHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: 16, paddingHorizontal: 12, borderRadius: 32,
    position: 'absolute', left: 0, right: 0, zIndex: 100,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)'
  },
  logoBox: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { width: 28, height: 28, backgroundColor: '#007AFF', borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 6 },
  logoText: { color: '#000', fontWeight: 'bold', fontSize: 15 },
  searchBox: { flex: 1, marginHorizontal: 10, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.05)', flexDirection: 'row', alignItems: 'center' },
  searchInput: { flex: 1, color: '#000', fontSize: 13, marginLeft: 6 },
  avatar: { width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: '#FFF' },

  carouselWrapper: { alignItems: 'center', marginBottom: 20 },
  carouselGlass: { padding: 4, borderRadius: 24, width: BANNER_WIDTH + 8, height: BANNER_HEIGHT + 8 },
  bannerImg: { width: '100%', height: '100%', borderRadius: 20 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 12, marginTop: 10, alignItems: 'center' },
  sectionTitle: { color: '#000', fontSize: 18, fontWeight: '800', letterSpacing: -0.5 },
  moreText: { color: '#007AFF', fontSize: 13, fontWeight: '600' },

  movieCard: { width: 110, marginRight: 14, padding: 5, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.6)' },
  poster: { width: '100%', height: 145, borderRadius: 12, marginBottom: 8 },
  rateTag: { position: 'absolute', top: 10, right: 10, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 8, overflow:'hidden' },
  rateText: { color: '#000', fontSize: 10, fontWeight: 'bold' },
  movieTitle: { color: '#000', fontSize: 12, textAlign: 'center', fontWeight: '600', paddingBottom: 4 },

  listRow: { flexDirection: 'row', padding: 10, marginBottom: 10, borderRadius: 16, gap: 12 },
  listImg: { width: 60, height: 60, borderRadius: 10 }
});