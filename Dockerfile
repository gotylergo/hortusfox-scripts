FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the script to the public directory
COPY public/ /usr/share/nginx/html/

# Expose port 80
EXPOSE 80
