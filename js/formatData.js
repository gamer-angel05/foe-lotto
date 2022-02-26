let MAX_ENCOUNTERS = undefined;
let MIN_ENCOUNTERS = undefined;
let MAX_FPS = undefined;
let TOTAL_FPS = undefined;


class formatData {
	#donors;
	#players;

	fps = 0;
	playersFiltered = undefined;
	playersSelection = [];
	winnerList = [];

	constructor(donors, players) {
		this.#donors = donors;
		this.#players = players;

		this.shuffle();
	}

	getDonors() {
		return this.#donors;
	}

	getPlayers() {
		return this.#players;
	}

	shuffle() {
		this.fps = Math.min(MAX_FPS, TOTAL_FPS);
		this.playersFiltered = this.#players.filter((player) => player.Building && player.Encounters > Number(MIN_ENCOUNTERS));
		this.playersSelection = this.playersFiltered.map(({Member}) => Member);
		this.shuffleDonors();
		this.shufflePlayers();
	}
	shuffleDonors() {
		shuffle(this.#donors);
	}
	shufflePlayers() {
		shuffle(this.playersSelection);
	}

	getWinners() {
		this.winnerList = [];
		this.getWinner();

		return this.assignDonors();
	}
	getWinner() {
		/*	Will loop until there is no more fps available.
			max can be updated with a capped value, meaning
			this is the max fps awarded per person. 
		*/
		const result = choice(this.playersSelection);
		const winner = this.playersFiltered.find(({Member}) => Member === result);
		const winnerEncounters = winner.Encounters;
		let winnerFps = Math.min(MAX_ENCOUNTERS, winnerEncounters);

		// last winner
		if (this.fps < winnerFps) winnerFps = this.fps;

		this.winnerList.push({'name': result, 'building': winner.Building, 'remain_fps': winnerFps, 'total_fps': winnerFps, 'donors': []});
		this.fps -= winnerFps;
		this.playersSelection = this.playersSelection.filter((player) => player !== result);
		
		addRowTable(result + ' is awarded ' + winnerFps + ' FP', '#table-winners');

		if (this.fps > 0 && this.playersSelection.length) {
			return this.getWinner();
		}
	}

	assignDonors() {
		/* 	Donors are shuffled in case there is too many FPs
			available for the number of winners. 
		*/
		for (let i = 0; i < this.#donors.length; i++) {
			const donor = this.#donors[i];
			let fpsAvailable = donor.Donations;
			let isAssigned = false;
			
			this.winnerList.forEach((winner, index) => {
				if (fpsAvailable > 0 && winner.remain_fps > 0) {

					if (donor.Member.toLowerCase() == winner.name.toLowerCase()) {
						isAssigned = index === this.winnerList.length - 1;
					} else {
						const fpsDonate = Math.min(fpsAvailable, winner.remain_fps);
						winner.donors.push([donor.Member, fpsDonate]);
						winner.remain_fps -= fpsDonate;
						fpsAvailable -= fpsDonate;
						isAssigned = true;
					}
				}
			})

			if (!isAssigned) {
				break;
			}
		}
	}
	getAssignedDonors() {
		/* pretty print the results
		*/
		const donorList = {};

		this.winnerList.forEach((winner) => {
			winner.donors.forEach((donor) => {
				const donorName = donor[0];
				if (!(donorName in donorList)) donorList[donorName] = [];

				donorList[donorName].push({'to': winner.name, 'fps': donor[1], 'building': winner.building});
			})
		})

		for (const [key, value] of Object.entries(donorList)) {
			value.forEach((donation) => {
				addRowTable(key + ' pays ' + donation.fps + ' FP on ' + donation.to + '\'s ' + donation.building, '#table-winners-donors');
			})
		}
	}
}


function addToTable(player, values, table, style=undefined) {
	var tbody = $(table).children('tbody');
	var tr = '<tr';

	if (style) tr += ' class="' + style + '"';
	tr += '><td>' + player + '</td>';
	values.forEach((value) => tr += '<td>' + value + '</td>');

	tbody.append(tr + '</tr>');
}
function addRowTable(value, table, style=undefined) {
	var tbody = $(table).children('tbody');
	var tr = '<tr';

	if (style) tr += ' class="' + style + '"';
	tr += '>' + '<td>' + value + '</td>';

	tbody.append(tr + '</tr>');
}


function loadInputs() {
	/*	Load values from form 
	*/
	oldMaxEncounters = MAX_ENCOUNTERS;
	oldMinEncounters = MIN_ENCOUNTERS;
	oldMaxFps = MAX_FPS;

	MAX_ENCOUNTERS = $('#inputMaxEncounters').val() || $('#inputMaxEncounters').attr('placeholder');
	MIN_ENCOUNTERS = $('#inputMinEncounters').val() || $('#inputMinEncounters').attr('placeholder');
	MAX_FPS = $('#inputMaxFPs').val() || TOTAL_FPS;

	if (oldMaxEncounters !== MAX_ENCOUNTERS || oldMinEncounters !== MIN_ENCOUNTERS || oldMaxFps !== MAX_FPS) {
		RELOAD_INFO = true;
	}
}
function loadInfo() {
	/*	Fill info tables
	*/
	$('#tables-info tbody tr').remove();
	loadInputs();

	__instance__.getPlayers().forEach((player) => {
		addToTable(player.Member, [player.Building || '', player.Encounters], '#table-players', player.Building && player.Encounters > MIN_ENCOUNTERS && 'table-success');
		if (player.Building) addToTable(player.Member, [player.Building], '#table-buildings');
	})
	__instance__.getDonors().forEach((player) => addToTable(player.Member, [player.Donations + ' FP'], '#table-donors'));
}

let originalFormat;
function setButtonTooltip() {
	const button = $('#info-button');
	if (!originalFormat) originalFormat = button.attr('data-original-title');

	const donors = __instance__.getDonors();
	TOTAL_FPS = donors.reduce((total, n) => total + Number(n.Donations), 0);
	button.attr('title', originalFormat.format(__instance__.getPlayers().length, donors.length, TOTAL_FPS))
		  .tooltip("_fixTitle");

	$('#fps-available').text("FP available: " + TOTAL_FPS);
}
