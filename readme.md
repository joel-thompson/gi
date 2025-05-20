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

Here's a screenshot of the CLI in action:

![alt text](images/screenshot.png)


## CLI

```
$ gi -c

  Usage
    $ gi [options]

  Options
    -c, --commit    Add and commit changes with AI-generated message
    -d, --dry-run   Show what would be committed without making changes

  Examples
    $ gi -c
    # Adds and commits changes with AI-generated message
    
    $ gi -c -d
    # Shows what would be committed without making changes
```
