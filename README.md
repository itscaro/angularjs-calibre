# Calibre browser with AngularJS & NodeJS
Fully based on Javascript for client and server sides.

## Installation

```
  npm install
```

## Configuration

You need to create a configuration file named *config.json* in the root directory of the application. You can find there 
an example file named *config.dist.json*

# Get running

## Start the application
With node
```
  node index.js
```

With forever
```
  forever index.js
```

## Nginx as Proxy

```
server {
       location /angular-calibre/ {
               proxy_pass http://127.0.0.1:8099/;
       }
}
```
