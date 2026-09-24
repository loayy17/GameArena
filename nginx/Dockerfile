FROM nginx:alpine

RUN apk add --no-cache openssl

COPY ./tools /tools

RUN chmod +x /tools/generate-cert.sh

EXPOSE 80 443

ENTRYPOINT ["/tools/generate-cert.sh"]