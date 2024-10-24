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
ARG INCORE="latest"

# store versions installed as environment variables
ENV INCORE=$INCORE \
    PYINCORE=$PYINCORE \
    PYINCORE_VIZ=$PYINCORE_VIZ \
    PYINCORE_DATA=$PYINCORE_DATA \
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
     pyincore-data=${PYINCORE_DATA} && \
  mamba clean --yes --all --force-pkgs-dirs && \
  find /opt/conda ! -perm -o=w -print | sort > /tmp/newfiles && \
  comm -13 /tmp/oldfiles /tmp/newfiles | xargs -d '\n' -n 100 chmod a+w && \
  rm -f /tmp/oldfiles /tmp/newfiles