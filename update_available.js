import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Find all result files
function findResultFiles() {
    const files = readdirSync('.');
    return files.filter(file => file.startsWith('results_') && file.endsWith('.json'));
}

// Read and parse a result file
function readResultFile(filename) {
    try {
        const content = readFileSync(filename, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        console.error(`❌ Error reading ${filename}: ${error.message}`);
        return null;
    }
}

// Extract available usernames from results
function extractAvailableUsernames(results) {
    const available = new Set();

    if (results.available && Array.isArray(results.available)) {
        results.available.forEach(item => {
            if (item.username) {
                available.add(item.username);
            }
        });
    }

    return Array.from(available);
}

// Main function
function main() {
    console.log('═══════════════════════════════════════════════');
    console.log('   UPDATE AVAILABLE USERNAMES FROM RESULTS');
    console.log('═══════════════════════════════════════════════\n');

    // Find all result files
    const resultFiles = findResultFiles();

    if (resultFiles.length === 0) {
        console.log('❌ No result files found (results_*.json)');
        return;
    }

    console.log(`📁 Found ${resultFiles.length} result file(s):\n`);
    resultFiles.forEach(file => console.log(`   - ${file}`));
    console.log('');

    // Collect all available usernames
    const allAvailable = new Set();
    let totalChecked = 0;
    let totalAvailable = 0;
    let totalTaken = 0;
    let totalErrors = 0;

    resultFiles.forEach(file => {
        console.log(`📖 Reading ${file}...`);
        const results = readResultFile(file);

        if (results) {
            const available = extractAvailableUsernames(results);
            available.forEach(username => allAvailable.add(username));

            const checked = (results.available?.length || 0) +
                (results.unavailable?.length || 0) +
                (results.errors?.length || 0) +
                (results.rateLimited?.length || 0);

            totalChecked += checked;
            totalAvailable += results.available?.length || 0;
            totalTaken += results.unavailable?.length || 0;
            totalErrors += (results.errors?.length || 0) + (results.rateLimited?.length || 0);

            console.log(`   ✅ Available: ${results.available?.length || 0}`);
            console.log(`   ⛔ Taken: ${results.unavailable?.length || 0}`);
            console.log(`   ❌ Errors: ${(results.errors?.length || 0) + (results.rateLimited?.length || 0)}`);
        }
        console.log('');
    });

    // Sort usernames
    const sortedUsernames = Array.from(allAvailable).sort();

    // Write to file
    const outputFile = 'available_usernames.txt';
    const content = sortedUsernames.join('\n') + '\n';
    writeFileSync(outputFile, content);

    console.log('═══════════════════════════════════════════════');
    console.log('                   SUMMARY');
    console.log('═══════════════════════════════════════════════');
    console.log(`📊 Total usernames checked: ${totalChecked}`);
    console.log(`✅ Total available: ${totalAvailable}`);
    console.log(`⛔ Total taken: ${totalTaken}`);
    console.log(`❌ Total errors: ${totalErrors}`);
    console.log('');
    console.log(`💾 Unique available usernames: ${sortedUsernames.length}`);
    console.log(`📝 Saved to: ${outputFile}`);
    console.log('═══════════════════════════════════════════════\n');

    // Display available usernames
    if (sortedUsernames.length > 0) {
        console.log('🎉 AVAILABLE USERNAMES:\n');
        sortedUsernames.forEach(username => {
            console.log(`   ✅ ${username}`);
        });
        console.log('');
    } else {
        console.log('😞 No available usernames found\n');
    }
}

// Run the script
main();
