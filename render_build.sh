#!/bin/bash

# get the flags
while getopts u: flag
do
    case "${flag}" in
        u) url=${OPTARG};
    esac
done
echo "URL: $url";

# go to the client/ folder
cd client;

# install dependencies
yarn;

# compile the frontend by passing it the API URL
export VITE_API_URL="$url/api" && yarn build;

# go back to the root folder
cd ..;

# add backend dependencies
yarn;

# compile the backend
yarn build;
