
# 1. index/ add
## install

```cmd
C:\path\crypto-app>npm install -y
{
  "name": "crypto-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}

```

```cmd
C:\path\crypto-app>npm install electron --save-dev --save-exact
```

2. package.json

```js
{
  "name": "crypto-app",
  "version": "1.0.0",
  "description": "",
  "main": "main.js", // 
  "scripts": {
    "start": "electron ." // npm start --> execute electron .
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "electron": "7.1.2"
  }
}
```

## index

1. index.html
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Hello World!</title>
    <!-- https://electronjs.org/docs/tutorial/security#csp-meta-tag -->
    <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';" />
    <link rel="stylesheet" href="../assets/css/main.css">
  </head>
  <body>
    <div class="row">
      <div id="price-container">
        <p class="subtext">
          Current BTC USD
        </p>
        <h1 id="price">Loading...</h1>
      </div>
      <div id="goal-container">
        <p><img src="../assets/images/up.svg"><span id="targetPrice">Choose a Target Price</span></p>
      </div>
      <div id="right-container">
        <button id="notifyBtn">Notify me when..</button>
      </div>
    </div>
    <script src="index.js"></script>
  </body>
</html>
```

2. index.js
```js
const electron = require("electron");
const path = require("path");
const BrowserWindow = electron.remote.BrowserWindow;

const notifyBtn = document.getElementById("notifyBtn");

notifyBtn.addEventListener("click", function(event) {
  const modalPath = path.join(__dirname, "add.html");
  let win = new BrowserWindow({
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    width: 400,
    height: 200,
    webPreferences: {
      nodeIntegration: true
    }
  });

  //   win.webContents.openDevTools();
  win.on("close", function() {
    win = null;
  });

  win.loadFile(modalPath);
  win.show();
});

```

## add

1. add.html
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Hello World!</title>
    <!-- https://electronjs.org/docs/tutorial/security#csp-meta-tag -->
    <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';" />
    <link rel="stylesheet" href="../assets/css/main.css">
    <link rel="stylesheet" href="../assets/css/add.css">
  </head>
  <body>
    <p class="notify">Notify when BTC reaches..</p>
    <div class="row2">
        <div>
            <input type="text" id="notifyVal" placeholder='USD'>
            <button id="updateBtn">Update</button>
        </div>
    </div>
    <a id="closeBtn">Close Window</a>
    <script src="add.js"></script>
  </body>
</html>
```
2. add.js
```js
const electron = require("electron");
const path = require("path");
const remote = electron.remote;

const closeBtn = document.getElementById("closeBtn");

closeBtn.addEventListener("click", function(event) {
  var window = remote.getCurrentWindow();
  window.close();
});

```

# axios

## install
```
npm install axios --save
```

## index (get btc data)

1. index.js
```js

function getBTC() {
  axios
    .get(
      "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD&api_key=f0b0fdf22a91fa8a97a615e459ba98e16cb90ca71b612f12c8c499b4cc6fb4e3"
    )
    .then(res => {
      const cryptos = res.data.USD;
      price.innerHTML = "$" + cryptos.toLocaleString("en");
    });
}
getBTC();
setInterval(getBTC, 30000);
```


# notification

## installation

```
npm install --save node-notifier
```

## javascript
1. index.js

```js

const notification = {
  title: "BTC Alert",
  body: "BTC just beat your target price!",
  icon: path.join( __dirname, "../assets/images/btc.png")
};

function getBTC() {
  axios
    .get(
      "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD&api_key=f0b0fdf22a91fa8a97a615e459ba98e16cb90ca71b612f12c8c499b4cc6fb4e3"
    )
    .then(res => {
      const cryptos = res.data.USD;
      price.innerHTML = "$" + cryptos.toLocaleString("en");

      if (targetPrice.innerHTML != "" && targetPriceVal < cryptos) {
        console.log(notification.icon);
        notifier.notify(
          {
            // appName: appId,
            title: notification.title,
            message: notification.body,
            icon: notification.icon,
            sound: true, // Only Notification Center or Windows Toasters
            wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait
          },
          function(err, response) {
            // Response is response from notification
          }
        );

      }
    });
}
```


# deploy 

## install/ setting

1. command
```cmd
npm install electron-packager --save-dev
```

1. shortcut(package.json) https://www.christianengvall.se/electron-packager-tutorial/
```js
{
  "name": "crypto-app",
  "version": "1.0.0",
  "description": "",
  "main": "main.js",
  "postinstall": "electron-builder install-app-deps",
  "scripts": {
    "start": "electron .",
    "package-mac": "electron-packager . --overwrite --platform=darwin --arch=x64 --icon=assets/icons/mac/icon.icns --prune=true --out=release-builds",
    "package-win": "electron-packager . electron-tutorial-app --overwrite --asar=true --platform=win32 --arch=ia32 --icon=assets/icons/win/icon.ico --prune=true --out=release-builds --version-string.CompanyName=CE --version-string.FileDescription=CE --version-string.ProductName=\"Electron Tutorial App\"",
    "package-linux": "electron-packager . electron-tutorial-app --overwrite --asar=true --platform=linux --arch=x64 --icon=assets/icons/png/1024x1024.png --prune=true --out=release-builds"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "electron": "7.1.2",
    "electron-package": "^0.1.0",
  },
  "dependencies": {
    "axios": "^0.19.0",
    "node-notifier": "^6.0.0"
  }
}
```
3. Electron Tutorial --> Crypto App

```js
"package-win": "electron-packager . electron-tutorial-app --overwrite --asar=true --platform=win32 --arch=ia32 --icon=assets/icons/win/icon.ico --prune=true --out=release-builds --version-string.CompanyName=CE --version-string.FileDescription=CE --version-string.ProductName=\"Crypto App\"",
```
4. install image to the path
   - assets
     - icons
         - wins
           - icon.ico

## execute

- windows

```
npm run package-win
```

- directory

```
- assets
- dist
- node_modules
- release-builds
  - crypto-app-win32-ia32 
    - crypto-app.exe  <-- 실행 파일
- src
...
```