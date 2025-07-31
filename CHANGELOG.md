# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.12.0] - 2025-07-31
- Pyincore incubator for IN-CORE release 6.1.0 [#144](https://github.com/IN-CORE/incore-lab/issues/144)

## [1.11.0] - 2025-07-30
- Pyincore 1.22.0 for IN-CORE release 6.1.0 [#141](https://github.com/IN-CORE/incore-lab/issues/141)

## [1.10.1] - 2025-02-20
- Pyincore 1.21.0 for IN-CORE release 6.0.0 [#138](https://github.com/IN-CORE/incore-lab/issues/138)

## [1.9.1] - 2024-11-04
### Changed
- Pyincore 1.20.1 for IN-CORE release 5.5.1 [#134](https://github.com/IN-CORE/incore-lab/issues/134)

## [1.9.0] - 2024-10-23
### Changed
- Hub containers versioning has been updated to use the changelog [#127](https://github.com/IN-CORE/incore-lab/issues/127)
- Separated code for lab and hub using their own placeholder [#128](https://github.com/IN-CORE/incore-lab/issues/128)
- Removed incore utilities code [#129](https://github.com/IN-CORE/incore-lab/issues/129)
- IN-CORE releaes 5.5.0 with pyincore 1.20.0

## [1.8.0] - 2024-08-21
### Changed 
- Updated base image forJupyterLab to 4.1 [#122](https://github.com/IN-CORE/incore-lab/issues/122)

### Changed
- UID logic. We will no longer depend upon the uid parameter from LDAP in JWT token. [#119](https://github.com/IN-CORE/incore-lab/issues/119)

## [1.7.0] - 2024-06-12
### Changed
- IN-CORE relase for 5.4.0 with pyincore 1.19.0 [#116](https://github.com/IN-CORE/incore-lab/issues/116)

## [1.6.0] - 2024-04-30

### Changed
- IN-CORE release for 5.3.1 with pyincore 1.18.1 [#112](https://github.com/IN-CORE/incore-lab/issues/112)

### Fixed
- Error in logic to determine if user is an admin


## [1.5.0] - 2024-04-10
### Changed
- IN-CORE release for 5.3.0 with pyincore 1.18.0 [#108](https://github.com/IN-CORE/incore-lab/issues/108)


## [1.4.0] - 2024-02-22

### Changed
- IN-CORE release for 5.1.0 with pyincore 1.17.0 [#103](https://github.com/IN-CORE/incore-lab/issues/103)


## [1.3.0] - 2024-02-07

### Added
- Github action works with RC version of components [#90](https://github.com/IN-CORE/incore-lab/issues/90)

### Changed
- IN-CORE release for 5.0.0 with pyincore 1.16.0 [#100](https://github.com/IN-CORE/incore-lab/issues/100)

## [1.2.1] - 2023-12-20

### Changed
- IN-CORE release for 4.8.1 with pyincore 1.15.1 [#96](https://github.com/IN-CORE/incore-lab/issues/96)


## [1.2.0] - 2023-12-13 

### Added

- Config file for controlling component versions and github action [#86](https://github.com/IN-CORE/incore-lab/issues/86)

### Changed
- DockerFile now uses mamba to install python dependencies [#84](https://github.com/IN-CORE/incore-lab/issues/84)
- Github Action workflow is no longer run on ARM architecture [#75](https://github.com/IN-CORE/incore-lab/issues/75)


## [1.1.0] - 2023-11-08

### Changed

- INCORE-Lab now uses Pyincore version 1.14.0 [#76](https://github.com/IN-CORE/incore-lab/issues/76)
- INCORE-Lab now uses Pyincore-viz version 1.8.4 [#76](https://github.com/IN-CORE/incore-lab/issues/76)

## [1.0.0] - 2023-10-11

### Changed

- Dockerfile for hub to use version 3.0.2 [#57](https://github.com/IN-CORE/incore-lab/issues/57)
- Dockerfile for lab to use version 4.0.2 respectively [#56](https://github.com/IN-CORE/incore-lab/issues/56)

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