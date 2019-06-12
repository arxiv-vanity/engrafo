# Version from https://hub.docker.com/_/debian/
FROM debian:testing-20190610

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
    # latexml dependencies \
    libarchive-zip-perl libfile-which-perl libimage-size-perl  \
    libio-string-perl libjson-xs-perl libtext-unidecode-perl \
    libparse-recdescent-perl liburi-perl libuuid-tiny-perl libwww-perl \
    libxml2 libxml-libxml-perl libxslt1.1 libxml-libxslt-perl  \
    imagemagick libimage-magick-perl perl-doc build-essential \
    # This is so we can pin to Node versions https://github.com/nodesource/distributions/issues/33 
    # See https://deb.nodesource.com/node_8.x/pool/main/n/nodejs/ for list of packages
    && curl -o nodejs.deb https://deb.nodesource.com/node_8.x/pool/main/n/nodejs/nodejs_8.14.0-1nodesource1_amd64.deb \
    && dpkg -i ./nodejs.deb \
    && rm nodejs.deb \
    && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update -qq \
    && apt-get install -qy yarn=1.12.* \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/src/latexml
WORKDIR /usr/src/latexml
ENV LATEXML_COMMIT=efca8582ff812bc1f65d27c5726e342555f7a3b7
RUN curl -L https://github.com/brucemiller/LaTeXML/tarball/$LATEXML_COMMIT | tar --strip-components 1 -zxf - \
    && perl Makefile.PL \
    && make \
    && make install

RUN mkdir -p /app
WORKDIR /app

# Node
COPY package.json yarn.lock /app/
RUN yarn install --pure-lockfile && yarn cache clean

ENV PATH="/app/bin:/app/node_modules/.bin:${PATH}"

COPY . /app

# Build production CSS and JS
RUN yarn run build
