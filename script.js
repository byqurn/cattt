// Yayıncı adı
const name = 'byqurn'; // Burada byqurn sabit olarak kullanılıyor

// Chatroom ID ve Channel ID almak için API'den veri çekme
fetch(`https://kick.com/api/v2/channels/${name}`)
  .then(response => response.json())
  .then(data => {
    const chatroom_id = data.chatroom.id; // Chatroom ID
    const channel_id = data.chatroom.channel_id; // Channel ID
    console.log(`chatroom_id: ${chatroom_id}, channel_id: ${channel_id}`);

    // WebSocket bağlantısını kurma
    const socket = new WebSocket(`wss://chat.kick.com/chatroom/${name}/${chatroom_id}/${channel_id}`);

    // WebSocket açık olduğunda yapılacak işlemler
    socket.onopen = () => {
      console.log('WebSocket bağlantısı kuruldu');
    };

    // WebSocket üzerinden mesaj alındığında yapılacak işlemler
    socket.onmessage = (event) => {
      console.log('Mesaj alındı:', event.data);
    };

    // WebSocket hatası olduğunda yapılacak işlemler
    socket.onerror = (error) => {
      console.error('WebSocket hatası:', error);
    };

    // WebSocket bağlantısı kapandığında yapılacak işlemler
    socket.onclose = (event) => {
      console.log('WebSocket bağlantısı kapandı', event);
    };
  })
  .catch(error => {
    console.error('API hatası:', error);
  });
