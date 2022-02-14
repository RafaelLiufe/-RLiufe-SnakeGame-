const {app, BrowserWindow, nativeImage} = require("electron")

function CreateWindow() {
	const appIcon = nativeImage.createFromPath(__dirname + '/imgs/icon.png')

	const win = new BrowserWindow({
		width: 400,
		height: 400,
		show: false,
		resizable: false,
		autoHideMenuBar: true,
		icon: appIcon
	})
	win.loadFile('index.html')
	win.once("ready-to-show", () => {
        win.show()
    })
}

app.whenReady().then(() => {
    CreateWindow()
})