// Project facts are maintained from docs/cv.md. Covers are conceptual illustrations.
export const projects = [
  {
    name: "DEXTEA",
    heroHighlight: { zh: "微服务系统", en: "Microservices system" },
    art: "ordering",
    cover: "/images/projects/dextea.webp",
    github: "https://github.com/wilson-lyc/dextea-v3",
    demo: "https://pan.quark.cn/s/73fc200d7737",
    en: [
      "Full-stack · Microservices",
      "A drink ordering platform connecting customers, stores, and headquarters.",
    ],
    zh: ["全栈开发 · 微服务", "连接顾客、门店与总部的饮品点单平台。"],
    tags: ["Spring Boot", "Go", "React / Vue", "RocketMQ"],
  },
  {
    name: "FindMyHouse",
    heroHighlight: { zh: "AI Agent 系统", en: "AI agent system" },
    art: "map",
    cover: "/images/projects/findmyhouse.webp",
    github: "https://github.com/wilson-lyc/FindMyHouse",
    demo: "https://pan.quark.cn/s/84bd93d41b54",
    en: [
      "Full-stack · AI collaboration",
      "Maps, commute planning, and an AI assistant for finding a home.",
    ],
    zh: [
      "全栈开发 · AI 协同",
      "集地图、通勤规划与 AI 助手于一体的租房工作台。",
    ],
    tags: ["Vue 3", "Fastify", "LangGraph"],
  },
  {
    name: "SAQ",
    heroHighlight: { zh: "AI Infrastructure · 模型量化", en: "Model quantization" },
    art: "tiles",
    cover: "/images/projects/saq.webp",
    github: "https://github.com/wilson-lyc/SAQ",
    demo: null,
    en: [
      "LLM inference · Mixed precision",
      "Exploring blockwise mixed-precision quantization for LLM inference.",
    ],
    zh: [
      "LLM 推理 · 混合精度量化",
      "面向大语言模型推理的分块混合精度量化探索。",
    ],
    tags: ["NVFP4 / MXFP8 / BF16", "CUTLASS", "vLLM"],
  },
  {
    name: "Scent4You",
    heroHighlight: { zh: "深度学习模型 · 推荐系统", en: "Model training" },
    art: "scent",
    cover: "/images/projects/scent4you.webp",
    github: "https://github.com/wilson-lyc/Scent4You",
    demo: null,
    en: [
      "Deep learning · Recommendation",
      "A deep learning recommender matching fragrances to personal scent preferences.",
    ],
    zh: ["深度学习 · 智能推荐", "用深度学习理解香调，推荐符合个人偏好的香水。"],
    tags: ["PyTorch", "BERT", "Data mining"],
  },
] as const
