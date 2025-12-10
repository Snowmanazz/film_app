import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Share2, Star, Download, MoreHorizontal, ChevronDown, ChevronUp, Send, MessageCircle, ThumbsUp, Heart } from 'lucide-react-native';
import MovingBackground from '../../components/MovingBackground';
import { GlassView, BouncyBtn } from '../../components/IslandComponents';

const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = width * 0.5625; // 16:9
const REC_ITEM_WIDTH = (width - 40 - 20) / 3 - 0.5;

// === 模拟数据 ===
const CAST = [
  { id: 1, name: '克里斯托弗', role: '导演', img: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: '马修·麦康纳', role: '库珀', img: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, name: '安妮·海瑟薇', role: '布兰德', img: 'https://i.pravatar.cc/150?u=3' },
  { id: 4, name: '杰西卡', role: '墨菲', img: 'https://i.pravatar.cc/150?u=4' },
];
const RECS = [
  { id: 1, title: '星际迷航', poster: 'https://picsum.photos/id/10/200/300' },
  { id: 2, title: '太空漫游', poster: 'https://picsum.photos/id/20/200/300' },
  { id: 3, title: '第三类接触', poster: 'https://picsum.photos/id/30/200/300' },
];
const COMMENTS = [
  { id: 1, user: '星际旅行者', avatar: 'https://i.pravatar.cc/150?u=5', content: '诺兰的又一神作！视觉效果震撼，剧情引人深思。', date: '2天前', likes: 128 },
  { id: 2, user: '科幻迷', avatar: 'https://i.pravatar.cc/150?u=6', content: '黑洞的特效简直令人惊叹。', date: '1周前', likes: 96 },
  { id: 3, user: '路人甲', avatar: 'https://i.pravatar.cc/150?u=7', content: '测试评论滚动。', date: '1周前', likes: 2 },
  { id: 4, user: '路人乙', avatar: 'https://i.pravatar.cc/150?u=8', content: '这里的内容会往下滑，但标题和视频不会动。', date: '1周前', likes: 5 },
  { id: 5, user: '测试员', avatar: 'https://i.pravatar.cc/150?u=9', content: '多加几条评论撑开高度...', date: '刚刚', likes: 1 },
];

