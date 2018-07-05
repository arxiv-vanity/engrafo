# Version from https://hub.docker.com/_/debian/
FROM debian:testing-20180625

# Official CDN throws 503s
RUN sed -i 's/deb.debian.org/mirrors.kernel.org/g' /etc/apt/sources.list

# LaTeX stuff first, because it's enormous and doesn't change much
# Change logs here: https://packages.debian.org/buster/texlive
RUN apt-get update -qq && apt-get install -qy texlive-full=2018.20180505*

# Node.js dependencies
RUN apt-get update -qq && apt-get install -qy curl gnupg2
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -qq && apt-get install -qy \
  ca-certificates \
  nodejs=8.11.3* \
  git-core \
  yarn=1.7.0*

# latexml dependencies
RUN apt-get update -qq && apt-get install -qy \
  libarchive-zip-perl libfile-which-perl libimage-size-perl  \
  libio-string-perl libjson-xs-perl libtext-unidecode-perl \
  libparse-recdescent-perl liburi-perl libuuid-tiny-perl libwww-perl \
  libxml2 libxml-libxml-perl libxslt1.1 libxml-libxslt-perl  \
  imagemagick libimage-magick-perl perl-doc build-essential

RUN mkdir -p /usr/src/latexml
WORKDIR /usr/src/latexml
ENV LATEXML_COMMIT=fb71c30ff7674fc62441ce6187a98240d19e279a
RUN curl -L https://github.com/brucemiller/LaTeXML/tarball/$LATEXML_COMMIT | tar --strip-components 1 -zxf -
RUN perl Makefile.PL; make; make install

RUN mkdir -p /app /node_modules
WORKDIR /app

# Percy dependencies
RUN apt-get update -qq && apt-get install -qy rubygems
RUN gem install percy-cli

# Node
COPY package.json yarn.lock /
# HACK: Install node_modules one directory up so they are not overwritten
# in development. The other workaround is using a volume for node_modules,
# but is really slow and hard to update.
RUN cd /; yarn install --pure-lockfile
ENV PATH /node_modules/.bin:$PATH

ENV PATH="/app/bin:${PATH}"

COPY . /app
