card3002 = new Object();
card3002.img = "../card3002/3002.jpg";
card3002.name = "Holy Light";
function helper3002(card){
	var flag = 0;
	setTimeout(function(){
		if (curDOM === null){
			return helper3002(card);
		}
		else if (curDOM.position === 111){
			sanChange(1, 8);
			packSend("action", null, 0, "san", 8);
			turnInfo.innerHTML = "End Turn";
			removeCard(card);
		}
		else if(curDOM.position === 11){
			sanChange(0, 8);
			packSend("action", null, 1, "san", 8);
			turnInfo.innerHTML = "End Turn";
			removeCard(card);
		}
		else{
			turnInfo.innerHTML = "Invalid Target";
		}
		
	},100);
}

card3002.onclick = function(){
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

}