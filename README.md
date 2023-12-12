## Description

AuctionHub is an auction platform that connects bidders and sellers.

## ATTENTION!! Installation

Pull the application from Github and Ensure you have your docker daemon running.

IMPORTANT:

## For the application to run successfully all SIX .env files need to be the associated directory:

1. ./apps/api-gateway/.env
2. ./apps/auth/.env
3. ./apps/auction-management/.env
4. ./apps/bid/.env
5. ./apps/inventory/.env
6. ./apps/payment/.env

Note: The .env files should be requested for

## Running the app: Ensure the directory for all commands is in the api-gateway directory.

```bash

$ docker-compose up --build -V

```

## Restarting the app: Run all three commands in order and Ensure the directory for all commands is in the api-gateway directory.

```bash

$ docker-compose down -v --remove-orphans

$ docker rmi $(docker images -q)

$ docker-compose up --build -V

```

## API ENDPOINT INSTRUCTIONS

Note: The application is not seeded, all necessary jsons needed are in the postman collection which is available upon request

The follwing should be done in order:

1. Register: Register Two Users preferably one as a seller and the other as a buyer
2. Login: Login with seller user
3. Create Listing: create multiple listings (your choice to create a single listing)
4. Start Auction: start auction with one of the listing item ids returned from the view listing endpoint or use listing item id = 1
5. Once the above instructions are complete all the endpoints in the postman collection should work as expected.

Note: A seller can bid for and sell items. A buyer can only bid. Some endpoints prohibit any user apart from sellers to access it.

## Building services individually

```bash
# run in api-gateway/apps/api-gateway
$ docker build -t api-gateway -f ./Dockerfile ../../

# run in auction-management
$ docker build -t auction-management -f ./Dockerfile ../../

# run in auth
$ docker build -t auth -f ./Dockerfile ../../

# run in bid
$ docker build -t bid -f ./Dockerfile ../../

# run in inventory
$ docker build -t inventory -f ./Dockerfile ../../

# run in payment
$ docker build -t payment -f ./Dockerfile ../../

```
