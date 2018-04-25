source ~/miniconda/bin/activate jupyterlab-ext
jupyter lab --watch# jupyterlab_incore

Show a plugin that connects with incore2-services and shows a list of available datasets, search datasets by title and type.
Show a plugin that searches the fragilities in incore2-services and visualizes them.


## Prerequisites

* JupyterLab version 0.32.0 (pip or conda)
* @jupyterlab/application version 0.16.2 (npm)

## Setting Up Instructions for the first time:
1. Install Conda - https://conda.io/miniconda.html
*    On MAC:
When the download completes, open a terminal and create a root conda environment by running this command.

```
bash Miniconda3*.sh -b -p ~/miniconda
```

Now activate the conda environment you just created so that you can run the conda package manager.
```
source ~/miniconda/bin/activate
```

2. Create a Conda Environment: |
```
conda create -n jupyterlab-ext nodejs jupyterlab cookiecutter git -c conda-forge
```


3. Activate the new environment - Needed each time you want to run the extension
```
source ~/miniconda/bin/activate jupyterlab-ext
```

Note: You’ll need to run the command above in each new terminal you open before you can work with the tools you installed in the jupyterlab-ext environment.

4. Build and install the extension for development - Needed each time dependencies are updated in package.json
 In one terminal - Install data viewer plugin
```
source ~/miniconda/bin/activate jupyterlab-ext
cd data_viewer
npm install
npm run clean
npm run build
jupyter labextension install . --no-build
jupyter labextension link .
```

In a second terminal - Install fragility service plugin

```source ~/miniconda/bin/activate jupyterlab-ext
cd fragility_viewer
npm install
npm run clean
npm run build
jupyter labextension install . --no-build
jupyter labextension link .
```

6. Jupyterlab is a React based app, and its modules comes with React types. This will result in conflicts in you are trying
   to install any React based extensions. To solve this conflict, just make sure you have *removed the @types folder* under
   the path ```node_modules/@jupyterlab/apputils/node_modules/``` In both the data_viewer and fragility_viewer folders


7. Run these commands to activate the jupyterlab-ext environment and to start a JupyterLab instance in watch mode so that it will keep up with our changes as we make them.
```
source ~/miniconda/bin/activate jupyterlab-ext
jupyter lab --watch
```
8. In a new tab run

```
npm run build
```


9. In development, in a new tab run - Avoids having to run npm run build each time you update something
npm run watch

## Running locally each time

1. In a terminal run:
```
source ~/miniconda/bin/activate jupyterlab-ext
cd data_viewer
npm run watch
```

2. In a second terminal run:
```source ~/miniconda/bin/activate jupyterlab-ext
cd fragility_viewer
npm run watch
```

3. In a third terminal run:
```source ~/miniconda/bin/activate jupyterlab-ext
jupyter lab --watch
```
