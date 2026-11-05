import os

server_path = os.path.join('backend', 'server.js')
with open(server_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.startswith('const PORT = process.env.PORT'):
        break
    new_lines.append(line)

new_listen_code = """const http = require('http');
const PORT = parseInt(process.env.PORT, 10) || 5000;

function startServer(port) {
  const server = http.createServer(app);
  server.on('error', (err) => {
    if ((err.code === 'EADDRINUSE' || err.code === 'EACCES') && port < 5010) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is unavailable (${err.code}). Retrying on port ${nextPort}...`);
      startServer(nextPort);
    } else {
      console.error(`Failed to start server on port ${port}:`, err);
    }
  });
  server.listen(port, () => {
    console.log(`TrustLens server running on port ${port}`);
  });
}

startServer(PORT);
"""

new_lines.append(new_listen_code)

with open(server_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Updated server.js successfully!")

