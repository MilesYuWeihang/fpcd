card3001 = new Object();
card3001.img = "../card3001/3001.png";
card3001.name = "Fire Ball";
function helper3001(card){
	enable(1);
	var flag = 0;
	setTimeout(function(){
		if (curDOM === null){
			return helper3001(card);
		}
		else if (curDOM.position === 111){
			sanChange(1, -5);
			packSend("action", null, 0, "san", -5);
			turnInfo.innerHTML = "End Turn";
			targetShow = false;

			packSend("action", card.img, positionShift(card.position),"showFlip",null);
			packSend("action",null, 11,"showTarget","negative");
			sleep(1000).then(()=>(removeCard(card),hidIcon(1),enable(0)));
		}
		else if(curDOM.position === 11){
			sanChange(0, -5);
			packSend("action", null, 1, "san", -5);
			turnInfo.innerHTML = "End Turn";
			targetShow = false;
			packSend("action", card.img, positionShift(card.position),"showFlip",null);
			packSend("action",null, 11,"showTarget","negative");
			sleep(1000).then(()=>(removeCard(card),hidIcon(1),enable(0)));
		}
		else{
			turnInfo.innerHTML = "Invalid Target";;
			targetShow = false;
			return false;
		}
		
	},100);
}

card3001.playcard = function(){
	console.log("in3001")
	targetShow = true;
	curDOM = null;
	turnInfo.innerHTML = "Select Target";
	var ret = helper3001(this);
	console.log(this);
	return ret;

};


card3001.onmouseover = function(){
	console.log(screem);
	screem.children[0].src = card3001.img;
	showTarget(this,greenWin);

}

card3001.onmouseout = function(){
	greenWin.style.display = "none";
}