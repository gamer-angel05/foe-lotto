let RELOAD_INFO = false;
let publicSpreadsheetUrl = "https://opensheet.elk.sh/1-XABpNzY6jgg_Bh9KaDKS-pPNgGF22d_yAxqKOAM6RI/GE%20Lotto"; // opensource redirect for google sheet w/o auth
let publicSpreadsheetDoc = "https://opensheet.elk.sh/1-XABpNzY6jgg_Bh9KaDKS-pPNgGF22d_yAxqKOAM6RI/Documentation";
let publicSheet = undefined;
let documentation = undefined;
let isSticky = false;
let __instance__ = undefined;


function __init__() {
    const copyAll = document.querySelectorAll('.js-clipboard');
    copyAll.forEach(button => {
        button.addEventListener('click', handleCopyClick);
        button.setAttribute('data-toggle', 'tooltip');
        button.setAttribute('data-placement', 'top');
        button.setAttribute('data-html', 'true');
    })
    $('[data-toggle="tooltip"]').tooltip({trigger : 'hover'});
    load();
}
function load() {
    /*  Load the public sheet data and cache it. Reload the data by using the Refresh button.
        This is to avoid pinging the limited api. 
    */
    fetch(publicSpreadsheetDoc)
    .then(response => response.json())
    .then(data => {
        documentation = data;
    })
    fetch(publicSpreadsheetUrl)
    .then(response => response.json())
    .then(data => {
        publicSheet = data;
        let donors = publicSheet.filter(({Donations}) => Donations && Donations > 0);
        let players = publicSheet.filter(({Encounters}) => Encounters && Encounters > 0);
        __instance__ = new formatData(donors, players);
        loadInfo();
        setButtonTooltip();
    })
}

function copyTextArea(element) {
    /*  Copy text area, via button click.
    */
    window.getSelection().removeAllRanges();
    const urlField = document.getElementById(element);
    urlField.select();
    document.execCommand('copy');
}
function copyTable(element) {
    /*  Copy tables, via button click.
    */
    window.getSelection().removeAllRanges();
    const urlField = document.getElementById(element);
    let range = document.createRange();
    range.selectNode(urlField);
    window.getSelection().addRange(range);
    document.execCommand('copy');
}

