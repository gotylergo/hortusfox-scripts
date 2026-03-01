FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the script to the public directory
COPY public/ /usr/share/nginx/html/

# Copy the dynamic loader generation script into the entrypoint directory
COPY generate-loader.sh /docker-entrypoint.d/99-generate-loader.sh
RUN chmod +x /docker-entrypoint.d/99-generate-loader.sh

# Expose port 80
EXPOSE 80
