import { useState, useRef, useCallback } from "react";
import { TUXText } from "@byted-tiktok/tux-web";

// ── Types matching the rule engine schema ──────────────────────────
interface Analysis {
  scene_type: string;
  post_intent: string;
  subjects: string[];
  face_count: number;
  has_animal: boolean;
  has_food: boolean;
  mood: string;
  semantic_tone: string[];
  colors: string;
  tags: string[];
}

interface Gameplay {
  tier: "core" | "extend" | "wild";
  category: string; // A/B/C/D/E/F/G or ★
  id: string;       // e.g. "C2", "彩蛋"
  name: string;
  description: string;
  flow: string;
  specific_example: string;
}

interface Scores {
  fun_score: number;
  social_score: number;
  surprise_score: number;
  freshness_score: number;
  overall: number;
}

interface CreationGuide {
  for_creator: string;
  for_audience: string;
  suggested_caption: string[];
}

interface AnalysisResult {
  analysis: Analysis;
  scene_label: string;
  priority_level: string;
  rule_log: string;
  gameplays: Gameplay[];
  scores: Scores;
  creation_guide: CreationGuide;
}

// ── Claude API integration ─────────────────────────────────────────

const RULE_ENGINE_PROMPT = `你是一个社交图片产品的「玩法规则引擎」v1.5。

用户上传一张图片（可能附带配文），你需要：
1. 理解图片内容与用户发帖意图
2. 识别图中可交互元素
3. 按规则引擎匹配玩法大类和子玩法
4. 输出完整的、针对这张图定制的互动玩法方案

输出必须具体、可执行、有创意，不能泛泛描述。

## 玩法大类体系（A-H 共8类）

分类依据：用户操作后得到什么，每类只有一个核心判断标准，互相不重叠。

### A · Reveal · 猜谜解密
得到：被隐藏的原有信息（彩蛋/文字故事/身份）
核心：信息操作前就存在但被遮挡，操作只是揭露它。答案是预设的，不是AI实时生成的。
子玩法：A1谁是卧底 / A2心声解锁·集齐 / A3找彩蛋 / A4刮刮乐

### B · Transform · 元素替换
得到：AI生成的替换内容（换装/换肤/换其他素材）
核心：图片里的原有元素被AI生成的新内容替换，原元素消失，新内容出现在原位置。
子玩法：B1发型实验室 / B2平行宇宙 / B3穿越时间线 / B4食物/饮品升华 / B5风格迁移 / B6换装换肤

### C · Morph · 元素形态变化
得到：元素在形状/大小/景深/维度上的实时变化
核心：元素自身的物理形态发生变化——大小、形状、维度。操作连续可控。
子玩法：C1元素缩放 / C2捏脸变形 / C3万物液化 / C4远近景深变化 / C5平面转3D / C6元素旋转

### D · Move · 元素位置变化
得到：元素在画面中位置的变化（位移/排序/落地）
核心：元素从A位置移动到B位置，形态本身不变，只是位置改变。
子玩法：D1元素位移·拖拽 / D2重排合照顺序 / D3重力滑落 / D4克隆复制·铺满

### E · Feed · 元素持续累积
得到：重复操作推进的累积状态（进度/里程碑/蓄力）
核心：单次操作不完整，需重复累积才能推进状态，有进度条/阶段变化/里程碑特效。
子玩法：E1喂饭变胖 / E2辣度挑战 / E3干杯计数 / E4撸猫/摸头满意度 / E5能量蓄力爆炸

### F · Add · 补充新元素
得到：在原图基础上新增的内容（空间/时间/状态/平面转3D）
核心：在原图基础上叠加新的内容，原有元素还在，新内容是额外增加的。与B的区别：B是把原有元素换掉，F是叠加新东西原元素还在。
子玩法：F1补全世界·空间扩展 / F2故事续写·时间扩展 / F3天气魔法·状态叠加 / F4平面转3D·维度扩展 / F5新增装饰元素 / F6添加配乐

### G · Score · 得到分数/测试结果
得到：关于图片或图中人物的评估/分数/测试结果
核心：图片触发一个测试或评估机制，用户得到一个关于自己/图中内容的量化结果或定性判断。单人即可完成，结果由AI生成。
子玩法：G1颜值评分 / G2穿搭指数 / G3明星相似度 / G4心情天气预报 / G5场景能量值 / G6食物热量揭秘 / G7关系亲密度

### H · Social · 需要多人参与
得到：依赖多人参与才能完成的社交结果
核心：必须有多人参与才能成立，少了「别人」这个角色玩法就无法完整体验。
竞争类：H1投票决定 / H2猜测挑战 / H3打分排名 / H4比赛对抗
协作类：H5合力达成 / H6共同养成 / H7拼图协作
接龙类：H8接龙改图 / H9故事接龙 / H10挑战传递
反馈类：H11好友批注 / H12匿名吐槽 / H13反应收集
共创类：H14众包创作 / H15接力二创

## 执行流程

Step 1 · 识别内容：
- scene_type：自拍 / 合影·聚餐 / 宠物 / 食物 / 风景 / 建筑·街道 / 物品 / 艺术·截图 / 其他
- post_intent：自我展示 / 生活记录 / 情感共鸣 / 社区梗 / 互动消遣 / 火花
- subjects：图中主要可交互元素，最多6个，按显著度排序
- face_count：0/1/2/3+
- has_animal / has_food：true/false
- mood：活泼 / 欢乐 / 温馨 / 安静 / 孤独 / 神秘 / 搞笑
- semantic_tone：幽默搞怪 / 美化变好看 / 惊喜出乎意料 / 情感共鸣 / 社交互动
- colors：暖色调 / 冷色调 / 高饱和 / 低饱和 / 黑白
- tags：最多8个

Step 2 · 优先级：P1(face≥1或animal或元素≥2) / P2(可互动主体≥3) / P3兜底

Step 3 · 元素→大类匹配：
| 识别到的元素 | 首选（★★★） | 扩展（★★） |
|------------|-----------|----------|
| 人脸·单人 | C2捏脸、B1发型、G1颜值评分 | B3时间线、G3明星相似度、E5蓄力 |
| 人脸·多人 | A2心声解锁、H1投票、H3打分 | H2猜测、D2重排、H8接龙 |
| 食物·饮品 | E1喂饭变胖、E3干杯、G6热量揭秘 | B4食物升华、F3天气、A3找彩蛋 |
| 宠物·动物 | E4撸猫、D3重力滑落、G1颜值 | A3找彩蛋、C3液化、D4克隆 |
| 风景·户外 | F1补全世界、F3天气魔法、C4景深 | F2续写、F4平面3D、B2平行宇宙 |
| 建筑·街道 | F1补全世界、B3时间线 | F3天气、B2平行宇宙、C5 3D |
| 物品·日用 | A3找彩蛋、A4刮刮乐、G5能量值 | C1缩放、D4克隆、F5新增装饰 |
| 服装·穿搭 | B6换装、G2穿搭指数 | B5风格迁移、H1投票 |
| 任意图·兜底 | C3万物液化、A4刮刮乐 | F2故事续写、H8接龙改图 |

Step 4 · 彩蛋（必须1个）：基于图片独特细节设计，只属于这张图，换图就失效。

## 模糊玩法判定流程
1. 需要多人才能成立吗？→ 是 → H·Social
2. 得到关于图片/人物的分数或测试结果？→ 是 → G·Score
3. 操作后得到被隐藏的原有信息？→ 是 → A·Reveal
4. 图片原有元素被AI替换成新版本？→ 是 → B·Transform
5. 原图上叠加了新内容（原元素还在）？→ 是 → F·Add
6. 元素的形状/大小/维度本身变了？→ 是 → C·Morph
7. 元素位置移动但形态没变？→ 是 → D·Move
8. 需要重复累积才能推进状态？→ 是 → E·Feed

## 输出格式（严格JSON，不含其他文字，不输出代码块标记）

{
  "analysis": {
    "scene_type": "",
    "post_intent": "",
    "subjects": [],
    "face_count": 0,
    "has_animal": false,
    "has_food": false,
    "mood": "",
    "semantic_tone": [],
    "colors": "",
    "tags": []
  },
  "scene_label": "一句话场景描述",
  "priority_level": "P1",
  "rule_log": "规则触发路径说明（1-2句）",
  "gameplays": [
    {
      "tier": "core",
      "category": "C",
      "id": "C2",
      "name": "捏脸变形",
      "description": "2-3句，说清楚这个玩法能做什么",
      "flow": "用户操作步骤1 → 步骤2 → 步骤3 → 结果",
      "specific_example": "针对这张图的极具体示例"
    },
    {
      "tier": "core",
      "category": "B", "id": "B1", "name": "", "description": "", "flow": "", "specific_example": ""
    },
    {
      "tier": "extend",
      "category": "G", "id": "G1", "name": "", "description": "", "flow": "", "specific_example": ""
    },
    {
      "tier": "extend",
      "category": "H", "id": "H1", "name": "", "description": "", "flow": "", "specific_example": ""
    },
    {
      "tier": "wild",
      "category": "★",
      "id": "彩蛋",
      "name": "彩蛋：[名称]",
      "description": "只属于这张图的独特玩法，换一张图就失效",
      "flow": "完整流程",
      "specific_example": "极具体示例"
    }
  ],
  "scores": {
    "fun_score": 8.5,
    "social_score": 8.0,
    "surprise_score": 8.5,
    "freshness_score": 9.0,
    "overall": 8.5
  },
  "creation_guide": {
    "for_creator": "给发帖人的一句引导语",
    "for_audience": "给好友的一句引导语",
    "suggested_caption": ["配文1", "配文2", "配文3"]
  }
}

注意：scores中所有分值必须是0-10范围的小数，不能超过10。`;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip data URL prefix to get raw base64
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getMediaType(file: File): "image/jpeg" | "image/png" | "image/gif" | "image/webp" {
  const type = file.type;
  if (type === "image/png") return "image/png";
  if (type === "image/gif") return "image/gif";
  if (type === "image/webp") return "image/webp";
  return "image/jpeg";
}

