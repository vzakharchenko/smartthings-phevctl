docker stop smartthings-phevctl
docker rm smartthings-phevctl
#docker image prune -a -f

docker build -t smartthings-phevctl .
docker run --name=smartthings-phevctl  -p 8080:8080 -p 8099:8099 smartthings-phevctl
