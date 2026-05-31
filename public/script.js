const API_BASE = 'http://localhost:5000';
let history = [];
const sessionId = 'session_' + Date.now();

async function process() {
    const input = document.getElementById('in');
    const chat = document.getElementById('chat');
    const status = document.getElementById('status');
    
    if (!input.value.trim()) return;

    const prompt = input.value;
    chat.innerHTML += `<div class="bubble user">${escapeHtml(prompt)}</div>`;
    input.value = '';

    const isImg = prompt.toLowerCase().startsWith('generate');
    const thinkingId = 'thinking_' + Date.now();
    chat.innerHTML += `<div class="bubble ai loading" id="${thinkingId}">Thinking...</div>`;
    chat.scrollTop = chat.scrollHeight;

    try {
        status.textContent = 'Processing...';
        
        if (isImg) {
            const cleanPrompt = prompt.replace(/^generate\s+/i, '');
            const response = await fetch(`${API_BASE}/api/generate-image`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: cleanPrompt })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            document.getElementById(thinkingId).remove();
            chat.innerHTML += `<div class="bubble ai"><img src="${data.imageUrl}" class="rounded-xl max-w-full" loading="lazy"></div>`;
        } else {
            const response = await fetch(`${API_BASE}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: prompt,
                    sessionId
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            document.getElementById(thinkingId).remove();
            chat.innerHTML += `<div class="bubble ai">${escapeHtml(data.reply)}</div>`;
        }
        status.textContent = '';
    } catch (error) {
        console.error('Error:', error);
        const errorMsg = document.getElementById(thinkingId);
        if (errorMsg) {
            errorMsg.innerHTML = `❌ Error: ${escapeHtml(error.message)}`;
            errorMsg.classList.add('error');
            errorMsg.classList.remove('loading');
        }
        status.textContent = `Error: ${error.message}`;
    }
    
    chat.scrollTop = chat.scrollHeight;
}

async function clearHistory() {
    if (confirm('Clear conversation history?')) {
        try {
            await fetch(`${API_BASE}/api/clear-history`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId })
            });
            document.getElementById('chat').innerHTML = `<div class="bubble ai">Conversation cleared. Start fresh!</div>`;
        } catch (error) {
            alert('Failed to clear history: ' + error.message);
        }
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.getElementById('btn').onclick = process;
document.getElementById('clear').onclick = clearHistory;
document.getElementById('in').onkeypress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        process();
    }
};
