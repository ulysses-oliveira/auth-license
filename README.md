## Comando para acessar o banco de dados no docker
docker exec -it pg_container psql -U postgres -d authdatabase

## Faz migrações e apaga todos os dados
npx prisma migrate reset
