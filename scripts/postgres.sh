sudo docker run -d --name postgres --restart=always --volumes-from pgdata --net=host postgres:3
sudo docker start postgres