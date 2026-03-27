import {Router} from 'express';
import type { Request, Response } from 'express';
import { StateSchema, MessagesValue, StateGraph, START, END } from "@langchain/langgraph";
import llmCall from "./nodes/llmCall.js";
import  { z } from 'zod';
import toolNode from "./nodes/tool.js";
import shouldContinue from "./nodes/end.js";

type RequestBody = {
    role: string;
    messages: string;
}

const MessagesState = new StateSchema({
  messages: MessagesValue,
});


const graph = new StateGraph(MessagesState)
  .addNode("llmCall", llmCall)
  .addNode("toolNode", toolNode)
  .addEdge(START, "llmCall")
  .addConditionalEdges("llmCall", shouldContinue, ["toolNode", END])
  .addEdge("toolNode", "llmCall")
  .compile();


const agentRouter = Router();

agentRouter.post('/execute', 
    async(req: Request<unknown, unknown, RequestBody>, res: Response) => {
    const role = req.body.role;
    const message = req.body.messages;
    const response = await graph.invoke({ messages: [{ role: role, content: message }] })
    .then((result) => {
        console.log("Agent response: ", result.messages.at(-1)?.content);
        return res.json(result);
    })
    .catch((error) => {
        res.status(500).json({ error: error.message });
    });
    
});

export default agentRouter;
export {MessagesState}