// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import firebase from "firebase/app";
import "firebase/auth";
import { attachCustomCommands } from "cypress-firebase";
const fbConfig = {
  apiKey: "AIzaSyAkp9Xj0ckAT1l7yLPp1CU5812g_Y8ebYI",
  authDomain: "graphite-88e41.firebaseapp.com",
  databaseURL: "https://graphite-88e41.firebaseio.com",
  projectId: "graphite-88e41",
  storageBucket: "graphite-88e41.appspot.com",
  messagingSenderId: "158148550453",
  appId: "1:158148550453:web:ea17a3b23534164945f67c",
  measurementId: "G-RX8D5M6ZGJ"
};

firebase.initializeApp(fbConfig);

attachCustomCommands({ Cypress, cy, firebase });