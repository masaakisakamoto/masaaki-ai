export type AudienceLens = "citizen" | "school" | "government";

export type AudienceRouting = {
  primary: AudienceLens;
  secondary: AudienceLens[];
  reason: string;
};

function includesAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

export function routeAudience(question: string): AudienceRouting {
  const q = question.toLowerCase();

  const schoolKeywords = [
    "学校",
    "授業",
    "体育",
    "部活",
    "先生",
    "教員",
    "教育",
    "子ども",
    "児童",
    "生徒",
  ];

  const governmentKeywords = [
    "行政",
    "自治体",
    "市役所",
    "政策",
    "施策",
    "地域",
    "市民全体",
    "公共",
    "予算",
    "事業",
  ];

  const citizenKeywords = [
    "市民",
    "家庭",
    "親子",
    "日常",
    "高齢者",
    "住民",
    "個人",
    "生活",
    "健康づくり",
  ];

  if (includesAny(q, schoolKeywords)) {
    return {
      primary: "school",
      secondary: ["citizen", "government"],
      reason: "学校・教育文脈の語が含まれているため",
    };
  }

  if (includesAny(q, governmentKeywords)) {
    return {
      primary: "government",
      secondary: ["citizen", "school"],
      reason: "行政・地域運用文脈の語が含まれているため",
    };
  }

  if (includesAny(q, citizenKeywords)) {
    return {
      primary: "citizen",
      secondary: ["school", "government"],
      reason: "市民・生活文脈の語が含まれているため",
    };
  }

  return {
    primary: "citizen",
    secondary: ["school", "government"],
    reason: "明示的な指定がないため、市民起点を既定値とする",
  };
}
