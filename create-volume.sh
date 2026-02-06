#!/usr/bin/env bash

# CONFIG
VOLUME_NAME=ONLINE_ENTERPRISE_PERN
LOCAL_PROJECT_PATH="/mnt/c/capstone/DevSim-Sample-Projects/devsim-sample-projects/projects/tech-stacks/PERN/ONLINE_ENTERPRISE" 
CONTAINER_MOUNT_PATH=/data

# Directories / files to exclude
EXCLUDES=(
  node_modules
  .next
  .git
  .turbo
  dist
  build
  coverage
  .DS_Store
  npm-debug.log
  yarn-error.log
  .env
)

# Create the volume if it doesn't exist
docker volume inspect "$VOLUME_NAME" >/dev/null 2>&1 || \
  docker volume create "$VOLUME_NAME"

# Build rsync exclude arguments
RSYNC_EXCLUDES=""
for item in "${EXCLUDES[@]}"; do
  RSYNC_EXCLUDES="$RSYNC_EXCLUDES --exclude=$item"
done

# Copy files into the volume
docker run --rm \
  -v "$VOLUME_NAME":"$CONTAINER_MOUNT_PATH" \
  -v "$LOCAL_PROJECT_PATH":/source:ro \
  alpine \
  sh -c "
    apk add --no-cache rsync >/dev/null &&
    rsync -a $RSYNC_EXCLUDES /source/ $CONTAINER_MOUNT_PATH/
  "

echo "Project copied to Docker volume: $VOLUME_NAME"
