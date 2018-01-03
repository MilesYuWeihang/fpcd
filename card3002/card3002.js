card3002 = new Object();
card3002.img = "../card3002/3002.jpg";
card3002.name = "Holy Light";
function helper3002(card){
	enable(1);
	var flag = 0;
	setTimeout(function(){
		if (curDOM === null){
			return helper3002(card);
		}
		else if (curDOM.position === 111){
			sanChange(1, 8);
			packSend("action", null, 0, "san", 8);
			turnInfo.innerHTML = "End Turn";
			targetShow = false;

			packSend("action", card.img, positionShift(card.position),"showFlip",null);
			packSend("action",null, 11,"showTarget","positive");
			sleep(1000).then(()=>(removeCard(card),hidIcon(1),enable(0)));
		}
		else if(curDOM.position === 11){
			sanChange(0, 8);
			packSend("action", null, 1, "san", 8);
			turnInfo.innerHTML = "End Turn";
			targetShow = false;

			packSend("action", card.img, positionShift(card.position),"showFlip",null);
			packSend("action",null, 111,"showTarget","positive");
			sleep(1000).then(()=>(removeCard(card),hidIcon(1),enable(0)));
		}
		else{
			turnInfo.innerHTML = "Invalid Target";
			targetShow = false;
			enable(0);
		}
		
	},100);
}

card3002.playcard = function(){
	console.log("in3002")
	curDOM = null;
	turnInfo.innerHTML = "Select Target";
	var ret = helper3002(this);
	console.log(this);
	return ret;

};
card3002.onmouseover = function(){
	console.log(screem);
	screem.children[0].src = card3002.img;
	showTarget(this, greenWin);

}

card3002.onmouseout = function(){
	greenWin.style.display = "none";
}