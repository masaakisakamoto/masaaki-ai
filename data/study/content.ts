export type StudyAudience = "pro" | "simple" | "both";
export type StudyFreshness = "core" | "updated" | "frontier";
export type StudyItemType = "article" | "paper" | "note" | "tool" | "guide";

export type StudyCategoryKey =
  | "human-systems"
  | "medical"
  | "ai"
  | "sports"
  | "longevity"
  | "tools";

export type StudyItem = {
  slug: string;
  title: string;
  category: StudyCategoryKey;
  type: StudyItemType;
  audience: StudyAudience;
  freshness: StudyFreshness;
  level: "intro" | "intermediate" | "advanced";
  summary: string;
  whyItMatters: string;
  tags: string[];
  href: string;
  sourceType: "internal" | "external";
  featured?: boolean;
  updatedAt?: string;
};

export const studyPrinciples = [
  {
    title: "Built to grow",
    description: "小さく始め、長く育てる",
  },
  {
    title: "Depth and clarity",
    description: "深さとわかりやすさの両立",
  },
  {
    title: "From knowledge to society",
    description: "知識を社会実装へつなぐ",
  },
] as const;

export const categoryOrder: StudyCategoryKey[] = [
  "human-systems",
  "medical",
  "ai",
  "sports",
  "longevity",
  "tools",
];

export const categories: Record<
  StudyCategoryKey,
  {
    title: string;
    shortDescription: string;
    heroDescription: string;
    tags: string[];
  }
> = {
  "human-systems": {
    title: "Human Systems",
    shortDescription:
      "人間の身体・動作・構造・機能を理解する。アナトミートレイン、姿勢、歩行、神経、運動療法を横断して整理する。",
    heroDescription:
      "人間の身体と動きを、構造として理解する。部分ではなく、つながりとして捉えるための視点を整理していく。",
    tags: ["Anatomy Trains", "Gait", "Posture", "Conditioning"],
  },
  medical: {
    title: "Medical",
    shortDescription:
      "医学・医療・論文・エビデンス。理解をエビデンスとつなぎ、より確かな判断へ。",
    heroDescription:
      "医学と論文を通して、知識に根拠を与える。理解をエビデンスとつなぎ、より確かな判断へ。",
    tags: ["Evidence", "Papers", "Guidelines", "Clinical Topics"],
  },
  ai: {
    title: "AI",
    shortDescription:
      "知識を拡張し、実装するための技術。理解・設計・開発・運用までをつなぐ。",
    heroDescription:
      "AIを、流行ではなく構造として学ぶ。基礎理解から実装、運用、社会実装までをつないで整理していく。",
    tags: ["LLM", "Agents", "Apps", "Evaluation"],
  },
  sports: {
    title: "Sports",
    shortDescription:
      "スポーツを通して、人の身体と行動を社会の中で実際に動かす領域。",
    heroDescription:
      "スポーツを通して、人の身体と行動を動かす。知識を現場に届け、社会の中で実践へつなげる。",
    tags: ["Community", "Education", "Habit", "Implementation"],
  },
  longevity: {
    title: "Longevity",
    shortDescription:
      "健康寿命をどう伸ばすか。身体・生活・環境・支援を含めて、実践として考える。",
    heroDescription:
      "健康寿命を、どう伸ばすか。身体・生活・環境・支援を含めて、実践として考える。",
    tags: ["Frailty", "Falls", "Daily Life", "Support"],
  },
  tools: {
    title: "Tools",
    shortDescription:
      "信頼できる知識・論文・学習への入口。世界水準の情報へアクセスするための基盤。",
    heroDescription:
      "学びを支える道具と情報源。論文、研究、実務、AI学習に役立つ入口を整理していく。",
    tags: ["PubMed", "Scholar", "Research", "Learning"],
  },
};

