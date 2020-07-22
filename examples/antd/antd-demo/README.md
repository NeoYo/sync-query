# sync-query demo of Antd

^_^ This is demo of using sync-query in antd-design.

There is only three lines of code in src/App.js

```js
import { syncQueryHOC } from "sync-query";
//...
const MyComponentEnhance = syncQueryHOC(MyComponent, ['searchInput', 'pagination'], 'fetch');
//...
<MyComponentEnhance></MyComponentEnhance>
//...
```

Once we did this, there are powerful features below.

## Feature

- auto synchronize react state to url query (URLSearchParam)
- auto call 'fetch' if react state is detected change.
- auto init react react state from url query (URLSearchParam)

For more about the gif demo, [click here]().

--------

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000/#?](http://localhost:3000/#?) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
