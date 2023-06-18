# Guides

<script>
  import pages from '@temp/pages'
  export default {
    computed: {
      guides() {
        return this.sortByCategories(
          pages.filter(p => p.path.indexOf('/guides/general/') >= 0)
        )
      },
      modules() {
        return this.sortByCategories(
          pages.filter(p => p.path.indexOf('/guides/modules/') >= 0)
        )
      },
      intro() {
        return this.sortByCategories(
          pages.filter(p => p.path.indexOf('/guides/intro-to-mojo/') >= 0)
        )
      }
    },
    methods: {
      sortByCategories(pages) {
        return pages.sort((a, b) => a.frontmatter.categories.localeCompare(b.frontmatter.categories))
      }
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
General guides

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


## Modules
Quick tutorials on how to use various builtins and standard library modules

<table>
  <tr>
    <th>Item</th>
    <th>Module</th>
    <th>Description</th>
  </tr>
  <tr v-for="module in modules">
   <td><a :href="module.path">{{ module.title }}</a></td>
   <td style="white-space: pre-wrap;">{{ module.frontmatter.categories }}</td>
   <td style="white-space: pre-wrap;">{{ module.frontmatter.usage }}</td>
  </tr>
</table>
