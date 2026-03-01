# hortusfox-scripts

A custom sidecar container to add enhanced features to [HortusFox](https://github.com/hortusfox/hortusfox) using JavaScript.

## Features

- **Auto-Logging:** Automatically creates a log entry when you modify custom attributes or use bulk actions.
- **Sidecar Setup:** Serves scripts via a lightweight Nginx container to avoid modifying the core HortusFox codebase.

## Quick Start

### 1. Add to Docker Compose

Add the following service to your HortusFox `docker-compose.yml`:

```yaml
services:
  scripts:
    image: ghcr.io/YOUR_USERNAME/hortusfox-scripts:latest
    container_name: hortusfox-scripts
    restart: unless-stopped
    ports:
      - "8081:80"
    networks:
      - hortusfox_network
```

### 2. Configure HortusFox

Go to Settings > Custom code for head section.

Add the script reference:

```html
<script src="http://YOUR_SERVER_IP:8081/hortusfox-logger.js"></script>
```

---

> **Note:** This project was originally "vibe coded" using Google's Gemini Pro model via Antigravity/LLM. The AI was directed to heavily automate the generation of setup and logic for integrating this sidecar feature with HortusFox.
