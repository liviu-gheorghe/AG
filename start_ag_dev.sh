#starting database
sudo docker run --rm --name database -d -v ~/pgdata:/pgdata --network=ag_backend ag_database
sudo docker-compose -f docker-compose-dev.yaml up #--build

#starting database container
#sudo docker run --rm --name database -d -v ~/pgdata:/pgdata --network=ag_backend ag_database
#sudo docker run --rm --name api-dev -d -v /home/liviu/Desktop/GIT/AG/backend/API:/opt --network ag_backend 