const AVAILABLE_MODELS = [
  "claude-sonnet-4-5-20250929",
  "claude-sonnet-4-6",
  "claude-opus-4-6",
  "claude-opus-4-5-20251101",
  "claude-haiku-4-5-20251001",
];

// In dev, read API key from .env.local (VITE_CLAUDE_API_KEY=sk-...)
// In production, the serverless function injects it from CLAUDE_API_KEY env var
const DEV_API_KEY = (import.meta.env?.VITE_CLAUDE_API_KEY as string) || "";

async function analyzeWithClaude(
  file: File,
  apiKey: string,
  _baseUrl: string,
  model: string
): Promise<AnalysisResult> {
  const base64 = await fileToBase64(file);
  const mediaType = getMediaType(file);

  // Use Vite dev proxy to avoid CORS issues
  const url = "/api/claude";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64 },
            },
            { type: "text", text: "请分析这张图片并输出玩法方案。" },
          ],
        },
      ],
      system: RULE_ENGINE_PROMPT,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API 请求失败 (${response.status}): ${err}`);
  }

  const data = await response.json();
  const text: string = data.content?.[0]?.text ?? "";

  // Try to parse JSON from response (strip markdown fences if present)
  const cleaned = text.replace(/^```json?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
  return JSON.parse(cleaned) as AnalysisResult;
}