export const studyItems: StudyItem[] = [
  {
    slug: "anatomy-trains-entry",
    title: "Anatomy Trains: entry point",
    category: "human-systems",
    type: "guide",
    audience: "both",
    freshness: "core",
    level: "intro",
    summary:
      "アナトミートレインの全体像をつかむための入口。身体を部分ではなく、つながりとして見る視点を整理する。",
    whyItMatters:
      "姿勢・歩行・動作の理解を、点ではなく線と連続性で捉えやすくなる。",
    tags: ["Anatomy Trains", "Fascial Lines", "Movement"],
    href: "/study/human-systems",
    sourceType: "internal",
    featured: true,
  },
  {
    slug: "how-to-look-at-gait",
    title: "How to look at gait",
    category: "human-systems",
    type: "guide",
    audience: "pro",
    freshness: "core",
    level: "intermediate",
    summary:
      "歩行を見るときに、どこから観察を始めるか。見る順番と判断の入り口を整理する。",
    whyItMatters: "観察の質が、評価と介入の質を大きく左右するため。",
    tags: ["Gait", "Observation", "Assessment"],
    href: "/study/human-systems",
    sourceType: "internal",
  },
  {
    slug: "body-as-system",
    title: "Human body as system",
    category: "human-systems",
    type: "article",
    audience: "simple",
    freshness: "frontier",
    level: "intro",
    summary:
      "人間の身体を、バラバラの部位ではなく、つながるシステムとして捉えるための入口。",
    whyItMatters:
      "部分だけを見ない理解は、実践の質を大きく変えるため。",
    tags: ["Systems", "Body", "Perspective"],
    href: "/study/human-systems",
    sourceType: "internal",
  },

  {
    slug: "how-to-read-a-paper",
    title: "How to read a paper",
    category: "medical",
    type: "guide",
    audience: "both",
    freshness: "core",
    level: "intro",
    summary:
      "論文をどこから読めばよいか、最低限の理解の仕方を整理する。",
    whyItMatters: "論文は読めないと活用できないため。",
    tags: ["Papers", "Reading", "Evidence"],
    href: "/study/medical",
    sourceType: "internal",
    featured: true,
  },
  {
    slug: "levels-of-evidence",
    title: "Levels of evidence",
    category: "medical",
    type: "guide",
    audience: "pro",
    freshness: "core",
    level: "intermediate",
    summary: "エビデンスレベルの考え方を整理する。",
    whyItMatters: "情報の信頼性を判断するため。",
    tags: ["Evidence", "Clinical", "Decision"],
    href: "/study/medical",
    sourceType: "internal",
  },
  {
    slug: "research-on-fall-prevention",
    title: "Research on fall prevention",
    category: "medical",
    type: "paper",
    audience: "both",
    freshness: "updated",
    level: "intermediate",
    summary: "転倒予防に関する主要研究の入口。",
    whyItMatters: "高齢者領域で最も重要なテーマの一つ。",
    tags: ["Falls", "Prevention", "Older Adults"],
    href: "/study/medical",
    sourceType: "internal",
  },

  {
    slug: "ai-learning-roadmap",
    title: "AI learning roadmap",
    category: "ai",
    type: "guide",
    audience: "both",
    freshness: "updated",
    level: "intro",
    summary:
      "AIをどういう順番で学ぶと、理解と実装がつながりやすいかを整理した入口。",
    whyItMatters:
      "学ぶ順番を間違えると、断片知識だけが増えてしまうため。",
    tags: ["Roadmap", "AI", "Learning"],
    href: "/study/ai",
    sourceType: "internal",
    featured: true,
  },
  {
    slug: "building-llm-apps",
    title: "Building LLM apps",
    category: "ai",
    type: "guide",
    audience: "pro",
    freshness: "updated",
    level: "intermediate",
    summary:
      "LLMアプリを作るときに押さえるべき基本構造をまとめる。",
    whyItMatters:
      "モデルの性能だけでなく、設計の質が体験を左右するため。",
    tags: ["LLM", "Apps", "Architecture"],
    href: "/study/ai",
    sourceType: "internal",
  },
  {
    slug: "ai-as-partner",
    title: "AI as partner, not just tool",
    category: "ai",
    type: "article",
    audience: "simple",
    freshness: "frontier",
    level: "intro",
    summary:
      "AIを単なる便利ツールで終わらせず、思考や実践を支える相棒として捉えるための視点。",
    whyItMatters: "使い方の思想が、そのままアウトプットの質に出るため。",
    tags: ["Mindset", "AI", "Practice"],
    href: "/study/ai",
    sourceType: "internal",
  },

  {
    slug: "why-sports-matter-in-community",
    title: "Why sports matter in community",
    category: "sports",
    type: "article",
    audience: "both",
    freshness: "core",
    level: "intro",
    summary: "地域におけるスポーツの役割を整理する。",
    whyItMatters: "運動は個人だけでなく、社会全体に影響するため。",
    tags: ["Community", "Sports Promotion", "Society"],
    href: "/study/sports",
    sourceType: "internal",
    featured: true,
  },
  {
    slug: "designing-sports-programs-for-children",
    title: "Designing sports programs for children",
    category: "sports",
    type: "guide",
    audience: "simple",
    freshness: "updated",
    level: "intro",
    summary: "小中学生向けにスポーツをどのように設計するか。",
    whyItMatters:
      "早期の体験が、その後の運動習慣を大きく左右するため。",
    tags: ["Children", "Schools", "Program Design"],
    href: "/study/sports",
    sourceType: "internal",
  },
  {
    slug: "encouraging-movement-in-daily-life",
    title: "Encouraging movement in daily life",
    category: "sports",
    type: "guide",
    audience: "both",
    freshness: "core",
    level: "intro",
    summary: "日常生活の中で身体を動かす習慣をつくる方法。",
    whyItMatters: "継続できる形が最も重要だから。",
    tags: ["Habit", "Daily Life", "Behavior Change"],
    href: "/study/sports",
    sourceType: "internal",
  },
  {
    slug: "sports-as-entry-to-longevity",
    title: "Sports as entry to longevity",
    category: "sports",
    type: "article",
    audience: "both",
    freshness: "frontier",
    level: "intermediate",
    summary:
      "スポーツを健康寿命の入り口として活用する視点。",
    whyItMatters: "運動習慣は長期的な健康に直結するため。",
    tags: ["Longevity", "Sports", "Health"],
    href: "/study/sports",
    sourceType: "internal",
  },

  {
    slug: "what-is-frailty",
    title: "What is frailty",
    category: "longevity",
    type: "guide",
    audience: "both",
    freshness: "core",
    level: "intro",
    summary: "フレイルの基本を整理する入口。",
    whyItMatters:
      "健康寿命を考えるうえで、早期理解が重要な概念だから。",
    tags: ["Frailty", "Older Adults", "Basics"],
    href: "/study/longevity",
    sourceType: "internal",
    featured: true,
  },
  {
    slug: "fall-prevention-basics",
    title: "Fall prevention basics",
    category: "longevity",
    type: "guide",
    audience: "pro",
    freshness: "core",
    level: "intermediate",
    summary: "転倒予防の基礎視点を整理する。",
    whyItMatters:
      "転倒は健康寿命や生活機能に大きく影響するため。",
    tags: ["Falls", "Prevention", "Program"],
    href: "/study/longevity",
    sourceType: "internal",
  },
  {
    slug: "supporting-daily-movement-in-elderly",
    title: "Supporting daily movement in elderly",
    category: "longevity",
    type: "guide",
    audience: "simple",
    freshness: "updated",
    level: "intro",
    summary: "高齢者の日常動作をどう支えるかの入口。",
    whyItMatters:
      "日常の動きが保たれること自体が、生活の質につながるため。",
    tags: ["Older Adults", "Daily Life", "Support"],
    href: "/study/longevity",
    sourceType: "internal",
  },

  {
    slug: "pubmed-entry",
    title: "PubMed",
    category: "tools",
    type: "tool",
    audience: "both",
    freshness: "core",
    level: "intro",
    summary: "医学・生物学系論文の代表的な検索入口。",
    whyItMatters: "一次情報に近い場所へアクセスできるため。",
    tags: ["PubMed", "Research", "Papers"],
    href: "https://pubmed.ncbi.nlm.nih.gov/",
    sourceType: "external",
    featured: true,
  },
  {
    slug: "semantic-scholar-entry",
    title: "Semantic Scholar",
    category: "tools",
    type: "tool",
    audience: "both",
    freshness: "core",
    level: "intro",
    summary: "論文探索を広げるための研究支援ツール。",
    whyItMatters: "関連論文をたどりやすく、探索効率が高い。",
    tags: ["Scholar", "Research", "Discovery"],
    href: "https://www.semanticscholar.org/",
    sourceType: "external",
  },
  {
    slug: "openalex-entry",
    title: "OpenAlex",
    category: "tools",
    type: "tool",
    audience: "pro",
    freshness: "updated",
    level: "intermediate",
    summary: "研究データを広く扱える学術メタデータ基盤。",
    whyItMatters:
      "探索・整理・拡張を構造的に考えやすい。",
    tags: ["OpenAlex", "Metadata", "Research"],
    href: "https://openalex.org/",
    sourceType: "external",
  },
];

