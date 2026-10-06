# Rangbangla — Docker helper commands.
# Usage: `make <target>`. Pass extra args with ARGS="...".
#
#   make up                          Build (if needed) and start the whole stack
#   make artisan ARGS="migrate:fresh --seed"
#   make composer ARGS="require foo/bar"
#   make npm ARGS="run build"

ARGS ?=

.DEFAULT_GOAL := help

.PHONY: help
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

.PHONY: up
up: ## Start all services (auto-setup runs on first boot)
	docker compose up -d --build

.PHONY: down
down: ## Stop and remove containers (keeps data)
	docker compose down

.PHONY: restart
restart: ## Restart all services
	docker compose restart

.PHONY: build
build: ## Rebuild the app image
	docker compose build

.PHONY: ps
ps: ## Show running services
	docker compose ps

.PHONY: logs
logs: ## Tail logs from all services
	docker compose logs -f

.PHONY: shell
shell: ## Open a bash shell in the app container
	docker compose exec app bash

.PHONY: artisan
artisan: ## Run artisan, e.g. make artisan ARGS="migrate:status"
	docker compose exec app php artisan $(ARGS)

.PHONY: composer
composer: ## Run composer, e.g. make composer ARGS="install"
	docker compose exec app composer $(ARGS)

.PHONY: npm
npm: ## Run npm in the vite container, e.g. make npm ARGS="run build"
	docker compose exec vite npm $(ARGS)

.PHONY: test
test: ## Run the test suite
	docker compose exec app php artisan test

.PHONY: fresh
fresh: ## Drop everything and re-migrate (+seed)
	docker compose exec app php artisan migrate:fresh --seed

.PHONY: mysql
mysql: ## Open a MySQL shell
	docker compose exec mysql sh -c 'mysql -u"$$MYSQL_USER" -p"$$MYSQL_PASSWORD" "$$MYSQL_DATABASE"'

.PHONY: redis
redis: ## Open a redis-cli shell
	docker compose exec redis redis-cli

.PHONY: destroy
destroy: ## Stop and DELETE all data volumes (DB, redis) — irreversible
	docker compose down -v
