# Version from https://hub.docker.com/_/debian/
FROM debian:testing-20180716

# Official CDN throws 503s
RUN sed -i 's/deb.debian.org/mirrors.kernel.org/g' /etc/apt/sources.list

# LaTeX stuff first, because it's enormous and doesn't change much
# Change logs here: https://packages.debian.org/buster/texlive
RUN apt-get update -qq && apt-get install -qy texlive-full=2018.20180505*

RUN apt-get update -qq && apt-get install -qy curl gnupg2 \
    && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    # runs apt-get update for us \
    && curl -sL https://deb.nodesource.com/setup_8.x | bash - \
    && apt-get install -qy \
    # Node.js dependencies \
    ca-certificates \
    nodejs=8.11.3* \
    git-core \
    yarn=1.7.0* \
    # latexml dependencies \
    libarchive-zip-perl libfile-which-perl libimage-size-perl  \
    libio-string-perl libjson-xs-perl libtext-unidecode-perl \
    libparse-recdescent-perl liburi-perl libuuid-tiny-perl libwww-perl \
    libxml2 libxml-libxml-perl libxslt1.1 libxml-libxslt-perl  \
    imagemagick libimage-magick-perl perl-doc build-essential \
    # percy dependencies \
    rubygems \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/src/latexml
WORKDIR /usr/src/latexml
ENV LATEXML_COMMIT=fb71c30ff7674fc62441ce6187a98240d19e279a
RUN curl -L https://github.com/brucemiller/LaTeXML/tarball/$LATEXML_COMMIT | tar --strip-components 1 -zxf - \
    && perl Makefile.PL \
    && make \
    && make install

# Percy
RUN gem install percy-cli

RUN mkdir -p /app
WORKDIR /app

# Node
COPY package.json yarn.lock /app/
RUN yarn install --pure-lockfile && yarn cache clean

ENV PATH="/app/bin:/app/node_modules/.bin:${PATH}"

COPY . /app
