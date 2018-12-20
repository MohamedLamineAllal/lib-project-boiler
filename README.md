# Lib project boiler

This is a simple boiler plate to start a js library project, with gulp automation setup for minification for javascript and css files. Sass compilation. 

Watcher Update for only the changed or added files (added if is not empty (not newly created) [copy, move or rename (which is a move)]).

(current gulp version = 4)


```
> gulp
```
to start the watcher


```
> gulp jsminify
```
to minify javascript files. All the ones in `src`.

```
> gulp jsCopy
```
to only copy to destination.

```
> gulp css
```
for css files (minfication + just copy version)

```
> gulp sass
```
for sass files (scss, sass extensions) (same)

```
> gulp style
```
to run both sass and css tasks


