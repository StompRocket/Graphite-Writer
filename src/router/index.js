import Vue from "vue";
import Router from "vue-router";
import home from "@/components/home";
import about from "@/components/about";
import documents from "@/components/documents";
import editor from "@/components/editor";
import login from "@/components/login";
import fourOhFour from "@/components/fourOhFour";
import shareRedirect from "@/components/shareRedirect";
import firebase from "firebase";
Vue.use(Router);

let router = new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: home
    },
    {
      path: "/about",
      name: "about",
      component: about
    },
    {
      path: "/documents",
      name: "documents",
      component: documents,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/d/:user/:document",
      name: "editor",
      component: editor,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/login",
      name: "login",
      component: login,
      props: {
        redirect: false
      }
    },
    {
      path: "/d/",
      redirect: "/documents"
    },
    {
      path: "/s/:user/:document",
      name: "shareRedirect",
      component: shareRedirect,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/404",
      name: "fourOhFour",
      component: fourOhFour
    },
    {
      path: "*",
      redirect: "/404"
    }
  ]
});
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const currentUser = firebase.auth().currentUser;
  // console.log(`requiresAuth: ${requiresAuth} user: ${currentUser}`);
  if (requiresAuth && !currentUser) {
    //console.log(to.path);
    localStorage.setItem("redirect", to.path);
    next({
      name: "login",
      props: {
        redirect: to.path
      }
    });
  } else if (requiresAuth && currentUser) {
    next();
  } else {
    next();
  }
});
export default router;