export default function VideoScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isCollected, setIsCollected] = useState(false);

  const navBarHeight = insets.top + 50;

  return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />

        {/* === 第一部分：完全固定的头部区域 (Nav + Video + Title) === */}
        <View style={styles.fixedHeaderContainer}>

          {/* 1. 顶部导航栏 */}
          <View style={[styles.navBar, { height: navBarHeight, paddingTop: insets.top }]}>
            <BouncyBtn onPress={() => router.back()} style={styles.navBackBtn} glass={false}>
              <ArrowLeft size={24} color="#000" />
            </BouncyBtn>
            <Text style={styles.navTitle} numberOfLines={1}>详情页</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* 2. 视频播放器 */}
          <View style={{ height: VIDEO_HEIGHT, backgroundColor: '#000' }}>
            <Video
                style={styles.video}
                source={{ uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay={false}
            />
          </View>

          {/* 3. 标题信息区 (现在固定在这里，不随下面滚动) */}
          <View style={styles.fixedTitleSection}>
            <Text style={styles.mainTitle} selectable>星际穿越：无限边疆</Text>
            <View style={styles.metaRow}>
              <View style={styles.scoreTag}>
                <Text style={styles.scoreText}>9.8</Text>
              </View>
              <Text style={styles.metaText}>2023 · 科幻 · 冒险</Text>
              <Text style={styles.metaText}>120万次播放</Text>
            </View>
          </View>

          {/* 分割线阴影，让滚动内容看起来像是在标题下方穿梭 */}
          <View style={styles.separatorShadow} />
        </View>

        {/* 背景 (只在下半部显示) */}
        <View style={[StyleSheet.absoluteFill, { zIndex: -1, top: navBarHeight + VIDEO_HEIGHT, overflow: 'hidden' }]}>
          <MovingBackground />
        </View>

        {/* === 第二部分：可滚动的剩余空间 === */}
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
            keyboardVerticalOffset={0}
        >
          <View style={{ flex: 1 }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingTop: 16, // 给上面留点呼吸空间
                  paddingBottom: 120
                }}
            >
              <View style={styles.contentPadding}>

                {/* 操作按钮 (胶囊) - 让它们随内容滚动，不然上面太挤了 */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.actionRow}
                    style={{ flexGrow: 0, marginBottom: 20 }}
                >
                  <CapsuleBtn
                      icon={ThumbsUp}
                      label={isLiked ? "1.2w" : "点赞"}
                      active={isLiked}
                      onPress={() => setIsLiked(!isLiked)}
                  />
                  <CapsuleBtn
                      icon={Heart}
                      label={isCollected ? "已收藏" : "收藏"}
                      active={isCollected}
                      color="#FF2D55"
                      onPress={() => setIsCollected(!isCollected)}
                  />
                  <CapsuleBtn icon={Share2} label="分享" />
                  <CapsuleBtn icon={Download} label="缓存" />
                </ScrollView>

                {/* 简介 */}
                <GlassView style={styles.card} intensity={40}>
                  <Text style={styles.sectionTitle}>剧情简介</Text>
                  <Text style={styles.descText} numberOfLines={isDescExpanded ? undefined : 3}>
                    在未来的世界里，地球面临着严重的资源枯竭和环境恶化。一组勇敢的宇航员踏上了穿越虫洞的旅程，寻找人类新的家园...
                  </Text>
                  <BouncyBtn glass={false} style={styles.expandBtn} onPress={() => setIsDescExpanded(!isDescExpanded)}>
                    <Text style={styles.expandText}>{isDescExpanded ? '收起' : '展开全部'}</Text>
                    {isDescExpanded ? <ChevronUp size={14} color="#007AFF" /> : <ChevronDown size={14} color="#007AFF" />}
                  </BouncyBtn>
                </GlassView>

                {/* 演职人员 */}
                <View style={styles.sectionBox}>
                  <Text style={styles.sectionHeader}>演职人员</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 15 }}>
                    {CAST.map(c => (
                        <View key={c.id} style={styles.castItem}>
                          <Image source={{ uri: c.img }} style={styles.castAvatar} />
                          <Text style={styles.castName} numberOfLines={1}>{c.name}</Text>
                          <Text style={styles.castRole} numberOfLines={1}>{c.role}</Text>
                        </View>
                    ))}
                  </ScrollView>
                </View>

                {/* 猜你喜欢 */}
                <View style={styles.sectionBox}>
                  <Text style={styles.sectionHeader}>猜你喜欢</Text>
                  <View style={styles.recGrid}>
                    {RECS.map(r => (
                        <BouncyBtn key={r.id} style={styles.recItem} glass={false}>
                          <Image source={{ uri: r.poster }} style={styles.recPoster} />
                          <Text style={styles.recTitle} numberOfLines={1}>{r.title}</Text>
                        </BouncyBtn>
                    ))}
                  </View>
                </View>

                {/* 评论区 */}
                <View style={styles.sectionBox}>
                  <Text style={styles.sectionHeader}>评论 (234)</Text>
                  {COMMENTS.map(c => (
                      <View key={c.id} style={styles.commentItem}>
                        <Image source={{ uri: c.avatar }} style={styles.commentAvatar} />
                        <View style={{flex: 1}}>
                          <View style={styles.commentHeader}>
                            <Text style={styles.commentUser}>{c.user}</Text>
                            <Text style={styles.commentDate}>{c.date}</Text>
                          </View>
                          <Text style={styles.commentContent}>{c.content}</Text>
                        </View>
                      </View>
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* 底部输入栏 */}
            <GlassView
                style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 15 }]}
                intensity={100}
            >
              <View style={styles.inputWrapper}>
                <TextInput
                    placeholder="发一条友善的弹幕..."
                    placeholderTextColor="#8E8E93"
                    style={styles.input}
                    returnKeyType="send"
                />
                <BouncyBtn glass={false} style={styles.sendBtn}>
                  <Send size={20} color="#007AFF" />
                </BouncyBtn>
              </View>
            </GlassView>
          </View>
        </KeyboardAvoidingView>
      </View>
  );
}