async function analyzeTextWithClaude(
  text: string,
  apiKey: string,
  _baseUrl: string,
  model: string
): Promise<AnalysisResult> {
  const url = `/api/claude/v1/messages`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system: RULE_ENGINE_PROMPT,
      messages: [
        {
          role: "user",
          content: `用户没有上传图片，而是输入了以下文字内容：

「${text}」

请根据这段文字的语义、情感、场景联想，推断这可能是什么类型的社交内容（自拍配文/聚餐感叹/心情日记/美食分享/风景感悟等），然后按照规则引擎的完整流程，为这类内容生成一套互动玩法方案。

重要限制——玩法必须以「虚拟形象 / 用户头像」为主体，不依赖真实照片：
1. 把「用户头像」或「虚拟 Avatar」作为玩法的核心操作对象（代替真实图片中的人脸/元素）
2. 例如：用头像做捏脸变形（C2）、给头像换装（B6）、让头像喂食变胖（E1）、给头像颜值评分（G1）等
3. specific_example 要结合文字内容中出现的具体元素（如提到了"猫"就用猫头像，提到了"奶茶"就让头像喝奶茶）
4. 没有真实图片，所以 scene_type/face_count 等视觉字段请根据文字语义推断，face_count 按虚拟头像推断为1
5. 严格按 JSON 格式输出，不含其他文字`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API 请求失败 (${response.status}): ${err}`);
  }

  const data = await response.json();
  const raw: string = data.content?.[0]?.text ?? "";
  const cleaned = raw.replace(/^```json?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
  return JSON.parse(cleaned) as AnalysisResult;
}

// ── UI Components ──────────────────────────────────────────────────

const TIER_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  core: { label: "核心玩法", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  extend: { label: "扩展玩法", color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  wild: { label: "彩蛋", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
};

const CATEGORY_META: Record<string, { label: string; en: string; color: string; desc: string }> = {
  A: { label: "猜谜解密", en: "Reveal", color: "#a78bfa", desc: "用户操作后得到被隐藏的原有信息，答案是预设的" },
  B: { label: "元素替换", en: "Transform", color: "#60a5fa", desc: "图片原有元素被AI替换成新版本，原元素消失" },
  C: { label: "形态变化", en: "Morph", color: "#34d399", desc: "元素自身形状/大小/维度实时变化，没有搬家" },
  D: { label: "位置移动", en: "Move", color: "#fb923c", desc: "元素在画面中位置变化，形态本身不变" },
  E: { label: "持续累积", en: "Feed", color: "#f472b6", desc: "重复操作推进的累积状态，必须累积才能推进" },
  F: { label: "补充新元素", en: "Add", color: "#38bdf8", desc: "在原图基础上叠加新内容，原有元素还在" },
  G: { label: "评分测试", en: "Score", color: "#4ade80", desc: "图片触发评估机制，单人得到量化/定性结果" },
  H: { label: "多人参与", en: "Social", color: "#facc15", desc: "必须多人参与才能成立，单人无法完成" },
  "★": { label: "彩蛋", en: "Wild", color: "#f59e0b", desc: "只属于这张图的独特玩法，换一张图就失效" },
};

function ScoreBar({ label, value }: { label: string; value: number }) {
  // Normalize: model sometimes returns 0-100 instead of 0-10
  const normalized = value > 10 ? value / 10 : value;
  const pct = Math.min((normalized / 10) * 100, 100);
  const color =
    normalized >= 8.5 ? "#22c55e" : normalized >= 7.5 ? "#3b82f6" : "#f59e0b";
  return (
    <div style={{ marginBottom: 8 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
          {label}
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color }}>{normalized.toFixed(1)}</span>
      </div>
      <div
        style={{
          height: 6,
          borderRadius: 3,
          backgroundColor: "rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: 3,
            backgroundColor: color,
            transition: "width 0.8s ease",
          }}
        />
      </div>
    </div>
  );
}

function TagChip({ text, color }: { text: string; color?: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 500,
        backgroundColor: color
          ? `${color}18`
          : "rgba(255,255,255,0.08)",
        color: color || "rgba(255,255,255,0.7)",
        border: `1px solid ${color ? `${color}30` : "rgba(255,255,255,0.1)"}`,
        marginRight: 6,
        marginBottom: 6,
      }}
    >
      {text}
    </span>
  );
}

function GameplayCard({ gp }: { gp: Gameplay }) {
  const tierCfg = TIER_CONFIG[gp.tier] || TIER_CONFIG.core;
  const catMeta = CATEGORY_META[gp.category] || { label: gp.category, en: "", color: "#9ca3af" };

  return (
    <div
      style={{
        backgroundColor: "rgba(255,255,255,0.04)",
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        border: `1px solid ${catMeta.color}22`,
      }}
    >
      {/* Header chips */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        <span style={{
          fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
          backgroundColor: `${catMeta.color}20`, color: catMeta.color, letterSpacing: 0.5,
        }}>
          {gp.id}
        </span>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6,
          backgroundColor: tierCfg.bg, color: tierCfg.color,
        }}>
          {tierCfg.label}
        </span>
      </div>
      {/* Name */}
      <TUXText preset="P1-Semibold" style={{ color: "#fff", display: "block", marginBottom: 6 }}>
        {gp.name}
      </TUXText>
      {/* Description */}
      <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.7)", margin: "0 0 10px" }}>
        {gp.description}
      </p>
      {/* Flow */}
      {gp.flow && (
        <div style={{
          backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "8px 12px",
          marginBottom: 10, borderLeft: `3px solid ${catMeta.color}`,
        }}>
          <div style={{ fontSize: 11, color: catMeta.color, fontWeight: 600, marginBottom: 3 }}>交互流程</div>
          <p style={{ fontSize: 12, lineHeight: 1.6, color: "rgba(255,255,255,0.55)", margin: 0 }}>
            {gp.flow}
          </p>
        </div>
      )}
      {/* Example */}
      {gp.specific_example && (
        <div style={{
          backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "8px 12px",
          borderLeft: `3px solid ${tierCfg.color}`,
        }}>
          <div style={{ fontSize: 11, color: tierCfg.color, fontWeight: 600, marginBottom: 3 }}>具体示例</div>
          <p style={{ fontSize: 12, lineHeight: 1.6, color: "rgba(255,255,255,0.55)", margin: 0 }}>
            {gp.specific_example}
          </p>
        </div>
      )}
    </div>
  );
}

