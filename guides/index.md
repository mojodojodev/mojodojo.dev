# Guides

<script>
  import pages from '@temp/pages'
  export default {
    computed: {
      guides() {
          return pages.filter(p => p.path.indexOf('/guides/general/') >= 0)
      },
      std() {
        return this.sortByCategories(
          pages.filter(p => p.path.indexOf('/guides/std/') >= 0)
        )
      },
      builtins() {
          return pages.filter(p => p.path.indexOf('/guides/builtins/') >= 0)
      },
      decorators() {
          return pages.filter(p => p.path.indexOf('/guides/decorators/') >= 0)
      },
      intro() {
        return this.sortByCategories(
            pages.filter(p => p.path.indexOf('/guides/intro-to-mojo/') >= 0)
        )
      },
      benchmarks() {
            return pages.filter(p => p.path.indexOf('/guides/benchmarks/') >= 0)
      },
    },
    methods: {
      sortByCategories(pages) {
        return pages.sort((a, b) => a.frontmatter.categories.localeCompare(b.frontmatter.categories))
      },
    }
  }
</script>


## Intro to Mojo
_This guide is in the early stages, feedback welcomed [on Github](https://github.com/mojodojodev/mojodojo.dev/discussions/categories/feedback)_

<table>
  <tr>
    <th>Chapter</th>
    <th>Description</th>
  </tr>
  <tr v-for="chapter in intro">
   <td><a :href="chapter.path">{{ chapter.frontmatter.categories }}</a></td>
   <td style="white-space: pre-wrap;">{{ chapter.frontmatter.usage }}</td>
  </tr>
</table>

## General

<table>
  <tr>
    <th>Guide</th>
    <th>Description</th>
  </tr>
  <tr v-for="guide in guides">
   <td><a :href="guide.path">{{ guide.title }}</a></td>
   <td style="white-space: pre-wrap;">{{ guide.frontmatter.usage }}</td>
  </tr>
</table>


## Builtins

<table>
  <tr>
    <th>Item</th>
    <th>Description</th>
  </tr>
  <tr v-for="i in builtins">
   <td><a :href="i.path">{{ i.title }}</a></td>
   <td style="white-space: pre-wrap;">{{ i.frontmatter.usage }}</td>
  </tr>
</table>

## Decorators

<table>
  <tr>
    <th>Item</th>
    <th>Description</th>
  </tr>
  <tr v-for="i in decorators">
   <td><a :href="i.path">{{ i.title }}</a></td>
   <td style="white-space: pre-wrap;">{{ i.frontmatter.usage }}</td>
  </tr>
</table>


## Standard Library

<table>
  <tr>
    <th>Item</th>
    <th>Module</th>
    <th>Description</th>
  </tr>
  <tr v-for="s in std">
   <td><a :href="s.path">{{ s.title }}</a></td>
   <td style="white-space: pre-wrap;">{{ s.frontmatter.categories }}</td>
   <td style="white-space: pre-wrap;">{{ s.frontmatter.usage }}</td>
  </tr>
</table>

## Benchmarks
Benchmarking various conversions of Python to Mojo

<table>
  <tr>
    <th>Title</th>
    <th>Description</th>
  </tr>
  <tr v-for="s in benchmarks">
   <td><a :href="s.path">{{ s.title }}</a></td>
   <td style="white-space: pre-wrap;">{{ s.frontmatter.usage }}</td>
  </tr>
</table>
