FROM nginx:1.13

RUN rm /etc/nginx/conf.d/default.conf
#//删除nginx 默认配置

ADD default.conf /tmp/template.conf
#//添加我们自己的配置 default.conf 在下面
ADD dist /usr/share/nginx/html/  
#//把刚才生成dist文件夹下的文件copy到nginx下面去

EXPOSE 8080
