card3001 = new Object();
card3001.img = "../card3001/3001.png";
card3001.name = "Fire Ball";
function helper3001(card){
	var flag = 0;
	setTimeout(function(){
		if (curDOM === null){
			return helper3001(card);
		}
		else if (curDOM.position === 111){
			sanChange(1, -5);
			packSend("action", null, 0, "san", -5);
			turnInfo.innerHTML = "End Turn";
			removeCard(card);
		}
		else if(curDOM.position === 11){
			sanChange(0, -5);
			packSend("action", null, 1, "san", -5);
			turnInfo.innerHTML = "End Turn";
			flag = 1;
			removeCard(card);
		}
		else{
			turnInfo.innerHTML = "Invalid Target";
			flag = 2;
			return false;
		}
		
	},100);
}

card3001.onclick = function(){
	console.log("in3001")
	curDOM = null;
	turnInfo.innerHTML = "Select Target";
	var ret = helper3001(this);
	console.log(this);
	return ret;

};


card3001.onmouseover = function(){
	console.log(screem);
	screem.children[0].src = card3001.img;

}