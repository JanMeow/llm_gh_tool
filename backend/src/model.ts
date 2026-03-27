import { ChatAnthropic } from "@langchain/anthropic";
const model = new ChatAnthropic({
    model: "claude-sonnet-4-6",
    temperature: 0,
  });

  export default model;