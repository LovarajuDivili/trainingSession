export const LLM_CONFIG = {
  Admin: [
    {
      modelName: "Gpt-4-o3",
      url: "https://sasa-openai-deployment-admin.com",
      key: "ADMIN_KEY_123",
      vendor: "Azure",
      model: "o3",
      outputCost: 8,
      inputCost: 2,
    },
    {
      modelName: "GPT-4o-55k",
      url: "https://sasa-openai-deployment-admin.com",
      key: "ADMIN_KEY_123",
      vendor: "Azure",
      model: "gpt-4o",
      outputCost: 4.5,
      inputCost: 3.4,
    },
  ],
  Technical: [
    {
      modelName: "GPT-Tech",
      url: "https://sasa-openai-deployment-tech.com",
      key: "TECH_KEY_456",
      vendor: "Azure",
      model: "gpt-3.5",
      outputCost: 2.5,
      inputCost: 1.5,
    },
  ],
  Developer: [
    {
      modelName: "Dev-GPT",
      url: "https://sasa-openai-deployment-dev.com",
      key: "DEV_KEY_789",
      vendor: "Azure",
      model: "gpt-4o",
      outputCost: 3.2,
      inputCost: 2.1,
    },
  ],
};
