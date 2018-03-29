source ~/miniconda/bin/activate jupyterlab-ext
jupyter lab --watch# jupyterlab_incore

Show a tab that connects with incore2-services and shows a list of available datasets


## Prerequisites

* JupyterLab

## Installation

```bash
jupyter labextension install jupyterlab_incore
```

## Development

For a development install (requires npm version 4 or later), do the following in the repository directory:

```bash
npm install
npm run build
jupyter labextension link .
```

To rebuild the package and the JupyterLab app:

```bash
npm run build
jupyter lab build
```

