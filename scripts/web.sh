sudo docker run -d --name=web --restart=always --net=host --log-opt max-size=1g -p 80:80 mmt/ui
sudo docker start web