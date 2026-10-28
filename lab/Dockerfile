FROM jupyterhub/singleuser:4.1

USER root
RUN apt-get -qq update && apt-get install -y --no-install-recommends \
    curl \
    git \
    zip unzip \
    gdal-bin \
    libspatialindex-dev \
    nano \
    vim-tiny \
    lsof && \
  rm -rf /var/lib/apt/lists/*

USER $NB_USER

# IN-CORE variables, set these to control versions to be installed
# use --build-arg CHANNEL=in-core/label/rc to install a RC version
ARG CHANNEL="in-core"
ARG PYINCORE="latest"
ARG PYINCORE_VIZ="latest"
ARG PYINCORE_DATA="latest"
ARG PYINCORE_INCUBATOR="latest"
ARG INCORE="latest"

# Minimum versions patched for Broccoli2Shell (CVE-2026-111497), an out-of-bounds write in the Brotli decoder
ARG BROTLI="1.2.1"
ARG NODEJS="22.23.4"
# pinning nodejs makes the solve pull in sqlite 3.32.3, which overwrites libsqlite3.so.0 and breaks sqlite3, GDAL and node
ARG SQLITE="3.50"

# store versions installed as environment variables
ENV INCORE=$INCORE \
    PYINCORE=$PYINCORE \
    PYINCORE_VIZ=$PYINCORE_VIZ \
    PYINCORE_DATA=$PYINCORE_DATA \
    PYINCORE_INCUBATOR=$PYINCORE_INCUBATOR \
    CHANNEL=$CHANNEL

# Install Mamba from Conda-Forge
RUN conda install -c conda-forge mamba

# Set mamba channels
RUN conda config --add channels conda-forge && \
    conda config --add channels in-core

# Install pyincore, pyincore-viz and other mamba packages
RUN umask 0 && \
  find /opt/conda ! -perm -o=w -print | sort > /tmp/oldfiles && \
  mamba install -c ${CHANNEL} -c in-core/label/rc -y \
     pyincore=${PYINCORE} \
     pyincore-viz=${PYINCORE_VIZ} \
     pyincore-data=${PYINCORE_DATA} \
     pyincore-incubator=${PYINCORE_INCUBATOR} \
     "brotli-python>=${BROTLI}" \
     "nodejs>=${NODEJS}" \
     "sqlite>=${SQLITE}" && \
  mamba clean --yes --all --force-pkgs-dirs && \
  find /opt/conda ! -perm -o=w -print | sort > /tmp/newfiles && \
  comm -13 /tmp/oldfiles /tmp/newfiles | xargs -d '\n' -n 100 chmod a+w && \
  rm -f /tmp/oldfiles /tmp/newfiles