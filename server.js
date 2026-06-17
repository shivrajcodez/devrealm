'use strict';

const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// Serve everything inside /public as static files
app.use(express.static(path.join(__dirname, 'public')));

// Fallback: any unknown route → index.html (SPA-style)
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\n  ⚔  DevRealm running at  http://localhost:${PORT}\n`);
  });
}

// Export for Vercel
module.exports = app;
