# Server
NODE_ENV=development
PORT=3000

# JWT
JWT_SECRET=change-me-super-secret
JWT_EXPIRES_IN=7d

# CORS (для dev, если запускаешь клиент отдельно)
# В production, когда Express раздаёт build клиента, обычно CORS не нужен.
CORS_ORIGIN=http://localhost:5173

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=300

# React build path (относительно папки server/)
# Vite: ../client/dist
# CRA:  ../client/build
CLIENT_BUILD_PATH=../client/dist

