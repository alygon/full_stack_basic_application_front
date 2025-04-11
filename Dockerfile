# Usa a imagem oficial do Nginx
FROM nginx:alpine

# Remove arquivos default do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia o conteúdo do projeto para o Nginx
COPY . /usr/share/nginx/html/

# Expõe a porta padrão
EXPOSE 80

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]