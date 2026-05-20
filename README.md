# Serverless Task Manager

## DynamoDB Local

Project dung DynamoDB Local de phat trien backend CRUD truoc khi deploy len AWS.

### Chay database

```sh
docker compose up -d
```

DynamoDB Local se chay tai:

```text
http://localhost:8000
```

Bang local duoc tao tu dong:

- Table: `TasksTable`
- Partition key: `taskId` (`String`)
- GSI: `userId-index`
- GSI partition key: `userId` (`String`)
- Projection: `ALL`

Script init cung seed san data demo cho `user-1` va `user-2`.

### Bien moi truong backend local

```sh
DYNAMODB_ENDPOINT=http://localhost:8000
DYNAMODB_TABLE=TasksTable
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=local
AWS_SECRET_ACCESS_KEY=local
```

### Kiem tra bang bang AWS CLI container

Neu may host chua cai AWS CLI, co the dung container:

```sh
docker compose run --rm --entrypoint aws dynamodb-init dynamodb list-tables \
  --endpoint-url http://dynamodb-local:8000 \
  --region ap-southeast-1
```

Query task theo user:

```sh
docker compose run --rm --entrypoint aws dynamodb-init dynamodb query \
  --table-name TasksTable \
  --index-name userId-index \
  --key-condition-expression "userId = :uid" \
  --expression-attribute-values '{":uid":{"S":"user-1"}}' \
  --endpoint-url http://dynamodb-local:8000 \
  --region ap-southeast-1
```

## Backend Node.js Local

Backend dung Node.js 20 voi 4 Lambda-style handlers rieng va Express adapter de chay local.

### Cai dependencies

```sh
cd backend
npm install
```

Neu can, tao file `.env` tu mau:

```sh
cp .env.example .env
```

Gia tri mac dinh cho local:

```sh
PORT=3000
DYNAMODB_ENDPOINT=http://localhost:8000
DYNAMODB_TABLE=TasksTable
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=local
AWS_SECRET_ACCESS_KEY=local
LOCAL_USER_ID=user-1
```

### Chay API local

Mo terminal 1:

```sh
docker compose up -d
```

Mo terminal 2:

```sh
cd backend
npm run dev
```

API se chay tai:

```text
http://localhost:3000
```

### Test CRUD bang curl

Lay danh sach task:

```sh
curl "http://localhost:3000/tasks?userId=user-1"
```

Tao task:

```sh
curl -X POST "http://localhost:3000/tasks?userId=user-1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer local-token" \
  -d '{"title":"Viet API local","description":"CRUD voi DynamoDB Local","priority":"high","status":"pending","dueDate":"2026-06-01"}'
```

Cap nhat task:

```sh
curl -X PUT "http://localhost:3000/tasks/<taskId>?userId=user-1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer local-token" \
  -d '{"title":"Viet API local xong","description":"Da cap nhat","priority":"medium","status":"done","dueDate":"2026-06-02"}'
```

Xoa task:

```sh
curl -X DELETE "http://localhost:3000/tasks/<taskId>?userId=user-1" \
  -H "Authorization: Bearer local-token"
```

### Chay test backend

Dam bao DynamoDB Local dang chay, sau do:

```sh
cd backend
npm test
```
