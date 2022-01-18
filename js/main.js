var MAX_ENCOUNTERS = undefined;
var MIN_ENCOUNTERS = undefined;
var MAX_FPS = undefined;
var TOTAL_FPS = undefined;
var __instance__ = undefined;
var publicSpreadsheetUrl = "https://sheetdb.io/api/v1/wn1i44dope2mz?sheet=GE%20Lotto";
var publicSheet = [{"Member":"Angel the Nameless","Encounters":"64","Donations":"400"},{"Member":"Ariadne the Wolfspeaker","Encounters":"64","Donations":"20"},{"Member":"bethbird2020","Encounters":"64","Donations":"20"},{"Member":"Graycie Gray","Encounters":"64","Donations":"20"},{"Member":"Lady911","Encounters":"64","Donations":"40"},{"Member":"Mik the Maker","Encounters":"64","Donations":"20"},{"Member":"Rakush","Encounters":"64","Donations":"20"},{"Member":"rettig83","Encounters":"64","Donations":"20"},{"Member":"richrice","Encounters":"64","Donations":"10"},{"Member":"Rofello","Encounters":"64","Donations":"5"},{"Member":"Ryudn Paean","Encounters":"64","Donations":"400"},{"Member":"Subjammer","Encounters":"64","Donations":"5"},{"Member":"Timberghost","Encounters":"64","Donations":"100"},{"Member":"tombonker","Encounters":"64","Donations":""},{"Member":"Yarlac","Encounters":"64","Donations":""},{"Member":"Lawrence the Just","Encounters":"60","Donations":""},{"Member":"Damius Maximus ","Encounters":"48","Donations":""},{"Member":"Fabulous41403","Encounters":"48","Donations":""},{"Member":"PrincipledTravel","Encounters":"48","Donations":""},{"Member":"Donnanymous the Valiant","Encounters":"43","Donations":""},{"Member":"Wilburforce the Savior","Encounters":"43","Donations":""},{"Member":"PeterPiper5","Encounters":"40","Donations":"10"},{"Member":"confederatoin","Encounters":"36","Donations":""},{"Member":"deus*ex*machina","Encounters":"36","Donations":""},{"Member":"Janus Dialecticus","Encounters":"32","Donations":""},{"Member":"Socslan","Encounters":"23","Donations":""},{"Member":"turdfurgeson01","Encounters":"23","Donations":""},{"Member":"Hunter Seeker","Encounters":"21","Donations":""},{"Member":"Captain Billy","Encounters":"20","Donations":""},{"Member":"WeberGrill","Encounters":"19","Donations":""},{"Member":"Tripaleo","Encounters":"18","Donations":""},{"Member":"LdySaphira 0712","Encounters":"16","Donations":""},{"Member":"Lord Bobby Lopaka","Encounters":"16","Donations":""},{"Member":"Rhythwyn","Encounters":"16","Donations":""},{"Member":"TeddyBoski the God","Encounters":"16","Donations":""},{"Member":"Damocles the Daring","Encounters":"15","Donations":""},{"Member":"Keith of StoneAge","Encounters":"14","Donations":""},{"Member":"Coyote CJ","Encounters":"11","Donations":""},{"Member":"Shapiro","Encounters":"11","Donations":""},{"Member":"Bougher ","Encounters":"9","Donations":""},{"Member":"darknel","Encounters":"8","Donations":""},{"Member":"Original Russ","Encounters":"5","Donations":""},{"Member":"666Irish the Annoyed","Encounters":"3","Donations":""},{"Member":"Cadmus 1235 the Hawk","Encounters":"0","Donations":""},{"Member":"ChipMaker","Encounters":"0","Donations":""},{"Member":"coldbloodbath","Encounters":"0","Donations":""},{"Member":"freedomhawk","Encounters":"0","Donations":""},{"Member":"FunnyBeach","Encounters":"0","Donations":""},{"Member":"gunnarmachine","Encounters":"0","Donations":""},{"Member":"Hawkeye 22d","Encounters":"0","Donations":""},{"Member":"Pantea 1882 the Savior","Encounters":"0","Donations":""},{"Member":"Sophocles 735 the Bold","Encounters":"0","Donations":""},{"Member":"WrenTX","Encounters":"0","Donations":""},{"Member":"zzz bobbbcattt2","Encounters":"0","Donations":""},{"Member":"zzz Dan the Man 616","Encounters":"0","Donations":""},{"Member":"zzz Loyyd7","Encounters":"0","Donations":""},{"Member":"Cynkenobi","Encounters":"","Donations":""},{"Member":"Daxier","Encounters":"","Donations":""},{"Member":"Xtinguish","Encounters":"","Donations":""},{"Member":"ZonoChron","Encounters":"","Donations":""},{"Member":"zzz 0000pooja","Encounters":"","Donations":""},{"Member":"zzz Acromeite the Merciful","Encounters":"","Donations":""},{"Member":"zzz Huskerfaninwa","Encounters":"","Donations":""},{"Member":"zzz Lawdog the Great","Encounters":"","Donations":""},{"Member":"zzz Mew2014","Encounters":"","Donations":""},{"Member":"zzz Mr T2","Encounters":"","Donations":""},{"Member":"zzz SzabyLaszlo","Encounters":"","Donations":""},{"Member":"zzz-Bam8904","Encounters":"","Donations":""},{"Member":"zzz-derrik Henry101","Encounters":"","Donations":""},{"Member":"zzz-FrozenVampire","Encounters":"","Donations":""},{"Member":"zzz-Maren Tudor","Encounters":"","Donations":""},{"Member":"zzz-rcdenny","Encounters":"","Donations":""},{"Member":"zzz-Simi Star","Encounters":"","Donations":""},{"Member":"zzz-Yummyest ","Encounters":"","Donations":""}];



