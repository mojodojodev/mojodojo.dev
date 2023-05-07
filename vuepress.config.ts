import { defaultTheme } from 'vuepress'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
    lang: 'en-US',
    title: 'Mojo Dojo',
    description: 'Learning Resources for 🔥',
    theme: defaultTheme({
        colorMode: 'dark',
        logo: '/hero.png',
        repo: 'mojodojodev/mojodojo.dev',
        repoLabel: 'GitHub',
        docsRepo: 'mojodojodev/mojodojo.dev',
        docsBranch: 'main',
        lastUpdated: false,
        locales: {
            '/': {
                selectLanguageName: 'English',
                editLinkText: 'Edit this page on GitHub',
                navbar: [
                    { text: 'Why Use Mojo', link: '/general/why_use_mojo' },
                    { text: 'Chis Lattner Answers', link: '/general/chris_answers' },
                ],
            },
        },
    })

})
