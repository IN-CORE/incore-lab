FROM jupyterhub/k8s-hub:0.10.6

WORKDIR /tmp/authenticator/
COPY authenticator /tmp/authenticator/
COPY authenticator/quota.json /etc/quota.json
RUN pip3 install /tmp/authenticator

WORKDIR /srv/jupyterhub
