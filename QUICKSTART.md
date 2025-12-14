# Quick Start Guide

## Installation

```bash
npm install
```

## Running the Checker

```bash
npm start
```

## What It Does

The checker will:
1. Generate ~2,500 OG usernames (single letters, two letters, common words, numbers, etc.)
2. Check each one against the hytl.tools API
3. Save available usernames to `available_usernames.txt` in real-time
4. Show progress and results in the console

## Expected Performance

- **Speed**: ~2,500 usernames in approximately 5-10 minutes
- **Rate Limiting**: Much less likely with hytl.tools API
- **Concurrent Requests**: 5 at a time with 200ms delay between batches

## Output Files

- `available_usernames.txt` - Available usernames (updated in real-time)
- `results_[timestamp].json` - Full results with all details

## If You Get Rate Limited

1. **Increase delay**: Change `delayMs: 200` to `delayMs: 500` or higher
2. **Reduce concurrency**: Change `maxConcurrent: 5` to `maxConcurrent: 3`
3. **Enable proxies**: Set `useProxy: true` and add proxies to `proxies.txt`

## Tips

- The checker will automatically retry 429 errors with exponential backoff
- Available usernames are saved immediately, so you won't lose them if the script crashes
- Check the console for real-time updates on what's available
