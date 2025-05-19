This file is a merged representation of a subset of the codebase, containing files not matching ignore patterns, combined into a single document by Repomix.
The content has been processed where content has been formatted for parsing in markdown style.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

- Pay special attention to the Repository Instruction. These contain important context and guidelines specific to this project.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching these patterns are excluded: repomix-instruction.md, repomix.config.json, _tech-plans
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Content has been formatted for parsing in markdown style
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
.cursor/
  rules/
    typescript-expert.mdc
    use-ink-readme.mdc
    use-object-parameters-for-functions.mdc
    use-pnpm.mdc
source/
  actions/
    ActionsMode.tsx
  ai/
    openai.ts
  gitMode/
    gitMode.tsx
  selectMode/
    selectMode.tsx
  utils/
    git.ts
  app.tsx
  cli.tsx
.editorconfig
.gitattributes
.gitignore
.prettierignore
eslint.config.js
LICENSE
package.json
readme.md
test.tsx
tsconfig.json
tsconfig.test.json
```

# Files

## File: .cursor/rules/typescript-expert.mdc
````
---
description: 
globs: 
alwaysApply: true
---
You are a senior engineer. You are an expert in typescript.
````

## File: .cursor/rules/use-ink-readme.mdc
````
---
description: 
globs: *.tsx,**/*.tsx
alwaysApply: false
---
This project uses ink for the terminal UI.

Here is the readme for the ink library: https://github.com/vadimdemedes/ink/blob/master/readme.md
````

## File: .cursor/rules/use-object-parameters-for-functions.mdc
````
---
description: 
globs: *.tsx,**/*.tsx
alwaysApply: false
---
Functions should use object parameters instead of positional parameters for better maintainability and readability.

Quick Check:
✓ Single primitive (string, number, boolean) → Use positional parameter
✓ Complex type (object, interface, array) → Must use object parameter
✓ Multiple parameters → Must use object parameter
✓ Optional parameters → Must use object parameter

✅ Good Examples:
```typescript
// Single primitive parameter
function handleClick(id: string): void;

// Single complex type
function updateUser({ user }: { user: UserDetails }): void;

// Multiple parameters
function getData({ 
  id,
  options = {},
}: {
  id: string;
  options?: RequestOptions;
}): Promise<Data>;

// React event handlers
onClick: (id: string) => void;                              // primitive OK
onChange: (params: { value: FormData }) => void;            // complex type
onSubmit: (params: { data: SubmitData; id: string }) => void;  // multiple params
```

❌ Bad Examples:
```typescript
// Complex type should use object param
function updateUser(user: UserDetails): void;

// Multiple params should use object param
function getData(id: string, options: RequestOptions = {}): Promise<Data>;

