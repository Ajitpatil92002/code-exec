# Use an official Ubuntu as a base image
FROM ubuntu:latest

# Install system dependencies and necessary programming languages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    openjdk-11-jdk \
    python3 \
    python3-pip \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

# Set the PATH for Bun
ENV PATH="/root/.bun/bin:${PATH}"

# Set the working directory
WORKDIR /code

# Copy your backend application code to the container
COPY . .

# Install your application's dependencies using Bun
RUN bun install

# Expose the application port (update the port number as needed)
EXPOSE 3000

# Set the command to run your application (update with your app's start command)
CMD ["bun", "run", "start"] # Make sure 'start' is defined in your package.json
