sudo docker run -d --name=api --restart=always --log-opt max-size=1g -e BACKEND_PORT=5000 -e PGHOST=postgres://localhost:27017/api --net=host mmt/core sh -c "npm start"
sudo docker start api