const chatContainer = document.getElementById('chat-container');
const connectionStatus = document.getElementById('connection-status');
let socket;
let channel = 'byqurn'; // Default channel
const settingsToggle = document.getElementById('settings-toggle');
const settingsContent = document.getElementById('settings-content');
const saveSettingsButton = document.getElementById('save-settings');
const channelInput = document.getElementById('channel-input');

let publicKey = 'nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAq/+l1WnlRrGSolDMA+A8\n6rAhMbQGmQ2SapVcGM3zq8ANXjnhDWocMqfWcTd95btDydITa10kDvHzw9WQOqp2\nMZI7ZyrfzJuz5nhTPCiJwTwnEtWft7nV14BYRDHvlfqPUaZ+1KR4OCaO/wWIk/rQ\nL/TjY0M70gse8rlBkbo2a8rKhu69RQTRsoaf4DVhDPEeSeI5jVrRDGAMGL3cGuyY\n6CLKGdjVEM78g3JfYOvDU/RvfqD7L89TZ3iN94jrmWdGz34JNlEI5hqK8dd7C5EF\nBEbZ5jgB8s8ReQV8H+MkuffjdAj3ajDDX3DOJMIut1lBrUVD1AaSrGCKHooWoL2e\ntwIDAQAB\n-----END PUBLIC KEY-----"'; // Public Key'yi buraya ekle

// WebSocket bağlantısı kurma
function connectToChat() {
  connectionStatus.textContent = 'Connecting...';
  
  // WebSocket URL'yi doğru endpoint ile değiştirdiğinden emin ol
  socket = new WebSocket(`wss://chat.kick.com/${channel}`);

  socket.onopen = () => {
    connectionStatus.textContent = 'Connected';
    console.log('WebSocket connection established.');
  };

  socket.onerror = (error) => {
    console.error('WebSocket Error: ', error);
    connectionStatus.textContent = 'Error connecting';
  };

  socket.onclose = () => {
    connectionStatus.textContent = 'Disconnected';
    console.log('WebSocket connection closed.');
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
