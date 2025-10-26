FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod || npm run build

FROM nginx:alpine
COPY --from=build /app/dist/veterinaria/browser /usr/share/nginx/html
# substitui a config padrão por uma sem TLS para DEV
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
