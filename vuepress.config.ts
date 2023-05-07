import { defaultTheme } from 'vuepress'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
    lang: 'en-US',
    title: 'Mojo Dojo',
    description: 'Learning Resources for 🔥',
    theme: defaultTheme({
        logo: '/hero.png',
        repo: 'mojodojodev/mojodojo.github.dev',
        repoLabel: 'GitHub',
        docsRepo: 'mojodojodev/mojodojo.github.dev',
        docsBranch: 'main',
        lastUpdated: false,
        locales: {
            '/': {
                selectLanguageName: 'English',
                editLinkText: 'Edit this page on GitHub',
                navbar: [
                    { text: 'Chis Latter FAQ', link: '/general/chris_faqs' },
                ],
            },
        },
    })

})
