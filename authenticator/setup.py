from setuptools import setup

setup(
    name='customauthenticator',
    version='beta',
    description='Custom Authenticator for JupyterHub',
    author='cwang138',
    author_email='cwang138@illinois.edu',
    license='MPL 2.0',
    packages=['customauthenticator'],
    install_requires=[
        'jupyterhub',
        'pyjwt',
        'requests'
    ]
)
