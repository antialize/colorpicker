let toPick = 20;
let step = 3;
let colorCount = 0;
let lloydSteps = 0;
let list = null;
let colors = [];
let fixed = [];
let to = null;
let randomFill = false;
let avoid = false;
const redWeight = 1.4142135623730951;
const greenWeight = 2;
const blueWeight = 1.7320508075688772;

class Color {
    constructor(r, g, b) {
	this.r = r;
	this.g = g;
	this.b = b;
    }
};

function changeColor(idx, c) {
    colors[idx] = c;
    const li = document.createElement("li");
    list.appendChild(li);
    li.style.backgroundColor = "rgb("+c.r+","+c.g+","+c.b+")";
}

function pickRandom() {
    changeColor(colorCount, new Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)));
    ++colorCount;
}

function dist(c1, c2) {
    const r = (c1.r - c2.r)*redWeight;
    const g = (c1.g - c2.g)*greenWeight;
    const b = (c1.b - c2.b)*blueWeight;
    return r*r + g*g+ b*b;
}

function pickFurthest() {
    let best_dist = 0
    let best_color = null;
    let my_color = new Color(0,0,0);
    for (my_color.r = 0; my_color.r < 256; my_color.r += step)
	for (my_color.g = 0; my_color.g < 256; my_color.g += step)
	    for (my_color.b = 0; my_color.b < 256; my_color.b += step) {
		let my_dist = 1000000000;
		for (let i = 0; i < colorCount; ++i) 
		    my_dist = Math.min(dist(colors[i], my_color), my_dist);
		if (my_dist > best_dist) {
		    best_dist = my_dist;
		    best_color = new Color(my_color.r, my_color.g, my_color.b);
		}
	    }

    changeColor(colorCount, best_color);
    ++colorCount;
}


class LLoydBucket {
    constructor() {
	this.r = 0;
	this.g = 0;
	this.b = 0;
	this.c = 0;
    }
};


function lloyd() {
    const content = document.getElementById("content");
    list = document.createElement("ul");
    content.appendChild(list);

    const buckets = [];
    for (let i=0; i < colorCount; ++i)
	buckets[i] = new LLoydBucket();

    let my_color = new Color(0,0,0);
    for (my_color.r = 0; my_color.r < 256; my_color.r += step)
	for (my_color.g = 0; my_color.g < 256; my_color.g += step)
	    for (my_color.b = 0; my_color.b < 256; my_color.b += step) {
		let best = 0;
		let best_dist = 1000000000;
		for (let i = 0; i < colorCount; ++i) {
		    const my_dist = dist(colors[i], my_color);
		    if (my_dist < best_dist) {
			best = i;
			best_dist = my_dist;
		    }
		}
		buckets[best].r += my_color.r;
		buckets[best].g += my_color.g;
		buckets[best].b += my_color.b;
		buckets[best].c += 1;
	    }

    for (let i = 0; i < colorCount; ++i) {
	if (!fixed[i]) 
	    changeColor(i, new Color(Math.round(buckets[i].r / buckets[i].c), Math.floor(buckets[i].g / buckets[i].c), Math.floor(buckets[i].b / buckets[i].c)));
	else
	    changeColor(i, colors[i])
    }
    ++lloydSteps;
}


function fillColors() {
    if (colorCount < 2 && avoid) {
	changeColor(0, new Color(0, 0, 0));
	changeColor(1, new Color(255, 255, 255));
	fixed[0] = fixed[1] = true;
	colorCount = 2;
    } else if (colorCount == (avoid?2:0) || (colorCount < toPick+(avoid?2:0) && randomFill))
	pickRandom();
    else if (colorCount < toPick+(avoid?2:0))
	pickFurthest();
    else if (lloydSteps < 20)
	lloyd();
    else {
	const content = document.getElementById("content");
	for (let i = 0; i < colorCount; ++i) {
	    const s = document.createElement("span");
	    const c = colors[i];
	    s.textContent = "\""+c.r + "," + c.g + "," + c.b+"\", ";
	    s.style.backgroundColor = "rgb("+c.r+","+c.g+","+c.b+")";
	    s.style.margin = "3px";
	    content.appendChild(s);
	}
	
	to = null;
	return;
    }
    to = setTimeout(fillColors, 0);
}

function pickColors() {
    if (to != null)
	clearTimeout(to);
    to = null;

    const content = document.getElementById("content");
    while(content.firstChild) content.removeChild(content.firstChild);
    colorCount = 0;
    lloydSteps = 0;
    list = document.createElement("ul");
    content.appendChild(list);
    to = setTimeout(fillColors, 0);
}

function setColors(v) {
    if (to != null)
	clearTimeout(to);
    to = null;
    toPick = v;
    pickColors();
}

function setSkip(v) {
    step = v;
    pickColors();
}

function setRandomFill(v) {
    randomFill = v;
    pickColors();
}

function setAvoid(v) {
    avoid = v;
    pickColors();
}
