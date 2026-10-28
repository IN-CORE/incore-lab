FROM quay.io/jupyterhub/k8s-hub:4.4.4

USER root
WORKDIR /tmp/authenticator/
COPY hub/authenticator /tmp/authenticator/
COPY hub/authenticator/quota.json /etc/quota.json
# keep the jupyterhub version that ships with the k8s-hub image
RUN pip3 freeze | grep -i "^jupyterhub==" > /tmp/constraints.txt && \
    pip3 install --no-cache-dir -c /tmp/constraints.txt /tmp/authenticator && \
    rm -f /tmp/constraints.txt
USER jovyan

WORKDIR /srv/jupyterhub
