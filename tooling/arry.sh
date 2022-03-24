#!/bin/bash

#git ls-remote -t --refs https://github.com/ethereum/solidity | sed -E 's/^[[:xdigit:]]+[[:space:]]+refs\/tags\/(.+)/\1/g'

arrVar=("v0.5.0"
"v0.5.1"
"v0.5.10"
"v0.5.11"
"v0.5.12"
"v0.5.13"
"v0.5.14"
"v0.5.15"
"v0.5.16"
"v0.5.17"
"v0.5.2"
"v0.5.3"
"v0.5.4"
"v0.5.5"
"v0.5.6"
"v0.5.7"
"v0.5.8"
"v0.5.9"
"v0.6.0"
"v0.6.1"
"v0.6.10"
"v0.6.11"
"v0.6.12"
"v0.6.2"
"v0.6.3"
"v0.6.4"
"v0.6.5"
"v0.6.6"
"v0.6.7"
"v0.6.8"
"v0.6.9"
"v0.7.0"
"v0.7.1"
"v0.7.2"
"v0.7.3"
"v0.7.4"
"v0.7.5"
"v0.7.6"
"v0.8.0"
"v0.8.1"
"v0.8.2"
"v0.8.3"
"v0.8.4"
"v0.8.5"
"v0.8.6"
"v0.8.7"
"v0.8.8"
"v0.8.9"
"v0.8.10"
"v0.8.11"
"v0.8.12"
"v0.8.13")


# Add new element at the end of the array
arrVar+=(".tar.gzr")

# Iterate the loop to read and print each array element
for value in "${arrVar[@]}"
do
     echo "https://github.com/ethereum/solidity/releases/download/solidity$value
done