FROM            node:22-alpine AS build
WORKDIR         /app
COPY            package.json package-lock.json ./
RUN             npm install --legacy-peer-deps
COPY            . .
RUN             npm run build

FROM            nginx:alpine AS web
COPY            <<'_' /etc/nginx/conf.d/default.conf
server {
    listen 80;
    root /var/www/html;

    index index.html;
    autoindex off;
    charset UTF-8;

    location / {
      try_files $uri $uri/ /index.html?$query_string;
    }
}
_
COPY            --from=build /app/dist /var/www/html
RUN             find /var/www/html