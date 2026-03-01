# hortusfox-scripts

A custom sidecar container to add enhanced features to [HortusFox](https://github.com/hortusfox/hortusfox) using JavaScript.

## Features

- **Auto-Logging:** Automatically creates a log entry when you modify custom attributes or use bulk actions.
- **Sidecar Setup:** Serves scripts via a lightweight Nginx container to avoid modifying the core HortusFox codebase.

## Quick Start

### 1. Add to Docker Compose

Update your HortusFox `docker-compose.yml` stack to add the sidecar service:

```yaml
services:
  app:
    image: ghcr.io/danielbrendel/hortusfox-web:latest
    container_name: hortusfox
    restart: unless-stopped
    depends_on:
      - db
    # ... your standard HortusFox environment variables & volumes

  scripts:
    # Use the sidecar scripts container
    image: ghcr.io/YOUR_USERNAME/hortusfox-scripts:main
    container_name: hortusfox-scripts
    restart: unless-stopped
    networks:
      - default # Ensure it shares the same network as 'app'
```

### 2. Configure Your Reverse Proxy (Recommended for CORS)

Loading the script via a different URL (like an IP address or `http://...:8081/`) may trigger your browser's CORS (Cross-Origin Resource Sharing) protections, preventing the scripts from loading securely.

The **best practice** is to place a Reverse Proxy (such as Nginx Proxy Manager, Caddy, or Traefik) in front of your stack to serve both containers from the **same domain**.

1. Route your main domain (`https://plants.example.com/`) to the HortusFox `app` container.
2. Create a custom location/path route (`https://plants.example.com/scripts/`) that points to port `80` on the `scripts` container.

Because the browser loads everything from the exact same domain, the Javascript is considered **Same-Origin** and executes flawlessly. 

### 3. Configure HortusFox

Go to Settings > Custom code for head section in the HortusFox UI.

If you used the Reverse Proxy method above, simply provide the path you routed:

```html
<script src="/scripts/"></script>
```

Otherwise, if you exposed port `8081` directly instead of a proxy, link your server's mapped IP:

```html
<script src="http://YOUR_SERVER_IP:8081/"></script>
```

---

> **Note:** This project was originally "vibe coded" using Google's Gemini Pro model via Antigravity/LLM. The AI was directed to heavily automate the generation of setup and logic for integrating this sidecar feature with HortusFox.
