import { createOpenAI } from "@ai-sdk/openai";
import fs from "fs";
import untildify from "untildify";

// Read OpenAI API key from ~/.gi.config.json.
function getOpenAIApiKey(): string {
	const configPath = untildify("~/.gi.config.json");
	if (!fs.existsSync(configPath)) {
		throw new Error(
			`Config file not found at ${configPath}. Please create a .gi.config.json file in your home directory with your OpenAI API key.
			
			ex:
			{
				"openaiApiKey": "sk-..."
			}`
		);
	}
	const configRaw = fs.readFileSync(configPath, "utf-8");
	let config: { openaiApiKey?: string };
	try {
		config = JSON.parse(configRaw);
	} catch (e) {
		throw new Error(`Failed to parse .gi.config.json: ${e}`);
	}
	if (!config.openaiApiKey) {
		throw new Error("Missing 'openaiApiKey' in .gi.config.json");
	}
	return config.openaiApiKey;
}

const openai = createOpenAI({
	// custom settings, e.g.
	// compatibility: 'strict', // strict mode, enable when using the OpenAI API
	apiKey: getOpenAIApiKey(),
});

export default openai;
