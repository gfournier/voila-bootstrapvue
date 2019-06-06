# Voila template for Bootstrap Vue components

[![Version](https://img.shields.io/pypi/v/voila-bootstrapvue.svg)](https://pypi.org/project/voila-bootstrapvue/)

A template for [Voila](https://github.com/QuantStack/voila) runtime to package a Jupyter notebook as a web application.


## Install

```
pip install voila-bootstrapvue
```


## Run sample

Add additional libraries in your environment for running the notebook:
```
pip install voila
pip install ipyhc
pip install ipybootstrapvue
```

Run voila:
```
voila Stock_price_demo.ipynb --template sample-grid-table
```

## References

* [Voila](https://github.com/QuantStack/voila)
* [voila-vuetify](https://github.com/mariobuikhuizen/voila-vuetify) 
* [ipybootstrapvue](https://github.com/gfournier/ipybootstrapvue) 


## Development

Install templates from the local sources:
```
pip install -e .
```
