import { defineClientConfig } from '@vuepress/client'
import BlogPosts from './components/BlogPosts.vue';
import ThisWeek from './components/ThisWeek.vue';

export default defineClientConfig({
    // TODO: Take these out a future date, just to keep links live for twitter and discord posts
    enhance({ router, app }) {
        router.addRoute({
            path: "/mojo_team_answers",
            redirect: "/mojo-team-answers",
        })
        router.addRoute({
            path: "/mojo_team_answers.html",
            redirect: "/mojo-team-answers",
        })
        router.addRoute({
            path: "/general/mojo_team_answers.",
            redirect: "/mojo-team-answers",
        })
        router.addRoute({
            path: "/general/mojo_team_answers.html",
            redirect: "/mojo-team-answers",
        })
        router.addRoute({
            path: "/mojo_playground_vscode",
            redirect: "/guides/general/mojo-playground-vscode.html",
        })
        router.addRoute({
            path: "/mojo_playground_vscode",
            redirect: "/guides/general/mojo-playground-vscode",
        })
        router.addRoute({
            path: "/tutorial/mojo_playground_vscode",
            redirect: "/guides/general/mojo-playground-vscode.html",
        })
        router.addRoute({
            path: "/tutorial/mojo_playground_vscode.html",
            redirect: "/guides/general/mojo-playground-vscode.html",
        })
        router.addRoute({
            path: "/guides/general/mojo_playground_vscode.html",
            redirect: "/guides/general/mojo-playground-vscode.html",
        })
        router.addRoute({
            path: "/general/mojo_team_answers",
            redirect: "/mojo-team-answers.html",
        })
        router.addRoute({
            path: "/general/mojo_team_answers.html",
            redirect: "/mojo-team-answers.html",
        })
        router.addRoute({
            path: "/mojo_team_answers",
            redirect: "/mojo-team-answers.html",
        })
        router.addRoute({
            path: "/mojo_team_answers.html",
            redirect: "/mojo-team-answers.html",
        })
        router.addRoute({
            path: "/is_mojo_for_me",
            redirect: "/is-mojo-for-me.html",
        })
        router.addRoute({
            path: "/is_mojo_for_me.html",
            redirect: "/is-mojo-for-me.html",
        })
        router.addRoute({
            path: "/blog.html",
            redirect: "/blog/2023-05-22-mojo-first-impressions.html",
        })
        router.addRoute({
            path: "/this_week_in_mojo.html",
            redirect: "/this-week-in-mojo/",
        })
        router.addRoute({
            path: "/this_week_in_mojo",
            redirect: "/this-week-in-mojo/",
        })
        router.addRoute({
            path: "/this_week_in_mojo/2023-06-09.html",
            redirect: "/this-week-in-mojo/2023-06-09.html",
        })

        app.component('BlogPosts', BlogPosts)
        app.component('ThisWeek', ThisWeek)
    },
    setup() { },
    rootComponents: [],
})
