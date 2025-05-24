FROM nginx:latest

# 复制本地构建好的静态文件到 nginx 的默认静态文件目录中
COPY ./dist /usr/share/nginx/html

# 复制自定义的 Nginx 配置文件到 Nginx 的配置目录
COPY ./nginx.conf /etc/nginx/nginx.conf

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx 并保持在前台运行
CMD [ "nginx", "-g", "daemon off;" ]