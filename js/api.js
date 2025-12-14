// AI name generation functionality
async function generateNames() {
    const promptInput = document.getElementById('generatePrompt');
    const countInput = document.getElementById('generateCount');
    const generateBtn = document.getElementById('generateBtn');
    const statusDiv = document.getElementById('generateStatus');
    const textarea = document.getElementById('usernames');

    const prompt = promptInput.value.trim();
    const count = parseInt(countInput.value) || 10;

    if (!prompt) {
        alert('Please enter a prompt for name generation');
        return;
    }

    // Show loading status
    generateBtn.disabled = true;
    statusDiv.className = 'generate-status loading';
    statusDiv.innerHTML = '<div class="spinner"></div> Generating names...';

    try {
        // Use Pollinations.ai - free, unauthenticated text generation API
        const response = await fetch('https://text.pollinations.ai/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [{
                    role: 'user',
                    content: `Generate exactly ${count} RARE and COMMON "OG" style usernames based on this theme: "${prompt}".

Think of classic Minecraft OG names - short, simple, memorable REAL WORDS or common terms.

Requirements:
- Each username must be 3-16 characters
- Only use letters, numbers, and underscores
- Prefer SHORT, simple, real English words (3-8 characters is ideal)
- Examples of OG style: "Dream", "Sky", "Fire", "Wolf", "Storm", "Ace", "King", "Fox"
- Mix of rare single words and common terms
- No complex combinations unless they're iconic

Output ONLY the usernames, one per line, nothing else. No numbering, no explanations.`
                }],
                seed: Math.floor(Math.random() * 1000000)
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error (${response.status}): ${errorText}`);
        }

        const generatedText = await response.text();

        // Extract usernames from the generated text
        const lines = generatedText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => {
                // Remove common prefixes like numbers, bullets, dashes
                return line.replace(/^[\d\-\*\.\)\]]+\s*/, '').trim();
            })
            .filter(line => {
                // Filter to valid usernames only
                return line.length >= 3 &&
                    line.length <= 16 &&
                    /^[a-zA-Z0-9_]+$/.test(line);
            })
            .slice(0, count);

        if (lines.length === 0) {
            throw new Error('No valid usernames generated. The API response did not contain valid usernames. Try a different prompt.');
        }

        // Add to textarea
        const currentText = textarea.value.trim();
        const newText = currentText
            ? currentText + '\n' + lines.join('\n')
            : lines.join('\n');
        textarea.value = newText;

        // Show success status
        statusDiv.className = 'generate-status success';
        statusDiv.innerHTML = `✓ Generated ${lines.length} usernames! Added to the list above.`;

        // Clear status after 5 seconds
        setTimeout(() => {
            statusDiv.classList.add('hidden');
        }, 5000);

    } catch (error) {
        console.error('Generation error:', error);
        statusDiv.className = 'generate-status error';
        statusDiv.innerHTML = `✗ ${error.message}`;
    } finally {
        generateBtn.disabled = false;
    }
}
