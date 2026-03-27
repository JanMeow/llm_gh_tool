import * as z from "zod";
import model from "./model.js";
import { tool} from "@langchain/core/tools";
import type { StructuredToolInterface } from "@langchain/core/tools";


// Define tools
const add = tool(({ a, b }) => a + b, {
  name: "add",
  description: "Add two numbers",
  schema: z.object({
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }),
});

const multiply = tool(({ a, b }) => a * b, {
  name: "multiply",
  description: "Multiply two numbers",
  schema: z.object({
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }),
});

const divide = tool(({ a, b }) => a / b, {
  name: "divide",
  description: "Divide two numbers",
  schema: z.object({
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }),
});

const searchGhCanvas = tool(
  async ({q}) => {
    const components = ["Panel", "Number Slider", "Divide Curve", "Circle", "Contour"];
    return JSON.stringify(components); // model sees a string; easy to parse
  },
  {
    name : "searchGhCanvas",
    description : "Search for the exisitig tools on current gh canvas",
    schema: z.object({
      q: z.string().describe("The query words to search for existing tools on current gh canvas")
    })
  }
)

// Augment the LLM with tools
const toolsByName : Record<string, StructuredToolInterface> = {
  [add.name]: add,
  [multiply.name]: multiply,
  [divide.name]: divide,
  [searchGhCanvas.name]: searchGhCanvas,
};
const tools = Object.values(toolsByName);
const modelWithTools = model.bindTools(tools);

export default modelWithTools;
export { toolsByName };