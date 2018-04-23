#!/bin/bash

npm run clean
npm run build
jupyter labextension link .
jupyter lab --watch
