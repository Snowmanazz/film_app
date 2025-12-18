export const MOCK_BANNERS = [
  { id: 101, imageUrl: 'https://picsum.photos/id/12/800/450', title: 'Banner 1', targetType: 'video', targetValue: '1' },
  { id: 102, imageUrl: 'https://picsum.photos/id/24/800/450', title: 'Banner 2', targetType: 'video', targetValue: '2' }
];

export const MOCK_HOT_MOVIES = [
  { id: 1, title: '沙丘2', poster: 'https://picsum.photos/id/30/200/300', rate: '9.4' },
  { id: 2, title: '奥本海默', poster: 'https://picsum.photos/id/40/200/300', rate: '9.6' },
  { id: 3, title: '星际穿越', poster: 'https://picsum.photos/id/50/200/300', rate: '9.8' },
  { id: 4, title: '盗梦空间', poster: 'https://picsum.photos/id/60/200/300', rate: '9.2' },
];

export const MOCK_RECENT_UPDATES = [1, 2, 3, 4, 5].map(i => ({
  id: 200 + i,
  title: `更新剧集名称 ${i}`,
  poster: `https://picsum.photos/id/${70 + i}/100/100`,
  updateInfo: `第 ${i + 5} 集`,
  updateTime: '刚刚更新'
}));

export const MOCK_CONFIG = {
  categories: [
    { id: 'all', name: '全部' },
    { id: 'movie', name: '电影' },
    { id: 'tv', name: '电视剧' },
    { id: 'anime', name: '动漫' },
    { id: 'doc', name: '纪录片' }
  ],
  filters: {
    genre: ['全部', '动作', '喜剧', '爱情', '科幻'],
    year: ['全部', '2025', '2024', '2023', '更早'],
    region: ['全部', '大陆', '美国', '日本']
  }
};

export const MOCK_VIDEO_LIST = Array(15).fill(0).map((_, i) => ({
  id: 300 + i,
  title: `示例影片 ${i}`,
  score: '9.2',
  year: '2023',
  tags: '科幻 / 冒险',
  poster: `https://picsum.photos/id/${50 + i}/200/300`
}));

export const MOCK_VIDEO_DETAIL = {
  id: 1,
  title: '星际穿越：无限边疆',
  poster: 'https://picsum.photos/id/50/200/300',
  videoSourceUrl: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
  score: '9.8',
  year: '2014',
  region: '美国',
  tags: ['科幻', '冒险'],
  playCount: '120万次播放',
  description: '在未来的世界里，地球面临着严重的资源枯竭和环境恶化。一组勇敢的宇航员踏上了穿越虫洞的旅程，寻找人类新的家园...',
  cast: [
    { id: 1, name: '克里斯托弗', role: '导演', img: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: '马修·麦康纳', role: '库珀', img: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, name: '安妮·海瑟薇', role: '布兰德', img: 'https://i.pravatar.cc/150?u=3' },
  ],
  related: [
    { id: 401, title: '星际迷航', poster: 'https://picsum.photos/id/10/200/300' },
    { id: 402, title: '太空漫游', poster: 'https://picsum.photos/id/20/200/300' },
    { id: 403, title: '第三类接触', poster: 'https://picsum.photos/id/30/200/300' },
  ],
  userInteraction: {
    isLiked: false,
    isCollected: true
  }
};

export const MOCK_COMMENTS = [
  { id: 1, user: '星际旅行者', avatar: 'https://i.pravatar.cc/150?u=5', content: '诺兰的又一神作！', date: '2天前', likes: 128 },
  { id: 2, user: '科幻迷', avatar: 'https://i.pravatar.cc/150?u=6', content: '特效炸裂。', date: '1周前', likes: 96 },
];

export const MOCK_USER_PROFILE = {
  id: 'u123',
  nickname: 'Zinat',
  avatar: 'https://i.pravatar.cc/150?u=8',
  vip: { isVip: true, expireDate: '2025.10 到期' }
};

export const MOCK_USER_HISTORY = [
  { id: 1, title: '复仇者联盟4', time: '1:24:30', progress: 0.65, poster: 'https://picsum.photos/id/10/100/150' },
  { id: 2, title: '星际穿越', time: '0:45:10', progress: 0.30, poster: 'https://picsum.photos/id/20/100/150' }
];

export const MOCK_USER_FAVORITES = [
  { id: 1, title: '肖申克的救赎', poster: 'https://picsum.photos/id/60/200/300' },
  { id: 2, title: '教父', poster: 'https://picsum.photos/id/70/200/300' },
];
