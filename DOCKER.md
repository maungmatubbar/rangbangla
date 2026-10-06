# Docker Development Environment

This project ships a complete, self-configuring Docker stack: **Nginx**,
**PHP 8.4-FPM**, **MySQL 8**, **phpMyAdmin**, **Redis**, a **Vite** dev server
with hot reload, and **queue** + **scheduler** workers.

## Requirements

- Docker Desktop (or Docker Engine + Compose v2)
- That's it — no local PHP, Node, MySQL, or Redis needed.

## Start

```bash
make up
```

That builds the images and starts everything. On the **first** run the app
container automatically:

1. creates `.env` from `.env.example` (if missing),
2. runs `composer install` (if `vendor/` is empty),
3. generates `APP_KEY` (if unset),
4. waits for MySQL to be healthy,
5. runs database migrations,
6. links storage and clears caches,
7. fixes writable-directory permissions.

Then open:

| What        | URL                   |
| ----------- | --------------------- |
| Application | http://localhost:8000 |
| phpMyAdmin  | http://localhost:8080 |
| Vite (HMR)  | http://localhost:5173 |

## Credentials

| Service | User      | Password | Database  |
| ------- | --------- | -------- | --------- |
| MySQL   | `laravel` | `secret` | `laravel` |
| MySQL   | `root`    | `root`   | —         |

phpMyAdmin connects to the `mysql` host automatically — log in with either
account. All values live in `.env` and can be changed there.

## Common commands

```bash
make ps                              # list services
make logs                            # tail logs
make shell                           # bash into the app container
make artisan ARGS="migrate:status"   # run artisan
make composer ARGS="update"          # run composer
make npm ARGS="run build"            # run npm (in the vite container)
make test                            # run the test suite
make fresh                           # migrate:fresh --seed
make mysql                           # mysql shell
make redis                           # redis-cli
make down                            # stop (keeps data)
make destroy                         # stop + delete DB/redis volumes
make help                            # list all targets
```

## Ports

Change any of these in `.env` if they clash with something on your machine,
then `make down && make up`:

```
APP_PORT=8000            # Nginx / the app
PMA_PORT=8080            # phpMyAdmin
VITE_PORT=5173           # Vite dev server
FORWARD_DB_PORT=3308     # MySQL (host access; 3306 avoided for local MySQL)
FORWARD_REDIS_PORT=6380  # Redis (host access; 6379 avoided for local Redis)
```

## Notes

- Your source is bind-mounted, so code edits are live. Rebuild the image
  (`make build`) only when `docker/php/Dockerfile` changes.
- `node_modules` lives in a Docker volume (Linux binaries), separate from your
  host copy. After editing `package.json`, restart the vite service.
- Redis powers cache, sessions, and queues. The `queue` and `scheduler`
  containers process background work automatically.
