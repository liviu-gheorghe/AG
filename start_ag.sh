sudo docker run --rm --name database -d -v ~/pgdata:/pgdata --network=ag_backend ag_database && \
#sudo docker run --rm -d -p 3400:80 -v ~/resources:/www/data  resource_server && \
sudo docker-compose up --build