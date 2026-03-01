# hortusfox-scripts

A custom sidecar container to add enhanced features to [HortusFox](https://github.com/hortusfox/hortusfox) using JavaScript.

## Features

- **Auto-Logging:** Automatically creates a log entry when you modify custom attributes or use bulk actions.
- **Sidecar Setup:** Serves scripts via a lightweight Nginx container to avoid modifying the core HortusFox codebase.

## Quick Start

### 1. Add to Docker Compose

Update your HortusFox `docker-compose.yml` stack to use the new custom core image, and add the sidecar service:

```yaml
services:
  app:
    # Use the custom rebuilt core image to inherit CORS patches
    image: ghcr.io/YOUR_USERNAME/hortusfox-core:latest
    container_name: hortusfox
    restart: unless-stopped
    depends_on:
      - db
    environment:
      APP_ADMIN_EMAIL: ${APP_ADMIN_EMAIL}
      APP_ADMIN_PASSWORD: ${APP_ADMIN_PASSWORD}
      APP_TIMEZONE: "America/Los_Angeles"
      DB_HOST: db
      DB_PORT: 3306
      DB_DATABASE: hortusfox
      DB_USERNAME: hortusfox
      DB_PASSWORD: ${MYSQL_PASSWORD}
      DB_CHARSET: "utf8mb4"
    volumes:
      - app_images:/var/www/html/public/img
      - app_logs:/var/www/html/app/logs
      - app_backup:/var/www/html/public/backup
      - app_themes:/var/www/html/public/themes
      - app_migrate:/var/www/html/app/migrations
    networks:
      - default
      - proxy

  db:
    image: mariadb:latest
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: hortusfox
      MYSQL_USER: hortusfox
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - default

  scripts:
    # Use the sidecar scripts container
    image: ghcr.io/YOUR_USERNAME/hortusfox-scripts:main
    container_name: hortusfox-scripts
    restart: unless-stopped
    ports:
      - "8081:80"
    networks:
      - default
```

### 2. Configure HortusFox

Go to Settings > Custom code for head section in the HortusFox UI.

Add the script reference using your server's IP and the mapped port:

```html
<script src="http://YOUR_SERVER_IP:8081/hortusfox-logger.js"></script>
```
*(Ensure you map ports on the `scripts` container or proxy it to an accessible URL if loading via browser).*

---

> **Note:** This project was originally "vibe coded" using Google's Gemini Pro model via Antigravity/LLM. The AI was directed to heavily automate the generation of setup and logic for integrating this sidecar feature with HortusFox.
