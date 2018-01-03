card1001 = new Object();
card1001.img = "../img/char.jpg";
card1001.name = "Miles";


card1001.playcard = function(){
	if(myself.flip === true){
		return;
	}
	this.img = "../card1001/1001.jpg";
	myself.flip = true;
	sanChangeTo(0,20);
	packSend("action", null, 1, "santo", 20);
	packSend("action", this.img, positionShift(this.position), "showFlip", null);
	this.children[0].src = this.img;


};
card1001.onmouseover = function(){
	if(this.owner == 0){
		screem.children[0].src = "../card1001/1001.jpg"
	}
	if(targetShow === true){
		showTarget(this, redCross);
	}
	else{
		showTarget(this, greenWin);
	}
}

card1001.onmouseout = function(){
	greenWin.style.display = "none";
	redCross.style.display = "none";
}