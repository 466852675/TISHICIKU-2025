#!/usr/bin/env node

/**
 * Tavily Search Script
 * AI-optimized web search using Tavily API
 * 
 * Usage: node search.mjs "query" [-n num] [--deep] [--topic news]
 */

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const BASE_URL = 'https://api.tavily.com/search';

const args = process.argv.slice(2);

if (!args.length) {
  console.log('Usage: node search.mjs "query" [-n num] [--deep] [--topic news]');
  console.log('Example: node search.mjs "OpenClaw skills" -n 5');
  process.exit(1);
}

if (!TAVILY_API_KEY) {
  console.error('Error: TAVILY_API_KEY environment variable is not set');
  console.error('Please set it with: export TAVILY_API_KEY=your_api_key');
  process.exit(1);
}

// Parse arguments
const query = args[0];
const options = {
  maxResults: 5,
  deepSearch: false,
  topic: 'general'
};

for (let i = 1; i < args.length; i++) {
  const arg = args[i];
  if (arg === '-n' && args[i + 1]) {
    options.maxResults = parseInt(args[i + 1]);
    i++;
  } else if (arg === '--deep') {
    options.deepSearch = true;
  } else if (arg === '--topic' && args[i + 1]) {
    options.topic = args[i + 1];
    i++;
  }
}

async function search() {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query: query,
        max_results: options.maxResults,
        search_depth: options.deepSearch ? 'advanced' : 'basic',
        topic: options.topic,
        include_answer: true,
        include_raw_content: false,
        include_images: false,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    
    // Print answer if available
    if (data.answer) {
      console.log('## Answer\n');
      console.log(data.answer);
      console.log('\n---\n');
    }
    
    // Print sources
    console.log('## Sources\n');
    if (data.results && data.results.length > 0) {
      data.results.forEach((result, index) => {
        console.log(`- **${result.title}** (relevance: ${Math.round(result.score * 100)}%)`);
        console.log(`  ${result.url}`);
        if (result.content) {
          const snippet = result.content.substring(0, 200);
          console.log(`  ${snippet}...`);
        }
        console.log('');
      });
    } else {
      console.log('No results found.');
    }
    
  } catch (error) {
    console.error('Search error:', error.message);
    process.exit(1);
  }
}

search();