// Optional param should use object param
function fetchItems(id: string, page?: number): Promise<Item[]>;
```

Guidelines:
1. Parameter Type Rules:
   - Primitive types (string, number, boolean): Use positional parameters if single and required
   - Complex types (interfaces, objects, arrays): Always use object parameters, even if single
   - Any combination of multiple parameters: Always use object parameters
   - Any optional parameters: Always use object parameters

2. Documentation:
   - Include TypeScript interface/type definitions for the parameter object
   - Use JSDoc with @param params for the container object
   - Use @param params.propertyName for each property

3. Default Values:
   - Assign default values in the destructuring pattern
   - Example: `function foo({ value = defaultValue }: { value?: string })`
````

## File: .cursor/rules/use-pnpm.mdc
````
---
description: Use pnpm as my package manager
globs: **/*.ts, **/*.tsx, package.json
---

Always use pnpm as my package manager when adding/updating/removing packages
````

## File: source/actions/ActionsMode.tsx
````typescript
import React, {useState} from 'react';
import {Text, Box, useInput} from 'ink';
import {Mode} from '../selectMode/selectMode.js';

interface Action {
	name: string;
	description: string;
	action: (inputText?: string) => void;
	requiresInput?: boolean;
}

const actions: Action[] = [
	{
		name: 'test',
		description: 'Test',
		action: () => {
			console.log('test');
		},
	},
	{
		name: 'test2',
		description: 'Test2',
		action: () => {
			console.log('test2');
		},
	},
	{
		name: 'test3',
		description: 'Test3',
		requiresInput: true,
		action: (inputText?: string) => {
			console.log('test3', inputText);
		},
	},
];

export default function ActionsMode({
	setMode,
}: {
	setMode: (mode: Mode) => void;
}) {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const selectedAction = actions[selectedIndex];
	const [inputText, setInputText] = useState('');

	useInput((input, key) => {
		if (key.upArrow) {
			setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
			return;
		}
		if (key.downArrow) {
			setSelectedIndex(prev => (prev < actions.length - 1 ? prev + 1 : prev));
			return;
		}

		if (selectedAction?.requiresInput && !key.return) {
			if (key.backspace || key.delete) {
				setInputText(prev => prev.slice(0, -1));
				return;
			}

			if (input && !key.ctrl && !key.meta) {
				const newInputText = inputText + input;
				setInputText(newInputText);
			}
			return;
		}

		if (input === 'q' && !selectedAction?.requiresInput) {
			setMode('select');
			return;
		}

		if (key.return && actions[selectedIndex]) {
			if (selectedAction?.requiresInput) {
				if (inputText !== '' && !!inputText.trim()) {
					actions[selectedIndex].action(inputText);
				}
				setInputText('');
			} else {
				actions[selectedIndex].action();
			}
			return;
		}

		const inputNumber = Number(input);
		const action = actions[inputNumber - 1];
		if (inputNumber <= actions.length && inputNumber >= 1 && action) {
			setSelectedIndex(inputNumber - 1);
			if (!action.requiresInput) {
				action.action();
			}
			return;
		}
		return;
	});

	return (
		<Box flexDirection="column" padding={1} gap={1}>
			<Text>Select an action:</Text>
			<Box flexDirection="column">
				{actions.map((a, index) => (
					<Text
						key={a.name}
						color={index === selectedIndex ? 'green' : undefined}
					>
						{index === selectedIndex ? `> ${index + 1}. ` : `  ${index + 1}. `}
						{a.name}
					</Text>
				))}
			</Box>
			<Text>{actions[selectedIndex]?.description}</Text>
			{actions[selectedIndex]?.requiresInput && (
				<Text>
					Enter input for {actions[selectedIndex]?.name}: {inputText}
				</Text>
			)}
		</Box>
	);
}
````

## File: source/ai/openai.ts
````typescript
import {createOpenAI} from '@ai-sdk/openai';

const openai = createOpenAI({
	// custom settings, e.g.
	// compatibility: 'strict', // strict mode, enable when using the OpenAI API
	apiKey: process.env['TERMINAG_OPENAI_API_KEY'],
});

export default openai;
````

## File: source/utils/git.ts
````typescript
import {simpleGit, SimpleGit} from 'simple-git';

export interface GitInfo {
	currentBranch: string;
	remoteUrl?: string;
	status: {
		staged: string[];
		modified: string[];
		untracked: string[];
	};
	lastCommit?: {
		hash: string;
		message: string;
		author: string;
		date: Date;
	};
}

/**
 * Get Git information from the current directory
 * @returns Promise<GitInfo> Object containing Git repository information
 * @throws Error if not in a Git repository
 */
export async function getGitInfo(): Promise<GitInfo> {
	const git: SimpleGit = simpleGit();

	// Check if we're in a Git repository
	const isRepo = await git.checkIsRepo();
	if (!isRepo) {
		throw new Error('Not in a Git repository');
	}

	// Get current branch
	const branchResult = await git.branch();
	const currentBranch = branchResult.current;

	// Get remote URL (if available)
	let remoteUrl: string | undefined;
	try {
		const remotes = await git.getRemotes(true);
		remoteUrl = remotes[0]?.refs.fetch;
	} catch {
		// Remote might not be set up
	}

	// Get status
	const status = await git.status();

	// Get last commit
	let lastCommit: GitInfo['lastCommit'] | undefined;
	try {
		const log = await git.log({maxCount: 1});
		if (log.latest) {
			lastCommit = {
				hash: log.latest.hash,
				message: log.latest.message,
				author: log.latest.author_name,
				date: new Date(log.latest.date),
			};
		}
	} catch {
		// Repository might be empty
	}

	return {
		currentBranch,
		remoteUrl,
		status: {
			staged: status.staged,
			modified: status.modified,
			untracked: status.not_added,
		},
		lastCommit,
	};
}
````

## File: .editorconfig
````
root = true

[*]
indent_style = tab
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.yml]
indent_style = space
indent_size = 2
````

## File: .gitattributes
````
* text=auto eol=lf
````

## File: .gitignore
````
node_modules
dist
````

## File: .prettierignore
````
dist
````

## File: eslint.config.js
````javascript
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config(
	{ignores: ['dist']},
	{
		extends: [
			js.configs.recommended,
			...tseslint.configs.recommended,
			...tseslint.configs.recommendedTypeChecked,
			...tseslint.configs.stylisticTypeChecked,
		],
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parserOptions: {
				project: ['./tsconfig.json', './tsconfig.test.json'],
				tsconfigRootDir: import.meta.dirname,
			},
		},
		plugins: {
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
			'react-x': reactX,
			'react-dom': reactDom,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			...reactX.configs['recommended-typescript'].rules,
			...reactDom.configs.recommended.rules,
			'react-refresh/only-export-components': [
				'warn',
				{allowConstantExport: true},
			],
		},
	},
);
````

## File: LICENSE
````
MIT License

Copyright (c) 2025 Joel Thompson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
````

## File: tsconfig.test.json
````json
{
	"extends": "./tsconfig.json",
	"include": ["test.tsx", "**/*.test.ts", "**/*.test.tsx"],
	"compilerOptions": {
		"noEmit": true
	}
}
````

## File: source/selectMode/selectMode.tsx
````typescript
import React from 'react';
import {Text, Box, useInput, useApp} from 'ink';

export type Mode = 'select' | 'git-chat' | 'actions';
const modes: Mode[] = ['git-chat', 'actions'] as const;

export default function SelectMode({
	setMode,
	selectedIndex,
	setSelectedIndex,
}: {
	setMode: React.Dispatch<React.SetStateAction<Mode>>;
	selectedIndex: number;
	setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
	const {exit} = useApp();
	useInput((input, key) => {
		if (input === 'q') {
			exit();
			return;
		}

		if (key.upArrow) {
			setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
		}
		if (key.downArrow) {
			setSelectedIndex(prev => (prev < modes.length - 1 ? prev + 1 : prev));
		}
		if (key.return && modes[selectedIndex]) {
			setMode(modes[selectedIndex]);
		}

		const inputNumber = Number(input);
		const mode = modes[inputNumber - 1];
		if (inputNumber <= modes.length && inputNumber >= 1 && mode) {
			setMode(mode);
			return;
		}
		return;
	});

	return (
		<Box flexDirection="column" padding={1} gap={1}>
			<Text>Select a mode:</Text>
			<Box flexDirection="column">
				{modes.map((m, index) => (
					<Text key={m} color={index === selectedIndex ? 'green' : undefined}>
						{index === selectedIndex ? `> ${index + 1}. ` : `  ${index + 1}. `}
						{m}
					</Text>
				))}
			</Box>
		</Box>
	);
}
````

## File: readme.md
````markdown
# terminag

Uses ink: https://github.com/vadimdemedes/ink/blob/master/readme.md

## Install

```bash
$ npm install --global terminag
```

## CLI

```
$ terminag --help

  Usage
    $ terminag

  Options
    --name  Your name

  Examples
    $ terminag --name=Jane
    Hello, Jane
