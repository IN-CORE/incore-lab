FROM jupyterhub/k8s-hub:3.0.2

USER root
WORKDIR /tmp/authenticator/
COPY hub/authenticator /tmp/authenticator/
COPY hub/authenticator/quota.json /etc/quota.json
RUN pip3 install /tmp/authenticator
USER jovyan

WORKDIR /srv/jupyterhub
