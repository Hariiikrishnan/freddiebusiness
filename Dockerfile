FROM nginx:alpine

# Copy custom Nginx configuration to handle React SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static HTML and assets
COPY index.html /usr/share/nginx/html/
COPY local_assets/ /usr/share/nginx/html/local_assets/
