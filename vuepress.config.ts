import { defaultTheme } from 'vuepress'
import { defineUserConfig } from 'vuepress'
import { docsearchPlugin } from '@vuepress/plugin-docsearch';


export default defineUserConfig({
    lang: 'en-US',
    title: 'Mojo Dojo',
    description: 'Learning Resources for Mojo 🔥',
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
                    { text: 'Mojo Team Answers', link: '/general/mojo_team_answers' },
                    { text: 'Mojo Playground VS Code', link: '/tutorial/mojo_playground_vscode' },
                ],
            },
        },
    }),
    plugins: [
        docsearchPlugin({
            appId: 'WHF26ZE58I',
            indexName: 'mojodojo',
            apiKey: 'd0eba3511025ee492b32890fdd60cdf3',
        }),
    ]
})
