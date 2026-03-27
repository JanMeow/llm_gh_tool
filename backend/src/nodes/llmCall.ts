import type { GraphNode } from "@langchain/langgraph";
import { SystemMessage } from "@langchain/core/messages";
  import modelWithTools from '../ghTool.js';
import { MessagesState } from '../state.js';


const llmCall: GraphNode<typeof MessagesState> = async (state) => {
  const reponse = await modelWithTools.invoke([
    new SystemMessage(
      "You are a helpful assistant that can help with tasks related to the rhino and grasshopper parametric modelling"
    ),
    ...state.messages,
  ]
  );
  return { messages: [reponse] };
};

export default llmCall;