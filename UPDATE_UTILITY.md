# Update Available Usernames Utility

## Purpose
This script reads all `results_*.json` files in the current directory and consolidates all available usernames into `available_usernames.txt`.

## Usage

```bash
npm run update
```

Or directly:
```bash
node update_available.js
```

## What It Does

1. **Finds all result files** - Scans for `results_*.json` files
2. **Extracts available usernames** - Pulls out all usernames marked as available
3. **Removes duplicates** - Ensures each username appears only once
4. **Sorts alphabetically** - Orders usernames A-Z
5. **Saves to file** - Writes to `available_usernames.txt`
6. **Displays summary** - Shows statistics and lists all available usernames

## Output

The script will:
- Show which result files were found
- Display statistics for each file
- Show total summary (checked, available, taken, errors)
- List all unique available usernames
- Save everything to `available_usernames.txt`

## Example Output

```
═══════════════════════════════════════════════
   UPDATE AVAILABLE USERNAMES FROM RESULTS
═══════════════════════════════════════════════

📁 Found 2 result file(s):

   - results_2025-12-13T19-30-00-000Z.json
   - results_2025-12-13T19-45-00-000Z.json

📖 Reading results_2025-12-13T19-30-00-000Z.json...
   ✅ Available: 5
   ⛔ Taken: 45
   ❌ Errors: 0

📖 Reading results_2025-12-13T19-45-00-000Z.json...
   ✅ Available: 3
   ⛔ Taken: 47
   ❌ Errors: 0

═══════════════════════════════════════════════
                   SUMMARY
═══════════════════════════════════════════════
📊 Total usernames checked: 100
✅ Total available: 8
⛔ Total taken: 92
❌ Total errors: 0

💾 Unique available usernames: 7
📝 Saved to: available_usernames.txt
═══════════════════════════════════════════════

🎉 AVAILABLE USERNAMES:

   ✅ aptly
   ✅ bytez
   ✅ codec
   ✅ ethos
   ✅ nixie
   ✅ regex
   ✅ zerox
```

## When to Use

- After running the checker multiple times
- To consolidate results from different runs
- To get a clean, sorted list of available usernames
- To see overall statistics across all checks
