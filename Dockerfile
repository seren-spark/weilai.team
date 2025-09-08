FROM nginx:latest

# 复制本地构建好的静态文件到 nginx 的默认静态文件目录中
COPY ./dist /usr/share/nginx/html

# 创建存放SSL证书的目录
RUN mkdir -p /etc/nginx/ssl

# 复制两个域名的SSL证书和私钥（替换为你的实际文件名）
COPY ./ssl/weilai_team/weilai.team.key /etc/nginx/ssl/weilai_team/
COPY ./ssl/weilai_team/weilai.team.pem /etc/nginx/ssl/weilai_team/
COPY ./ssl/www_weilai_team/www.weilai.team.key /etc/nginx/ssl/www_weilai_team/
COPY ./ssl/www_weilai_team/www.weilai.team.pem /etc/nginx/ssl/www_weilai_team/

# 复制自定义的 Nginx 配置文件到 Nginx 的配置目录
COPY ./nginx.conf /etc/nginx/nginx.conf

# 暴露 80 端口
EXPOSE 80 443

# 启动 Nginx 并保持在前台运行
CMD [ "nginx", "-g", "daemon off;" ]