```
````

## File: test.tsx
````typescript
import React from 'react';
import chalk from 'chalk';
import test from 'ava';
import {render} from 'ink-testing-library';
import App from './source/app.js';

// TODO: tests are cuurently failing

test('greet unknown user', t => {
	const {lastFrame} = render(<App />);

	t.is(lastFrame(), `Hello, ${chalk.green('Stranger')}`);
});

test('greet user with a name', t => {
	const {lastFrame} = render(<App />);

	t.is(lastFrame(), `Hello, ${chalk.green('Jane')}`);
});
````

## File: tsconfig.json
````json
{
	"extends": "@sindresorhus/tsconfig",
	"compilerOptions": {
		"outDir": "dist",
		"moduleResolution": "node16",
		"module": "node16"
	},
	"include": ["source"]
}
````

## File: source/cli.tsx
````typescript
#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';
import {Mode} from './selectMode/selectMode.js';

const cli = meow(
	`
    Usage
      $ terminag

    Options
      --mode  The mode to run the CLI in

    Examples
      $ terminag --mode=git

  `,
	{
		importMeta: import.meta,
		flags: {
			mode: {
				type: 'string',
			},
		},
	},
);

render(<App startingMode={cli.flags.mode as Mode} />);
````

## File: source/gitMode/gitMode.tsx
````typescript
import {Box, Text, useApp, useInput} from 'ink';
import React, {useState} from 'react';
import {generateText} from 'ai';
import openai from '../ai/openai.js';
import Spinner from 'ink-spinner';
import {Mode} from '../selectMode/selectMode.js';

interface Message {
	text: string;
	isUser: boolean;
}

const seedMessages: Message[] = [
	{
		text: 'Welcome to Git Assistant! I can help you with Git commands, workflows, and best practices.',
		isUser: false,
	},
	{
		text: 'Feel free to ask any Git-related questions or type "exit" to quit.',
		isUser: false,
	},
];

export default function GitMode({setMode}: {setMode: (mode: Mode) => void}) {
	const {exit} = useApp();
	const [inputText, setInputText] = useState('');
	const [messages, setMessages] = useState<Message[]>(seedMessages);
	const [isLoading, setIsLoading] = useState(false);

	const handleMessage = async (message: string) => {
		setIsLoading(true);
		setInputText('');
		const newMessages = [...messages, {text: message, isUser: true}];
		setMessages(newMessages);
		const {text} = await generateText({
			model: openai.responses('gpt-4.1'),
			tools: {
				web_search_preview: openai.tools.webSearchPreview({
					// optional configuration:
					// searchContextSize: 'high',
				}),
			},
			system:
				'You are a Git expert assistant who specializes in version control best practices. You can help with Git commands, workflows, branching strategies, merge conflicts, repository management, and other Git-related tasks. You provide clear, practical solutions and explain Git concepts in an easy-to-understand way.',
			messages: newMessages.map(m => ({
				role: m.isUser ? 'user' : 'assistant',
				content: m.text,
			})),
		});
		setIsLoading(false);

		setMessages(prev => [...prev, {text, isUser: false}]);
	};

	useInput((input, key) => {
		if (key.return) {
			if (isLoading || !inputText.trim()) return;
			if (inputText.trim() === 'exit' || inputText.trim() === 'quit') {
				exit();
				return;
			}

			if (inputText.trim() === 'back') {
				setMode('select');
				return;
			}

			if (inputText.trim() === 'clear') {
				setMessages(seedMessages);
				setInputText('');
				return;
			}

			void handleMessage(inputText);
			return;
		}

		if (key.backspace || key.delete) {
			setInputText(prev => prev.slice(0, -1));
			return;
		}

		if (input && !key.ctrl && !key.meta) {
			const newInputText = inputText + input;
			setInputText(newInputText);
		}
	});

	return (
		<Box flexDirection="column" padding={1} gap={1}>
			<Box borderStyle="round" flexDirection="column" marginBottom={1}>
				{messages.map((message, index) => (
					<Box
						paddingBottom={index === messages.length - 1 ? undefined : 1}
						// eslint-disable-next-line react-x/no-array-index-key
						key={index}
					>
						<Text color={message.isUser ? 'yellow' : 'green'}>
							{message.isUser ? 'You: ' : 'Bot: '}
							{message.text}
						</Text>
					</Box>
				))}
			</Box>

			<Box flexDirection="row" gap={1}>
				<Box>
					{isLoading ? (
						<Text color="cyan">
							<Spinner type="dots" />
						</Text>
					) : (
						<Text color="cyan">_</Text>
					)}
				</Box>
				<Text>{inputText}</Text>
				{!isLoading && <Text color="cyan">_</Text>}
			</Box>
		</Box>
	);
}
````

## File: package.json
````json
{
	"name": "terminag",
	"version": "0.0.0",
	"license": "MIT",
	"bin": "dist/cli.js",
	"type": "module",
	"engines": {
		"node": ">=16"
	},
	"scripts": {
		"repomix": "pnpm dlx repomix",
		"build": "tsc",
		"watch": "tsc --watch",
		"test": "prettier --check . && xo && ava",
		"app": "tsc && node dist/cli.js",
		"lint": "eslint .",
		"typecheck": "tsc --noEmit && tsc -p tsconfig.test.json --noEmit"
	},
	"files": [
		"dist"
	],
	"dependencies": {
		"@ai-sdk/openai": "^1.3.16",
		"ai": "^4.3.9",
		"ink": "^4.1.0",
		"ink-spinner": "^5.0.0",
		"meow": "^11.0.0",
		"react": "^18.2.0",
		"simple-git": "^3.27.0",
		"zod": "^3.24.3"
	},
	"devDependencies": {
		"@eslint/js": "^9.24.0",
		"@sindresorhus/tsconfig": "^3.0.1",
		"@types/react": "^18.0.32",
		"@vdemedes/prettier-config": "^2.0.1",
		"ava": "^5.2.0",
		"chalk": "^5.2.0",
		"eslint": "^9.24.0",
		"eslint-config-xo-react": "^0.27.0",
		"eslint-plugin-react": "^7.32.2",
		"eslint-plugin-react-dom": "^1.48.3",
		"eslint-plugin-react-hooks": "^4.6.2",
		"eslint-plugin-react-refresh": "^0.4.19",
		"eslint-plugin-react-x": "^1.48.3",
		"ink-testing-library": "^3.0.0",
		"prettier": "^2.8.7",
		"ts-node": "^10.9.1",
		"typescript": "^5.0.3",
		"typescript-eslint": "^8.30.1",
		"xo": "^0.53.1"
	},
	"ava": {
		"extensions": {
			"ts": "module",
			"tsx": "module"
		},
		"nodeArguments": [
			"--loader=ts-node/esm"
		]
	},
	"xo": {
		"extends": "xo-react",
		"prettier": true,
		"rules": {
			"react/prop-types": "off"
		}
	},
	"prettier": "@vdemedes/prettier-config"
}
````

## File: source/app.tsx
````typescript
import React, {useState} from 'react';
import {Text, Box} from 'ink';
import GitMode from './gitMode/gitMode.js';
import SelectMode, {Mode} from './selectMode/selectMode.js';
import ActionsMode from './actions/ActionsMode.js';

export default function App({startingMode}: {startingMode: Mode}) {
	const [mode, setMode] = useState<Mode>(startingMode || 'select');
	const [selectedIndex, setSelectedIndex] = useState(0);

	if (mode === 'select') {
		return (
			<SelectMode
				setMode={setMode}
				selectedIndex={selectedIndex}
				setSelectedIndex={setSelectedIndex}
			/>
		);
	}

	if (mode === 'git-chat') {
		return <GitMode setMode={setMode} />;
	}

	if (mode === 'actions') {
		return <ActionsMode setMode={setMode} />;
	}

	return (
		<Box padding={1}>
			<Text>Mode {mode} is not implemented</Text>
		</Box>
	);
}
````



# Instruction
This file is the output of my terminag project. Use it as a reference for other projects built using the 'ink' library.