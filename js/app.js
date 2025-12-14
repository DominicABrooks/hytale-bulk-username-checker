// Main application logic and UI management
let isChecking = false;
let shouldStop = false;
let results = {
    all: [],
    available: [],
    taken: [],
    errors: []
};
let currentTab = 'all';

function updateStats(stats) {
    document.getElementById('totalCount').textContent = stats.total;
    document.getElementById('checkedCount').textContent = stats.checked;
    document.getElementById('availableCount').textContent = stats.available;
    document.getElementById('takenCount').textContent = stats.taken;
    document.getElementById('errorCount').textContent = stats.errors;

    const progress = stats.total > 0 ? (stats.checked / stats.total * 100) : 0;
    document.getElementById('progressFill').style.width = `${progress}%`;
}

function addResult(username, status) {
    const result = { username, status };
    results.all.push(result);
    results[status].push(result);

    if (currentTab === 'all' || currentTab === status) {
        displayResult(result);
    }
}

function displayResult(result) {
    const resultList = document.getElementById('resultList');
    const item = document.createElement('div');
    item.className = `result-item ${result.status}`;

    const usernameSpan = document.createElement('span');
    usernameSpan.className = 'username';
    usernameSpan.textContent = result.username;

    const badge = document.createElement('span');
    badge.className = `badge ${result.status}`;
    badge.textContent = result.status;

    item.appendChild(usernameSpan);
    item.appendChild(badge);
    resultList.appendChild(item);
}

function switchTab(tab) {
    currentTab = tab;

    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    const resultList = document.getElementById('resultList');
    resultList.innerHTML = '';

    const resultsToShow = tab === 'all' ? results.all : results[tab];
    resultsToShow.forEach(result => displayResult(result));
}

async function startCheck() {
    const textarea = document.getElementById('usernames');
    const usernames = textarea.value
        .split('\n')
        .map(u => u.trim())
        .filter(u => u.length > 0);

    if (usernames.length === 0) {
        alert('Please enter at least one username');
        return;
    }

    isChecking = true;
    shouldStop = false;
    results = { all: [], available: [], taken: [], errors: [] };

    document.getElementById('startBtn').classList.add('hidden');
    document.getElementById('stopBtn').classList.remove('hidden');
    document.getElementById('stats').classList.remove('hidden');
    document.getElementById('progressBar').classList.remove('hidden');
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('resultList').innerHTML = '';

    const delay = parseInt(document.getElementById('delay').value);
    const concurrent = parseInt(document.getElementById('concurrent').value);

    await processBatch(usernames, delay, concurrent);

    document.getElementById('startBtn').classList.remove('hidden');
    document.getElementById('stopBtn').classList.add('hidden');
    document.getElementById('exportBtn').classList.remove('hidden');

    isChecking = false;
}

function stopCheck() {
    shouldStop = true;
    document.getElementById('stopBtn').disabled = true;
}

function exportResults() {
    const available = results.available.map(r => r.username).join('\n');
    const blob = new Blob([available], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `available_usernames_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