export const sportsFocusAreas = [
  "スポーツ推進",
  "運動教育（小中学校）",
  "地域スポーツ",
  "健康づくり活動",
  "イベント設計",
  "行動変容",
  "運動習慣化",
  "高齢者運動プログラム",
  "子どもの運動発達",
] as const;

export const sportsProjectIdeas = [
  {
    title: "親子で動く、はじめの一歩",
    description:
      "小中学生と保護者が一緒に参加できる、短時間・高頻度型の地域スポーツ導線。",
    connection:
      "運動教育（小中学校） / 地域スポーツ / 運動習慣化",
  },
  {
    title: "日常の動きから始める健康づくり",
    description:
      "競技スポーツに限定せず、歩く・立つ・遊ぶ・支えるを含む身体活動の普及設計。",
    connection:
      "健康づくり活動 / 行動変容 / 高齢者運動プログラム",
  },
  {
    title: "深谷市スポーツ推進の学び基盤",
    description:
      "市民・学校・指導者が同じ構造で学べるページ群を育て、地域のスポーツ推進に活かす。",
    connection:
      "自治体との接続（深谷市） / スポーツ推進 / イベント設計",
  },
];

export const sportsCityApplications = [
  {
    title: "市民向けの身近な運動づくり",
    description:
      "難しい運動ではなく、誰でも始めやすい小さな動きから、地域全体に運動のきっかけを広げる。",
  },
  {
    title: "小中学校との連携",
    description:
      "体育や朝活動に短時間プログラムを組み込み、子どもたちの運動体験を日常の中に自然に組み込む。",
  },
  {
    title: "高齢者の生活動作支援",
    description:
      "転倒予防や日常動作の維持につながる動きを、地域活動や教室の中で無理なく継続できる形で提供する。",
  },
  {
    title: "イベントから習慣へ",
    description:
      "単発イベントで終わらせず、日常に戻ったあとも続けられる導線を設計する。",
  },
];

