# Film App API 接口文档

本文档定义了客户端与后台管理端的所有接口细节。

## 1. 基础说明

- **Base URL**: `HOST_PENDING` (待定，例如 `https://api.filmapp.com/v1`)
- **协议**: HTTPS
- **数据格式**: JSON
- **字符编码**: UTF-8

### 通用响应结构
所有接口默认返回以下结构，业务数据在 `data` 字段中。

```json
{
  "code": 0,          // 0: 成功, 非0: 错误码
  "message": "success", // 错误信息或提示
  "data": { ... }     // 业务数据
}
```

---

## 2. 客户端接口 (Client API)

### 2.1 全局配置
获取应用初始化的基础配置，如分类标签、筛选字典等。

- **URL**: `/config`
- **Method**: `GET`
- **Headers**: 无
- **Query Params**: 无

**Response Example:**
```json
{
  "code": 0,
  "data": {
    "categories": [
      { "id": "all", "name": "全部" },
      { "id": "movie", "name": "电影" },
      { "id": "tv", "name": "电视剧" },
      { "id": "anime", "name": "动漫" }
    ],
    "filters": {
      "genre": ["全部", "动作", "喜剧", "爱情", "科幻"],
      "year": ["全部", "2024", "2023", "2022", "更早"],
      "region": ["全部", "大陆", "美国", "日本", "韩国"]
    }
  }
}
```

### 2.2 首页 - 轮播图
- **URL**: `/home/banners`
- **Method**: `GET`

**Response Example:**
```json
{
  "code": 0,
  "data": [
    {
      "id": 101,
      "imageUrl": "https://picsum.photos/800/450",
      "title": "沙丘2",
      "targetType": "video", // video | link
      "targetValue": "1"     // videoId or http url
    }
  ]
}
```

### 2.3 首页 - 热门推荐
- **URL**: `/home/hot`
- **Method**: `GET`
- **Query Params**:
    - `limit` (int, default: 10): 数量

**Response Example:**
```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "title": "奥本海默",
      "poster": "https://picsum.photos/200/300",
      "rate": "9.6"
    }
  ]
}
```

### 2.4 首页 - 最近更新
- **URL**: `/home/recent`
- **Method**: `GET`
- **Query Params**:
    - `limit` (int, default: 10)

**Response Example:**
```json
{
  "code": 0,
  "data": [
    {
      "id": 202,
      "title": "海贼王",
      "poster": "https://picsum.photos/100/100",
      "updateInfo": "第 1080 集",
      "updateTime": "刚刚更新"
    }
  ]
}
```

### 2.5 影片列表 (搜索/筛选)
用于分类页、搜索页和高级筛选。

- **URL**: `/videos`
- **Method**: `GET`
- **Query Params**:
    - `keyword` (string, optional): 搜索关键词
    - `category` (string, optional): 大分类 ID
    - `genre` (string, optional): 类型
    - `year` (string, optional): 年份
    - `region` (string, optional): 地区
    - `minRating` (float, optional): 最低评分 (0-10)
    - `sort` (string, optional): `new` (最新) | `hot` (最热) | `rating` (评分)
    - `page` (int, default: 1)
    - `limit` (int, default: 20)

**Response Example:**
```json
{
  "code": 0,
  "data": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "list": [
      {
        "id": 5,
        "title": "示例影片",
        "poster": "https://picsum.photos/200/300",
        "score": "9.0",
        "tags": "科幻 / 冒险",
        "year": "2023"
      }
    ]
  }
}
```

### 2.6 影片详情
- **URL**: `/videos/{id}`
- **Method**: `GET`

**Response Example:**
```json
{
  "code": 0,
  "data": {
    "id": 1,
    "title": "星际穿越",
    "poster": "https://picsum.photos/200/300",
    "videoSourceUrl": "https://example.com/video.mp4",
    "score": "9.8",
    "year": "2014",
    "region": "美国",
    "tags": ["科幻", "冒险"],
    "playCount": "120万",
    "description": "在未来的世界里，地球面临着严重的资源枯竭...",
    "cast": [
      { "id": 1, "name": "克里斯托弗", "role": "导演", "avatar": "https://..." },
      { "id": 2, "name": "马修", "role": "主演", "avatar": "https://..." }
    ],
    "related": [ // 猜你喜欢
       { "id": 10, "title": "太空漫游", "poster": "https://..." }
    ],
    "userInteraction": { // 当前用户与该视频的交互状态 (需登录)
       "isLiked": false,
       "isCollected": true
    }
  }
}
```

### 2.7 评论列表
- **URL**: `/videos/{id}/comments`
- **Method**: `GET`
- **Query Params**: `page`, `limit`

**Response Example:**
```json
{
  "code": 0,
  "data": {
    "total": 50,
    "list": [
      {
        "id": 1001,
        "user": { "nickname": "UserA", "avatar": "https://..." },
        "content": "好看！",
        "date": "2天前",
        "likes": 12
      }
    ]
  }
}
```

### 2.8 用户 - 个人信息
- **URL**: `/user/profile`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`

**Response Example:**
```json
{
  "code": 0,
  "data": {
    "id": "u123",
    "nickname": "Zinat",
    "avatar": "https://...",
    "vip": {
      "isVip": true,
      "expireDate": "2025-10-01"
    }
  }
}
```

### 2.9 用户 - 历史记录
- **URL**: `/user/history`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`

**Response Example:**
```json
{
  "code": 0,
  "data": [
    {
      "videoId": 1,
      "title": "影片标题",
      "poster": "https://...",
      "progress": 0.5, // 观看进度百分比
      "progressTime": "12:30", // 观看时长字符串
      "lastWatchTime": "2023-12-18 10:00"
    }
  ]
}
```

---

## 3. 后台管理接口 (Admin API)

**鉴权**: 所有 Admin 接口需 Header 携带管理员 Token。

### 3.1 影片管理 - 上传/保存
- **URL**: `/admin/videos`
- **Method**: `POST`
- **Content-Type**: `application/json`

**Request Body:**
```json
{
  "title": "新影片标题",
  "poster": "https://oss.example.com/poster.jpg",
  "videoSourceUrl": "https://oss.example.com/movie.mp4",
  "category": "movie",
  "genres": ["科幻", "动作"],
  "year": "2024",
  "region": "美国",
  "description": "简介内容...",
  "cast": [
    { "name": "演员A", "role": "主演", "avatar": "..." }
  ]
}
```

**Response:**
```json
{ "code": 0, "message": "created", "data": { "id": 123 } }
```

### 3.2 影片管理 - 更新
- **URL**: `/admin/videos/{id}`
- **Method**: `PUT`

**Request Body:**
(同上，包含需要修改的字段)

### 3.3 影片管理 - 删除
- **URL**: `/admin/videos/{id}`
- **Method**: `DELETE`

**Response:**
```json
{ "code": 0, "message": "deleted" }
```

### 3.4 运营 - 轮播图配置
- **URL**: `/admin/banners`
- **Method**: `POST`

**Request Body:**
```json
{
  "title": "春节活动",
  "imageUrl": "https://...",
  "targetType": "video",
  "targetValue": "123",
  "sortOrder": 1
}
```

### 3.5 运营 - 筛选字典管理
- **URL**: `/admin/dictionaries/{type}` 
- **Method**: `POST`
- **Path Params**: `type` (e.g., `genre`, `region`)

**Request Body:**
```json
{
  "label": "赛博朋克",
  "value": "cyberpunk",
  "sort": 10
}
```
