# Stage 1: Build the application
FROM node:20-alpine as builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy the rest of your application code
COPY . .

# Build the Vite project for production
RUN pnpm run build

# Stage 2: Serve the static files with Nginx
FROM nginx:stable-alpine

# Copy the build output from the builder stage to Nginx's html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom Nginx configuration (we'll create this next)
COPY nginx.conf /etc/nginx/conf.d/moodflix.conf 

# Expose port 80 (default HTTP port)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]