const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static(__dirname));
app.use(bodyParser.json());

// Route to handle contact form submission
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    const newMessage = { name, email, message, date: new Date() };
    const filePath = path.join(__dirname, 'messages.json');

    // Save message to messages.json
    fs.readFile(filePath, (err, data) => {
        let messages = [];
        if (!err && data.length > 0) {
            messages = JSON.parse(data);
        }

        messages.push(newMessage);

        fs.writeFile(filePath, JSON.stringify(messages, null, 2), err => {
            if (err) {
                return res.status(500).json({ success: false, error: 'Failed to save message.' });
            }
            res.json({ success: true, message: 'Message saved successfully.' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
