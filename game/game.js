//Game Vars
var player = {};
var game = {};
var countryNames = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre and Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts and Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

//Classes
class Country {
	constructor(name, leadername, land, milpower, ecopower){
		this.name = name;
		this.leadername = leadername;
		this.land = land;
		this.milpower = milpower;
		this.ecopower = ecopower;
	}
}

class EconomyHandler {
	constructor(money){
		this.money = money;
	}
}

class MilitaryHandler {
	constructor(){

	}
}

class ManpowerHandler {
	constructor(manpower){
		this.manpower = manpower;
	}
}

class LandHandler {
	constructor(land){
		this.availableLand = land;
		this.totalLand = land;
	}
}

class Resource {
	constructor(name, stockpile, value, sellratio){
		this.name = name;
		this.stockpile = stockpile;
		this.value = value;
		this.sellratio = sellratio;
	}
}

class AICountry {
	constructor(name, leadername, treasury, land, milpower, ecopower){
		this.name = name;
		this.leadername = leadername; 
		this.treasury = treasury;
		this.land = land;
		this.milpower = milpower;
		this.ecopower = ecopower;
	}
}

$(".CreateCountry").on('click', function() {
	let countryName = $("#countryNameInput").val();
	let playerName = $("#countryLeaderInput").val();
	var title = $("#createCountryTitle");
	if (countryName != "" && playerName != "") {
		player.country = new Country(countryName, playerName, 0, 0, 0);
		$("#createCountryBody").remove();
		$("#difficultySelector").css("visibility", "visible");
	} else if (countryName == "" && playerName != "") {
		title.html("Enter a country name!");
		title.css("color", "#ff0000");
	} else if (playerName == "" && countryName != "") {
		title.html("Enter your name!");
		title.css("color", "#ff0000");
	} else {
		title.html("Fill all fields!");
		title.css("color", "#ff0000");
	}
});

$(".RandomName").on('click', function() {
	$("#countryNameInput").val(countryNames[Math.floor(Math.random() * countryNames.length+1)]);
});

$(".difficultyButton").on('click', function(){
	switch ($(this).data('mode')) {
		case "easy":
			player.difficulty = 1.5;
			$("#difficultySelector").remove();
			$(".pDif").css("color", "#12842d");
			$(".pDif").html("Easy");
			InitializeCountry();
			break;
		case "normal":
			player.difficulty = 1;
			$("#difficultySelector").remove();
			$(".pDif").css("color", "#ff9900");
			$(".pDif").html("Normal");
			InitializeCountry();
			break;
		case "hard":
			player.difficulty = 0.5;
			$("#difficultySelector").remove();
			$(".pDif").css("color", "#ff0000");
			$(".pDif").html("Hard");
			InitializeCountry();
			break;
		default:
			$("#difSelectTitle").html("Oi, don't be cheeky");
			$("#difSelectTitle").css("color", "#ff0000");
			break;
	}
});

$(".slideDiv").on('click', function(){
	if ($(this).css("left") == "-120px") {
		$(".slideDiv").animate({left:'-120px'}, {queue: false, duration: 250});
		$(this).animate({left:'0px'}, {queue: false, duration: 250});
		OpenPage($(this).data('page'));
	} else if ($(this).css("left") == "0px") {
		$(this).animate({left:'-120px'}, {queue: false, duration: 250});
		ClosePage();
	}
});

function ClosePage() {
	$(".page").css("visibility", "hidden");
}

function OpenPage(pageName) {
	$(".page").css("visibility", "visible");
	$("#pageTitle").html(pageName);
	$(".child").css("visibility", "hidden");
	$("."+pageName.toLowerCase()).css("visibility", "inherit");
}

function InitializeCountry(){
	$("#conInfo").css("visibility", "visible");
	$("#conName").html(player.country.name);
	game.active = true;
	player.eco = new EconomyHandler(0);
	player.eco.resources = {};
	player.eco.resources.coal = new Resource("Coal", 0, 0, 0.5);
	player.eco.resources.oil = new Resource("Oil", 0, 0, 0.5);
	player.eco.resources.iron = new Resource("Iron", 0, 0, 0.5);
	player.eco.resources.bricks = new Resource("Bricks", 0, 0, 0.5);
	$("#moneyDisplay").html(FormatNumberText(player.eco.money));
	player.mil = new MilitaryHandler();
	player.land = new LandHandler(1000);
	$("#landDisplay").html(FormatNumberText(player.land.availableLand));
	player.manpower = new ManpowerHandler(5000);
	$("#manDisplay").html(FormatNumberText(player.manpower.manpower));
	$(".slideDiv").css("visibility", "visible");
}

function UpdateAllText() {

}

function FormatNumberText(number){
	return number;
}