# gi

## Install

You can install `gi` globally from npm:

```bash
npm install -g @joelthompson/gi
```

Or if you prefer using pnpm:

```bash
pnpm add -g @joelthompson/gi
```

After installation, the `gi` command will be available globally in your terminal.

NOTE: i'm updating frequently, so you may need to run `pnpm update -g @joelthompson/gi` to get the latest version.

## Setup

It uses an openai api key, and expects a config file in ~/.gi.config.json.

example config file:

```json
{
  "openaiApiKey": "your key here"
}
```

## Usage

**Important**: The `-c` (commit) flag is required to perform any actions. Running the tool without flags will show the help screen:

```bash
# No flags passed
$ gi
Flags passed: {"dryRun":false,"commit":false,"verbose":false,"yesCommit":false}
No action taken. Please use one of the following options:
--commit (-c) Generate and apply an AI commit message
--dry-run (-d) Show what would be committed without making changes
--verbose (-v) Show detailed output including full diff
--yesCommit (-y) Skip confirmation and commit directly


# Generate an AI commit message and prompt for confirmation
$ gi -c
message: feat: add user authentication system
Press Y to confirm or N to cancel

# Dry run - shows the AI-generated message without committing
$ gi -c -d
message: docs: update API documentation

# Show verbose output including the full diff being analyzed
$ gi -c -v
message: feat: add new feature
Press Y to confirm or N to cancel

# Skip confirmation and commit directly with AI-generated message
$ gi -c -y
message: fix: resolve login issue
```

I prefer to set an alias for my preffered way to run the tool.
Example:
```bash
alias gii="gi -c -y"
```

The tool will:
- Automatically exclude lock files (pnpm-lock.yaml, package-lock.json, yarn.lock)
- Ignore node_modules and image files (png, jpg, jpeg, gif, svg, webp, bmp, ico)
- Generate conventional commit messages (feat, fix, docs, etc.)
- Handle both tracked and untracked files
- Limit diff size to 5000 characters for optimal processing

Special cases:
- If there are no changes to commit, it will show "No changes to commit"
- If the diff is too large (>5000 chars), it will show "Diff too big to process"

## CLI

```
$ gi

  Usage
    $ gi [options]

  Options
    -c, --commit     Add and commit changes with AI-generated message
    -d, --dry-run    Show what would be committed without making changes
    -v, --verbose    Show detailed output including full diff
    -y, --yesCommit  Skip confirmation and commit directly

  Examples
    $ gi -c
    # Generates commit message and prompts for confirmation
    
    $ gi -c -d
    # Shows generated message without committing
    
    $ gi -c -v
    # Shows full diff and generated message
    
    $ gi -c -y
    # Commits changes immediately with AI message
```
