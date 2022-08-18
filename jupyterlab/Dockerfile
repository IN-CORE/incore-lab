FROM jupyterhub/singleuser:1.2.2
USER root

RUN apt-get -qq update && apt-get install -y apt-utils && \
  apt-get -qq install git && apt-get -qq install zip unzip && \ 
  apt-get -qq install -y TK8.5 && apt-get -qq install gdal-bin && \
  apt-get -qq install libspatialindex-dev && \
  apt-get -qq install nano && \
  apt-get install -y vim-tiny && \
  apt-get install lsof && \
  mkdir /OpenSeesPy && \
  chmod 777 /OpenSeesPy

# install opensees
USER $NB_USER
ADD openseespylinux.zip "/OpenSeesPy/" 
RUN cd /OpenSeesPy && \
  unzip openseespylinux.zip && \
  cp /OpenSeesPy/opensees.so /opt/conda/lib/python3.8/site-packages/. && \
  chmod 774 /opt/conda/lib/python3.8/site-packages/opensees.so

USER root

RUN rm -rf /OpenSeesPy && \
  apt-get update && \
  apt install -y gfortran-7 && \
  apt-get install -y  libssl-dev && \
  cd /usr/lib/x86_64-linux-gnu/ && \
  ln -s libpng16.so.16 libpng15.so.15 && \
  ln -s libcrypto.so.1.0.0 libcrypto.so.10

USER $NB_USER

RUN conda create -n jupyterlab-ext nodejs=14 jupyterlab=3.4.3 cookiecutter git -y -c conda-forge && \
  echo "Activate conda envrironment jupyterlab-ext" && \
  /bin/bash -c "source activate jupyterlab-ext" && \
  echo "Install nodejs 14" && \
  conda install -c conda-forge -y nodejs=14 && \ 
  echo "Install jupyterlab 3.4.3" && \
  conda install -c conda-forge -y jupyterlab=3.4.3 && \
  echo "Installed jupyterlab 3.4.3" && \
  echo "Install ipyleaflet 0.13.6" && \
  conda install -c conda-forge -y ipyleaflet=0.13.6

## install jupyterlab-renderers extension
RUN jupyter labextension install @jupyterlab/fasta-extension && \
  jupyter labextension install @jupyterlab/geojson-extension && \
# jupyter labextension install @jupyterlab/katex-extension
# jupyter labextension install @jupyterlab/plotly-extension
  jupyter labextension install @jupyterlab/vega2-extension && \
  jupyter labextension install @jupyter-widgets/jupyterlab-manager jupyter-leaflet jupyter-matplotlib && \
  jupyter labextension install jupyter-leaflet

RUN echo "install incore data fragility viewer" && \
  cd /tmp && \
  git clone "https://github.com/IN-CORE/incore-lab.git" && \
  sleep 10 && \
  cd incore-lab && \
  git checkout master && \
  git pull && \
  jupyter lab clean && \
  cd incore_utilities && \
  npm install && \
  #npm audit fix --force && \
  npm run clean && \
  npm run build && \
  jupyter labextension install . --no-build && \
  jupyter labextension link . && \
  rm -rf /tmp/npm* && \
  rm -rf /tmp/v8* 

# install custom authenticator
RUN echo "install custom authenticator" && \
  cd /tmp/incore-lab && \
  cd authenticator && \
  pip install . -U && \
  rm -rf /tmp/incore-lab

# register ipyleaflet
RUN jupyter nbextension enable --py --sys-prefix ipyleaflet

# install pyincore, pyincore-viz and other conda packages
RUN conda install -c conda-forge -y boto3 && \
  conda install -c conda-forge -y pycodestyle>=2.6.0 && \
  conda install -c conda-forge -y fiona=1.8.21 && \
  echo "updated fiona to 1.8.21" && \
  conda install -c conda-forge ipympl && \
  conda config --add channels conda-forge && \ 
  conda config --add channels in-core && \
  conda install -c in-core/label/rc -y pyincore=1.6.0rc3 && \
  echo "pyincore installed" && \
  conda install -c in-core/label/rc -y pyincore-viz=1.7.0rc1 && \
  echo "pyincore-viz installed" && \
  conda install -c in-core/label/rc -y pyincore-data=0.5.1.rc.1 && \
  echo "pyincore-data installed" && \
  conda clean -y -a --force-pkgs-dirs && \
  chmod 777 /opt/conda/share/jupyter/lab/settings/build_config.json && \
  chmod 777 -R /opt/conda/

USER $NB_USER
