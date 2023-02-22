# Getting Started

1. Installation process
    - run 'yarn install'
    - start dev server run 'yarn start'
2. Deployment process
    - Goto full-version directory and open package.json. Update homepage URL to the production URL
    - Goto full-version directory and run 'yarn build'

# TO DOCKER COMPOSE

Build with no cache  
`docker-compose -f dev.yml build --no-cache`
Start the services  
`docker-compose -f dev.yml up`
List the services  
`docker-compose -f dev.yml ps`
List the containers  
`docker ps`
Stop services  
`docker-compose -f dev.yml stop`