function handleCopyClick() {
    /*  Show and hide Copied tooltip for copy buttons
    */
    $(this).attr('data-original-title', 'Copied!').tooltip('show');
    $(this).on('hidden.bs.tooltip', () => $(this).attr('data-original-title', 'Copy to clipboard'));
}
function handleLotteryClick() {
    /*  Reset tables and start the lottery process 
    */
    loadInputs();
    $('#table-winners tbody tr').remove();
    $('#table-winners-donors tbody tr').remove();
    $('#winner-area').val('');
    $('#winner-post')[0].classList.add('hidden');
    
    __instance__.shuffle();
    __instance__.getWinners();
    __instance__.getAssignedDonors();

    $('#tables-lottery')[0].classList.remove('hidden');

    confetti({
        particleCount: 100,
        spread: 40,
        origin: {
            x: Math.random() * (0.6 - 0.4) + 0.4,
            // since they fall down, start a bit higher than random
            y: Math.random() * (0.6 - 0.4) + 0.4
        },
        colors: ["#FFFFFF", "#5d4a1f", "#D1B464", "#FFFFAC"]
    })
    confetti({
        particleCount: 130,
        spread: 60,
        origin: {
            x: Math.random() * (0.6 - 0.4) + 0.4,
            // since they fall down, start a bit higher than random
            y: Math.random() * (0.9 - 0.4) + 0.4
        },
        colors: ["#FFFFFF", "#5d4a1f", "#D1B464", "#FFFFAC"]
    })
    confetti({
        particleCount: 100,
        spread: 80,
        origin: {
            x: Math.random() * (0.6 - 0.4) + 0.4,
            // since they fall down, start a bit higher than random
            y: Math.random() * (0.7 - 0.3) + 0.3
        },
        colors: ["#FFFFFF", "#5d4a1f", "#D1B464", "#FFFFAC"]
    })
}
function handleShuffleClick() {
    /*  Shuffle the instance... 
        only takes effect before Lottery is pressed of course
    */
    __instance__.shuffle();
    loadInfo();
    const button = $('#shuffle-button');
    button.attr('data-original-title', 'Shuffled!').tooltip('show');
    button.on('hidden.bs.tooltip', () => button.attr('data-original-title', 'Lucky shuffle!'));

    confetti({
        particleCount: 100,
        spread: 50,
        origin: {
            x: Math.random() * (0.6 - 0.4) + 0.4,
            // since they fall down, start a bit higher than random
            y: Math.random() * (0.9 - 0.4) + 0.4
        },
        colors: ["#FFFFFF", "#5d4a1f", "#D1B464", "#FFFFAC"]
    })
}
function handleInfoClick() {
    /*  Display the basic informations that is used
        in the shuffle for transparency.
    */
    loadInputs();
    let tables_info = $('#tables-info')[0].classList;
    let info_button = $('#info-button');

    if (tables_info.contains('hidden')) {
        tables_info.remove('hidden');
        info_button.text('Less Info');
        
    } else {
        tables_info.add('hidden');
        info_button.text('More Info');
    }

    if (RELOAD_INFO) {
        RELOAD_INFO = false;
        loadInfo();
    }
}
function handleReloadData() {
    /*  Reload data from the sheet, so erase all loaded data
        and re-init everything as if first run. 
    */
    $('#table-winners tbody tr').remove();
    $('#table-winners-donors tbody tr').remove();
    $('#tables-info tbody tr').remove();
    $('#tables-lottery tbody tr').remove();
    $('#tables-lottery')[0].classList.add('hidden');
    
    $('#intro-area').text('');
    $('#intro-post')[0].classList.add('hidden');
    
    $('#winner-area').val('');
    $('#winner-post')[0].classList.add('hidden');
    
    load();
}
function handleCreatePost() {
    /*  Copy pasta to create the info post.
        --Intro buildings
        --Buildings
        --Intro donors
        --Donors
    */
    let buildings = documentation.find((entry) => entry.String === 'intro-ge-buildings');
    let buildings2 = documentation.find((entry) => entry.String === 'intro-ge-buildings2');
    let donors = documentation.find((entry) => entry.String == 'intro-ge-donors');
    var text = '';

    // Buildings
    text += buildings.Text + "\n";
    $('#table-buildings tbody tr').each((idx, tr) => text += '\n' + tr.innerText.replace('\t', ': ', 1));
    text += '\n\n';
    text += buildings2.Text + '\n\n';
    // Donors
    text += donors.Text + '\n';
    $('#table-donors tbody tr').each((idx, tr) => text += '\n' + tr.innerText.replace('\t', ': ', 1));
    
    $('#intro-area').val(text);
    $('#intro-post')[0].classList.remove('hidden');
}
function handleCreateWinnerPost() {
    /*  Copy pasta to create the info post.
        --Intro winners
        --Winners
        --Donors
        --End
    */
    let winners = documentation.find((entry) => entry.String === 'winners-lotto');
    let donors = documentation.find((entry) => entry.String === 'donors-lotto');
    let end = documentation.find((entry) => entry.String === 'end-lotto');
    var text = '';

    // Winners
    text += winners.Text + '\n';
    $('#table-winners tbody tr').each((idx, tr) => text += '\n' + tr.innerText);
    text += '\n\n';
    // Donors
    text += donors.Text + '\n';
    $('#table-winners-donors tbody tr').each((idx, tr) => text += '\n' + tr.innerText);
    text += '\n\n' + end.Text;

    $('#winner-area').val(text);
    $('#winner-post')[0].classList.remove('hidden');
}

$(document).on('show.bs.tooltip', function (e) {
    setTimeout(function() {   //calls click event after a certain time
        $('[data-toggle="tooltip"]').tooltip('hide');
    }, 4000)
})

$(document).scroll(function() {
    /*  Sticky navigation change bg color on scroll,
        display back to top button.
    */
    let scroll = $(window).scrollTop();

    if (scroll < 450) {
        isSticky = false;
        $('.sticky-top')[0].classList.remove('active-sticky');
        $('.js-top').css('display', 'none');

    } else if (!isSticky) {
        isSticky = true;
        $('.sticky-top')[0].classList.add('active-sticky');
        $('.js-top').css('display', 'block');
    }
})
$(document).ready(__init__);
