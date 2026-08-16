FROM nginx:1.27-alpine

RUN apk add --no-cache openssl \
    && mkdir -p /etc/nginx/certs \
    && openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/nginx/certs/localhost.key \
        -out /etc/nginx/certs/localhost.crt \
        -subj "/C=JO/ST=Amman/L=Amman/O=Arena404/OU=ft_transcendence/CN=localhost"

COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443
