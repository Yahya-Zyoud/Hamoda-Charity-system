const express = require('express');
const app = express();
const PORT = 5000;

app.get('/api', (req, res) => {
  res.json({ message: "Hello from backend of hamoda-charity-system!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});