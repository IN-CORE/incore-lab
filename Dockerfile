FROM jupyterhub/k8s-hub:0.10.6

WORKDIR /tmp/authenticator/
COPY authenticator /tmp/authenticator/
RUN pip3 install /tmp/authenticator

WORKDIR /srv/jupyterhub
