set -e

sudo docker run -d --privileged --name pgdata -v /data/db tianon/true
sudo docker run -d --privileged --name postgres --volumes-from pgdata --net=host postgres:3
sudo docker build -t "mmt/core" . && sudo docker run --net=host -i mmt/core sh -c 'npm run lintnofix'