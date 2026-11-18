const express = require('express');
const admin = require('firebase-admin');
const app = express();
app.use(express.json());

// আপনার service-account.json ফাইলটি এখানে লোড হবে
const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.post('/send', async (req, res) => {
  const { title, body, image } = req.body;
  
  try {
    const message = {
      topic: 'allUsers', // আপনার ইউজার অ্যাপকে এই টপিকে সাবস্ক্রাইব করতে হবে
      notification: {
        title: title,
        body: body,
      },
      data: {
        image: image || '' 
      }
    };

    const response = await admin.messaging().send(message);
    res.status(200).json({ success: true, messageId: response });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});