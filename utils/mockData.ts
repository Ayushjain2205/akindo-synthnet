import { DatasetTemplate, LLMModel, Dataset } from "@/types";

export const templates: Record<string, DatasetTemplate[]> = {
  tabular: [
    {
      name: "Customer Data",
      prompt:
        "Generate a dataset of customer information including name, age, email, purchase_history, and customer_segment for an e-commerce business",
    },
    {
      name: "Employee Records",
      prompt:
        "Create employee data with fields: employee_id, name, department, salary, hire_date, performance_rating, and location",
    },
    {
      name: "Product Catalog",
      prompt:
        "Generate product data including product_id, name, category, price, stock_quantity, rating, and description",
    },
    {
      name: "Financial Transactions",
      prompt:
        "Create transaction data with transaction_id, amount, date, type, account_id, and merchant information",
    },
  ],
  text: [
    {
      name: "Product Reviews",
      prompt:
        "Generate realistic product reviews with varying sentiment, length, and detail for different product categories",
    },
    {
      name: "Social Media Posts",
      prompt:
        "Create social media content including posts, comments, and captions for various platforms and topics",
    },
    {
      name: "News Articles",
      prompt:
        "Generate news article content covering different topics like technology, business, sports, and politics",
    },
    {
      name: "Customer Support",
      prompt:
        "Create customer support conversations including inquiries, complaints, and resolutions",
    },
  ],
  "time-series": [
    {
      name: "Stock Prices",
      prompt:
        "Generate daily stock price data with open, high, low, close, and volume for multiple stocks over time",
    },
    {
      name: "Sensor Data",
      prompt:
        "Create IoT sensor readings including temperature, humidity, pressure, and other environmental metrics",
    },
    {
      name: "Website Analytics",
      prompt:
        "Generate website traffic data including page views, unique visitors, bounce rate, and conversion metrics",
    },
    {
      name: "Sales Metrics",
      prompt:
        "Create sales performance data with daily revenue, units sold, and customer acquisition metrics",
    },
  ],
  images: [
    {
      name: "Product Photos",
      prompt:
        "Generate realistic product images for e-commerce including different angles, lighting, and backgrounds",
    },
    {
      name: "Document Scans",
      prompt:
        "Create synthetic document images including invoices, receipts, contracts, and forms",
    },
    {
      name: "Medical Images",
      prompt:
        "Generate synthetic medical imaging data including X-rays, MRIs, and CT scans for research purposes",
    },
    {
      name: "Satellite Imagery",
      prompt:
        "Create synthetic satellite images showing different terrain types, weather conditions, and geographic features",
    },
  ],
};

export const llmModels: LLMModel[] = [
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "OpenAI",
    description: "Most capable model for complex data generation",
    icon: "🧠",
    pricing: "0.03 FIL per 1K tokens",
    bestFor: ["tabular", "time-series", "images"],
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    description: "Fast and cost-effective for most use cases",
    icon: "⚡",
    pricing: "0.002 FIL per 1K tokens",
    bestFor: ["tabular", "text"],
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    provider: "Anthropic",
    description: "Excellent for structured data and analysis",
    icon: "🎭",
    pricing: "0.015 FIL per 1K tokens",
    bestFor: ["tabular", "time-series", "text"],
  },
  {
    id: "llama-2-70b",
    name: "Llama 2 70B",
    provider: "Meta",
    description: "Open-source model with good performance",
    icon: "🦙",
    pricing: "0.001 FIL per 1K tokens",
    bestFor: ["text", "tabular"],
  },
];

export const mockDatasets: Dataset[] = [
  {
    id: "1",
    name: "E-commerce Customer Analytics",
    description:
      "Comprehensive customer behavior dataset with purchase history, demographics, and engagement metrics for machine learning models.",
    type: "tabular",
    size: 250,
    price: 2.5,
    author: "0x1234...5678",
    createdAt: "2024-01-15",
    tags: ["ecommerce", "analytics", "customer-behavior", "ml"],
    downloads: 234,
    rating: 4.8,
    views: 1200,
  },
  {
    id: "2",
    name: "Financial Market Sentiment",
    description:
      "Real-time sentiment analysis data from social media and news sources for financial market prediction models.",
    type: "text",
    size: 500,
    price: 5.0,
    author: "0x9876...4321",
    createdAt: "2024-01-12",
    tags: ["finance", "sentiment", "nlp", "trading"],
    downloads: 189,
    rating: 4.6,
    views: 890,
  },
  {
    id: "3",
    name: "IoT Sensor Network Data",
    description:
      "Multi-sensor time-series data from industrial IoT devices including temperature, pressure, and vibration readings.",
    type: "time-series",
    size: 1000,
    price: 8.0,
    author: "0x4567...8901",
    createdAt: "2024-01-10",
    tags: ["iot", "sensors", "industrial", "time-series"],
    downloads: 156,
    rating: 4.9,
    views: 750,
  },
  {
    id: "4",
    name: "Medical Image Classification",
    description:
      "Synthetic medical imaging dataset with X-ray and MRI scans for computer vision and diagnostic AI training.",
    type: "images",
    size: 150,
    price: 12.0,
    author: "0x2468...1357",
    createdAt: "2024-01-08",
    tags: ["medical", "imaging", "ai", "healthcare"],
    downloads: 98,
    rating: 4.7,
    views: 450,
  },
  {
    id: "5",
    name: "Social Media Engagement Metrics",
    description:
      "Comprehensive social media performance data across multiple platforms with engagement rates and viral content patterns.",
    type: "tabular",
    size: 750,
    price: 3.5,
    author: "0x1357...2468",
    createdAt: "2024-01-05",
    tags: ["social-media", "engagement", "marketing", "analytics"],
    downloads: 312,
    rating: 4.5,
    views: 1100,
  },
  {
    id: "6",
    name: "Product Review Sentiment",
    description:
      "Large-scale product review dataset with sentiment labels and rating predictions for e-commerce recommendation systems.",
    type: "text",
    size: 800,
    price: 6.5,
    author: "0x8642...9753",
    createdAt: "2024-01-03",
    tags: ["reviews", "sentiment", "ecommerce", "recommendations"],
    downloads: 267,
    rating: 4.8,
    views: 950,
  },
  {
    id: "7",
    name: "Stock Price Prediction Data",
    description:
      "Historical stock market data with technical indicators and news sentiment for algorithmic trading models.",
    type: "time-series",
    size: 1000,
    price: 10.0,
    author: "0x9753...8642",
    createdAt: "2024-01-01",
    tags: ["stocks", "trading", "finance", "prediction"],
    downloads: 145,
    rating: 4.9,
    views: 680,
  },
  {
    id: "8",
    name: "Autonomous Vehicle Training",
    description:
      "Synthetic driving scenario dataset with street images, traffic signs, and pedestrian detection for self-driving car AI.",
    type: "images",
    size: 100,
    price: 15.0,
    author: "0x7531...8642",
    createdAt: "2023-12-28",
    tags: ["autonomous", "vehicles", "computer-vision", "safety"],
    downloads: 78,
    rating: 4.6,
    views: 320,
  },
];
