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

# JupyterLab and Jupyter AI versions, the Jupyter AI chat UI needs JupyterLab >= 4.5
ARG JUPYTERLAB="4.6"
ARG NOTEBOOK="7.6"
ARG JUPYTER_AI="3.2"

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
     jupyterlab=${JUPYTERLAB} \
     notebook=${NOTEBOOK} \
     "sqlite>=3.50" && \
  mamba clean --yes --all --force-pkgs-dirs && \
  find /opt/conda ! -perm -o=w -print | sort > /tmp/newfiles && \
  comm -13 /tmp/oldfiles /tmp/newfiles | xargs -d '\n' -n 100 chmod a+w && \
  rm -f /tmp/oldfiles /tmp/newfiles

# Install Jupyter AI with the Jupyternaut persona from PyPI (jupyternaut is not on conda-forge),
# keeping the jupyterlab, notebook and jupyterhub versions installed above.
# Jupyter AI needs cryptography >= 45, so pyopenssl is upgraded to a version that supports it.
# litellm >= 1.103 imports mcp 2.x APIs but jupyternaut caps mcp < 2 (via langchain-mcp-adapters),
# which breaks every Jupyternaut reply, so litellm is kept below 1.103.
# uv is used since the pip resolver backtracks for a long time on this install.
RUN umask 0 && \
  find /opt/conda ! -perm -o=w -print | sort > /tmp/oldfiles && \
  pip list --format=freeze | grep -i -E "^(jupyterlab|notebook|jupyterhub)==" > /tmp/constraints.txt && \
  pip install --no-cache-dir uv && \
  uv pip install --no-cache --python /opt/conda/bin/python -c /tmp/constraints.txt \
     "jupyter-ai[jupyternaut]==${JUPYTER_AI}.*" \
     "pyopenssl>=26" \
     "litellm<1.103" && \
  find /opt/conda ! -perm -o=w -print | sort > /tmp/newfiles && \
  comm -13 /tmp/oldfiles /tmp/newfiles | xargs -r -d '\n' -n 100 chmod a+w && \
  rm -f /tmp/oldfiles /tmp/newfiles /tmp/constraints.txt