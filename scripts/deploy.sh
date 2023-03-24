aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 359576025491.dkr.ecr.ap-southeast-1.amazonaws.com
docker compose -f ../docker-compose.production.yml build
docker tag server-gear-backend:latest 359576025491.dkr.ecr.ap-southeast-1.amazonaws.com/gear-backend:latest
docker push 359576025491.dkr.ecr.ap-southeast-1.amazonaws.com/gear-backend:latest