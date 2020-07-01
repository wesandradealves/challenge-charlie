import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'

const Home = resolve => require(["@/views/Home/Home.vue"], resolve);
const PageNotFound = resolve =>
  require(["@/views/PageNotFound/PageNotFound.vue"], resolve);

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  linkActiveClass: "current",
  routes: [
    {
      path: "*",
      name: "PageNotFound",
      component: PageNotFound,
      meta: {
        slug: "page-not-found",
        title: "Weather | 404"
      }
    },
    {
      path: "/",
      name: "Home",
      component: Home,
      meta: {
        slug: "home",
        title: "Weather"
      },
      props: true
    }
  ]
});

router.beforeResolve((to, from, next) => {
  NProgress.start()

  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.title);

  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.metaTags);

  if (nearestWithTitle) document.title = nearestWithTitle.meta.title;
  Array.from(document.querySelectorAll("[data-vue-router-controlled]")).map(
    el => el.parentNode.removeChild(el)
  );

  if (!nearestWithMeta) return next();
  nearestWithMeta.meta.metaTags
    .map(tagDef => {
      const tag = document.createElement("meta");

      Object.keys(tagDef).forEach(key => {
        tag.setAttribute(key, tagDef[key]);
      });
      tag.setAttribute("data-vue-router-controlled", "");
      return tag;
    })
    .forEach(tag => document.head.appendChild(tag));

    next();
});

router.afterEach((to, from) => {
  window.scrollTo( 0, 0 )
  NProgress.done()
})

export default router;