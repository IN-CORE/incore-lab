# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [0.5.3] - 2021-04-14

### [Bugfix]
- Fix bugs on jhub authenticator logout: periodically check user auth expiration; clear auth cookie on logout; provide meaningful message [INCORE1-995](https://opensource.ncsa.illinois.edu/jira/browse/INCORE1-995)


## [0.5.2] - 2021-02-01

### [Bugfix]
- Upgrade dependency libraries to work with JupyterLab 3.0.6 [INCORE1-944](https://opensource.ncsa.illinois.edu/jira/browse/INCORE1-944)

### [Changed]
- Make jhub authenticator work with JWT token and traefik [INCORE1-616](https://opensource.ncsa.illinois.edu/jira/browse/INCORE1-616)
- Rewrite the jhub authenticator to store additional ldap user information for jlab spawners [INCORE1-960](https://opensource.ncsa.illinois.edu/jira/browse/INCORE1-960)


## [0.5.1] - 2020-12-10

### [Bugfix]
- Update dependency libraries to resolve build error [INCORE1-847](https://opensource.ncsa.illinois.edu/jira/browse/INCORE1-847)


## [0.5.0] - 2020-09-08

### [Bugfix]
- Replace fragility with DFR3 [INCORE1-761](https://opensource.ncsa.illinois.edu/jira/browse/INCORE1-761)

### [Added]
- Redirect to landing page when log out [INCORE1-715](https://opensource.ncsa.illinois.edu/jira/browse/INCORE1-715)


## [0.4.0] - 2020-07-28

### [Added]
- Add roles (or realm_access in roles) as criteria to control user access to incore lab [INCORE1-639](https://opensource.ncsa.illinois.edu/jira/browse/INCORE1-639)
- Append error message as query parameter to the redirect url [INCORE1-620](https://opensource.ncsa.illinois.edu/jira/browse/INCORE1-620)

## [0.3.2] - 2020-06-01

### [Added]
- jupyterhub customauthenticator add ability to check for group and expiration [INCORE1-561](https://opensource.ncsa.illinois.edu/jira/browse/INCORE1-561)

## [0.3.1] - 2020-01-31

### [Added]
- Jupyter Hub custom authenticator [INCORE1-434](INCORE-1042-writing-custom-authenticator-in-jupyterhub)

### [Updated]
- upgrade jupyterlab extension plugins and dependencies to work with Jupyter Lab version 2.0.2 [INCORE1-526](https://opensource.ncsa.illinois.edu/jira/browse/INCORE1-526)


## [0.1.0] - 2019-12-23
Initial release of IN-CORE lab
