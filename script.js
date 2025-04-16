
const chatContainer = document.getElementById('chat-container');
const userColors = {};
const maxMessages = 10;

function getRandomColor() {
  const colors = ['#ff5e5e', '#ffd15e', '#5eff8a', '#5ecbff', '#b75eff', '#ff5ecd'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function parseEmojis(text) {
  return text.replace(/:[a-zA-Z0-9_]+:/g, match => {
    const emoji = match.slice(1, -1);
    return `<img src="https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji}.png" alt="${emoji}" style="height: 20px; vertical-align: middle;" onerror="this.remove()">`;
  });
}

function addMessage(username, message) {
  if (!userColors[username]) {
    userColors[username] = getRandomColor();
  }

  const div = document.createElement('div');
  div.className = 'chat-message';
  div.innerHTML = `<span class="username" style="color: ${userColors[username]}">${escapeHtml(username)}:</span> ${parseEmojis(escapeHtml(message))}`;

  chatContainer.appendChild(div);

  while (chatContainer.children.length > maxMessages) {
    chatContainer.removeChild(chatContainer.firstChild);
  }
}

// WebSocket bağlantısı
const channel = "byqurn"; // Burayı kanal adına göre düzenle
const ws = new WebSocket(`wss://chat.kick.com/${channel}`);

ws.addEventListener('message', (event) => {
  try {
    const data = JSON.parse(event.data);
    if (data.type === 'message') {
      const username = data.data.sender.username;
      const message = data.data.content;
      addMessage(username, message);
    }
  } catch (e) {
    console.error('Mesaj parse edilemedi:', e);
  }
});
