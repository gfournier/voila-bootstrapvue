- To release a new version of voila-bootstrapvue templates on PyPI:

* Update version in `setup.py` (set release version, remove 'dev')
* git add the `setup.py` file and git commit
* `python setup.py sdist`
* `python setup.py bdist_wheel`
* `twine upload <wheel>`
* `twine upload <dist>`
* `git tag -a X.X.X -m 'comment'`
* Update `setup.py` (add 'dev' and increment minor)
* git add and git commit
* git push
* git push --tags