export const sportsProgramGroups = [
  {
    key: "family",
    title: "親子・家庭",
    description:
      "家庭の中で始めやすい運動のきっかけをつくり、親子で一緒に動ける流れを育てる。",
  },
  {
    key: "school",
    title: "小中学校",
    description:
      "学校の活動に短時間で組み込みやすい形で、子どもの運動体験を支える。",
  },
  {
    key: "elderly",
    title: "高齢者",
    description:
      "日常動作の維持や転倒予防につながる、やさしく続けやすい形をつくる。",
  },
] as const;

export const sportsPublicIntro = {
  title: "このページについて",
  description:
    "このページは、深谷市のスポーツ推進に関わる活動を、市民の皆さまにより身近に感じていただけたらと思い、個人として少しずつ整理しながら作っているページです。",
  points: [
    "市民の方にとっては、日常の中で無理なく取り組める身近な運動として",
    "学校関係者の方にとっては、子どもたちの運動体験を支えるヒントとして",
    "行政・地域関係者の方にとっては、地域全体に運動習慣を広げる考え方の整理として",
  ],
  note:
    "なお、現時点では深谷市の公式ページではなく、市の正式な関与のもとで公開されているものではありません。個人としての試作を含みますが、地域の活動や実践を知るきっかけになればと思っています。",
} as const;

export const sportsShareMessage = {
  title: "共有用メッセージ",
  description:
    "深谷市のスポーツ推進に関わる活動を、市民の皆さまにより身近に感じていただけたらと思い、個人として少しずつ整理しながらページを作っています。\n\n現時点では、市の公式な案内として公開しているものではありませんが、地域の活動や実践につながる場として、これから少しずつ育てていけたらと考えています。\n\n最後まで見てくださり、本当にありがとうございます。",
} as const;

export const sportsFeaturedAthletes = [
  {
    name: "村岡桃佳",
    sport: "パラアルペンスキー / パラ陸上",
    description:
      "深谷市にゆかりのあるアスリートとして、世界の舞台で活躍を続けている選手です。地域の中でスポーツの可能性を広げる存在のひとりです。",
    connection:
      "市民にとっては身近な憧れとして、学校にとっては挑戦を学ぶきっかけとして、地域にとってはスポーツ文化を育てる象徴としてつながります。",
  },
  {
    name: "高桑早生",
    sport: "パラ陸上",
    description:
      "深谷市にゆかりのあるアスリートとして、競技を通じて挑戦を体現している選手です。多様なスポーツのあり方を考えるうえでも大切な存在です。",
    connection:
      "子どもたちにとっては挑戦する姿のロールモデルとなり、市民にとってはスポーツを広く捉える視点につながります。",
  },
  {
    name: "清水達也",
    sport: "プロ野球",
    description:
      "深谷市にゆかりのあるプロ野球選手で、地域の子どもたちにも身近な存在です。深谷市親善大使としても活動しています。",
    connection:
      "学校や地域にとっては、夢や挑戦を具体的に感じられるロールモデルであり、スポーツを通じた地域のつながりにもつながります。",
  },
] as const;

