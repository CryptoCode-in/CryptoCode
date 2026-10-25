# Multi-compiler execution environment for CryptoCode
FROM node:22-bookworm-slim

# Set environment variables
ENV NODE_ENV=production \
    PORT=5000 \
    JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 \
    PATH="/usr/lib/jvm/java-17-openjdk-amd64/bin:${PATH}"

# Install compilers and runtimes:
# - GCC: C compiler
# - G++: C++ compiler
# - default-jdk-headless: Java 17 JDK (providing javac and java)
# - python3: Python 3 interpreter
# - python-is-python3: Creates symlink /usr/bin/python -> /usr/bin/python3
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    default-jdk-headless \
    python3 \
    python-is-python3 \
 && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy application source code
COPY . .

# Create data directory and temporary execution directory with proper ownership
RUN mkdir -p /app/data /tmp/cryptocode \
 && chown -R node:node /app /tmp/cryptocode

# Switch to non-privileged user for security
USER node

# Expose backend port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
