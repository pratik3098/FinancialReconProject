### Facedrive Data discrepency 
The db stores the data with mismatch values from facedrive and stripe databases. The app has two components.
1. Backend App: Which communicates with the database and retrieve data. 
It accepts GET and POST requests and sends the data.
2. Frontend App: It fetches the data from backends app and interacts with the user.


### System Requirements:
1. NodeJs
2. Docker-Compose


### Commands to start  the app: 
1. docker-compose -f ./app/src/postgres-db.yml up -d
2. cd app 
3. npm start
4. cd ../facedrive-app
5. npm start


### Note: If starting project for first time:
1. cd facedrive-app
2. npm install



### To Setup Docker-enviorment:
1. chmod 777  src/.docker-config.sh
2. sudo ./docker-config.sh 
3. log-out and log-in
4. sudo apt install docker-compose -y 
#### Note:  For Windows, use Docker-Toolkit.
#### If you use it, Change the localhost address in ./app/src/configData.js to docker-machine ip address.
#### docker machine address command: docker-machine ip
#### Make sure to apply proper permissions to "./uploads" directory


### To setup Node enviorment on Ubuntu:
1. sudo curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
2. log-out and log-in
3. nvm install node