export const sportsAudienceNavigation = [
  {
    key: "citizen",
    title: "市民の方へ",
    description:
      "日常生活の中で無理なく体を動かすきっかけや、家庭で取り入れやすい身近な運動を紹介します。",
    href: "#sports-programs-family",
  },
  {
    key: "school",
    title: "学校関係者の方へ",
    description:
      "体育や学校活動に取り入れやすい形で、子どもたちの運動体験を支える視点をまとめています。",
    href: "#sports-programs-school",
  },
  {
    key: "government",
    title: "行政・地域関係者の方へ",
    description:
      "地域全体に運動習慣を広げるための設計や、継続可能な取り組みの考え方を整理しています。",
    href: "#sports-city-application",
  },
] as const;

export const sportsPrograms = [
  {
    title: "親子で動く、はじめの一歩",
    target: "小中学生 + 保護者",
    purpose: "始めやすい運動のきっかけをつくり、家庭内での運動習慣につなげる",
    structure: [
      "5分：遊びながら体を動かす",
      "5分：バランス・姿勢",
      "5分：親子で協力する動き",
    ],
    duration: "15分",
    frequency: "週1回 + 家庭で再現",
    expectedOutcome:
      "運動への心理的ハードル低下・親子の関係性向上",
    connection: [
      "運動教育（小中学校）",
      "地域スポーツ",
      "運動習慣化",
    ],
  },
  {
    title: "日常動作を支える、やさしい運動習慣",
    target: "高齢者",
    purpose: "転倒予防と生活機能維持につながる、やさしく続けやすい運動習慣をつくる",
    structure: [
      "5分：呼吸と姿勢を整える",
      "5分：立つ・座る・支えるの基本動作",
      "5分：バランスと安心して歩く準備",
    ],
    duration: "15分",
    frequency: "週1回 + 日常の中で反復",
    expectedOutcome:
      "転倒予防、日常動作の維持、運動への心理的ハードル低下",
    connection: [
      "高齢者運動プログラム",
      "健康づくり活動",
      "運動習慣化",
    ],
  },
  {
    title: "動いて学ぶ、学校スポーツの土台づくり",
    target: "小中学生",
    purpose: "身体を動かす楽しさと基本動作の理解をつなぎ、学校現場で継続しやすいスポーツ体験をつくる",
    structure: [
      "5分：遊びを通じた導入",
      "5分：走る・跳ぶ・支えるなどの基本動作",
      "5分：協力しながら動くミニプログラム",
    ],
    duration: "15分",
    frequency: "授業・朝活動・イベントで反復",
    expectedOutcome:
      "運動への前向きな印象形成、基本動作の獲得、学校での継続的なスポーツ導線づくり",
    connection: [
      "運動教育（小中学校）",
      "子どもの運動発達",
      "地域スポーツ",
    ],
  },
];

export function getFeaturedItems() {
  return studyItems.filter((item) => item.featured);
}

export function getItemsByCategory(category: StudyCategoryKey) {
  return studyItems.filter((item) => item.category === category);
}

export function isStudyCategoryKey(value: string): value is StudyCategoryKey {
  return categoryOrder.includes(value as StudyCategoryKey);
}

export const sportsSampleEvents = [
  {
    id: "event-001",
    title: "親子でからだを動かす体験会",
    date: "2026-05-18",
    location: "深谷市内公民館",
    target: "親子",
    fee: "無料",
    organizer: "地域スポーツ団体",
    summary:
      "親子で一緒に体を動かしながら、日常の中で取り入れやすい運動を体験できるイベントです。",
    applyMethod: "事前申込",
  },
  {
    id: "event-002",
    title: "シニア向けやさしい運動教室",
    date: "2026-06-07",
    location: "深谷市内体育施設",
    target: "高齢者",
    fee: "500円",
    organizer: "地域健康づくりグループ",
    summary:
      "転倒予防や日常動作の維持につながる、やさしく続けやすい運動を行う教室です。",
    applyMethod: "当日参加可",
  },
  {
    id: "event-003",
    title: "小学生向けスポーツチャレンジ",
    date: "2026-06-22",
    location: "深谷市内小学校体育館",
    target: "小学生",
    fee: "無料",
    organizer: "学校連携スポーツ団体",
    summary:
      "遊びの要素を取り入れながら、さまざまな動きやスポーツにふれる体験イベントです。",
    applyMethod: "事前申込",
  },
] as const;
