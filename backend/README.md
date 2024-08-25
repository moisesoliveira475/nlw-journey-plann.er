- Configuração inicial de um projeto nodeJS
  - npm init -y
  - npm i typescript @types/node -D
  - npx tsc --init
  - https://github.com/tsconfig/bases
  - npm i tsx -D

- Execução do servidor
  - npx tsx watch src/server.ts
- Criar script de execução do projeto
 - "dev": "tsx watch src/server.ts"

- Prisma
  - npm i prisma -D
  - npx prisma init --datasource-provider SQLite
  - npx prisma migrate dev
  - npx prisma studio
- Zod 
  - npm i zod
  - npm i fastify-type-provider-zod
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
- Segurança
  - npm i @fastify/cors
  15:00 min