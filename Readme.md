To start project install dependencies `npm i` and run `make up` in the terminal. A running Docker is required. By default server is running on http://localhost:3000/
Alternatively if make is not installed run `docker-compose -f ./docker-compose.yml up -d --build --force-recreate`
Please use node version at least 22
 
To populate database with some products use `npm run seed`
