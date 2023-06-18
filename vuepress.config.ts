import { defaultTheme, defineUserConfig } from 'vuepress'
import { docsearchPlugin } from '@vuepress/plugin-docsearch';
import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics'
import { feedPlugin } from 'vuepress-plugin-feed2';
import { shikiPlugin } from '@vuepress/plugin-shiki'
import { gitPlugin } from '@vuepress/plugin-git'
import { readFileSync } from "fs"
import codeCopyPlugin from '@snippetors/vuepress-plugin-code-copy'




const compareDate = (dateA, dateB) => {
    if (!dateA || !(dateA instanceof Date)) return 1;
    if (!dateB || !(dateB instanceof Date)) return -1;

    return dateB.getTime() - dateA.getTime();
};

const mojoGrammar = JSON.parse(readFileSync("./syntax/mojo.tmLanguage.json").toString())


export default defineUserConfig({
    lang: 'en-US',
    title: 'Mojo Dojo',
    description: 'Learning Resources for Mojo 🔥',
    pagePatterns: ['**/*.md', '!**/README.md', '!.vuepress', '!node_modules', '!wip'],
    markdown: {
        code: {
            lineNumbers: false
        }
    },
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
                    { text: 'Guides', link: '/guides/' },
                    { text: 'Mojo Team Answers', link: '/mojo-team-answers' },
                    { text: 'This Week in Mojo', link: '/this-week-in-mojo/' },
                    { text: 'Blog', link: '/blog/' },
                    { text: 'Is Mojo for Me?', link: '/is-mojo-for-me' },
                ],
                sidebar: [
                    {
                        text: 'Guides',
                        link: '/guides/',
                        collapsible: true,
                        children: [
                            {
                                text: "General",
                                collapsible: true,
                                children: [
                                    '/guides/general/mojo-playground-vscode.md',
                                ]
                            },
                            {
                                text: 'Modules',
                                collapsible: true,
                                children: [
                                    '/guides/modules/Assert.md',
                                    '/guides/modules/Benchmark.md',
                                    {
                                        text: 'Buffer',
                                        collapsible: true,
                                        children: [
                                            '/guides/modules/Buffer/Buffer.md',
                                            '/guides/modules/Buffer/NDBuffer.md',
                                        ]
                                    },
                                    {
                                        text: 'Pointer',
                                        collapsible: true,
                                        children: [
                                            '/guides/modules/Pointer/DTypePointer.md',
                                            '/guides/modules/Pointer/Pointer.md',
                                        ]
                                    },
                                    '/guides/modules/Random.md',
                                    '/guides/modules/Sort.md',
                                    '/guides/modules/String.md',
                                    '/guides/modules/TargetInfo.md',
                                    '/guides/modules/Time.md',
                                    {
                                        text: 'Vector',
                                        collapsible: true,
                                        children: [
                                            '/guides/modules/Vector/DynamicVector.md',
                                            '/guides/modules/Vector/InlinedFixedVector.md',
                                            '/guides/modules/Vector/UnsafeFixedVector.md',
                                        ]
                                    },
                                ]
                            },
                            {
                                text: 'Builtins',
                                collapsible: true,
                                children: [
                                    '/guides/modules/builtins/Bool.md',
                                    '/guides/modules/builtins/FloatLiteral.md',
                                    '/guides/modules/builtins/ListLiteral.md'
                                ]
                            },
                            {
                                text: "Intro to Mojo",
                                collapsible: true,
                                children: [
                                    '/guides/intro-to-mojo/setup.md',
                                    '/guides/intro-to-mojo/basic-types.md',
                                ]
                            },
                        ],
                    },
                    "/mojo-team-answers.md",
                    {
                        text: 'This Week in Mojo',
                        link: '/this-week-in-mojo/',
                        collapsible: true,
                        children: [
                            '/this-week-in-mojo/2023-06-23.md',
                            '/this-week-in-mojo/2023-06-16.md',
                            '/this-week-in-mojo/2023-06-09.md',
                            '/this-week-in-mojo/2023-06-02.md',
                            '/this-week-in-mojo/2023-05-26.md',
                            '/this-week-in-mojo/2023-05-19.md',
                            '/this-week-in-mojo/2023-05-12.md',
                        ]
                    },
                    {
                        text: 'Blog',
                        link: '/blog/',
                        collapsible: true,
                        children: [
                            '/blog/2023-05-22-mojo-first-impressions.md',
                            '/blog/2023-05-08-why-use-mojo.md',
                        ]
                    },
                    "/is-mojo-for-me.md",
                ],
            }
        }
    }),
    plugins: [
        gitPlugin({
            contributors: false
        }),
        codeCopyPlugin(),
        docsearchPlugin({
            appId: 'WHF26ZE58I',
            indexName: 'mojodojo',
            apiKey: 'd0eba3511025ee492b32890fdd60cdf3',
        }),
        googleAnalyticsPlugin({
            id: 'G-8B385M142M',
        }),
        shikiPlugin({
            langs: [
                {
                    id: "mojo",
                    scopeName: 'source.mojo',
                    grammar: mojoGrammar,
                    aliases: ["Mojo"],
                },
                {
                    id: "python",
                    scopeName: 'source.python',
                    path: "./languages/python.tmLanguage.json",
                    aliases: ["Python"]
                },
                {
                    id: "output",
                    scopeName: 'source.python',
                    path: "./languages/python.tmLanguage.json",
                    aliases: ["Output"]
                },
                {
                    id: "shell",
                    scopeName: 'source.shell',
                    path: "./languages/shellscript.tmLanguage.json",
                    aliases: ["bash", "Bash"]
                },
            ],
            theme: 'material-theme',
        }),
        feedPlugin({
            rss: true,
            json: true,
            atom: true,
            count: 30,

            hostname: 'https://www.mojodojo.dev',
            filter: ({ frontmatter }) => {
                return (
                    frontmatter.feed === true
                );
            },
            sorter: (a, b) => {
                return compareDate(
                    a.data.git?.createdTime
                        ? new Date(a.data.git?.createdTime)
                        : a.frontmatter.date,
                    b.data.git?.createdTime
                        ? new Date(b.data.git?.createdTime)
                        : b.frontmatter.date
                );
            },
        }),

    ],
    onPrepared: async (app) => {
        await app.writeTemp(
            'pages.js',
            `export default ${JSON.stringify(app.pages.map(({ data }) => data))}`
        );
    },
});
