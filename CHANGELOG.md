# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased] - 

### Changed
- DockerFile now uses mamba to install python dependencies [#84](https://github.com/IN-CORE/incore-lab/issues/84)
- Github workflow is not run on ARM architecture [#75](https://github.com/IN-CORE/incore-lab/issues/75)

## [1.1.0] - 2023-11-08

### Changed
- INCORE-Lab now uses Pyincore version 1.14.0 [#76](https://github.com/IN-CORE/incore-lab/issues/76)
- INCORE-Lab now uses Pyincore-viz version 1.8.4 [#76](https://github.com/IN-CORE/incore-lab/issues/76)

## [1.0.0] - 2023-10-11

### Changed

- Dockerfile for hub to use version 3.0.2 [#57](https://github.com/IN-CORE/incore-lab/issues/57)
- Dockerfile for lab to use version 4.0.2 respectively [#56]( https://github.com/IN-CORE/incore-lab/issues/56)

### Added

- Read Quota from incore-service allocation endpoint [#66](https://github.com/IN-CORE/incore-lab/issues/66)

## [0.8.0] - 2023-08-16

### Added

- Ipopt and Scip solvers are included as a default [#61](https://github.com/IN-CORE/incore-lab/issues/61)

### Changed

- DockerFile to have JupyterLab only once saving memory [#56](https://github.com/IN-CORE/incore-lab/issues/56)

## [0.7.0] - 2023-06-14

### Changed

- Incore-lab with pyincore 1.11.0
- 

### Fixed

- Map visualization in incore-lab [#46](https://github.com/IN-CORE/incore-lab/issues/46)

## [0.6.1] - 2023-04-24

### Changed

- Incore-lab with pyincore 1.10.0

## [0.6.0] - 2022-09-14

### Added

- Incore-lab jupyterlab docker file [#24](https://github.com/IN-CORE/incore-lab/issues/24)

### Changed

- Removed incore_jupyter group from incore-lab and switched to env variables [#29](https://github.com/IN-CORE/incore-lab/issues/29)

## [0.5.4] - 2020-05-21

### Added

- When a new instance of incore lab is started it will use quotas based on the user [INCORE1-1182](https://opensource.ncsa.illinois.edu/jira/browse/INCORE1-1182)

## [0.5.3] - 2021-04-14

### Changed

- When logging out from jupyterhub, also logout from INCORE

## [0.5.2] - 2021-02-01

### Bugfix

- Upgrade dependency libraries to work with JupyterLab 3.0.6 [INCORE1-944](https://opensource.ncsa.illinois.edu/jira/browse/INCORE1-944)

### Changed

- Make jhub authenticator work with JWT token and traefik [INCORE1-616](https://opensource.ncsa.illinois.edu/jira/browse/INCORE1-616)
- Rewrite the jhub authenticator to store additional ldap user information for jlab spawners [INCORE1-960](https://opensource.ncsa.illinois.edu/jira/browse/INCORE1-960)

## [0.5.1] - 2020-12-10

### Bugfix

- Update dependency libraries to resolve build error [INCORE1-847](https://opensource.ncsa.illinois.edu/jira/browse/INCORE1-847)

## [0.5.0] - 2020-09-08

### Bugfix

- Replace fragility with DFR3 [INCORE1-761](https://opensource.ncsa.illinois.edu/jira/browse/INCORE1-761)

### Added

- Redirect to landing page when log out [INCORE1-715](https://opensource.ncsa.illinois.edu/jira/browse/INCORE1-715)

## [0.4.0] - 2020-07-28

### Added

- Add roles (or realm_access in roles) as criteria to control user access to incore lab [INCORE1-639](https://opensource.ncsa.illinois.edu/jira/browse/INCORE1-639)
- Append error message as query parameter to the redirect url [INCORE1-620](https://opensource.ncsa.illinois.edu/jira/browse/INCORE1-620)

## [0.3.2] - 2020-06-01

### Added

- jupyterhub customauthenticator add ability to check for group and expiration [INCORE1-561](https://opensource.ncsa.illinois.edu/jira/browse/INCORE1-561)

## [0.3.1] - 2020-01-31

### Added

- Jupyter Hub custom authenticator [INCORE1-434](INCORE-1042-writing-custom-authenticator-in-jupyterhub)

### Changed

- upgrade jupyterlab extension plugins and dependencies to work with Jupyter Lab version 2.0.2 [INCORE1-526](https://opensource.ncsa.illinois.edu/jira/browse/INCORE1-526)

## [0.1.0] - 2019-12-23

Initial release of IN-CORE lab
