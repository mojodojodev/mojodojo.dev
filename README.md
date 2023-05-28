# mojodojo.dev
This website is for learning resources for the Mojo programming language.

It's built with [VuePress V2](https://v2.vuepress.vuejs.org/guide/getting-started.html) which is currently in beta, the main configuration comes from [vuepresss.config.ts](vuepress.config.ts), while [vuepress.client.ts](vuepress.client.ts) contains client-side configuration like redirects to keep old social media links alive, the css and static images can be modified in [.vuepress/public](.vuepress/public) and [.vuepress/styles](.vuepress/styles)

The homepage comes from [index.md](index.md), there is some custom Vue code I've taken from https://nushell.sh to generate the blog links in [components](components), and to generate the tables in [guides/index.md](guides/index.md).

The syntax highlighting comes from shiki which is what VS Code uses, the definition for the Mojo language is in [syntax/mojo.tmLanguage.json](syntax/mojo.tmLanguage.json) thanks to [crisadamo](https://github.com/crisadamo/mojo-lang-syntax).
