# Version from https://hub.docker.com/_/debian/
FROM debian:buster-20211115

# LaTeX stuff first, because it's enormous and doesn't change much
# Change logs here: https://packages.debian.org/buster/texlive-full
RUN apt-get update -qq && apt-get install -qy texlive-full

RUN set -ex \
    && apt-get update -qq \
    && apt-get install -qy \
    # apt-key dependencies
    curl \
    gnupg2 \
    # Node.js dependencies \
    ca-certificates \
    git-core \
    python3-minimal \
    # latexml dependencies \
    libarchive-zip-perl libfile-which-perl libimage-size-perl  \
    libio-string-perl libjson-xs-perl libtext-unidecode-perl \
    libparse-recdescent-perl liburi-perl libuuid-tiny-perl libwww-perl \
    libxml2 libxml-libxml-perl libxslt1.1 libxml-libxslt-perl  \
    imagemagick libimage-magick-perl perl-doc build-essential \
    # This is so we can pin to Node versions https://github.com/nodesource/distributions/issues/33 
    # See https://deb.nodesource.com/node_12.x/pool/main/n/nodejs/ for list of packages
    && curl -o nodejs.deb https://deb.nodesource.com/node_12.x/pool/main/n/nodejs/nodejs_12.20.0-deb-1nodesource1_amd64.deb \
    && dpkg -i ./nodejs.deb \
    && rm nodejs.deb \
    && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update -qq \
    && apt-get install -qy yarn=1.22.* \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/src/latexml
WORKDIR /usr/src/latexml
ENV LATEXML_COMMIT=7fe716a7e8d67958e4005512c0c6f2acf838781a
RUN curl -L https://github.com/brucemiller/LaTeXML/tarball/$LATEXML_COMMIT | tar --strip-components 1 -zxf - \
    && perl Makefile.PL \
    && make \
    && make install

# allow converting PDF, etc
# https://stackoverflow.com/questions/52998331/imagemagick-security-policy-pdf-blocking-conversion
COPY .docker/policy.xml /etc/ImageMagick-6/policy.xml

RUN mkdir -p /app
WORKDIR /app

# Node
COPY package.json yarn.lock /app/
RUN yarn install --pure-lockfile && yarn cache clean

ENV PATH="/app/bin:/app/node_modules/.bin:${PATH}"

COPY . /app

# Build production CSS and JS
RUN yarn run build
