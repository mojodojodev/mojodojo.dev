# Updates
## 2023-05-12
### Mojo Team Updates
#### Float Literals
`FloatLiteral` is backed by `F64`, Mojo Playground is currently only printing to 6 decimal places, but the mantissa width is 52

### Removed Sections
#### `&` postfix
It's been changed to `inout` in [latest playground update](https://docs.modular.com/mojo/changelog.html#week-of-2023-05-01) so no longer relevant

## 2023-05-11
### Mojo Team Updates
#### `object` type in Mojo
It's a struct that wraps a pointer to a CPython object

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

Updated to VuePress 2.0.0-beta.61

Add redirects for new page structure, to retain social media links