function __init__() {
	/*	Load the public sheet data and cache it. Reload the data by using the Refresh button.
		This is to avoid pinging the limited api. */
    $("[data-toggle=\"tooltip\"]").tooltip().tooltip("hide"); 
	/*axios.get(publicSpreadsheetUrl)
    .then( response => {
    	publicSheet = response.data;
        console.log(publicSheet);
	    let donors = publicSheet.filter((e) => e.Donations && e.Donations > 0);
	    let players = publicSheet.filter((e) => e.Encounters && e.Encounters > 0);
	    __instance__ = new Generate(donors, players);
	    show_info();
    });*/
    console.log(publicSheet);
    let donors = publicSheet.filter((e) => e.Donations && e.Donations > 0);
    let players = publicSheet.filter((e) => e.Encounters && e.Encounters > 0);
    __instance__ = new Generate(donors, players);
    show_info();
}

// don't really need to split donors and players, can just filter down arrays?
class Generate {
	#donors
	#players

	fps = 0
	players_selection = []
	winner_list = []

	constructor(donors, players) {
		this.#donors = donors;
		this.#players = players;
		
		this.shuffle();
	}
	set_donors(donors) {
		this.#donors 
	}

	get_donors() {
		return this.#donors;
	}

	get_players() {
		return this.#players;
	}

	shuffle() {
		this.fps = Math.min(MAX_FPS, TOTAL_FPS);
		this.players_selection = this.#players.map(({Member}) => Member);
		this.shuffle_donors();
		this.shuffle_players();
	}

