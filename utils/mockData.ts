import { DatasetTemplate, LLMModel } from '@/types';

export const templates: Record<string, DatasetTemplate[]> = {
  tabular: [
    {
      name: 'Customer Data',
      prompt: 'Generate a dataset of customer information including name, age, email, purchase_history, and customer_segment for an e-commerce business'
    },
    {
      name: 'Employee Records',
      prompt: 'Create employee data with fields: employee_id, name, department, salary, hire_date, performance_rating, and location'
    },
    {
      name: 'Product Catalog',
      prompt: 'Generate product data including product_id, name, category, price, stock_quantity, rating, and description'
    },
    {
      name: 'Financial Transactions',
      prompt: 'Create transaction data with transaction_id, amount, date, type, account_id, and merchant information'
    }
  ],
  text: [
    {
      name: 'Product Reviews',
      prompt: 'Generate realistic product reviews with varying sentiment, length, and detail for different product categories'
    },
    {
      name: 'Social Media Posts',
      prompt: 'Create social media content including posts, comments, and captions for various platforms and topics'
    },
    {
      name: 'News Articles',
      prompt: 'Generate news article content covering different topics like technology, business, sports, and politics'
    },
    {
      name: 'Customer Support',
      prompt: 'Create customer support conversations including inquiries, complaints, and resolutions'
    }
  ],
  'time-series': [
    {
      name: 'Stock Prices',
      prompt: 'Generate daily stock price data with open, high, low, close, and volume for multiple stocks over time'
    },
    {
      name: 'Sensor Data',
      prompt: 'Create IoT sensor readings including temperature, humidity, pressure, and other environmental metrics'
    },
    {
      name: 'Website Analytics',
      prompt: 'Generate website traffic data including page views, unique visitors, bounce rate, and conversion metrics'
    },
    {
      name: 'Sales Metrics',
      prompt: 'Create sales performance data with daily revenue, units sold, and customer acquisition metrics'
    }
  ],
  images: [
    {
      name: 'Product Photos',
      prompt: 'Generate realistic product images for e-commerce including different angles, lighting, and backgrounds'
    },
    {
      name: 'Document Scans',
      prompt: 'Create synthetic document images including invoices, receipts, contracts, and forms'
    },
    {
      name: 'Medical Images',
      prompt: 'Generate synthetic medical imaging data including X-rays, MRIs, and CT scans for research purposes'
    },
    {
      name: 'Satellite Imagery',
      prompt: 'Create synthetic satellite images showing different terrain types, weather conditions, and geographic features'
    }
  ]
};

export const llmModels: LLMModel[] = [
  { 
    id: 'gpt-4', 
    name: 'GPT-4', 
    provider: 'OpenAI',
    description: 'Most capable model for complex data generation',
    icon: '🧠',
    pricing: '0.03 FIL per 1K tokens',
    bestFor: ['tabular', 'time-series', 'images']
  },
  { 
    id: 'gpt-3.5-turbo', 
    name: 'GPT-3.5 Turbo', 
    provider: 'OpenAI',
    description: 'Fast and cost-effective for most use cases',
    icon: '⚡',
    pricing: '0.002 FIL per 1K tokens',
    bestFor: ['tabular', 'text']
  },
  { 
    id: 'claude-3-sonnet', 
    name: 'Claude 3 Sonnet', 
    provider: 'Anthropic',
    description: 'Excellent for structured data and analysis',
    icon: '🎭',
    pricing: '0.015 FIL per 1K tokens',
    bestFor: ['tabular', 'time-series', 'text']
  },
  { 
    id: 'llama-2-70b', 
    name: 'Llama 2 70B', 
    provider: 'Meta',
    description: 'Open-source model with good performance',
    icon: '🦙',
    pricing: '0.001 FIL per 1K tokens',
    bestFor: ['text', 'tabular']
  }
];
