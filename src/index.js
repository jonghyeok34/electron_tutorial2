const electron = require("electron");
const path = require("path");
const notifier = require("node-notifier");
const BrowserWindow = electron.remote.BrowserWindow;
const axios = require("axios");
const ipc = electron.ipcRenderer;

const notifyBtn = document.getElementById("notifyBtn");
var price = document.querySelector("h1");
var targetPrice = document.getElementById("targetPrice");
var targetPriceVal;
const appId = "com.electronapp.id";

const nativeImage = require("electron").nativeImage;
const notification = {
  title: "BTC Alert",
  body: "BTC just beat your target price!",
  icon: path.join(__dirname, "../assets/images/btc.png")
};
const isDev = require("electron-is-dev");

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

        if (isDev) {
          console.log("Running in development");
        } else {
          console.log("Running in production");
        }

        notifier.notify(
          {
            // appName: appId,
            title: notification.title,
            message: notification.body,
            icon: path.join(__dirname, "../assets/images/btc.png"),
            sound: true, // Only Notification Center or Windows Toasters
            wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait
          },
          function(err, response) {
            // Response is response from notification
          }
        );

        /* notification does not work in win10 */
        // var myNotification = new window.Notification(notification.title, {
        //   body: notification.body,
        //   icon: notification.icon
        // });
        // myNotification.onclick = () => {
        //   console.log("Notification clicked");
        // };
      }
    });
}
getBTC();
setInterval(getBTC, 10000);

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

ipc.on("targetPriceVal", function(event, arg) {
  targetPriceVal = Number(arg);
  targetPrice.innerHTML = "$" + targetPriceVal.toLocaleString("en");
});
