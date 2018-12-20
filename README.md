# Lib project boiler

This is a simple boiler plate to start a js library project, with gulp automation setup for minification for javascript and css files. Sass compilation. And simple copy with comments stripping.

Watcher: Update for only the changed or added files (added if is not empty (not newly created) [copy, move or rename (which is a move)]).

(current gulp version = 4)


```bash
> gulp
```
to start the watcher


```bash
> gulp jsminify
```
to minify javascript files. All the ones in `src`.

```bash
> gulp jsCopy
```
to only copy to destination.

```bash
> gulp css
```
for css files (minfication + just copy version)

```bash
> gulp sass
```
for sass files (scss, sass extensions) (same)

```bash
> gulp style
```
to run both sass and css tasks


Clone, 
then run
```bash
npm install 
```

