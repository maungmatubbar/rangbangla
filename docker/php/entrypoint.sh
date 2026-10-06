#!/bin/sh
set -e

cd /var/www/html

ROLE="${CONTAINER_ROLE:-app}"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
wait_for_mysql() {
    host="${DB_HOST:-mysql}"
    port="${DB_PORT:-3306}"
    echo "==> Waiting for MySQL at ${host}:${port}..."
    until php -r "exit(@fsockopen(getenv('DB_HOST') ?: 'mysql', (int)(getenv('DB_PORT') ?: 3306)) ? 0 : 1);" 2>/dev/null; do
        sleep 2
    done
    echo "==> MySQL is reachable."
}

ensure_env() {
    if [ ! -f .env ]; then
        echo "==> .env not found, creating from .env.example"
        cp .env.example .env
    fi
}

# ---------------------------------------------------------------------------
# Worker containers (queue / scheduler) only need a ready app + database.
# The primary "app" container owns install/keygen/migrate so they never race.
# ---------------------------------------------------------------------------
if [ "$ROLE" != "app" ]; then
    ensure_env
    wait_for_mysql
    echo "==> Starting $ROLE process: $*"
    exec "$@"
fi

echo "==> Preparing Laravel application (role: app)..."

ensure_env

# Install composer dependencies if they are missing.
if [ ! -f vendor/autoload.php ]; then
    echo "==> Installing composer dependencies..."
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

# Generate an application key if one is not set.
if ! grep -q "^APP_KEY=base64:" .env; then
    echo "==> Generating application key..."
    php artisan key:generate --force
fi

wait_for_mysql

echo "==> Running database migrations..."
php artisan migrate --force

# Public storage symlink (ignore if it already exists).
php artisan storage:link 2>/dev/null || true

# Start clean in development.
php artisan optimize:clear || true

# Make sure the writable directories are writable by php-fpm (www-data).
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true
chmod -R ug+rwX storage bootstrap/cache 2>/dev/null || true

echo "==> Setup complete. Starting: $*"
exec "$@"
