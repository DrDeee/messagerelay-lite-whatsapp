## run in Docker

1. Create a new folder and open it.
2. Clone the repository with `git clone`.
3. Create a file named `database.json` that contains `{"msgs":{},"mirror":{}}`.
4. Copy example.env from the cloned folder and paste your API authentication. Rename the file to `process.env`.

Create a docker-compose.yml with the following content and start the container with `docker-compose up`

```docker
version: '3.3'

services:
  bot:
    build: ./messagerelay-lite-whatsapp
    container_name: message-relay_whatsapp
    volumes:
      - ./process.env:/app/process.env
      - ./database.json:/app/database.json
    network_mode: "bridge"
```
