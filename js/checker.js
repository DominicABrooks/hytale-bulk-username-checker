// Username checking functionality
const API_URL = 'https://api.hytl.tools/check';

async function checkUsername(username) {
    try {
        const response = await fetch(`${API_URL}/${encodeURIComponent(username)}`);

        if (response.status === 429) {
            throw new Error('Rate limited');
        }

        const data = await response.json();
        return {
            username,
            available: data.available || false,
            status: 'success'
        };
    } catch (error) {
        return {
            username,
            available: false,
            status: 'error',
            error: error.message
        };
    }
}

async function processBatch(usernames, delay, concurrent) {
    const stats = {
        total: usernames.length,
        checked: 0,
        available: 0,
        taken: 0,
        errors: 0,
        invalid: 0
    };

    for (let i = 0; i < usernames.length && !shouldStop; i += concurrent) {
        const batch = usernames.slice(i, i + concurrent);
        const promises = batch.map(username => {
            // Check if username is valid first
            if (!isValidUsername(username)) {
                return Promise.resolve({
                    username,
                    status: 'invalid'
                });
            }
            return checkUsername(username);
        });

        const batchResults = await Promise.all(promises);

        for (const result of batchResults) {
            stats.checked++;

            if (result.status === 'invalid') {
                stats.invalid++;
                addResult(result.username, 'errors');
            } else if (result.status === 'error') {
                stats.errors++;
                addResult(result.username, 'errors');
            } else if (result.available) {
                stats.available++;
                addResult(result.username, 'available');
            } else {
                stats.taken++;
                addResult(result.username, 'taken');
            }

            updateStats(stats);
        }

        if (i + concurrent < usernames.length && !shouldStop) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    return stats;
}

function isValidUsername(username) {
    // Must be 3-16 characters
    if (username.length < 3 || username.length > 16) {
        return false;
    }
    // Must be letters, numbers, or underscore only
    return /^[a-zA-Z0-9_]+$/.test(username);
}
