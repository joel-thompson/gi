import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
	// custom settings, e.g.
	// compatibility: 'strict', // strict mode, enable when using the OpenAI API
	apiKey: process.env["GI_OPENAI_API_KEY"],
});

export default openai;
