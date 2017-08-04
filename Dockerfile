FROM andreasjansson/engrafo-pandoc as pandoc

FROM debian:stretch
# TODO: delete python-setuptools (but I don't want to bust my cache)
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
RUN apt-get update -qq && apt-get install -qy nodejs yarn python-pip

COPY --from=pandoc /root/.local/bin/pandoc /usr/local/bin/pandoc

# pandocfilter
RUN mkdir -p /app/pandocfilter
WORKDIR /app
COPY pandocfilter/requirements.txt /app/pandocfilter/
RUN pip install -r pandocfilter/requirements.txt

# server
COPY server/requirements.txt /app/server/
RUN pip install -r server/requirements.txt

# Node
WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn

ENV PYTHONUNBUFFERED=1

COPY . /app
