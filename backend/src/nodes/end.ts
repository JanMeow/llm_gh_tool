import type { ConditionalEdgeRouter } from "@langchain/langgraph";
import { MessagesState } from '../state.js';
import { AIMessage } from '@langchain/core/messages';
import { END } from '@langchain/langgraph';

const shouldContinue: ConditionalEdgeRouter<typeof MessagesState,Record<string, unknown>,"toolNode"> = (state) => {
    const lastMessage = state.messages.at(-1);
  
    // Check if it's an AIMessage before accessing tool_calls
    if (!lastMessage || !AIMessage.isInstance(lastMessage)) {
      return END;
    }
  
    // If the LLM makes a tool call, then perform an action
    if (lastMessage.tool_calls?.length) {
      return "toolNode";
    }
  
    // Otherwise, we stop (reply to the user)
    return END;
  };
export default shouldContinue;