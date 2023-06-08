import { defaultTheme, defineUserConfig } from 'vuepress'
import { docsearchPlugin } from '@vuepress/plugin-docsearch';
import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics'
import { feedPlugin } from 'vuepress-plugin-feed2';
import { shikiPlugin } from '@vuepress/plugin-shiki'
import { gitPlugin } from '@vuepress/plugin-git'
import { readFileSync } from "fs"



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
                    { text: 'Mojo Team Answers', link: '/mojo_team_answers' },
                    { text: 'This Week in Mojo', link: '/this_week_in_mojo/' },
                    { text: 'Blog', link: '/blog/' },
                    { text: 'Is Mojo for Me?', link: '/is_mojo_for_me' },
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
                                    '/guides/general/mojo_playground_vscode.md',
                                ]
                            },
                            {
                                text: 'Modules',
                                collapsible: true,
                                children: [
                                    {
                                        text: 'Pointer',
                                        collapsible: true,
                                        children: [
                                            '/guides/modules/Pointer/DTypePointer.md',
                                            '/guides/modules/Pointer/Pointer.md',
                                        ]
                                    },
                                    {
                                        text: 'Buffer',
                                        collapsible: true,
                                        children: [
                                            '/guides/modules/Buffer/Buffer.md',
                                        ]
                                    },
                                    '/guides/modules/Assert.md',
                                    '/guides/modules/Benchmark.md',
                                    '/guides/modules/Random.md',
                                    '/guides/modules/String.md',
                                    '/guides/modules/TargetInfo.md',
                                    '/guides/modules/Time.md',
                                    '/guides/modules/Sort.md',
                                ]
                            }
                        ],
                    },
                    "/mojo_team_answers.md",
                    {
                        text: 'This Week in Mojo',
                        link: '/this_week_in_mojo/',
                        collapsible: true,
                        children: [
                            '/this_week_in_mojo/2023-06-09.md',
                            '/this_week_in_mojo/2023-06-02.md',
                            '/this_week_in_mojo/2023-05-26.md',
                            '/this_week_in_mojo/2023-05-19.md',
                            '/this_week_in_mojo/2023-05-12.md',
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
                    "/is_mojo_for_me.md",
                ],
            }
        }
    }),
    plugins: [
        gitPlugin({
            contributors: false
        }),
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
