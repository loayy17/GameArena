#!/bin/sh

if [ ! -f "/certs/gamearena.crt" ] || [ ! -f "/certs/gamearena.key" ]; then
    echo "Generating self-signed certificate..."
    mkdir -p "/certs"
    openssl req -x509 \
        -nodes \
        -days 365 \
        -newkey rsa:2048 \
        -subj "/CN=localhost" \
        -addext "subjectAltName=DNS:localhost,IP:127.0.0.1" \
        -keyout "/certs/gamearena.key" \
        -out "/certs/gamearena.crt"
    echo "Certificate generated successfully."
else
    echo "Certificate already exists."
fi
mkdir -p /etc/nginx/snippets
cp "/tools/nginx.conf" /etc/nginx/conf.d/default.conf

# Start Nginx in the foreground
exec nginx -g "daemon off;"