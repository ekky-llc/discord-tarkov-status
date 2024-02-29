#!/bin/bash

user=blackdog
host=192.168.40.254

# Compress Folder Contents (uses .gitignore values)
git archive -o app.tar.gz main

# Transfer Files to said folder '~/auto-deploy'
scp app.tar.gz .env $user@$host:~/auto-deploy

ssh $user@$host << EOF
  cd ~/auto-deploy
  tar xvzf app.tar.gz

  # Cleanup if exists
  docker container rm -f tarkovstats
  docker image rm -f ytb/tarkovstats:latest

  # Build, Remove and Deploy Container
  docker build --no-cache -t ytb/tarkovstats:latest .
    
  docker run \
    --name tarkovstats \
    -dit \
    --restart=unless-stopped \
    ytb/tarkovstats:latest

  # Cleanup Files
  ls -l
  rm -rf ~/auto-deploy/*

  # Check Docker
  docker ps | grep tarkovstats

  # Disconnect
  exit
EOF

rm -f app.tar.gz