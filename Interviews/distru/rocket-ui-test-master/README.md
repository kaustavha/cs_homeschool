This repo contains a small UI project written in React. Unfortunately it has many errors and 
outmoded coding practices, particularly in Launches.jsx, the components and the actions. The Layout, routing,
stores and services are more up to date, so don't waste too much of your time on them (although
feel free to give feedback or make fixes if you think significant improvements are possible and you want to take 
the time — but they're not necessarily intended to be in scope of the challenge.)

The repo is designed to be simple to start and run with just npm and any recent version of node.
It is built on webpack and uses the webpack development server, so all you should need to do is clone the
repo and start the app in development mode with npm start and view it on port 7357. All the tools 
for writing code should be included, but feel free to add additional dependencies if you find that
helps you.

 While the code is intentionally a little dirty around the edges in the hopes you will show us how you would 
 clean it up, you should be able to follow the general react/redux and REST pattern for loading data and 
 outputting UI elements.

The app pulls data about launches from the public SpaceX api. 

**Your task**

- Add a feature where clicking on any given launch will expand that launch and reveal more info about the rocket used in the launch
- Clicking on another launch will another other launch open and expand the one clicked instead
- If a launch is already open and being viewed, clicking on it again will shrink it

Feel free to add files, breakup components or modularize and generally clean up code (Pleaese be weary of time! First get it working).
Place more emphasis on usability than graphic design, code with the assumption that colors, borders and margins might change
according to forthcoming design requirements and your job is to get the feature working in a well structured way.

The development challenge is build against the space-x public REST API `https://documenter.getpostman.com/view/2025350/RWaEzAiG`
You should be able to easily find the information there make the call and extract the data needed.

Good Luck.

### What were using

* React 16 (includes Hooks should you want to use them)
* Webpack 4
* React Router 4
* SASS
* Babel Cli
* Hot Module Reloading
* Jest 21 
* Enzyme 3 for testing (should you have time to implement tests)

### Features

* Simple src/index.jsx and src/index.css (local module css).
* Webpack configuration for development (with hot reloading) and production (with minification).
* Both js(x) and css hot loaded during development.
* [Webpack Dashboard Plugin](https://github.com/FormidableLabs/webpack-dashboard) on dev server.

### To run

* You'll need to have [git](https://git-scm.com/) and [node](https://nodejs.org/en/) installed in your system.
* Fork and clone the project:

```
git clone https://github.com/seamusmalone/ui-test-base
```

* Then install the dependencies:

```
npm install
```

* Run development server:

```
npm start
```

* Or you can run development server with [webpack-dashboard](https://github.com/FormidableLabs/webpack-dashboard):

```
npm run dev
```

Open the web browser to `http://localhost:7357/`


### To test
To run unit tests:

```
npm test
```

Tests come bundled with:

* Jest
* Enzyme
* React Test Utils
* React Test Renderer
