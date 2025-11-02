FROM node:alpine AS build

WORKDIR /app
COPY package*.json /app
RUN npm ci
COPY . /app
ENV VITE_SESSION_WEBSOCKET_URL=/ws
ENV VITE_SESSION_API_URL=/api/collaborative
ENV VITE_COLLECT_BASE_URL=/api/felles

RUN npm run build 

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/web.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]
