# Facedrive Data discrepency 
The db stores the data with mismatch values from facedrive and stripe databases.

# System Requirements:
1. NodeJs
2. Docker-Compose


# Command: 
docker-compose -f postgres-db.yml up -d



To Setup Docker-enviorment:
chmod 777 * src/.docker-config.sh
sudo ./docker-config.sh 
log-out and log-in

sudo apt install docker-compose -y 


To setup Node enviorment:
sudo curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash

nvm install node


To setup pg-native enviorment:
sudo apt-get install libpq-dev g++ make