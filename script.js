// WebSocket bağlantısı kurmak için gerekli fonksiyon
function connectToChat() {
    const channel = document.getElementById("channel-input").value || 'byqurn';  // Kanal ismini kullanıcıdan al, default 'byqurn'
    socket = new WebSocket(`wss://chat.kick.com/chat/${channel}`);
    
    // WebSocket bağlantısı açıldığında yapılacak işlemler
    socket.onopen = () => {
        console.log('Connected to chat');
        document.getElementById('connection-status').textContent = "Connected";
    };
    
    // WebSocket hatası oluştuğunda yapılacak işlemler
    socket.onerror = (error) => {
        console.error("WebSocket Error: ", error);
        document.getElementById('connection-status').textContent = "Connection Error";
        reconnectWebSocket();
    };

    // WebSocket bağlantısı kapandığında yapılacak işlemler
    socket.onclose = () => {
        console.log('WebSocket connection closed');
        document.getElementById('connection-status').textContent = "Disconnected";
        reconnectWebSocket();
    };

    // WebSocket'ten mesaj alındığında yapılacak işlemler
    socket.onmessage = (event) => {
        console.log('Received message:', event.data);
        const message = JSON.parse(event.data);
        displayMessage(message);
    };
}

// WebSocket bağlantısını yeniden denemek için fonksiyon
function reconnectWebSocket() {
    setTimeout(() => {
        console.log("Reconnecting...");
        connectToChat();
    }, 5000); // 5 saniye sonra yeniden bağlanmayı dene
}

// Mesajı ekranda göstermek için fonksiyon
function displayMessage(message) {
    const chatContainer = document.getElementById('chat-container');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    
    // Kullanıcı adı ve mesajı ekle
    messageElement.innerHTML = `<strong>${message.user}</strong>: ${message.text}`;
    
    // Yeni mesajı chat container'a ekle
    chatContainer.appendChild(messageElement);
    
    // Eğer fazla mesaj varsa, eski mesajları kaldır
    const maxMessages = parseInt(document.getElementById('max-messages').value) || 10;
    if (chatContainer.children.length > maxMessages) {
        chatContainer.removeChild(chatContainer.firstChild);
    }

    // Yeni mesajı ekranda göster, animasyon ekleyebilirsin
}

// Ayarları kaydetmek için fonksiyon
function saveSettings() {
    const channel = document.getElementById("channel-input").value || 'byqurn';
    const maxMessages = document.getElementById("max-messages").value;
    const messageFade = document.getElementById("message-fade").value;
    const bgOpacity = document.getElementById("bg-opacity").value;

    // Ayarları yerel depolama veya başka bir yerde saklayabilirsin
    console.log("Settings Saved:", { channel, maxMessages, messageFade, bgOpacity });
}

// Ayarları açıp kapatma fonksiyonu
function toggleSettings() {
    const settingsContent = document.getElementById("settings-content");
    settingsContent.classList.toggle("hidden");
}

// Sayfa yüklendiğinde gerekli olayları başlat
document.addEventListener("DOMContentLoaded", () => {
    // Chat bağlantısını başlat
    connectToChat();

    // Ayarları kaydetmek için buton
    const saveSettingsButton = document.getElementById('save-settings');
    saveSettingsButton.addEventListener('click', saveSettings);

    // Ayarları açıp kapatmak için buton
    const settingsToggleButton = document.getElementById('settings-toggle');
    settingsToggleButton.addEventListener('click', toggleSettings);
});
