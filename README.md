# reer
A cli api testing tool written in typescript


- [Installation](#installation)
- [Usage](#usage)
  - [Quick Start](#quick-start)
  - [Options and Arguments](#options-and-arguments)
  - [Configuration](#configuration)
    - [App Configuration](#app-configuration)
    - [Route Configuration](#route-configuration)
    - [Project Configuration](#project-configuration)
  - [Commands](#commands)

## Installation
```sh
npm install -g @maxdahl/reer
```
If you get an EACCESS error on Mac/Linux try running the command with sudo

## Usage
### Quick Start
  Everything in reer works with json files. You write your route definitions in them and load them through the cli.
  Switch to a directory where you want to initialize reer and run
  ```sh
  reer init
  ```
  This will create the following directory structure:
  ```
  root
  ├── .reer
  │   ├── reer.json 
  │   ├── config
  │   │   ├── user.json
  │   ├── routes
  │   ├── store
  ```
  We will refer to .reer as the  ReerDir from now on.
  [Create your route definitions](#route-configuration) in the routes directory and launch reer.
  You can now run each route in the cli by typing ```<fileName>/<routeName>```

  For example to launch a route named login from the file auth.json you simply type ```auth/login```

  You can also pass one or more route specification(s) as argument to reer when starting it. E. g. 
  ```sh
  reer auth/login
  ```

### Options and Arguments
reer provides you some cli options to specify where it runs:

| option                | description                                                                                   | default                            |
|-----------------------|-----------------------------------------------------------------------------------------------|------------------------------------|
| -p,<br /> --path      | Your working directory. reer will look for the ReerDir inside (specified with -d) here        | The directory you are currently in |
| -d,<br /> --directory | Specifies the ReerDir which contains the reer and route config. Needs to be inside --path     | .reer                              |
| -c,<br /> --config    | The name of the reer config file. Must be inside --directory and must be a json file          | reer.json                          |

You can also run every command and route by passing it as an argument to reer.
Examples:
```sh
reer auth/login // runs the route named "login" in file "auth.json"
reer get http://example.com // make a get request to example.com and prints the result
```

### Configuration
#### App Configuration
reer reads its initial configuration from a json file in your ReerDir.
The following configuration options are available:
```json
{
  "locations": {
    "projectConfig": "config/project.json",
    "cookies": "store/.cookies",
    "history": "store/.history",
    "routes": "routes"
  },
  "baseUrl": ""
}
```
|option                   | description                                                                             | default                    |
|-------------------------|-----------------------------------------------------------------------------------------|----------------------------|
| locations               | an object containing various file locations. all locations are relative to your ReerDir |                            |
| locations.projectConfig | location of your project config file                                                    | config/user.json           |
| locations.cookies       | file in which cookies will be saved                                                     | store/.cookies             |
| locations.history       | file to save the command history in                                                     | store/.history             |
| locations.routes        | directory containing your route definitions                                             | routes                     | 
| baseUrl                 | Base URL for all your requests. Allows you to define relative URLs                      |                            |
 
#### Route Configuration 
Routes are defined in json files in your routes directory. A file can contain multiple routes, which are referred to by their key name. 
A full route definition looks like this:
```json
{
  "login": {
    "name": "myLoginRoute",
    "method": "post",
    "url": "http://localhost:3000/login",
    "type": "json",
    "headers": {
      "Custom-Header": "Custom Header Value"
    },
    "cookies": {
      "custom-cookie": "foobar"
    },
    "data": {
      "username": "username",
      "password": "password"
    },
    "before": [
      "set variable value",
      "set variable 2 \"Some other value\""
    ],
    "after": "set token res.body.token"
  },
}
```
The minimum required configuration is a url for get requests and a url and data for post requests (post/put/patch/delete). 
Assumed the name of the file is auth.json, we would run the route by running auth/json in the cli or passing it as argument.

##### Route Options
###### name
You can give your route a custom name. This will be used later when you select previous requests via commands. 
If you don't provide a name, reer takes the route key ("login") as name.

###### method
The HTTP method. If you don't provide a value, "GET" is assumed.

###### url
The request URL.

###### type
The request content type. You can find a full list of content types here: https://www.iana.org/assignments/media-types/media-types.xhtml

Reer also provides some shortcuts:
- json => application/json
- text => text/plain
- ... more to come

Default value is "json".

###### headers
A key-value pair of custom headers

###### cookies
A key-value pair of custom cookies

###### data
The data to send in the request body. Will not be send on get requests. 
The format has to match the provided type property. If you for example specify type json, your data has to be a valid json object.

###### before/after
Actions to run before/after the request is made. You can use all available commands or run additional requests (either with get/post/put/delete command or specify the file/request name like auth/login).
You can provide an array to execute multiple commands/requests

#### Project Configuration
The project configuration is used for storing project wide variables. You can access them anywhere in your project except the main reer config file (because it needs to be parsed in order to find the project config file)
Variables are stored as a json object and can be nested indefinitely.

To read a variable simply put them in double curly brackets ```{{VARNAME}}```
To read nested variables seperate them with a dot ```{{NESTED.VALUE}}```

##### Example:
###### Config File
```json
{
  "host": "http://localhost",
  "credentials": {
    "username": "myusername",
    "password": "mypassword"
  }
}
```
##### Route Config
```json
{
  "login": {
    "method": "post",
    "url": "{{host}}/login",
    "data": {
      "username": "{{credentials.username}}",
      "password": "{{credentials.password}}"
    }
  }
}
```

Now {{crednetials.username}} and {{credentials.password}} will be resolved to "myusername" and "mypassword". 
Also the {{host}} variable will be resolved to "http://localhost". We could also specify the baseUrl config param in the main reer config file (reer.json) and only provide "login" as url

### Commands
[WIP]
