### Facedrive Data discrepency 
The db stores the data with mismatch values from facedrive and stripe databases. The app has two components.
1. Backend App: Which communicates with the database and retrieve data. 
It accepts GET and POST requests and sends the data.
2. Frontend App: It fetches the data from backends app and interacts with the user.


### System Requirements:
1. NodeJs
2. Docker-Compose


### Command: 
docker-compose -f postgres-db.yml up -d

### To Setup Docker-enviorment:
1. chmod 777 * src/.docker-config.sh
2. sudo ./docker-config.sh 
3. log-out and log-in
4. sudo apt install docker-compose -y 


### To setup Node enviorment on Ubuntu:
1. sudo curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
2. nvm install node


### Sample API call from browser 

### http://localhost:8080/dt1?action=post&startDate=2020-02-12T05:00:00.000Z&endDate=2020-02-13T05:00:00.000Z