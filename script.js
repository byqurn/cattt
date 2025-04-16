const chatContainer = document.getElementById('chat-container');
const connectionStatus = document.getElementById('connection-status');
let channel = 'byqurn'; // Default channel
const settingsToggle = document.getElementById('settings-toggle');
const settingsContent = document.getElementById('settings-content');
const saveSettingsButton = document.getElementById('save-settings');
const channelInput = document.getElementById('channel-input');

let socket;

// WebSocket bağlantısı kurma
function connectToChat() {
  connectionStatus.textContent = 'Connecting...';
  socket = new WebSocket(`wss://chat.kick.com/${channel}`);

  socket.onopen = () => {
    connectionStatus.textContent = 'Connected';
  };

  socket.onerror = (error) => {
    console.error('WebSocket Error: ', error);
    connectionStatus.textContent = 'Error connecting';
  };

  socket.onclose = () => {
    connectionStatus.textContent = 'Disconnected';
  };

  socket.onmessage = (event) => {
    const messageData = JSON.parse(event.data);
    if (messageData && messageData.message) {
      displayMessage(messageData);
    }
  };
}

// Mesajı ekranda gösterme
function displayMessage(messageData) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message');

  // Kullanıcı adı kalın, mesaj metni normal
  const usernameElement = document.createElement('strong');
  usernameElement.classList.add('username');
  usernameElement.textContent = messageData.user;

  const messageText = document.createElement('span');
  messageText.classList.add('message-text');
  messageText.innerHTML = messageData.message;  // Eğer emoji varsa, burada işlenecek

  messageElement.appendChild(usernameElement);
  messageElement.appendChild(messageText);

  chatContainer.prepend(messageElement); // Mesajı üstte göster

  // Eğer fazla mesaj varsa, ilkini sil
  if (chatContainer.children.length > 50) {
    chatContainer.removeChild(chatContainer.lastChild);
  }
}

// Kanal adı ve diğer ayarları kaydetme
saveSettingsButton.addEventListener('click', () => {
  channel = channelInput.value.trim();
  connectToChat();
});

// Ayar paneli açma
settingsToggle.addEventListener('click', () => {
  settingsContent.classList.toggle('hidden');
});

// Sayfa yüklendiğinde chat'e bağlan
window.onload = () => {
  connectToChat();
};
