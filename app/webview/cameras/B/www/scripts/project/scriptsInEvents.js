"use strict";

import { cameraNameStarter } from "./cameraName.js"

{
	const scriptsInEvents = {

		async EventSheet1_Event1_Act1(runtime, localVars)
		{
			runtime.globalVars.Camera = cameraNameStarter;
			document.title = `MultiWindows - ${cameraNameStarter}`;
			window.addEventListener('beforeunload', async (e) => {
				e.preventDefault();
				runtime.callFunction("closeALL");
			});
		},

		async EventSheet1_Event8_Act1(runtime, localVars)
		{
			const action = "CONFIGURE";
			const windowName = runtime.globalVars.WindowName;
			const screenWidth = runtime.globalVars.ScreenWidth;
			const screenHeight = runtime.globalVars.ScreenHeight;
			const camera = runtime.globalVars.Camera;
			const cameraX = runtime.globalVars.CameraX;
			const cameraY = runtime.globalVars.CameraY;
			const config = {windowName, screenWidth, screenHeight, camera, cameraX, cameraY }
			const option = { config }
			const target = "SELF";
			const objMessage = {action, target, option};
			const message = JSON.stringify(objMessage);
			runtime.setReturnValue(message);
		},

		async EventSheet1_Event9_Act1(runtime, localVars)
		{
			const action = "PLAYER POSITION";
			const playerX = runtime.objects.Player.getFirstInstance().x;
			const playerY = runtime.objects.Player.getFirstInstance().y;
			const player = {playerX, playerY }
			const option = { player }
			const target = "ALL";
			const objMessage = {action, target, option};
			const message = JSON.stringify(objMessage);
			runtime.setReturnValue(message);
		},

		async EventSheet1_Event11_Act2(runtime, localVars)
		{
			const messageTXT = localVars.MessageFromServer;
			const message = JSON.parse(messageTXT);
			
			const { action } = message;
			
			if ( action === "PLAYER POSITION" && cameraNameStarter != "MENU") {
				//console.log("PLAYER POSITION")
				const x = message.option.player.playerX;
				const y = message.option.player.playerY;
				runtime.objects.Player.getFirstInstance().x = x;
				runtime.objects.Player.getFirstInstance().y = y;
			// 	runtime.callFunction("SetPlayerPosition", x, y);
			}
		},

		async EventSheet1_Event16_Act1(runtime, localVars)
		{
			const action = "CLOSE";
			const target = "ALL";
			const option = {};
			const objMessage = {action, target, option};
			const message = JSON.stringify(objMessage);
			runtime.globalVars.Message = message;
		},

		async EventSheet1_Event17_Act1(runtime, localVars)
		{
			const action = "TEST";
			const target = "SELF";
			const option = {message: "HI!"};
			const objMessage = {action, target, option};
			const message = JSON.stringify(objMessage);
			runtime.globalVars.Message = message;
		},

		async EventSheet1_Event18_Act1(runtime, localVars)
		{
			const action = "PLAY";
			const target = "ALL";
			const objMessage = {action, target};
			const message = JSON.stringify(objMessage);
			runtime.globalVars.Message = message;
		}

	};
	
	self.C3.ScriptsInEvents = scriptsInEvents;
}
