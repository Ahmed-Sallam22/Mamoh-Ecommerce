# Use an official Node runtime as a parent image
FROM node:alpine

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Copy .env.example to .env
RUN cp .env.example .env

# Install any needed packages specified in package.json
RUN npm install --force

# Build the application for production
RUN npm run build 

# Use nginx alpine for serving the static files
FROM nginx:alpine

# Copy static assets from builder stage
COPY --from=0 /app/build /usr/share/nginx/html

# Copy the Nginx configuration file
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside
EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]