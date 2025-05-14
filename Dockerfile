FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Debug: pokaż zawartość dist i dist/client
RUN echo "== ZAWARTOŚĆ /app/dist ==" && ls -al /app/dist && \
    echo "== ZAWARTOŚĆ /app/dist/client ==" && ls -al /app/dist/client || echo "BRAK /app/dist/client"

FROM nginx:alpine

# Skopiuj zbudowaną aplikację
COPY --from=builder /app/dist/client /usr/share/nginx/html

# Debug: pokaż co jest w katalogu serwowanym przez nginx
RUN echo "== ZAWARTOŚĆ /usr/share/nginx/html ==" && ls -al /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
