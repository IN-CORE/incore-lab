## Prerequisite
* Use JupyterLab version >= v1.0.0

## Build and Install the custom extension
```
cd incore_utilities
npm install
npm run clean
npm run build
jupyter labextension install . --no-build
jupyter labextension link .
```

## launch Jupyterlab
```$xslt
jupyter lab

```
For development purpose, run these commands to launch jupyterlab in **watch mode** so that it will reflect every change made
in one terminal run command:
```
jupyter lab --watch
```
and in a second terminal run command

```
npm run build
```
