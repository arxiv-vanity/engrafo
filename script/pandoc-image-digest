#!/bin/bash

set -eu

IMAGE=andreasjansson/engrafo-pandoc

curl -I -s -D - -H "Authorization: Bearer $(curl -s "https://auth.docker.io/token?service=registry.docker.io&scope=repository:$IMAGE:pull" | jq -r .token)" -H "Accept: application/vnd.docker.distribution.manifest.v2+json" https://index.docker.io/v2/$IMAGE/manifests/latest | grep Docker-Content-Digest
