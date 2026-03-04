---
name: tavily
description: AI-optimized web search via Tavily API. Returns concise, relevant results for AI agents.
metadata:
  openclaw:
    requires:
      env:
        - TAVILY_API_KEY
    primaryEnv: TAVILY_API_KEY
---

# Tavily Search

AI-optimized web search using Tavily API. Designed for AI agents - returns clean, relevant content.

## When to Use This Skill

Use the tavily skill when:
- You need current information or latest data
- User asks about recent news or events
- You need to search for information beyond your knowledge cutoff
- Research tasks requiring web search

## How to Use

### Basic Search

```bash
node scripts/search.mjs "your search query"
```

### Options

- `-n <number>` - Number of results (default: 5)
- `--deep` - Deep search for complex queries
- `--topic news` - Search for news only

### Examples

```bash
# Basic search
node scripts/search.mjs "OpenClaw skills"

# Get 10 results
node scripts/search.mjs "AI news 2026" -n 10

# Deep research
node scripts/search.mjs "machine learning best practices" --deep

# News search
node scripts/search.mjs "technology news" --topic news
```

## Environment Variables

- `TAVILY_API_KEY` - Required. Get from https://tavily.com

## Output Format

The skill returns:
- Concise answer to the query
- List of relevant sources with URLs
- Relevance scores for each source
