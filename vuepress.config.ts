import { defaultTheme, defineUserConfig } from 'vuepress'
import { docsearchPlugin } from '@vuepress/plugin-docsearch';
import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics'
import { feedPlugin } from 'vuepress-plugin-feed2';
import { shikiPlugin } from '@vuepress/plugin-shiki'
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
    pagePatterns: ['**/*.md', '!**/README.md', '!.vuepress', '!node_modules'],
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
                                text: 'Pointers',
                                collapsible: true,
                                children: [
                                    '/guides/modules/Pointer/DTypePointer.md',
                                    '/guides/modules/Pointer/Pointer.md',
                                ]
                            },
                            {
                                text: 'Assert',
                                collapsible: true,
                                children: [
                                    '/guides/modules/Assert/assert_param.md',
                                    '/guides/modules/Assert/assert_param_msg.md',
                                    '/guides/modules/Assert/debug_assert.md',
                                ]
                            },
                            {
                                text: 'TargetInfo',
                                collapsible: true,
                                children: ['/guides/modules/TargetInfo/os_is_linux.md'],
                            },
                            {
                                text: "General",
                                collapsible: true,
                                children: [
                                    '/guides/general/mojo_playground_vscode.md',
                                ]
                            }
                        ],
                    },
                    '/mojo_team_answers',
                    '/this_week_in_mojo/',
                    '/blog/',
                ]
            }
        }
    }),
    plugins: [
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
