const chatContainer = document.getElementById('chat-container');
const connectionStatus = document.getElementById('connection-status');
const settingsToggle = document.getElementById('settings-toggle');
const settingsContent = document.getElementById('settings-content');
const saveSettingsButton = document.getElementById('save-settings');
const channelInput = document.getElementById('channel-input');
const maxMessagesInput = document.getElementById('max-messages');
const messageFadeInput = document.getElementById('message-fade');
const bgOpacityInput = document.getElementById('bg-opacity');
const opacityValue = document.getElementById('opacity-value');

let userColors = {};
let maxMessages = 10;
let messageFade = 0;
let bgOpacity = 60;
let channel = 'byqurn';

// Ayarları kaydet
function saveSettings() {
  channel = channelInput.value || 'byqurn';
  maxMessages = parseInt(maxMessagesInput.value, 10);
  messageFade = parseInt(messageFadeInput.value, 10);
  bgOpacity = parseInt(bgOpacityInput.value, 10);
  opacityValue.textContent = `${bgOpacity}%`;
  chatContainer.style.backgroundColor = `rgba(0, 0, 0, ${bgOpacity / 100})`;
  reconnectWebSocket();
}

// WebSocket bağlantısını kur
let ws;
function reconnectWebSocket() {
  if (ws) {
    ws.close(); // eski bağlantıyı kapat
  }
  
  connectionStatus.textContent = 'Connecting...';

  ws = new WebSocket(`wss://chat.kick.com/${channel}`);

  ws.onopen = () => {
    connectionStatus.textContent = 'Connected';
  };

  ws.onerror = () => {
    connectionStatus.textContent = 'Failed to connect';
  };

  ws.onclose = () => {
    connectionStatus.textContent = 'Disconnected';
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        const username = data.data.sender.username;
        const message = data.data.content;
        addMessage(username, message);
      }
    } catch (e) {
      console.error('Message parse error:', e);
    }
  };
}

// Kullanıcı adını ve mesajı ekle
function addMessage(username, message) {
  if (!userColors[username]) {
    userColors[username] = getRandomColor();
  }

  const div = document.createElement('div');
  div.className = 'chat-message';
  div.innerHTML = `<span class="username" style="color: ${userColors[username]}">${username}:</span> ${parseEmojis(message)}`;

  chatContainer.appendChild(div);

  while (chatContainer.children.length > maxMessages) {
    chatContainer.removeChild(chatContainer.firstChild);
  }

  if (messageFade > 0) {
    setTimeout(() => {
      div.style.opacity = 0;
    }, messageFade * 1000);
  }
}

// Emoji desteği ekle
function parseEmojis(text) {
  return text.replace(/:[a-zA-Z0-9_]+:/g, match => {
    const emoji = match.slice(1, -1);
    return `<img src="https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji}.png" alt="${emoji}" style="height: 20px; vertical-align: middle;" onerror="this.remove()">`;
  });
}

// Rastgele renk seç
function getRandomColor() {
  const colors = ['#ff5e5e', '#ffd15e', '#5eff8a', '#5ecbff', '#b75eff', '#ff5ecd'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Ayarları kaydet butonuna tıklama
saveSettingsButton.addEventListener('click', saveSettings);

// Ayarları açma / kapama
settingsToggle.addEventListener('click', () => {
  settingsContent.classList.toggle('hidden');
});

// Sayfa yüklendiğinde WebSocket'i başlat
window.onload = reconnectWebSocket;




const testSocket = new WebSocket('wss://echo.websocket.org');

testSocket.onopen = () => {
  console.log('Test WebSocket bağlantısı başarıyla kuruldu!');
  testSocket.send('Merhaba, bu bir test mesajıdır.');
};

testSocket.onmessage = (event) => {
  console.log('Test mesajı alındı:', event.data);
};

testSocket.onerror = (error) => {
  console.log('Test WebSocket hatası:', error);
};

testSocket.onclose = () => {
  console.log('Test WebSocket bağlantısı kapandı');
};