// 胶囊按钮组件
const CapsuleBtn = ({ icon: Icon, label, active, onPress, color = '#007AFF' }: any) => (
    <BouncyBtn
        glass={false}
        onPress={onPress}
        style={[
          styles.capsuleBtn,
          active && { backgroundColor: color + '15' }
        ]}
    >
      <Icon size={18} color={active ? color : '#333'} />
      <Text style={[styles.capsuleText, active && { color: color, fontWeight: '600' }]}>
        {label}
      </Text>
    </BouncyBtn>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', overflow: 'hidden' }, // 防止滑动溢出

  // === 固定头部区域样式 ===
  fixedHeaderContainer: {
    backgroundColor: '#FFF',
    zIndex: 10,
    // 如果想要头部也有阴影，可以取消下面的注释
    // shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5,
  },
  navBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
  },
  navBackBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  navTitle: { fontSize: 16, fontWeight: '600', color: '#000' },

  video: { width: '100%', height: '100%' },

  // 固定标题区
  fixedTitleSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1, borderBottomColor: '#F5F5F7',
  },
  mainTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 6, lineHeight: 24 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  scoreTag: { backgroundColor: 'rgba(0,122,255,0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  scoreText: { color: '#007AFF', fontWeight: 'bold', fontSize: 12 },
  metaText: { fontSize: 12, color: '#888' },

  separatorShadow: {
    height: 1, backgroundColor: '#E5E5E5',
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2,
  },

  // === 滚动内容区域样式 ===
  contentPadding: { paddingHorizontal: 16 },

  // 胶囊按钮
  actionRow: { gap: 12 },
  capsuleBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F5F5F7',
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 30,
    gap: 6,
    height: 36
  },
  capsuleText: { fontSize: 13, color: '#333', fontWeight: '500' },

  // 通用卡片
  card: { padding: 16, borderRadius: 16, marginBottom: 24, backgroundColor: 'rgba(255,255,255,0.6)' },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 8 },
  descText: { fontSize: 13, color: '#444', lineHeight: 20 },
  expandBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  expandText: { color: '#007AFF', fontSize: 12, marginRight: 4 },

  // 演职员 & 推荐
  sectionBox: { marginBottom: 24 },
  sectionHeader: { fontSize: 16, fontWeight: '700', marginBottom: 12, color: '#111' },
  castItem: { alignItems: 'center', width: 70 },
  castAvatar: { width: 56, height: 56, borderRadius: 28, marginBottom: 6, backgroundColor: '#eee' },
  castName: { fontSize: 12, color: '#333', fontWeight: '500' },
  castRole: { fontSize: 10, color: '#999' },

  recGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  recItem: { width: REC_ITEM_WIDTH, marginBottom: 10 },
  recPoster: { width: '100%', aspectRatio: 0.7, borderRadius: 8, backgroundColor: '#eee', marginBottom: 6 },
  recTitle: { fontSize: 13, color: '#333' },

  // 评论
  commentItem: { flexDirection: 'row', marginBottom: 16 },
  commentAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10, backgroundColor: '#eee' },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  commentUser: { fontSize: 13, fontWeight: '600', color: '#555' },
  commentDate: { fontSize: 11, color: '#999' },
  commentContent: { fontSize: 14, color: '#222', lineHeight: 20 },

  // 底部栏
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingTop: 10, paddingHorizontal: 16,
    borderTopWidth: 1, borderColor: '#E5E5E5',
    backgroundColor: 'rgba(255,255,255,0.95)'
  },
  inputWrapper: { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1, height: 38, borderRadius: 19,
    backgroundColor: '#F2F2F7', paddingHorizontal: 15, fontSize: 14
  },
  sendBtn: { marginLeft: 12 }
});