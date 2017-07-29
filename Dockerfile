FROM andreasjansson/pandoc as pandoc

FROM debian:stretch
RUN apt-get update -qq && apt-get install -qy \
  ca-certificates \
  libgmp10 \
  pdf2svg \
  python \
  python-setuptools \
  texlive \
  texlive-latex-extra

RUN apt-get update -qq && apt-get install -qy curl gnupg2
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -qq && apt-get install -qy nodejs yarn

COPY --from=pandoc /root/.local/bin/pandoc /usr/local/bin/pandoc

COPY engrafo_pandocfilter /app/engrafo_pandocfilter
WORKDIR /app/engrafo_pandocfilter
RUN python setup.py install

WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn

COPY . /app
