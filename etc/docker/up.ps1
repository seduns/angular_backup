docker network create mymicroservice_7 --label=mymicroservice_7
docker-compose -f docker-compose.infrastructure.yml up -d
exit $LASTEXITCODE