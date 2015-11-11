# Calibre browser with AngularJS & NodeJS
Fully based on Javascript for client and server sides.

## Installation

```
  npm install
```

## Configuration

You need to create a configuration file named *config.json* in the directory *src*.

The configuration for server.host and server.port can be overriden by environment variable *host* and *port*.
If there is no environment variable or no entry in configuration file, the host will be 127.0.0.1 and the port will be random

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

### Build for node
nom install

### Build for electron
aspm install --target 0.34.0 --arch x64