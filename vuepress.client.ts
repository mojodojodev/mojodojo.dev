import { defineClientConfig } from '@vuepress/client'
import BlogPosts from './components/BlogPosts.vue';
import ThisWeek from './components/ThisWeek.vue';

export default defineClientConfig({
    // TODO: Take these out a future date, just to keep links live for twitter and discord posts
    enhance({ router, app }) {
        router.addRoute({
            path: "/general/mojo_team_answers",
            redirect: "/mojo_team_answers",
        })
        router.addRoute({
            path: "/general/mojo_team_answers.html",
            redirect: "/mojo_team_answers",
        })
        router.addRoute({
            path: "/tutorial/mojo_playground_vscode",
            redirect: "/tutorials",
        })
        router.addRoute({
            path: "/tutorial/mojo_playground_vscode.html",
            redirect: "/tutorials",
        })
        router.addRoute({
            path: "/general/mojo_team_answers",
            redirect: "/blog",
        })
        router.addRoute({
            path: "/general/mojo_team_answers.html",
            redirect: "/blog",
        })
        app.component('BlogPosts', BlogPosts)
        app.component('ThisWeek', ThisWeek)
    },
    setup() { },
    rootComponents: [],
})
