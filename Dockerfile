# Use node as the base image
FROM node:20.11.0-alpine3.18

# This database is purely for the build process (as to not expose non-existent data)
# and should point to a clean database, or a schema that is not in use by anything
ENV DATABASE_URL ${DATABASE_URL_BUILD}

ENV NEXTAUTH_URL ${NEXTAUTH_URL}
ENV NEXTAUTH_SECRET ${NEXTAUTH_SECRET}
ENV SENDGRID_API_KEY ${SENDGRID_API_KEY}
ENV EMAIL_FROM="Assessment Tracker <trackerassessment@gmail.com>"

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files to the container
COPY package*.json ./

# Easy workaround to prevent cypress proxy error... Remove it :D
RUN sed -i '/cypress/d' package.json
# Cypress needed for npm install... let's see if it works

# Install project dependencies
RUN npm ci

# Copy the rest of the application code to the container
COPY . .

# Include fix from this issue:
# https://github.com/keonik/prisma-erd-generator/issues/145
ENV DISABLE_ERD true
# Generate the prisma client with the prisma schema (to allow imports to succeed)
RUN npx prisma generate
RUN npx prisma db push

# Build the Next.js application
RUN npm run build

# From error logs in:
# https://console.openshift.cs.cf.ac.uk/k8s/ns/assessment-tracker/pods/assessmenttracking-5d4746bfcc-99q6z/logs
RUN mkdir /.npm && chown -R 1002790000 /.npm

# Attempt fix for:
# https://git.cardiff.ac.uk/c21063494/assessmenttracking/-/issues/42
RUN mkdir -p .next/cache/images && chown -R 1002790000 .next/cache/images

EXPOSE 3000

RUN chmod +x entrypoint.sh

# This should be the database which is keeping track of the prisma "migrations" table;
# also should be the live database
ENV DATABASE_URL ${DATABASE_URL_LIVE}

# Need to deploy DB migrations before starting the server
CMD ["./entrypoint.sh"]
