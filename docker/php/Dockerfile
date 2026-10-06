# syntax=docker/dockerfile:1
FROM php:8.4-fpm-bookworm

# ---------------------------------------------------------------------------
# PHP extensions (installed via the well-maintained extension installer).
# ---------------------------------------------------------------------------
COPY --from=mlocati/php-extension-installer:latest /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions \
        pdo_mysql \
        redis \
        bcmath \
        gd \
        zip \
        intl \
        pcntl \
        opcache \
        exif

# ---------------------------------------------------------------------------
# System packages needed at runtime (git/unzip for composer, mysql client for
# the wait-for-db check).
# ---------------------------------------------------------------------------
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        git \
        unzip \
        default-mysql-client \
    && rm -rf /var/lib/apt/lists/*

# ---------------------------------------------------------------------------
# Composer.
# ---------------------------------------------------------------------------
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=1

# ---------------------------------------------------------------------------
# Node.js + npm (needed by the Vite dev server, which also shells out to
# `php artisan` for Wayfinder/Inertia codegen — so PHP and Node must coexist).
# Copied from the matching bookworm Node image for glibc compatibility.
# ---------------------------------------------------------------------------
COPY --from=node:22-bookworm-slim /usr/local/bin/node /usr/local/bin/node
COPY --from=node:22-bookworm-slim /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -sf /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -sf /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx

# ---------------------------------------------------------------------------
# Entrypoint that performs the automatic first-boot setup.
# ---------------------------------------------------------------------------
COPY docker/php/entrypoint.sh /usr/local/bin/app-entrypoint
RUN chmod +x /usr/local/bin/app-entrypoint

WORKDIR /var/www/html

ENTRYPOINT ["app-entrypoint"]
CMD ["php-fpm"]
