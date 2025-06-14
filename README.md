## Comando para acessar o banco de dados no docker
docker exec -it pg_container psql -U postgres -d authdatabase

## Apaga todas as tabelas
docker exec -i pg_container psql -U postgres -d authdatabase < drop_tables.sql

## Cria todas as tabelas
docker exec -i pg_container psql -U postgres -d authdatabase < create_tables.sql

## Faz migrações e apaga todos os dados
npx prisma migrate reset (não funciona)

## Aplica as migrações
npx prisma migrate dev --name init
