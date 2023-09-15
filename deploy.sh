docker stop typescript-be
docker rm typescript-be
docker rmi typescript-be-server

docker build -t tlciweb-be-server .
docker run -d --restart on-failure -v $(pwd)/src/v1/storage:/app/dist/v1/storage -p 8881:8881 --name typescript-be typescript-be-server
docker image prune -f