	shuffle_donors() {
		shuffle(this.#donors);
	}

	shuffle_players() {
		shuffle(this.players_selection);
	}

	get_winners() {
		this.winner_list = []
		this.get_winner()

		return this.assign_donors();
	}

	get_winner() {
		/*	Will loop until there is no more fps available.
			max can be updated with a capped value, meaning
			this is the max fps awarded per person. */
		const result = choice(this.players_selection);
		const winner = this.#players.find(({ Member }) => Member === result);
		const winner_encounters = winner.Encounters;
		var winner_fps = Math.min(MAX_ENCOUNTERS, winner_encounters);

		if (this.fps < winner_fps) { // last winner
			winner_fps = this.fps;
		};

		console.log(result + " / " + winner_encounters + " encounters / " + winner_fps + " fps");
		this.winner_list.push({"name": result, "remain_fps": winner_fps, "total_fps": winner_fps, "donors": []});
		this.fps -= winner_fps;
		this.players_selection = this.players_selection.filter((e) => e !== result);
		add_to_table(result, winner_fps, "#table_lotwinners");

		if (this.fps > 0 && this.players_selection.length) {
			return this.get_winner();
		}
	}

	assign_donors() {
		/* 	Donors are shuffled in case there is too many FPs
			available for the number of winners. */
		//console.log("FPS remaining: " + this.fps);

		for (let i = 0; i < this.#donors.length; i++) {
			const donor = this.#donors[i];
			var fps_available = donor.Donations;
			var is_assigned = false;
			
			this.winner_list.forEach((winner, index) => {
				if (fps_available > 0 && winner.remain_fps > 0) {

					if (donor.Member.toLowerCase() == winner.name.toLowerCase()) {
						is_assigned = index === this.winner_list.length - 1
					} else {
						const fps_donate = Math.min(fps_available, winner.remain_fps);
						winner.donors.push([donor.Member, fps_donate]);
						winner.remain_fps -= fps_donate;
						fps_available -= fps_donate;
						is_assigned = true;
					};
				};
			});

			if (!is_assigned) {
				break;
			};
		};
	}

	get_assigned_donors() {
		// pretty print the results
		const donor_list = {};

		this.winner_list.forEach((winner) => {
			winner.donors.forEach((donor) => {
				let donor_name = donor[0]
				
				if (!(donor_name in donor_list)) {
					donor_list[donor_name] = [];
				}
				donor_list[donor_name].push({"to": winner.name, "fps": donor[1]});
				//donor_list[donor_name].push(donor_name + " -> " + winner.name + " : [" + donor[1] + "] FPs");
			});
		});

		for (const [key, value] of Object.entries(donor_list)) {
			value.forEach((donation) => {
				add_to_table(key + " -> " + donation.to, donation.fps, "#table_lotdonors")
			});
		}
	}
}

function load_encounter_input() {
	/*	Load values from form */
	MAX_ENCOUNTERS = $("#inputMaxEncounters").val() || $("#inputMaxEncounters").attr("placeholder");
	MIN_ENCOUNTERS = $("#inputMinEncounters").val() || $("#inputMinEncounters").attr("placeholder");
	MAX_FPS = $("#inputMaxFPs").val() || TOTAL_FPS;
}

function handleLotteryClick() {
	/* 	Reset tables and start the lottery process */
	load_encounter_input();
	$("#table_lotwinners tbody tr").remove();
	$("#table_lotdonors tbody tr").remove();
	
	__instance__.shuffle();
	__instance__.get_winners();
	__instance__.get_assigned_donors();

	$("#tables_lottery").css("display", "");
}

function handleInfoClick() {
	/*	Display the basic informations that is used
		in the shuffle for transparency */
	load_encounter_input();
	let tables_info = $("#tables_info");
	let info_button = $("#info_button")

	if (tables_info.css("display") === "none") {
		tables_info.css("display", "");
		info_button.text("Less Info");
	} else {
		tables_info.css("display", "none");
		info_button.text("More Info");
	};
}

function handleReloadData() {
	/*	Reload data from the sheet, so erase all loaded data
		and re-init everything as if first run. */
	$("#table_lotwinners tbody tr").remove();
	$("#table_lotdonors tbody tr").remove();
	$("#tables_info tbody tr").remove();
	$("#tables_lottery tbody tr").remove();
	$("#tables_info").css("display", "none");
	$("#tables_lottery").css("display", "none");
	
	__init__();
}

function copyTable(el) {
    var urlField = document.getElementById(el);
    var range = document.createRange();
    range.selectNode(urlField);
    window.getSelection().addRange(range);
    document.execCommand('copy');
}

  

function add_to_table(player, value, table) {
	var tbody = $(table).children('tbody');
	tbody.append("<tr><td>" + player + "</td><td>"+ value + "</td></tr>");
}

function show_info() {

	__instance__.get_players().forEach((e) => {
		add_to_table(e.Member, e.Encounters, "#table_players");
	});
	__instance__.get_donors().forEach((e) => {
		add_to_table(e.Member, e.Donations, "#table_donors");
	});
	setRefreshButtonTooltip();
}

var refreshButtonTooltipFormat;
function setRefreshButtonTooltip() {
	const $refreshButton = $("#refresh_button");
	if (refreshButtonTooltipFormat === undefined ||
		refreshButtonTooltipFormat === "") {
		refreshButtonTooltipFormat = $refreshButton.attr("data-original-title");
	}
	let donors = __instance__.get_donors();
	TOTAL_FPS = donors.reduce((total, n) => total + Number(n.Donations), 0);
	$refreshButton.attr("title", refreshButtonTooltipFormat.format(__instance__.get_players().length, donors.length, TOTAL_FPS))
				  .tooltip("_fixTitle");

	$("#fps_available").text("FPs available: " + TOTAL_FPS);
}

$(document).ready(__init__);
