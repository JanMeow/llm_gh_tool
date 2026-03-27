import { AIMessage, ToolMessage } from "@langchain/core/messages";
import type { GraphNode } from "@langchain/langgraph";
import { MessagesState } from '../state.js';
import {toolsByName} from '../ghTool.js';

const toolNode: GraphNode<typeof MessagesState> = async (state) => {
  const lastMessage = state.messages.at(-1);

  if (lastMessage == null || !AIMessage.isInstance(lastMessage)) {
    return { messages: [] };
  }

  const result: ToolMessage[] = [];
  for (const toolCall of lastMessage.tool_calls ?? []) {
    console.log(`Tool call: ${toolCall.name}`);
    const tool = toolsByName[toolCall.name];
    const observation = await tool?.invoke(toolCall);
    if (!observation) {
        console.error(`Tool ${toolCall.name} returned null`);
      continue;
    }
    result.push(observation);
  }

  return { messages: result };
};

export default toolNode;