// Category tabs + gameplay list
function GameplayTabs({ gameplays }: { gameplays: Gameplay[] }) {
  // Collect unique categories in order of appearance
  const orderedCats: string[] = [];
  gameplays.forEach((gp) => {
    if (!orderedCats.includes(gp.category)) orderedCats.push(gp.category);
  });

  const [activeTab, setActiveTab] = useState<string>("ALL");

  const tabs = [{ key: "ALL", label: "全部", count: gameplays.length }, ...orderedCats.map((c) => ({
    key: c,
    label: `${c} · ${CATEGORY_META[c]?.label ?? c}`,
    count: gameplays.filter((g) => g.category === c).length,
  }))];

  const visible = activeTab === "ALL" ? gameplays : gameplays.filter((g) => g.category === activeTab);
  const activeCatColor = activeTab === "ALL" ? "#fff" : (CATEGORY_META[activeTab]?.color ?? "#fff");

  return (
    <div>
      {/* Tab bar */}
      <div style={{
        display: "flex", gap: 6, marginBottom: 16, overflowX: "auto",
        paddingBottom: 4, scrollbarWidth: "none",
      }}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          const tabColor = tab.key === "ALL" ? "#fff" : (CATEGORY_META[tab.key]?.color ?? "#fff");
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flexShrink: 0,
                padding: "6px 14px",
                borderRadius: 20,
                border: isActive ? `1.5px solid ${tabColor}` : "1.5px solid rgba(255,255,255,0.1)",
                backgroundColor: isActive ? `${tabColor}18` : "transparent",
                color: isActive ? tabColor : "rgba(255,255,255,0.4)",
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
              <span style={{
                marginLeft: 5, fontSize: 11,
                color: isActive ? tabColor : "rgba(255,255,255,0.25)",
              }}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
      {/* Active category description */}
      {activeTab !== "ALL" && CATEGORY_META[activeTab] && (
        <div style={{
          padding: "8px 12px", borderRadius: 8, marginBottom: 12,
          backgroundColor: `${activeCatColor}10`,
          border: `1px solid ${activeCatColor}20`,
          fontSize: 12, color: `${activeCatColor}cc`,
        }}>
          <span style={{ fontWeight: 700 }}>{activeTab} · {CATEGORY_META[activeTab].en} · {CATEGORY_META[activeTab].label}</span>
          {" — "}
          {CATEGORY_META[activeTab].desc}
        </div>
      )}
      {/* Cards */}
      {visible.map((gp, i) => <GameplayCard key={i} gp={gp} />)}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────

export default function ImageAnalysisPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<"image" | "text">("image");
  const [textInput, setTextInput] = useState("");
  const [submittedText, setSubmittedText] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const doTextAnalysis = useCallback(
    async (text: string) => {
      setSubmittedText(text);
      setResult(null);
      setError(null);
      setAnalyzing(true);
      try {
        const res = await analyzeTextWithClaude(text, DEV_API_KEY, "", AVAILABLE_MODELS[0]);
        setResult(res);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "分析失败");
      } finally {
        setAnalyzing(false);
      }
    },
    []
  );

  const doAnalysis = useCallback(
    async (file: File) => {
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);
      setResult(null);
      setError(null);
      setAnalyzing(true);
      try {
        const res = await analyzeWithClaude(file, DEV_API_KEY, "", AVAILABLE_MODELS[0]);
        setResult(res);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "分析失败");
      } finally {
        setAnalyzing(false);
      }
    },
    []
  );

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      doAnalysis(file);
    },
    [doAnalysis]
  );

  const handleTextSubmit = () => {
    const trimmed = textInput.trim();
    if (!trimmed) return;
    doTextAnalysis(trimmed);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleReset = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setSubmittedText(null);
    setTextInput("");
    setResult(null);
    setError(null);
    setAnalyzing(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0a0a0a",
        color: "#fff",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          backgroundColor: "rgba(10,10,10,0.9)",
          backdropFilter: "blur(12px)",
          zIndex: 10,
        }}
      >
        <div>
          <TUXText
            preset="H2-Semibold"
            style={{ color: "#fff", display: "block" }}
          >
            图片玩法规则引擎
          </TUXText>
          <TUXText
            preset="SmallText1-Regular"
            style={{ color: "rgba(255,255,255,0.4)", marginTop: 2 }}
          >
            上传图片 / 输入文字 → AI 分析 → 生成互动玩法方案
          </TUXText>
        </div>
        {(imageUrl || submittedText) && (
          <button
            onClick={handleReset}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.15)",
              backgroundColor: "transparent",
              color: "rgba(255,255,255,0.7)",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {imageUrl ? "重新上传" : "重新输入"}
          </button>
        )}
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 20px" }}>
        {/* Input Zone (tabbed) */}
        {!imageUrl && !submittedText && (
          <div>
            {/* Mode Tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[
                { key: "image" as const, icon: "📷", label: "上传图片" },
                { key: "text" as const, icon: "✏️", label: "输入文字" },
              ].map((tab) => {
                const isActive = inputMode === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setInputMode(tab.key)}
                    style={{
                      padding: "8px 20px",
                      borderRadius: 20,
                      border: isActive ? "1.5px solid #3FCBFA" : "1.5px solid rgba(255,255,255,0.12)",
                      backgroundColor: isActive ? "rgba(63,203,250,0.1)" : "transparent",
                      color: isActive ? "#3FCBFA" : "rgba(255,255,255,0.45)",
                      fontSize: 14,
                      fontWeight: isActive ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Image Upload Zone */}
            {inputMode === "image" && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${dragActive ? "#3FCBFA" : "rgba(255,255,255,0.15)"}`,
                  borderRadius: 20,
                  padding: "80px 40px",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: dragActive ? "rgba(63,203,250,0.04)" : "rgba(255,255,255,0.02)",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.6 }}>📷</div>
                <TUXText preset="P1-Semibold" style={{ color: "rgba(255,255,255,0.8)", display: "block" }}>
                  拖拽图片到此处，或点击选择
                </TUXText>
                <TUXText preset="SmallText1-Regular" style={{ color: "rgba(255,255,255,0.35)", marginTop: 8, display: "block" }}>
                  支持 JPG / PNG / HEIC，建议使用真实社交场景图片
                </TUXText>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
              </div>
            )}

            {/* Text Input Zone */}
            {inputMode === "text" && (
              <div style={{
                borderRadius: 20,
                border: "1.5px solid rgba(255,255,255,0.12)",
                backgroundColor: "rgba(255,255,255,0.02)",
                padding: 24,
              }}>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>
                  描述你想发布的内容，AI 会联想相关的互动玩法 ✨
                </div>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="例如：今天和朋友去吃了一家超好吃的火锅，人均120，每次喝一口汤都幸福感爆棚🫕"
                  rows={5}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.12)",
                    backgroundColor: "rgba(255,255,255,0.04)",
                    color: "#fff",
                    fontSize: 15,
                    lineHeight: 1.7,
                    resize: "vertical",
                    outline: "none",
                    fontFamily: "inherit",
                    marginBottom: 14,
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleTextSubmit();
                  }}
                />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
                    ⌘ + Enter 提交
                  </span>
                  <button
                    onClick={handleTextSubmit}
                    disabled={!textInput.trim()}
                    style={{
                      padding: "10px 28px",
                      borderRadius: 10,
                      border: "none",
                      backgroundColor: textInput.trim() ? "#3FCBFA" : "rgba(255,255,255,0.1)",
                      color: textInput.trim() ? "#000" : "rgba(255,255,255,0.3)",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: textInput.trim() ? "pointer" : "not-allowed",
                      transition: "all 0.15s",
                    }}
                  >
                    生成玩法方案 →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Image/Text Preview + Results */}
        {(imageUrl || submittedText) && (
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>

            {/* ── Left: sticky image / text card ── */}
            <div style={{ width: 300, flexShrink: 0, position: "sticky", top: 80, alignSelf: "flex-start" }}>
              {imageUrl ? (
                <div style={{
                  borderRadius: 16, overflow: "hidden", position: "relative",
                  backgroundColor: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <img src={imageUrl} alt="Uploaded" style={{ width: "100%", display: "block", objectFit: "cover" }} />
                  {analyzing && (
                    <div style={{
                      position: "absolute", inset: 0,
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
                    }}>
                      <div style={{
                        width: 36, height: 36,
                        border: "3px solid rgba(255,255,255,0.15)",
                        borderTopColor: "#3FCBFA", borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                      }} />
                      <TUXText preset="P2-Regular" style={{ color: "#fff", marginTop: 10 }}>
                        AI 分析中…
                      </TUXText>
                    </div>
                  )}
                </div>
              ) : submittedText ? (
                <div style={{
                  borderRadius: 16, padding: 20,
                  backgroundColor: "rgba(63,203,250,0.05)",
                  border: "1px solid rgba(63,203,250,0.15)",
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>✏️</div>
                  <div style={{
                    fontSize: 14, lineHeight: 1.7,
                    color: "rgba(255,255,255,0.85)",
                    wordBreak: "break-all",
                    maxHeight: 260, overflowY: "auto",
                  }}>
                    {submittedText}
                  </div>
                  {analyzing && (
                    <div style={{
                      position: "absolute", inset: 0,
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
                      borderRadius: 16,
                    }}>
                      <div style={{
                        width: 36, height: 36,
                        border: "3px solid rgba(255,255,255,0.15)",
                        borderTopColor: "#3FCBFA", borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                      }} />
                      <TUXText preset="P2-Regular" style={{ color: "#fff", marginTop: 10 }}>
                        AI 分析中…
                      </TUXText>
                    </div>
                  )}
                </div>
              ) : null}
              {/* scene label under panel */}
              {result && (
                <div style={{ marginTop: 12, textAlign: "center" }}>
                  <TUXText preset="P2-Semibold" style={{ color: "#fff", display: "block" }}>
                    {result.scene_label}
                  </TUXText>
                  <div style={{ marginTop: 6, display: "inline-flex", gap: 6, alignItems: "center" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6,
                      backgroundColor: result.priority_level === "P1" ? "rgba(34,197,94,0.12)" : result.priority_level === "P2" ? "rgba(59,130,246,0.12)" : "rgba(245,158,11,0.12)",
                      color: result.priority_level === "P1" ? "#22c55e" : result.priority_level === "P2" ? "#3b82f6" : "#f59e0b",
                    }}>{result.priority_level}</span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                      {result.gameplays.length} 个玩法
                    </span>
                  </div>
                </div>
              )}
            </div>{/* end left col */}

            {/* ── Right: scrollable analysis results ── */}
            <div style={{ flex: 1, minWidth: 0 }}>

            {/* Error Display */}
            {error && (
              <div
                style={{
                  padding: 16,
                  borderRadius: 12,
                  backgroundColor: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  marginBottom: 20,
                }}
              >
                <TUXText
                  preset="P2-Semibold"
                  style={{ color: "#ef4444", display: "block", marginBottom: 6 }}
                >
                  分析失败
                </TUXText>
                <p
                  style={{
                    fontSize: 13,
                    color: "rgba(239,68,68,0.7)",
                    margin: "0 0 12px",
                    wordBreak: "break-all",
                  }}
                >
                  {error}
                </p>
                <button
                  onClick={handleReset}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 6,
                    border: "1px solid rgba(239,68,68,0.3)",
                    backgroundColor: "transparent",
                    color: "#ef4444",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  重新上传
                </button>
              </div>
            )}

            {/* Analysis Results */}
            {result && (
              <div>
                {/* Scene & Priority */}
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    marginBottom: 20,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      minWidth: 200,
                      backgroundColor: "rgba(255,255,255,0.04)",
                      borderRadius: 14,
                      padding: 16,
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.4)",
                        marginBottom: 6,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      场景判定
                    </div>
                    <TUXText
                      preset="H3-Semibold"
                      style={{ color: "#fff", display: "block" }}
                    >
                      {result.scene_label}
                    </TUXText>
                    <div
                      style={{
                        marginTop: 8,
                        display: "inline-block",
                        padding: "3px 10px",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        backgroundColor:
                          result.priority_level === "P1"
                            ? "rgba(34,197,94,0.12)"
                            : result.priority_level === "P2"
                              ? "rgba(59,130,246,0.12)"
                              : "rgba(245,158,11,0.12)",
                        color:
                          result.priority_level === "P1"
                            ? "#22c55e"
                            : result.priority_level === "P2"
                              ? "#3b82f6"
                              : "#f59e0b",
                      }}
                    >
                      {result.priority_level}
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      minWidth: 200,
                      backgroundColor: "rgba(255,255,255,0.04)",
                      borderRadius: 14,
                      padding: 16,
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.4)",
                        marginBottom: 6,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      规则路径
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: "rgba(255,255,255,0.6)",
                        margin: 0,
                      }}
                    >
                      {result.rule_log}
                    </p>
                  </div>
                </div>

                {/* Analysis Tags */}
                <div
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    borderRadius: 14,
                    padding: 16,
                    marginBottom: 20,
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.4)",
                      marginBottom: 10,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    内容分析
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                      gap: "8px 16px",
                      marginBottom: 12,
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: 11,
                          color: "rgba(255,255,255,0.35)",
                        }}
                      >
                        场景类型
                      </span>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>
                        {result.analysis.scene_type}
                      </div>
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: 11,
                          color: "rgba(255,255,255,0.35)",
                        }}
                      >
                        发帖意图
                      </span>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>
                        {result.analysis.post_intent}
                      </div>
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: 11,
                          color: "rgba(255,255,255,0.35)",
                        }}
                      >
                        人脸数量
                      </span>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>
                        {result.analysis.face_count}
                      </div>
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: 11,
                          color: "rgba(255,255,255,0.35)",
                        }}
                      >
                        画面情绪
                      </span>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>
                        {result.analysis.mood}
                      </div>
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: 11,
                          color: "rgba(255,255,255,0.35)",
                        }}
                      >
                        色调
                      </span>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>
                        {result.analysis.colors}
                      </div>
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: 11,
                          color: "rgba(255,255,255,0.35)",
                        }}
                      >
                        有动物
                      </span>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>
                        {result.analysis.has_animal ? "是" : "否"}
                      </div>
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: 11,
                          color: "rgba(255,255,255,0.35)",
                        }}
                      >
                        有食物
                      </span>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>
                        {result.analysis.has_food ? "是" : "否"}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <span
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.35)",
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      语义倾向
                    </span>
                    {result.analysis.semantic_tone.map((t) => (
                      <TagChip key={t} text={t} color="#8b5cf6" />
                    ))}
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.35)",
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      标签
                    </span>
                    {result.analysis.tags.map((t) => (
                      <TagChip key={t} text={t} />
                    ))}
                  </div>
                </div>

                {/* Gameplays */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{
                    fontSize: 11, color: "rgba(255,255,255,0.4)",
                    marginBottom: 12, textTransform: "uppercase", letterSpacing: 1,
                  }}>
                    玩法方案（{result.gameplays.length} 个）
                  </div>
                  <GameplayTabs gameplays={result.gameplays} />
                </div>

                {/* Scores */}
                <div
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    borderRadius: 14,
                    padding: 16,
                    marginBottom: 20,
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.4)",
                      marginBottom: 12,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    评分
                  </div>
                  <ScoreBar label="趣味性 Fun" value={result.scores.fun_score} />
                  <ScoreBar
                    label="社交性 Social"
                    value={result.scores.social_score}
                  />
                  <ScoreBar
                    label="惊喜感 Surprise"
                    value={result.scores.surprise_score}
                  />
                  <ScoreBar
                    label="新鲜度 Freshness"
                    value={result.scores.freshness_score}
                  />
                  <div
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      marginTop: 8,
                      paddingTop: 8,
                    }}
                  >
                    <ScoreBar label="综合 Overall" value={result.scores.overall} />
                  </div>
                </div>

                {/* Creation Guide */}
                <div
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    borderRadius: 14,
                    padding: 16,
                    marginBottom: 40,
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.4)",
                      marginBottom: 12,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    创作引导
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <span
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.35)",
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      给发帖人
                    </span>
                    <p
                      style={{
                        fontSize: 14,
                        color: "rgba(255,255,255,0.8)",
                        margin: 0,
                      }}
                    >
                      {result.creation_guide.for_creator}
                    </p>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <span
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.35)",
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      给好友
                    </span>
                    <p
                      style={{
                        fontSize: 14,
                        color: "rgba(255,255,255,0.8)",
                        margin: 0,
                      }}
                    >
                      {result.creation_guide.for_audience}
                    </p>
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.35)",
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      推荐配文
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {result.creation_guide.suggested_caption.map((c, i) => (
                        <div
                          key={i}
                          style={{
                            padding: "8px 12px",
                            borderRadius: 10,
                            backgroundColor: "rgba(255,255,255,0.04)",
                            fontSize: 13,
                            color: "rgba(255,255,255,0.6)",
                          }}
                        >
                          「{c}」
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>{/* end right col */}

          </div>
        )}
      </div>

      {/* Spinner keyframes */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
