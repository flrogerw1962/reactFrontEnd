# Photo & Go

### DevTools
In development, `Ctrl + H` show/hide the Redux DevTools and `Ctrl + W` changes its position on the screen, by default is hide.

### Code linting
- Run `$ npm run lint` to lint the source code against Airbnb code style.

### Running Tests
- Run `$ npm test` to run the test suite once.
- Run `$ npm run test:watch` to run the test suite on every file update.

### Running Code Coverage
- Run `$ npm run coverage` to run the test and generates the report under the path /coverage.

Some of the tests are now failing and I don't have time to fully understand the test framework. I can see that when users is being tested, cart code is also being executed.  Filtering tests in categories fail and yet I have verified the methods work fine.

## Technology
This project uses the following technologies:
- React + Redux
- Routing: react-router-redux
- Tooling: webpack, babel, eslint, karma, hot loading
- Testing: karma, mocha, expect, enzyme

## Browser Support

__Evergreen Browsers__   
The latest versions of Chrome, Firefox, Internet Explorer (10+), Microsoft Edge, and Safari are evergreen browsers, i.e. they automatically update themselves silently without prompting the user.

__Mobile Browsers__

- iOS version 8 and above: Safari, Chrome (most recent version)
- Chrome for Android (most recent version)

Read [browser-support.md](browser-support.md) for details

## Deployment

When pushing to Heroku, Heroku sets `NODE_ENV` to 'production', then runs `npm install` and `npm start`. The `build` script is ran via the `preinstall` npm hook, and webpack builds the app with production settings. Once the Heroku app is set up and git remote address is linked, nothing more than `git push heroku master` is required.

#### Manual deployment

Heroku setup instructions:

 - Login / Create an account on heroku.com.
 - Install the [heroku toolbelt](https://toolbelt.heroku.com/) to utilize the CLI tool.

Once installed,

 - login via the terminal: $ heroku login
 - Point to the heroku remote (from within the project root directory): heroku git:remote -a <your-project-name>
 - git push heroku master

That's it! On deploy, Heroku automatically sets the NODE_ENV to 'production', and our webpack configs do the rest. A brief summary of how that works is listed in the README. If you want to trace the logic fork between development and production environments, start with the `server.js` file.

__On Windows__, it is best to run the heroku stuff in powershell or cmd.exe; there's a problem with cygwin https://github.com/heroku/cli/issues/84

If deploying to a CDN, etc. you may choose to use the `build` script to bundle the app, then serve the
contents of the `dist` directory.
