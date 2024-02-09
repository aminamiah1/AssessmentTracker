# Use the official Node.js image as the base image
FROM node:18.18.2-alpine3.18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the Next.js application
RUN npm run build

# From error logs in:
# https://console.openshift.cs.cf.ac.uk/k8s/ns/assessment-tracker/pods/assessmenttracking-5d4746bfcc-99q6z/logs
USER root
RUN chown -R 1001:0 /.npm /app

USER 1001

EXPOSE 3000

# Specify the command to start the Next.js app
CMD ["npm", "start"]