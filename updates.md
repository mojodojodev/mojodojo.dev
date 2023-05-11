# Changelog

## 2023-07-23
### Mojo Team Updates
#### Multiple declaration and assignment
This is something that is currently being worked on, allowing syntax such as:
```mojo
let a, b = 1, 2
```

### General
Added this update page for when the Mojo team gives new answers, similar to a CHANGELOG.md, thanks very much to [@elliotwaite](https://twitter.com/elliotwaite) for the suggestion.

Changing the structure now the site is growing, will now be four single pages:
- blog
- tutorials
- mojo team answers
- changelog

Experimenting with having every blog and tutorial on the same page, inspired by the [Zig Language Reference]( https://ziglang.org/documentation/master/) which is really enjoyable to use and offers some nice benefits:
- Keeps navigation in the left sidebar without duplication via an `index.md`
- Can reorganize tutorials without breaking links by taking advantage of `#heading-tags`
- Users can download a single `.md` file and use it offline in a code editor
- A single link will have a higher hit rate improving ranking on search engines
