export interface Station {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  emoji: string;
  color: string;
  topics: string[];
  hostName: string;
}

export const stations: Station[] = [
  {
    id: "morning-news",
    name: "朝のニュース",
    nameEn: "Morning News",
    description: "今日の最新ニュースをお届け",
    emoji: "📰",
    color: "#FF6B6B",
    topics: [
      "国内ニュース",
      "国際ニュース",
      "経済ニュース",
      "社会ニュース",
      "政治ニュース",
    ],
    hostName: "アサヒ",
  },
  {
    id: "tech",
    name: "テクノロジー",
    nameEn: "Technology",
    description: "テクノロジーの最前線",
    emoji: "🤖",
    color: "#4ECDC4",
    topics: [
      "AI・機械学習",
      "スマートフォン",
      "スタートアップ",
      "ゲーム・VR",
      "サイバーセキュリティ",
    ],
    hostName: "テクオ",
  },
  {
    id: "business",
    name: "ビジネス",
    nameEn: "Business",
    description: "経済・ビジネス情報",
    emoji: "💼",
    color: "#45B7D1",
    topics: [
      "株式市場",
      "企業動向",
      "日本経済",
      "投資・資産運用",
      "ビジネストレンド",
    ],
    hostName: "ケイコ",
  },
  {
    id: "culture",
    name: "カルチャー",
    nameEn: "Culture",
    description: "日本文化・エンタメ",
    emoji: "🎭",
    color: "#F7DC6F",
    topics: [
      "映画・ドラマ",
      "音楽",
      "アニメ・マンガ",
      "アート・デザイン",
      "伝統文化",
    ],
    hostName: "ハナ",
  },
  {
    id: "sports",
    name: "スポーツ",
    nameEn: "Sports",
    description: "スポーツ速報・解説",
    emoji: "⚽",
    color: "#58D68D",
    topics: [
      "サッカー・Jリーグ",
      "野球・プロ野球",
      "バスケット・Bリーグ",
      "テニス・ゴルフ",
      "陸上・水泳",
    ],
    hostName: "ソウ",
  },
  {
    id: "science",
    name: "サイエンス",
    nameEn: "Science",
    description: "科学・宇宙の最新発見",
    emoji: "🔬",
    color: "#9B59B6",
    topics: [
      "宇宙探査",
      "医学・バイオ",
      "物理学",
      "環境・気候",
      "テクノロジー研究",
    ],
    hostName: "ミライ",
  },
  {
    id: "lifestyle",
    name: "ライフスタイル",
    nameEn: "Lifestyle",
    description: "暮らし・健康・グルメ",
    emoji: "🌸",
    color: "#F1948A",
    topics: [
      "健康・美容",
      "グルメ・料理",
      "旅行・観光",
      "ファッション",
      "インテリア",
    ],
    hostName: "サクラ",
  },
  {
    id: "world",
    name: "ワールド",
    nameEn: "World",
    description: "世界の話題・国際情勢",
    emoji: "🌍",
    color: "#85C1E9",
    topics: [
      "国際政治",
      "海外文化",
      "環境問題",
      "国際経済",
      "世界の不思議",
    ],
    hostName: "セカイ",
  },
];
