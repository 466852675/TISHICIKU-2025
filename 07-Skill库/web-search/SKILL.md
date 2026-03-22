---
name: web-search
description: Real-time web search using inference.sh CLI. Use this skill when you need current information, latest documentation, recent news, or any data beyond your knowledge cutoff.
allowed-tools: Bash(infsh *)
---

# Web Search & Extraction

Search the web and extract content via [inference.sh](https://inference.sh) CLI.

## Quick Start

### Install inference.sh CLI
```bash
npm install -g inference.sh
infsh login
```

### Basic Search
```bash
infsh app run tavily/search-assistant --input '{"query": "latest AI developments"}'
```

## Available Apps

### Tavily
- `tavily/search-assistant` - AI-powered search with answers
- `tavily/extract` - Extract content from URLs
- `tavily/crawl` - Crawl multiple pages
- `tavily/map` - Research mapping
- `tavily/research` - Comprehensive research

### Exa
- `exa/search` - Smart web search with AI
- `exa/answer` - Direct factual answers
- `exa/extract` - Extract and analyze web content

## Examples

```bash
# Tavily Search
infsh app run tavily/search-assistant --input '{"query": "best AI frameworks"}'

# Exa Search  
infsh app run exa/search --input '{"query": "machine learning"}'

# Extract URLs
infsh app run tavily/extract --input '{"urls": ["https://example.com"]}'
```

## Setup

1. `npm install -g inference.sh`
2. `infsh login`
3. Get Tavily API key from tavily.com (optional)

## Related Skills

- `npx skills add inference-sh/skills@infsh-cli` - Full platform skill
- `npx skills add inference-sh/skills@llm-models` - LLM models
