// Kanal verisi almak için REST API isteği
fetch('https://api.kick.com/public/v1/channels/byqurn')  // Kanal adı yerine doğru kanal adı ekle
  .then(response => response.json())
  .then(data => {
    console.log('Kanal Verisi:', data);
    // Kanal verisi alındıktan sonra WebSocket bağlantısını kuruyoruz

    const channelName = "byqurn"; // Kanal adı (değiştirilebilir)

    const ws = new WebSocket(`wss://chat.kick.com/${channelName}`);

    ws.onopen = () => {
      console.log('WebSocket bağlantısı başarıyla kuruldu!');
    };

    ws.onmessage = (event) => {
      // WebSocket üzerinden gelen mesajları işliyoruz
      console.log('Yeni mesaj:', event.data);
      const message = JSON.parse(event.data);
      if (message.type === 'message') {
        const username = message.data.sender.username;
        const content = message.data.content;
        console.log(`Mesajı gönderen: ${username}, İçerik: ${content}`);
        // UI'ye mesajları ekleyebilirsin
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket Hatası:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket bağlantısı kapandı');
    };

  })
  .catch(error => {
    console.error('Kanal verisi alınırken hata oluştu:', error);
  });
