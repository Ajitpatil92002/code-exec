# Dockerfile
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
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /code

# Set default command
CMD ["/bin/bash"]
