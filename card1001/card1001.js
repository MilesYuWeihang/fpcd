card1001 = new Object();
card1001.img = "../img/char.jpg";
card1001.name = "Miles";


card1001.playcard = function(){
	if(myself.flip === true){
		return;
	}
	this.img = "../card1001/1001.jpg";
	myself.flip = true;
	myself.san = 20;
	this.children[0].src = this.img;


};
card1001.onmouseover = function(){
	screem.children[0].src = "../card1001/1001.jpg"
	showTarget(this, greenWin);

}

card1001.onmouseout = function(){
	greenWin.style.display = "none";
}