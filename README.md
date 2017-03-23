# Calibre browser with AngularJS & NodeJS
Fully based on Javascript for client and server sides.

## Installation

### Build for node
```
  npm install
```

### Build for electron
```
aspm install --target 0.35.0 --arch x64
```

## Configuration

You need to create a configuration file named *config.json* in the directory *src*.

The configuration for server.host and server.port can be overriden by environment variable *host* and *port*.
If there is no environment variable or no entry in configuration file, the host will be 127.0.0.1 and the port will be random

# Get running

## Start the application
With node
```
  npm start
```

With PM2
```
  pm2 start src/pm2.yaml
```

With electron
```
  npm run electron
```

## Nginx as Proxy
```
server {
       location /angular-calibre/ {
               proxy_pass http://127.0.0.1:8099/;
       }
}
```

## Traefik as Proxy
```
[backends]
  [backends.angularjscalibre]
    [backends.angularjscalibre.circuitbreaker]
      expression = "NetworkErrorRatio() > 0.5"
    [backends.angularjscalibre.servers.server1]
    url = "http://127.0.0.1:8099"
    weight = 10

[frontends]
  [frontends.angularjscalibre]
  backend = "angularjscalibre"
    [frontends.angularjscalibre.routes.host]
    rule = "Host:angularjscalibre.fr.itscaro.me"
```
