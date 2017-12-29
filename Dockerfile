FROM debian:stretch

# Official CDN throws 503s
RUN sed -i 's/deb.debian.org/mirrors.kernel.org/g' /etc/apt/sources.list

# LaTeX stuff first, because it's enormous and doesn't change much
RUN apt-get update -qq && apt-get install -qy \
  curl \
  gnupg2 \
  texlive-full

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -qq && apt-get install -qy \
  ca-certificates \
  curl \
  nodejs \
  git-core \
  gnupg2 \
  python \
  python-pip \
  yarn

# latexml
RUN apt-get update -qq && apt-get install -qy \
  libarchive-zip-perl libfile-which-perl libimage-size-perl  \
  libio-string-perl libjson-xs-perl libtext-unidecode-perl \
  libparse-recdescent-perl liburi-perl libuuid-tiny-perl libwww-perl \
  libxml2 libxml-libxml-perl libxslt1.1 libxml-libxslt-perl  \
  imagemagick libimage-magick-perl perl-doc
RUN mkdir -p /usr/src/latexml
WORKDIR /usr/src/latexml
ENV LATEXML_COMMIT=e14e9f07d5fca8a124953ddb04a9abaeb65a618e
RUN curl -L https://github.com/brucemiller/LaTeXML/tarball/$LATEXML_COMMIT | tar --strip-components 1 -zxf -
RUN perl Makefile.PL; make; make install

RUN mkdir -p /app
WORKDIR /app

# server
COPY server/requirements.txt /app/server/
RUN pip install -r server/requirements.txt

# Node
COPY package.json yarn.lock /app/
RUN yarn

ENV PYTHONUNBUFFERED=1
ENV PATH="/app/bin:${PATH}"

COPY . /app
