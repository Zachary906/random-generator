// Pokémon Wheel Spinner
// IMMEDIATE TEST - Change page title
try {
    document.title = 'JS START ' + Date.now();
    
    // Expose wheel opening function IMMEDIATELY
    window.openWheelGen = function(gen) {
        document.title = 'Opening: ' + gen;
        try {
            if (typeof window.triggerWheelMode === 'function') {
                window.triggerWheelMode(gen);
            } else {
                // Fallback: wait a bit and try again
                setTimeout(function() {
                    if (typeof window.triggerWheelMode === 'function') {
                        window.triggerWheelMode(gen);
                    } else {
                        alert('Wheel system not ready. Please wait 2 seconds and try again.');
                    }
                }, 500);
            }
        } catch(e) {
            alert('Error opening wheel: ' + e.message);
        }
    };
    
} catch(e) {
    alert('Init error: ' + e.message);
}

// Console interceptor - MUST BE FIRST
let __consoleMessages = [];
let __consoleVisible = false;
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.log = function(...args) {
    try {
        const msg = args.map(a => {
            if (typeof a === 'object') {
                if (a === null) return 'null';
                if (a instanceof NodeList) return `NodeList(${a.length})`;
                if (a instanceof HTMLElement) return `<${a.tagName}>`;
                try { return JSON.stringify(a); } catch(e) { return '[Object]'; }
            }
            return String(a);
        }).join(' ');
        __consoleMessages.push({ type: 'log', msg, time: new Date().toISOString() });
        if (__consoleMessages.length > 200) __consoleMessages.shift();
        originalConsoleLog.apply(console, args);
    } catch(e) {
        originalConsoleLog.call(console, 'Console.log error:', e);
    }
};

console.error = function(...args) {
    const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ');
    __consoleMessages.push({ type: 'error', msg, time: new Date().toISOString() });
    if (__consoleMessages.length > 200) __consoleMessages.shift();
    originalConsoleError.apply(console, args);
};

console.warn = function(...args) {
    const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ');
    __consoleMessages.push({ type: 'warn', msg, time: new Date().toISOString() });
    if (__consoleMessages.length > 200) __consoleMessages.shift();
    originalConsoleWarn.apply(console, args);
};

console.log('=== SCRIPT LOADING v5.0 ===', new Date().toISOString());
// Debug flag and helper with on-screen panel support
const DEBUG = true;
let __debugBuffer = [];
let __debugPanelVisible = false;
console.log('[INIT] Debug system initialized. Press "d" to toggle debug panel.');
function dbg(...args) {
    if (!DEBUG) return;
    const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
    const time = new Date().toISOString().split('T')[1].replace('Z','');
    const line = `[${time}] ${msg}`;
    console.log('[DEBUG]', ...args);
    __debugBuffer.push(line);
    if (__debugBuffer.length > 100) __debugBuffer.shift();
    if (__debugPanelVisible) updateDebugPanel();
}

function updateDebugPanel() {
    const el = document.getElementById('debugPanel');
    if (!el) return;
    el.innerHTML = `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <strong style="color:#0ff;">Debug Panel</strong>
        <button id="clearDebugBtn" style="background:#222; color:#0ff; border:1px solid #0ff; padding:2px 6px; border-radius:4px; cursor:pointer; font-size:11px;">Clear</button>
    </div>` +
    '<div style="font-size:11px; line-height:1.3; white-space:pre-wrap;">' + __debugBuffer.slice().reverse().join('\n') + '</div>';
    const clearBtn = document.getElementById('clearDebugBtn');
    if (clearBtn) {
        clearBtn.onclick = () => { __debugBuffer = []; updateDebugPanel(); };
    }
}

function toggleDebugPanel() {
    let el = document.getElementById('debugPanel');
    if (!el) {
        el = document.createElement('div');
        el.id = 'debugPanel';
        el.style.position = 'fixed';
        el.style.top = '10px';
        el.style.right = '10px';
        el.style.width = '320px';
        el.style.height = '300px';
        el.style.background = 'rgba(0,0,0,0.85)';
        el.style.color = '#ccc';
        el.style.fontFamily = 'monospace';
        el.style.fontSize = '12px';
        el.style.padding = '10px';
        el.style.border = '1px solid #0ff';
        el.style.borderRadius = '8px';
        el.style.boxShadow = '0 0 12px rgba(0,255,255,0.4)';
        el.style.overflowY = 'auto';
        el.style.zIndex = '9999';
        document.body.appendChild(el);
    }
    __debugPanelVisible = !__debugPanelVisible;
    el.style.display = __debugPanelVisible ? 'block' : 'none';
    if (__debugPanelVisible) updateDebugPanel();
}

// Console overlay (press 'c' to toggle)
// Note: console interceptor is at the top of the file

function updateConsoleOverlay() {
    const overlay = document.getElementById('consoleOverlay');
    if (!overlay) return;
    const content = overlay.querySelector('.console-content');
    if (__consoleVisible) {
        content.innerHTML = __consoleMessages.slice().reverse().map(item => {
            const color = item.type === 'error' ? '#ff5555' : item.type === 'warn' ? '#ffaa00' : '#00ff00';
            return `<div style="color: ${color}; margin-bottom: 5px; font-family: monospace; font-size: 12px;">[${item.time.split('T')[1].split('.')[0]}] ${item.msg}</div>`;
        }).join('');
    }
}

function showConsoleOverlay() {
    let overlay = document.getElementById('consoleOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'consoleOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 500px;
            height: 400px;
            background: rgba(0, 0, 0, 0.95);
            z-index: 999999;
            padding: 10px;
            overflow-y: auto;
            display: none;
            border: 2px solid #00ff00;
            border-radius: 5px;
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
        `;
        
        const header = document.createElement('div');
        header.style.cssText = 'color: white; font-size: 20px; margin-bottom: 10px; display: flex; justify-content: space-between;';
        header.innerHTML = `<span>Console Output (Press C to close)</span>`;
        
        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Clear';
        clearBtn.style.cssText = 'background: #ff5555; color: white; border: none; padding: 5px 15px; cursor: pointer; border-radius: 3px;';
        clearBtn.onclick = () => {
            __consoleMessages = [];
            updateConsoleOverlay();
        };
        header.appendChild(clearBtn);
        
        const content = document.createElement('div');
        content.className = 'console-content';
        content.style.cssText = 'color: #00ff00; font-family: monospace; white-space: pre-wrap; word-break: break-all;';
        
        overlay.appendChild(header);
        overlay.appendChild(content);
        document.body.appendChild(overlay);
    }
    
    __consoleVisible = !__consoleVisible;
    overlay.style.display = __consoleVisible ? 'block' : 'none';
    if (__consoleVisible) updateConsoleOverlay();
}

// Expose to window for inline onclick
window.showConsoleOverlay = showConsoleOverlay;

document.addEventListener('keydown', (e) => {
    // Avoid typing conflicts inside inputs/textareas
    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea') return;
    
    if (e.key === 'd' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        toggleDebugPanel();
    }
    
    if (e.key === 'c' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        showConsoleOverlay();
    }
});
let selectedGeneration = null;
let pokemonLimit = 151;
let pokemonOffset = 0;
let isLegendaryMode = false;
let isEeveelutionMode = false;
let isParadoxMode = false;
let isStarterMode = false;
let isFossilMode = false;
let isZMoveMode = false;
let isGigantamaxMode = false;
let isTeraMode = false;
let isRegionalMode = false;
let isMegaMode = false;
let isGamesMode = false;
let isUltimateMode = false;

// Pokémon Games list
const zMoves = [
    { name: 'Breakneck Blitz', type: 'Normal', category: 'Type-based' },
    { name: 'All-Out Pummeling', type: 'Fighting', category: 'Type-based' },
    { name: 'Supersonic Skystrike', type: 'Flying', category: 'Type-based' },
    { name: 'Acid Downpour', type: 'Poison', category: 'Type-based' },
    { name: 'Tectonic Rage', type: 'Ground', category: 'Type-based' },
    { name: 'Continental Crush', type: 'Rock', category: 'Type-based' },
    { name: 'Savage Spin-Out', type: 'Bug', category: 'Type-based' },
    { name: 'Never-Ending Nightmare', type: 'Ghost', category: 'Type-based' },
    { name: 'Corkscrew Crash', type: 'Steel', category: 'Type-based' },
    { name: 'Inferno Overdrive', type: 'Fire', category: 'Type-based' },
    { name: 'Hydro Vortex', type: 'Water', category: 'Type-based' },
    { name: 'Bloom Doom', type: 'Grass', category: 'Type-based' },
    { name: 'Gigavolt Havoc', type: 'Electric', category: 'Type-based' },
    { name: 'Shattered Psyche', type: 'Psychic', category: 'Type-based' },
    { name: 'Subzero Slammer', type: 'Ice', category: 'Type-based' },
    { name: 'Devastating Drake', type: 'Dragon', category: 'Type-based' },
    { name: 'Black Hole Eclipse', type: 'Dark', category: 'Type-based' },
    { name: 'Twinkle Tackle', type: 'Fairy', category: 'Type-based' },
    { name: 'Catastropika', type: 'Electric', category: 'Pikachu Exclusive' },
    { name: '10,000,000 Volt Thunderbolt', type: 'Electric', category: 'Pikachu (Cap) Exclusive' },
    { name: 'Stoked Sparksurfer', type: 'Electric', category: 'Alolan Raichu Exclusive' },
    { name: 'Extreme Evoboost', type: 'Normal', category: 'Eevee Exclusive' },
    { name: 'Pulverizing Pancake', type: 'Normal', category: 'Snorlax Exclusive' },
    { name: 'Genesis Supernova', type: 'Psychic', category: 'Mew Exclusive' },
    { name: 'Sinister Arrow Raid', type: 'Ghost', category: 'Decidueye Exclusive' },
    { name: 'Malicious Moonsault', type: 'Dark', category: 'Incineroar Exclusive' },
    { name: 'Oceanic Operetta', type: 'Water', category: 'Primarina Exclusive' },
    { name: 'Soul-Stealing 7-Star Strike', type: 'Ghost', category: 'Marshadow Exclusive' },
    { name: 'Splintered Stormshards', type: 'Rock', category: 'Lycanroc Exclusive' },
    { name: "Let's Snuggle Forever", type: 'Fairy', category: 'Mimikyu Exclusive' },
    { name: 'Clangorous Soulblaze', type: 'Dragon', category: 'Kommo-o Exclusive' },
    { name: 'Guardian of Alola', type: 'Fairy', category: 'Tapu Exclusive' },
    { name: 'Searing Sunraze Smash', type: 'Steel', category: 'Solgaleo Exclusive' },
    { name: 'Menacing Moonraze Maelstrom', type: 'Ghost', category: 'Lunala Exclusive' },
    { name: 'Light That Burns the Sky', type: 'Psychic', category: 'Necrozma Exclusive' }
];

// Pokémon Games list (mainline games) - Updated 2025
const pokemonGames = [
    { name: 'Pokémon Red', generation: 'Gen 1', region: 'Kanto', year: 1996 },
    { name: 'Pokémon Blue', generation: 'Gen 1', region: 'Kanto', year: 1996 },
    { name: 'Pokémon Yellow', generation: 'Gen 1', region: 'Kanto', year: 1998 },
    { name: 'Pokémon Gold', generation: 'Gen 2', region: 'Johto', year: 1999 },
    { name: 'Pokémon Silver', generation: 'Gen 2', region: 'Johto', year: 1999 },
    { name: 'Pokémon Crystal', generation: 'Gen 2', region: 'Johto', year: 2000 },
    { name: 'Pokémon Ruby', generation: 'Gen 3', region: 'Hoenn', year: 2002 },
    { name: 'Pokémon Sapphire', generation: 'Gen 3', region: 'Hoenn', year: 2002 },
    { name: 'Pokémon Emerald', generation: 'Gen 3', region: 'Hoenn', year: 2004 },
    { name: 'Pokémon FireRed', generation: 'Gen 3', region: 'Kanto', year: 2004 },
    { name: 'Pokémon LeafGreen', generation: 'Gen 3', region: 'Kanto', year: 2004 },
    { name: 'Pokémon Diamond', generation: 'Gen 4', region: 'Sinnoh', year: 2006 },
    { name: 'Pokémon Pearl', generation: 'Gen 4', region: 'Sinnoh', year: 2006 },
    { name: 'Pokémon Platinum', generation: 'Gen 4', region: 'Sinnoh', year: 2008 },
    { name: 'Pokémon HeartGold', generation: 'Gen 4', region: 'Johto', year: 2009 },
    { name: 'Pokémon SoulSilver', generation: 'Gen 4', region: 'Johto', year: 2009 },
    { name: 'Pokémon Black', generation: 'Gen 5', region: 'Unova', year: 2010 },
    { name: 'Pokémon White', generation: 'Gen 5', region: 'Unova', year: 2010 },
    { name: 'Pokémon Black 2', generation: 'Gen 5', region: 'Unova', year: 2012 },
    { name: 'Pokémon White 2', generation: 'Gen 5', region: 'Unova', year: 2012 },
    { name: 'Pokémon X', generation: 'Gen 6', region: 'Kalos', year: 2013 },
    { name: 'Pokémon Y', generation: 'Gen 6', region: 'Kalos', year: 2013 },
    { name: 'Pokémon Omega Ruby', generation: 'Gen 6', region: 'Hoenn', year: 2014 },
    { name: 'Pokémon Alpha Sapphire', generation: 'Gen 6', region: 'Hoenn', year: 2014 },
    { name: 'Pokémon Sun', generation: 'Gen 7', region: 'Alola', year: 2016 },
    { name: 'Pokémon Moon', generation: 'Gen 7', region: 'Alola', year: 2016 },
    { name: 'Pokémon Ultra Sun', generation: 'Gen 7', region: 'Alola', year: 2017 },
    { name: 'Pokémon Ultra Moon', generation: 'Gen 7', region: 'Alola', year: 2017 },
    { name: "Pokémon Let's Go, Pikachu!", generation: 'Gen 7', region: 'Kanto', year: 2018 },
    { name: "Pokémon Let's Go, Eevee!", generation: 'Gen 7', region: 'Kanto', year: 2018 },
    { name: 'Pokémon Sword', generation: 'Gen 8', region: 'Galar', year: 2019 },
    { name: 'Pokémon Shield', generation: 'Gen 8', region: 'Galar', year: 2019 },
    { name: 'Pokémon Brilliant Diamond', generation: 'Gen 8', region: 'Sinnoh', year: 2021 },
    { name: 'Pokémon Shining Pearl', generation: 'Gen 8', region: 'Sinnoh', year: 2021 },
    { name: 'Pokémon Legends: Arceus', generation: 'Gen 8', region: 'Hisui', year: 2022 },
    { name: 'Pokémon Scarlet', generation: 'Gen 9', region: 'Paldea', year: 2022 },
    { name: 'Pokémon Violet', generation: 'Gen 9', region: 'Paldea', year: 2022 },
    { name: 'Pokémon Legends: Z-A', generation: 'Gen 10', region: 'Kalos', year: 2025 },
    { name: 'Pokémon Trading Card Game Live', generation: 'Digital', region: 'Global', year: 2024 },
    { name: 'Pokémon Quest', generation: 'Spin-off', region: 'Tumblecube Island', year: 2018 },
    { name: 'Pokémon Detective Pikachu Returns', generation: 'Gen 8', region: 'Ryme City', year: 2024 }
];

// List of Gigantamax Pokémon IDs (Gigantamax form IDs from PokéAPI)
const gigantamaxPokemon = [
    10195, // Venusaur-Gmax
    10196, // Charizard-Gmax
    10197, // Blastoise-Gmax
    10198, // Butterfree-Gmax
    10199, // Pikachu-Gmax
    10200, // Meowth-Gmax
    10201, // Machamp-Gmax
    10202, // Gengar-Gmax
    10203, // Kingler-Gmax
    10204, // Lapras-Gmax
    10205, // Eevee-Gmax
    10206, // Snorlax-Gmax
    10207, // Garbodor-Gmax
    10208, // Melmetal-Gmax
    10209, // Rillaboom-Gmax
    10210, // Cinderace-Gmax
    10211, // Inteleon-Gmax
    10212, // Corviknight-Gmax
    10213, // Orbeetle-Gmax
    10214, // Drednaw-Gmax
    10215, // Coalossal-Gmax
    10216, // Flapple-Gmax
    10217, // Appletun-Gmax
    10218, // Sandaconda-Gmax
    10219, // Toxtricity-Gmax (Amped)
    10220, // Centiskorch-Gmax
    10221, // Hatterene-Gmax
    10222, // Grimmsnarl-Gmax
    10223, // Alcremie-Gmax
    10224, // Copperajah-Gmax
    10225, // Duraludon-Gmax
    10226, // Urshifu-Gmax (Single Strike)
    10227  // Urshifu-Gmax (Rapid Strike)
];

// List of Regional Variant Pokémon (Alolan, Galarian, Hisuian, Paldean)
const regionalVariants = [
    // Alolan Forms (Gen 7)
    10091, // Rattata-Alola
    10092, // Raticate-Alola
    10093, // Raichu-Alola
    10094, // Sandshrew-Alola
    10095, // Sandslash-Alola
    10096, // Vulpix-Alola
    10097, // Ninetales-Alola
    10098, // Diglett-Alola
    10099, // Dugtrio-Alola
    10100, // Meowth-Alola
    10101, // Persian-Alola
    10102, // Geodude-Alola
    10103, // Graveler-Alola
    10104, // Golem-Alola
    10105, // Grimer-Alola
    10106, // Muk-Alola
    10107, // Exeggutor-Alola
    10108, // Marowak-Alola
    // Galarian Forms (Gen 8)
    10158, // Meowth-Galar
    10159, // Ponyta-Galar
    10160, // Rapidash-Galar
    10161, // Slowpoke-Galar
    10162, // Slowbro-Galar
    10163, // Farfetchd-Galar
    10164, // Weezing-Galar
    10165, // Mr-Mime-Galar
    10166, // Articuno-Galar
    10167, // Zapdos-Galar
    10168, // Moltres-Galar
    10169, // Slowking-Galar
    10170, // Corsola-Galar
    10171, // Zigzagoon-Galar
    10172, // Linoone-Galar
    10173, // Darumaka-Galar
    10174, // Darmanitan-Galar
    10175, // Yamask-Galar
    10176, // Stunfisk-Galar
    // Hisuian Forms (Gen 8 Legends Arceus)
    10229, // Growlithe-Hisui
    10230, // Arcanine-Hisui
    10231, // Voltorb-Hisui
    10232, // Electrode-Hisui
    10233, // Typhlosion-Hisui
    10234, // Qwilfish-Hisui
    10235, // Sneasel-Hisui
    10236, // Samurott-Hisui
    10237, // Lilligant-Hisui
    10238, // Zorua-Hisui
    10239, // Zoroark-Hisui
    10240, // Braviary-Hisui
    10241, // Sliggoo-Hisui
    10242, // Goodra-Hisui
    10243, // Avalugg-Hisui
    10244, // Decidueye-Hisui
    // Paldean Forms (Gen 9)
    10246, // Tauros-Paldea-Combat
    10247, // Tauros-Paldea-Blaze
    10248  // Tauros-Paldea-Aqua
];

// List of Mega Evolution Pokémon (Gen 6-7 + Legends: Z-A)
const megaEvolutions = [
    10033, // Venusaur-Mega
    10034, // Charizard-Mega-X
    10035, // Charizard-Mega-Y
    10036, // Blastoise-Mega
    10037, // Alakazam-Mega
    10038, // Gengar-Mega
    10039, // Kangaskhan-Mega
    10040, // Pinsir-Mega
    10041, // Gyarados-Mega
    10042, // Aerodactyl-Mega
    10043, // Mewtwo-Mega-X
    10044, // Mewtwo-Mega-Y
    10045, // Ampharos-Mega
    10046, // Scizor-Mega
    10047, // Heracross-Mega
    10048, // Houndoom-Mega
    10049, // Tyranitar-Mega
    10050, // Blaziken-Mega
    10051, // Gardevoir-Mega
    10052, // Mawile-Mega
    10053, // Aggron-Mega
    10054, // Medicham-Mega
    10055, // Manectric-Mega
    10056, // Banette-Mega
    10057, // Absol-Mega
    10058, // Garchomp-Mega
    10059, // Lucario-Mega
    10060, // Abomasnow-Mega
    10061, // Beedrill-Mega
    10062, // Pidgeot-Mega
    10063, // Slowbro-Mega
    10064, // Steelix-Mega
    10065, // Sceptile-Mega
    10066, // Swampert-Mega
    10067, // Sableye-Mega
    10068, // Sharpedo-Mega
    10069, // Camerupt-Mega
    10070, // Altaria-Mega
    10071, // Glalie-Mega
    10072, // Salamence-Mega
    10073, // Metagross-Mega
    10074, // Latias-Mega
    10075, // Latios-Mega
    10076, // Rayquaza-Mega
    10077, // Lopunny-Mega
    10078, // Garchomp-Mega
    10079, // Audino-Mega
    10080, // Diancie-Mega
    10090, // Gallade-Mega
    // New Mega Evolutions from Pokémon Legends: Z-A
    10278, // Clefable-Mega
    10279, // Victreebel-Mega
    10280, // Starmie-Mega
    10281, // Dragonite-Mega
    10282, // Meganium-Mega
    10283, // Feraligatr-Mega
    10284, // Skarmory-Mega
    10285, // Froslass-Mega
    10286, // Emboar-Mega
    10287, // Excadrill-Mega
    10288, // Scolipede-Mega
    10289, // Scrafty-Mega
    10290, // Eelektross-Mega
    10291, // Chandelure-Mega
    10292, // Chesnaught-Mega
    10293, // Delphox-Mega
    10294, // Greninja-Mega
    10295, // Pyroar-Mega
    10296, // Floette-Mega
    10297, // Malamar-Mega
    10298, // Barbaracle-Mega
    10299, // Dragalge-Mega
    10300, // Hawlucha-Mega
    10301, // Zygarde-Mega
    10302, // Drampa-Mega
    10303  // Falinks-Mega
];

// List of Terastallized Pokémon (Gen 9 Pokémon that commonly Terastallize)
const teraPokemon = [
    906,  // Sprigatito
    907,  // Floragato
    908,  // Meowscarada
    909,  // Fuecoco
    910,  // Crocalor
    911,  // Skeledirge
    912,  // Quaxly
    913,  // Quaxwell
    914,  // Quaquaval
    921,  // Pawmi
    922,  // Pawmo
    923,  // Pawmot
    935,  // Charcadet
    936,  // Armarouge
    937,  // Ceruledge
    946,  // Bramblin
    947,  // Brambleghast
    953,  // Rellor
    954,  // Rabsca
    957,  // Tinkatink
    958,  // Tinkatuff
    959,  // Tinkaton
    974,  // Cetoddle
    975,  // Cetitan
    976,  // Veluza
    978,  // Tatsugiri
    984,  // Great Tusk
    985,  // Scream Tail
    986,  // Brute Bonnet
    987,  // Flutter Mane
    988,  // Slither Wing
    989,  // Sandy Shocks
    990,  // Iron Treads
    991,  // Iron Bundle
    992,  // Iron Hands
    993,  // Iron Jugulis
    994,  // Iron Moth
    995,  // Iron Thorns
    1007, // Koraidon
    1008, // Miraidon
    1009, // Walking Wake
    1010, // Iron Leaves
    1011, // Poltchageist
    1012, // Sinistcha
    1013, // Okidogi
    1014, // Munkidori
    1015, // Fezandipiti
    1016, // Ogerpon
    1017, // Archaludon
    1024, // Terapagos
    1025  // Pecharunt
];

// List of Legendary and Mythical Pokémon IDs
const legendaryAndMythical = [
    144, 145, 146, 150, 151, // Gen 1: Articuno, Zapdos, Moltres, Mewtwo, Mew
    243, 244, 245, 249, 250, 251, // Gen 2: Raikou, Entei, Suicune, Lugia, Ho-Oh, Celebi
    377, 378, 379, 380, 381, 382, 383, 384, 385, 386, // Gen 3: Regis, Latis, Groudon, Kyogre, Rayquaza, Jirachi, Deoxys
    480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, // Gen 4: Lake trio, Dialga, Palkia, Giratina, Regigigas, Heatran, Cresselia, Phione, Manaphy, Darkrai, Shaymin, Arceus
    494, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649, // Gen 5: Victini, Swords of Justice, Tao trio, Therian forms, Tornadus, Thundurus, Landorus, Kyurem, Keldeo, Meloetta, Genesect
    716, 717, 718, 719, 720, 721, // Gen 6: Xerneas, Yveltal, Zygarde, Diancie, Hoopa, Volcanion
    772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 800, 801, 802, 807, 808, 809, // Gen 7: Type: Null, Silvally, Tapus, Cosmog line, Necrozma, Magearna, Marshadow, Zeraora, Meltan, Melmetal
    888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898, 905, // Gen 8: Zacian, Zamazenta, Eternatus, Kubfu, Urshifu, Zarude, Regieleki, Regidrago, Glastrier, Spectrier, Calyrex, Enamorus
    1001, 1002, 1003, 1004, 1007, 1008, 1009, 1010, 1014, 1015, 1016, 1017, 1020, 1021, 1022, 1023, 1024, 1025 // Gen 9: Treasures of Ruin, Loyal Three, Ogerpon, Terapagos, Pecharunt
];

// List of Eeveelutions (Eevee and all evolutions)
const eeveelutions = [
    133, // Eevee
    134, // Vaporeon
    135, // Jolteon
    136, // Flareon
    196, // Espeon
    197, // Umbreon
    470, // Leafeon
    471, // Glaceon
    700  // Sylveon
];

// Eeveelution info
const eeveelutionInfo = {
    133: { type: 'Normal', description: 'The Evolution Pokémon' },
    134: { type: 'Water', description: 'The Bubble Jet Pokémon' },
    135: { type: 'Electric', description: 'The Lightning Pokémon' },
    136: { type: 'Fire', description: 'The Flame Pokémon' },
    196: { type: 'Psychic', description: 'The Sun Pokémon' },
    197: { type: 'Dark', description: 'The Moonlight Pokémon' },
    470: { type: 'Grass', description: 'The Verdant Pokémon' },
    471: { type: 'Ice', description: 'The Fresh Snow Pokémon' },
    700: { type: 'Fairy', description: 'The Intertwining Pokémon' }
};

// List of Paradox Pokémon (Ancient and Future forms from Gen 9)
const paradoxPokemon = [
    984,  // Great Tusk (Ancient - Donphan)
    985,  // Scream Tail (Ancient - Jigglypuff)
    986,  // Brute Bonnet (Ancient - Amoonguss)
    987,  // Flutter Mane (Ancient - Misdreavus)
    988,  // Slither Wing (Ancient - Volcarona)
    989,  // Sandy Shocks (Ancient - Magneton)
    990,  // Iron Treads (Future - Donphan)
    991,  // Iron Bundle (Future - Delibird)
    992,  // Iron Hands (Future - Hariyama)
    993,  // Iron Jugulis (Future - Hydreigon)
    994,  // Iron Moth (Future - Volcarona)
    995,  // Iron Thorns (Future - Tyranitar)
    1005, // Roaring Moon (Ancient - Salamence)
    1006, // Iron Valiant (Future - Gallade/Gardevoir)
    1009, // Walking Wake (Ancient - Suicune)
    1010, // Iron Leaves (Future - Virizion)
    1020, // Gouging Fire (Ancient - Entei)
    1021, // Raging Bolt (Ancient - Raikou)
    1022, // Iron Boulder (Future - Terrakion)
    1023, // Iron Crown (Future - Cobalion)
];

// Paradox Pokémon info
const paradoxInfo = {
    984: { era: 'Ancient', basedOn: 'Donphan' },
    985: { era: 'Ancient', basedOn: 'Jigglypuff' },
    986: { era: 'Ancient', basedOn: 'Amoonguss' },
    987: { era: 'Ancient', basedOn: 'Misdreavus' },
    988: { era: 'Ancient', basedOn: 'Volcarona' },
    989: { era: 'Ancient', basedOn: 'Magneton' },
    990: { era: 'Future', basedOn: 'Donphan' },
    991: { era: 'Future', basedOn: 'Delibird' },
    992: { era: 'Future', basedOn: 'Hariyama' },
    993: { era: 'Future', basedOn: 'Hydreigon' },
    994: { era: 'Future', basedOn: 'Volcarona' },
    995: { era: 'Future', basedOn: 'Tyranitar' },
    1005: { era: 'Ancient', basedOn: 'Salamence' },
    1006: { era: 'Future', basedOn: 'Gallade/Gardevoir' },
    1009: { era: 'Ancient', basedOn: 'Suicune' },
    1010: { era: 'Future', basedOn: 'Virizion' },
    1020: { era: 'Ancient', basedOn: 'Entei' },
    1021: { era: 'Ancient', basedOn: 'Raikou' },
    1022: { era: 'Future', basedOn: 'Terrakion' },
    1023: { era: 'Future', basedOn: 'Cobalion' },
};

// All Fossil Pokémon - evolved from fossils or evolved from fossil Pokémon
// Includes all evolutionary lines starting from fossil revivals
const fossilPokemon = [
    // Gen 1 - Omanyte line (evolves from fossil)
    138, 139, // Omanyte → Omastar
    
    // Gen 1 - Kabuto line (evolves from fossil)
    140, 141, // Kabuto → Kabutops
    
    // Gen 3 - Lileep line (evolves from fossil)
    345, 346, // Lileep → Cradily
    
    // Gen 3 - Anorith line (evolves from fossil)
    347, 348, // Anorith → Armaldo
    
    // Gen 4 - Cranidos line (evolves from fossil)
    408, 409, // Cranidos → Rampardos
    
    // Gen 4 - Shieldon line (evolves from fossil)
    410, 411, // Shieldon → Bastionage
    
    // Gen 5 - Tirtouga line (evolves from fossil)
    564, 565, // Tirtouga → Carracosta
    
    // Gen 5 - Archen line (evolves from fossil)
    566, 567, // Archen → Archeops
    
    // Gen 8 - Dracozolt (fossil revival combination)
    880, // Dracozolt (Dragon/Electric)
    
    // Gen 8 - Arctozolt (fossil revival combination)
    882, // Arctozolt (Electric/Ice)
    
    // Gen 8 - Dracovish (fossil revival combination)
    884, // Dracovish (Water/Dragon)
    
    // Gen 8 - Arctovish (fossil revival combination)
    886, // Arctovish (Water/Ice)
];

// List of all Starter Pokémon and their evolutions
const starterPokemon = [
    // Gen 1
    1, 2, 3,     // Bulbasaur line
    4, 5, 6,     // Charmander line
    7, 8, 9,     // Squirtle line
    // Gen 2
    152, 153, 154, // Chikorita line
    155, 156, 157, // Cyndaquil line
    158, 159, 160, // Totodile line
    // Gen 3
    252, 253, 254, // Treecko line
    255, 256, 257, // Torchic line
    258, 259, 260, // Mudkip line
    // Gen 4
    387, 388, 389, // Turtwig line
    390, 391, 392, // Chimchar line
    393, 394, 395, // Piplup line
    // Gen 5
    495, 496, 497, // Snivy line
    498, 499, 500, // Tepig line
    501, 502, 503, // Oshawott line
    // Gen 6
    650, 651, 652, // Chespin line
    653, 654, 655, // Fennekin line
    656, 657, 658, // Froakie line
    // Gen 7
    722, 723, 724, // Rowlet line
    725, 726, 727, // Litten line
    728, 729, 730, // Popplio line
    // Gen 8
    810, 811, 812, // Grookey line
    813, 814, 815, // Scorbunny line
    816, 817, 818, // Sobble line
    // Gen 9
    906, 907, 908, // Sprigatito line
    909, 910, 911, // Fuecoco line
    912, 913, 914  // Quaxly line
];

// Starter Pokémon info
const starterInfo = {
    1: { stage: 'Base', type: 'Grass/Poison', generation: 1 },
    2: { stage: 'Stage 1', type: 'Grass/Poison', generation: 1 },
    3: { stage: 'Stage 2', type: 'Grass/Poison', generation: 1 },
    4: { stage: 'Base', type: 'Fire', generation: 1 },
    5: { stage: 'Stage 1', type: 'Fire', generation: 1 },
    6: { stage: 'Stage 2', type: 'Fire/Flying', generation: 1 },
    7: { stage: 'Base', type: 'Water', generation: 1 },
    8: { stage: 'Stage 1', type: 'Water', generation: 1 },
    9: { stage: 'Stage 2', type: 'Water', generation: 1 },
    152: { stage: 'Base', type: 'Grass', generation: 2 },
    153: { stage: 'Stage 1', type: 'Grass', generation: 2 },
    154: { stage: 'Stage 2', type: 'Grass', generation: 2 },
    155: { stage: 'Base', type: 'Fire', generation: 2 },
    156: { stage: 'Stage 1', type: 'Fire', generation: 2 },
    157: { stage: 'Stage 2', type: 'Fire', generation: 2 },
    158: { stage: 'Base', type: 'Water', generation: 2 },
    159: { stage: 'Stage 1', type: 'Water', generation: 2 },
    160: { stage: 'Stage 2', type: 'Water', generation: 2 },
    252: { stage: 'Base', type: 'Grass', generation: 3 },
    253: { stage: 'Stage 1', type: 'Grass', generation: 3 },
    254: { stage: 'Stage 2', type: 'Grass', generation: 3 },
    255: { stage: 'Base', type: 'Fire', generation: 3 },
    256: { stage: 'Stage 1', type: 'Fire/Fighting', generation: 3 },
    257: { stage: 'Stage 2', type: 'Fire/Fighting', generation: 3 },
    258: { stage: 'Base', type: 'Water', generation: 3 },
    259: { stage: 'Stage 1', type: 'Water/Ground', generation: 3 },
    260: { stage: 'Stage 2', type: 'Water/Ground', generation: 3 },
    387: { stage: 'Base', type: 'Grass', generation: 4 },
    388: { stage: 'Stage 1', type: 'Grass', generation: 4 },
    389: { stage: 'Stage 2', type: 'Grass/Ground', generation: 4 },
    390: { stage: 'Base', type: 'Fire', generation: 4 },
    391: { stage: 'Stage 1', type: 'Fire/Fighting', generation: 4 },
    392: { stage: 'Stage 2', type: 'Fire/Fighting', generation: 4 },
    393: { stage: 'Base', type: 'Water', generation: 4 },
    394: { stage: 'Stage 1', type: 'Water', generation: 4 },
    395: { stage: 'Stage 2', type: 'Water/Steel', generation: 4 },
    495: { stage: 'Base', type: 'Grass', generation: 5 },
    496: { stage: 'Stage 1', type: 'Grass', generation: 5 },
    497: { stage: 'Stage 2', type: 'Grass', generation: 5 },
    498: { stage: 'Base', type: 'Fire', generation: 5 },
    499: { stage: 'Stage 1', type: 'Fire/Fighting', generation: 5 },
    500: { stage: 'Stage 2', type: 'Fire/Fighting', generation: 5 },
    501: { stage: 'Base', type: 'Water', generation: 5 },
    502: { stage: 'Stage 1', type: 'Water', generation: 5 },
    503: { stage: 'Stage 2', type: 'Water', generation: 5 },
    650: { stage: 'Base', type: 'Grass', generation: 6 },
    651: { stage: 'Stage 1', type: 'Grass', generation: 6 },
    652: { stage: 'Stage 2', type: 'Grass/Fighting', generation: 6 },
    653: { stage: 'Base', type: 'Fire', generation: 6 },
    654: { stage: 'Stage 1', type: 'Fire', generation: 6 },
    655: { stage: 'Stage 2', type: 'Fire/Psychic', generation: 6 },
    656: { stage: 'Base', type: 'Water', generation: 6 },
    657: { stage: 'Stage 1', type: 'Water', generation: 6 },
    658: { stage: 'Stage 2', type: 'Water/Dark', generation: 6 },
    722: { stage: 'Base', type: 'Grass/Flying', generation: 7 },
    723: { stage: 'Stage 1', type: 'Grass/Flying', generation: 7 },
    724: { stage: 'Stage 2', type: 'Grass/Ghost', generation: 7 },
    725: { stage: 'Base', type: 'Fire', generation: 7 },
    726: { stage: 'Stage 1', type: 'Fire', generation: 7 },
    727: { stage: 'Stage 2', type: 'Fire/Dark', generation: 7 },
    728: { stage: 'Base', type: 'Water', generation: 7 },
    729: { stage: 'Stage 1', type: 'Water', generation: 7 },
    730: { stage: 'Stage 2', type: 'Water/Fairy', generation: 7 },
    810: { stage: 'Base', type: 'Grass', generation: 8 },
    811: { stage: 'Stage 1', type: 'Grass', generation: 8 },
    812: { stage: 'Stage 2', type: 'Grass', generation: 8 },
    813: { stage: 'Base', type: 'Fire', generation: 8 },
    814: { stage: 'Stage 1', type: 'Fire', generation: 8 },
    815: { stage: 'Stage 2', type: 'Fire', generation: 8 },
    816: { stage: 'Base', type: 'Water', generation: 8 },
    817: { stage: 'Stage 1', type: 'Water', generation: 8 },
    818: { stage: 'Stage 2', type: 'Water', generation: 8 },
    906: { stage: 'Base', type: 'Grass', generation: 9 },
    907: { stage: 'Stage 1', type: 'Grass', generation: 9 },
    908: { stage: 'Stage 2', type: 'Grass/Dark', generation: 9 },
    909: { stage: 'Base', type: 'Fire', generation: 9 },
    910: { stage: 'Stage 1', type: 'Fire', generation: 9 },
    911: { stage: 'Stage 2', type: 'Fire/Ghost', generation: 9 },
    912: { stage: 'Base', type: 'Water', generation: 9 },
    913: { stage: 'Stage 1', type: 'Water', generation: 9 },
    914: { stage: 'Stage 2', type: 'Water/Fighting', generation: 9 }
};

// G-Max Moves mapping (Pokémon ID to their G-Max move)
const gmaxMoves = {
    3: { move: 'G-Max Vine Lash', type: 'Grass', description: 'A Grass-type attack that Gigantamax Venusaur use. This move continues to deal damage for four turns.' },
    6: { move: 'G-Max Wildfire', type: 'Fire', description: 'A Fire-type attack that Gigantamax Charizard use. This move continues to deal damage for four turns.' },
    9: { move: 'G-Max Cannonade', type: 'Water', description: 'A Water-type attack that Gigantamax Blastoise use. This move continues to deal damage for four turns.' },
    12: { move: 'G-Max Befuddle', type: 'Bug', description: 'A Bug-type attack that Gigantamax Butterfree use. This move inflicts the poisoned, paralyzed, or asleep status condition on opponents.' },
    25: { move: 'G-Max Volt Crash', type: 'Electric', description: 'An Electric-type attack that Gigantamax Pikachu use. This move paralyzes opponents.' },
    52: { move: 'G-Max Gold Rush', type: 'Normal', description: 'A Normal-type attack that Gigantamax Meowth use. This move confuses opponents and also earns extra money.' },
    68: { move: 'G-Max Chi Strike', type: 'Fighting', description: 'A Fighting-type attack that Gigantamax Machamp use. This move raises the chance of critical hits.' },
    94: { move: 'G-Max Terror', type: 'Ghost', description: 'A Ghost-type attack that Gigantamax Gengar use. This move prevents opponents from fleeing or switching out.' },
    99: { move: 'G-Max Foam Burst', type: 'Water', description: 'A Water-type attack that Gigantamax Kingler use. This move harshly lowers the Speed of opponents.' },
    131: { move: 'G-Max Resonance', type: 'Ice', description: 'An Ice-type attack that Gigantamax Lapras use. This move reduces the damage received for five turns.' },
    133: { move: 'G-Max Cuddle', type: 'Normal', description: 'A Normal-type attack that Gigantamax Eevee use. This move infatuates opponents.' },
    143: { move: 'G-Max Replenish', type: 'Normal', description: 'A Normal-type attack that Gigantamax Snorlax use. This move restores Berries that have been eaten.' },
    569: { move: 'G-Max Malodor', type: 'Poison', description: 'A Poison-type attack that Gigantamax Garbodor use. This move poisons opponents.' },
    812: { move: 'G-Max Drum Solo', type: 'Grass', description: 'A Grass-type attack that Gigantamax Rillaboom use. This move can be used on the target regardless of its Abilities.' },
    815: { move: 'G-Max Fireball', type: 'Fire', description: 'A Fire-type attack that Gigantamax Cinderace use. This move can be used on the target regardless of its Abilities.' },
    818: { move: 'G-Max Hydrosnipe', type: 'Water', description: 'A Water-type attack that Gigantamax Inteleon use. This move can be used on the target regardless of its Abilities.' },
    823: { move: 'G-Max Wind Rage', type: 'Flying', description: 'A Flying-type attack that Gigantamax Corviknight use. This move removes the effects of moves like Reflect and Light Screen.' },
    826: { move: 'G-Max Gravitas', type: 'Psychic', description: 'A Psychic-type attack that Gigantamax Orbeetle use. This move changes gravity for five turns.' },
    834: { move: 'G-Max Stonesurge', type: 'Water', description: 'A Water-type attack that Gigantamax Drednaw use. This move scatters sharp stones around the field.' },
    839: { move: 'G-Max Volcalith', type: 'Rock', description: 'A Rock-type attack that Gigantamax Coalossal use. This move continues to deal damage for four turns.' },
    841: { move: 'G-Max Tartness', type: 'Grass', description: 'A Grass-type attack that Gigantamax Flapple use. This move reduces the evasiveness of opponents.' },
    842: { move: 'G-Max Sweetness', type: 'Grass', description: 'A Grass-type attack that Gigantamax Appletun use. This move heals the status conditions of allies.' },
    844: { move: 'G-Max Sandblast', type: 'Ground', description: 'A Ground-type attack that Gigantamax Sandaconda use. Opponents are trapped in a raging sandstorm for four to five turns.' },
    849: { move: 'G-Max Stun Shock', type: 'Electric', description: 'An Electric-type attack that Gigantamax Toxtricity use. This move poisons or paralyzes opponents.' },
    851: { move: 'G-Max Centiferno', type: 'Fire', description: 'A Fire-type attack that Gigantamax Centiskorch use. This move traps opponents for four to five turns.' },
    858: { move: 'G-Max Smite', type: 'Fairy', description: 'A Fairy-type attack that Gigantamax Hatterene use. This move confuses opponents.' },
    861: { move: 'G-Max Snooze', type: 'Dark', description: 'A Dark-type attack that Gigantamax Grimmsnarl use. This move makes opponents drowsy.' },
    869: { move: 'G-Max Finale', type: 'Fairy', description: 'A Fairy-type attack that Gigantamax Alcremie use. This move heals the HP of allies.' },
    879: { move: 'G-Max Steelsurge', type: 'Steel', description: 'A Steel-type attack that Gigantamax Copperajah use. This move scatters sharp spikes around the field.' },
    884: { move: 'G-Max Rapid Flow', type: 'Water', description: 'A Water-type attack that Gigantamax Urshifu (Rapid Strike Style) use. This move can hit the target twice in a row and can be used on the target regardless of its Abilities.' },
    892: { move: 'G-Max One Blow', type: 'Dark', description: 'A Dark-type attack that Gigantamax Urshifu (Single Strike Style) use. This move can be used on the target regardless of its Abilities and ignores Max Guard.' },
    893: { move: 'G-Max Meltdown', type: 'Steel', description: 'A Steel-type attack that Gigantamax Melmetal use. This move makes opponents unable to use the same move twice in a row.' }
};

// Type color mapping
function getTypeColor(type) {
    const typeColors = {
        normal: '#A8A878',
        fire: '#F08030',
        water: '#6890F0',
        electric: '#F8D030',
        grass: '#78C850',
        ice: '#98D8D8',
        fighting: '#C03028',
        poison: '#A040A0',
        ground: '#E0C068',
        flying: '#A890F0',
        psychic: '#F85888',
        bug: '#A8B820',
        rock: '#B8A038',
        ghost: '#705898',
        dragon: '#7038F8',
        dark: '#705848',
        steel: '#B8B8D0',
        fairy: '#EE99AC'
    };
    return typeColors[type] || '#68A090';
}

// Get gradient colors based on Pokemon types
function getTypeGradient(types) {
    if (!types || types.length === 0) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    
    const color1 = getTypeColor(types[0]);
    const color2 = types.length > 1 ? getTypeColor(types[1]) : color1;
    
    return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
}

// Generation and region info for Pokémon
function getGenerationInfo(id) {
    if (id >= 1 && id <= 151) return { gen: 1, region: 'Kanto' };
    if (id >= 152 && id <= 251) return { gen: 2, region: 'Johto' };
    if (id >= 252 && id <= 386) return { gen: 3, region: 'Hoenn' };
    if (id >= 387 && id <= 493) return { gen: 4, region: 'Sinnoh' };
    if (id >= 494 && id <= 649) return { gen: 5, region: 'Unova' };
    if (id >= 650 && id <= 721) return { gen: 6, region: 'Kalos' };
    if (id >= 722 && id <= 809) return { gen: 7, region: 'Alola' };
    if (id >= 810 && id <= 905) return { gen: 8, region: 'Galar' };
    if (id >= 906 && id <= 1025) return { gen: 9, region: 'Paldea' };
    return { gen: 0, region: 'Unknown' };
}

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const resultDiv = document.getElementById('result');
const loadingDiv = document.getElementById('loading');
const mainShinyToggleBtn = document.getElementById('mainShinyToggle');

// Wheel configuration
const WHEEL_SIZE = 600;

let pokemon = [];
let currentRotation = 0;
let isSpinning = false;
let targetRotation = 0;
let spinSpeed = 0;

// Colors for the wheel segments
const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
    '#90E0EF', '#F4A261', '#E76F51', '#2A9D8F', '#E9C46A',
    '#F72585', '#7209B7', '#3A0CA3', '#4361EE', '#4CC9F0'
];

// Shiny mode state
let isShinyMode = false;

// Event listeners - DEFERRED until canvas exists
function attachCanvasListeners() {
    if (!canvas) {
        console.error('Canvas not found when attaching listeners');
        return;
    }
    
    console.log('Attaching canvas click listener');
    
    canvas.addEventListener('click', (e) => {
        console.log('Canvas click event fired. isSpinning:', isSpinning, 'pokemon.length:', pokemon.length);
        document.title = 'Canvas click! isSpinning=' + isSpinning + ' pokemon=' + pokemon.length;
        
        if (!isSpinning && pokemon.length > 0) {
            // Check if click is on the center Pokéball (within 40px radius)
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left - WHEEL_SIZE / 2;
            const y = e.clientY - rect.top - WHEEL_SIZE / 2;
            const distance = Math.sqrt(x * x + y * y);
            
            console.log(`Click detected at distance: ${distance.toFixed(2)}px from center`);
            document.title = `Distance: ${distance.toFixed(2)}px`;
            
            if (distance <= 40) {
                console.log('Pokéball clicked! Starting spin...');
                document.title = 'SPINNING!';
                canvas.style.cursor = 'wait';
                spinWheel();
            } else {
                console.log('Click outside Pokéball zone');
            }
        } else {
            console.log('Cannot spin: isSpinning=' + isSpinning + ' or no pokemon data');
        }
    });

    // Hover effect for Pokéball
    canvas.addEventListener('mousemove', (e) => {
        if (!isSpinning && pokemon.length > 0) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left - WHEEL_SIZE / 2;
            const y = e.clientY - rect.top - WHEEL_SIZE / 2;
            const distance = Math.sqrt(x * x + y * y);
            
            canvas.style.cursor = distance <= 40 ? 'pointer' : 'default';
        }
    });
}

// Main screen shiny toggle button event listener
if (mainShinyToggleBtn) {
    mainShinyToggleBtn.addEventListener('click', () => {
        isShinyMode = !isShinyMode;
        mainShinyToggleBtn.textContent = isShinyMode ? '✨ Shiny Mode ON' : '✨ Toggle Shiny Mode';
        
        // Toggle active class for CSS animation
        if (isShinyMode) {
            mainShinyToggleBtn.classList.add('active');
        } else {
            mainShinyToggleBtn.classList.remove('active');
        }
        
        console.log('Shiny mode:', isShinyMode);
    });
}

// Selection screen logic
console.log('=== Initializing Selection Screen ===');
console.log('DOM readyState:', document.readyState);

// Create visible debug display
function showDebug(msg) {
    const debugDiv = document.getElementById('debugInfo');
    if (debugDiv) {
        debugDiv.innerHTML += msg + '<br>';
        debugDiv.scrollTop = debugDiv.scrollHeight; // Auto-scroll
    } else {
        console.error('debugInfo div not found!');
    }
}

showDebug('Script loaded at: ' + Date.now());

// Test showDebug after 2 seconds
setTimeout(() => {
    showDebug('2 second delay test - if you see this, showDebug works');
}, 2000);

// Test if elements exist
const testQuery = document.querySelectorAll('.wheel-option');
console.log('TOTAL WHEELS IN DOM:', testQuery.length);
showDebug('WHEELS IN DOM: ' + testQuery.length);

const selectionScreen = document.getElementById('selectionScreen');
const mainScreen = document.getElementById('mainScreen');
const pokedexScreen = document.getElementById('pokedexScreen');
const wheelOptions = document.querySelectorAll('.wheel-option:not(#pokedexOption)');
const pokedexOption = document.getElementById('pokedexOption');

console.log('WHEELS AFTER FILTER:', wheelOptions.length);
showDebug('WHEELS FILTERED: ' + wheelOptions.length);

    console.log('Found wheel options:', wheelOptions.length);
    console.log('Pokedex option exists:', !!pokedexOption);
    if (wheelOptions.length === 0) {
        console.error('ERROR: No wheel options found! Check HTML structure');
    }
    dbg('Initializing wheel options. Count:', wheelOptions.length);
dbg('Random wheel option exists:', document.getElementById('randomWheelOption') ? 'YES' : 'NO');
console.log('=== POKEMON WHEEL SCRIPT v2.0 LOADED ===');
console.log('Wheel options:', wheelOptions);
console.log('Selection screen:', selectionScreen);
console.log('Main screen:', mainScreen);
console.log('Pokedex screen:', pokedexScreen);
console.log('Pokedex option:', pokedexOption);

// Pokédex option click handler
if (pokedexOption) {
    console.log('Setting up Pokedex click handler');
    pokedexOption.addEventListener('click', () => {
        console.log('Opening Pokédex search');
        selectionScreen.style.display = 'none';
        pokedexScreen.style.display = 'flex';
    });
} else {
    console.error('Pokedex option not found!');
}

// Pokédex back button
const pokedexBackBtn = document.getElementById('pokedexBackBtn');
if (pokedexBackBtn) {
    pokedexBackBtn.addEventListener('click', () => {
        pokedexScreen.style.display = 'none';
        selectionScreen.style.display = 'flex';
        // Clear search
        document.getElementById('pokemonSearch').value = '';
        document.getElementById('pokedexResult').innerHTML = '<p class="pokedex-placeholder">Select a category and search</p>';
        currentSearchCategory = 'pokemon';
    });
}

// Search category management
let currentSearchCategory = 'none';
const categoryBtns = document.querySelectorAll('.category-btn');

categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active state
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update category
        currentSearchCategory = btn.getAttribute('data-category');
        dbg('Category selected:', currentSearchCategory);
        
        // Update placeholder
        const searchInput = document.getElementById('pokemonSearch');
        const placeholders = {
            'none': 'Select a category and search...',
            'pokemon': 'Enter Pokémon name or number...',
            'moves': 'Enter move name or browse all...',
            'abilities': 'Enter ability name or browse all...',
            'items': 'Enter item name or browse all...',
            'types': 'Enter type name or browse all...',
            'pokeballs': 'Search Poké Balls or browse all...',
            'tms': 'Browse all Technical Machines...',
            'gmax': 'Browse all G-Max Moves...'
        };
        searchInput.placeholder = placeholders[currentSearchCategory];
        
        // Clear results
        const resultEl = document.getElementById('pokedexResult');
        
        // Don't auto-load if "none" category selected
        if (currentSearchCategory === 'none') {
            resultEl.innerHTML = `<p class=\"pokedex-placeholder\">Select a category to get started!</p>`;
            return;
        }
        
        // Auto-load category content with limited view + See More where applicable
        switch (currentSearchCategory) {
            case 'none':
                resultEl.innerHTML = `<p class="pokedex-placeholder">Select a category and enter a search term...</p>`;
                break;
            case 'gmax':
                dbg('Auto-loading G-Max moves');
                searchGMaxMoves('');
                break;
            case 'tms':
                dbg('Auto-loading TMs');
                searchTMs('');
                break;
            case 'moves':
                dbg('Auto-loading moves limited batch');
                searchMoves('', null, true);
                break;
            case 'abilities':
                dbg('Auto-loading abilities limited batch');
                searchAbilities('', true);
                break;
            case 'items':
                dbg('Auto-loading items limited batch');
                searchItems('', true);
                break;
            case 'pokeballs':
                dbg('Auto-loading Poké Balls limited batch');
                searchPokeballs('', true);
                break;
            case 'pokemon':
                dbg('Auto-loading initial Pokémon batch');
                listPokemon();
                break;
            case 'types':
                dbg('Auto-loading types');
                searchTypes('');
                break;
            default:
                resultEl.innerHTML = `<p class=\"pokedex-placeholder\">Enter search term...</p>`;
        }
    });
});

// Pokédex search functionality
const searchBtn = document.getElementById('searchBtn');
const pokemonSearch = document.getElementById('pokemonSearch');
const pokedexResult = document.getElementById('pokedexResult');
const randomSuggestBtn = document.getElementById('randomSuggestBtn');
dbg('Random suggest button found:', randomSuggestBtn ? 'YES' : 'NO');

async function searchPokemon() {
    const query = pokemonSearch.value.trim().toLowerCase();
    
    // If no query, show error
    if (!query) {
        pokedexResult.innerHTML = '<p class="pokedex-error">Please enter a search term</p>';
        return;
    }
    
    // If no category selected, default to Pokémon search
    if (currentSearchCategory === 'none' || !currentSearchCategory) {
        currentSearchCategory = 'pokemon';
    }
    
    // Route to appropriate search function based on category
    if (currentSearchCategory === 'none') {
        pokedexResult.innerHTML = '<p class="pokedex-error">Please select a category first!</p>';
        return;
    }
    
    if (!query) {
        pokedexResult.innerHTML = '<p class="pokedex-error">Please enter a search term!</p>';
        return;
    }
    
    // Route to appropriate search function based on category
    if (currentSearchCategory === 'all') {
        await searchAllCategories(query);
    } else if (currentSearchCategory === 'pokemon') {
        await searchPokemonCategory(query);
    } else if (currentSearchCategory === 'moves') {
        await searchMoves(query);
    } else if (currentSearchCategory === 'abilities') {
        await searchAbilities(query);
    } else if (currentSearchCategory === 'items') {
        await searchItems(query);
    } else if (currentSearchCategory === 'types') {
        await searchTypes(query);
    } else if (currentSearchCategory === 'pokeballs') {
        await searchPokeballs(query);
    } else if (currentSearchCategory === 'tms') {
        await searchTMs(query);
    } else if (currentSearchCategory === 'gmax') {
        await searchGMaxMoves(query);
    }
}

// Search across all categories simultaneously
async function searchAllCategories(query) {
    if (!query) {
        pokedexResult.innerHTML = '<p class="pokedex-error">Please enter a search term</p>';
        return;
    }
    
    query = query.toLowerCase().trim();
    pokedexResult.innerHTML = '<p class="pokedex-placeholder">Searching all categories...</p>';
    
    try {
        // Run all searches in parallel
        const [pokemonResults, moveResults, abilityResults, itemResults, typeResults, pokeBallResults, tmResults, gmaxResults] = await Promise.all([
            searchPokemonCategoryAll(query),
            searchMovesAll(query),
            searchAbilitiesAll(query),
            searchItemsAll(query),
            searchTypesAll(query),
            searchPokeballsAll(query),
            searchTMsAll(query),
            searchGMaxMovesAll(query)
        ]);
        
        // Combine all results
        let totalResults = 0;
        let html = '<div style="padding: 20px;">';
        
        if (pokemonResults.length > 0) {
            totalResults += pokemonResults.length;
            html += `<div style="margin-bottom: 20px;"><h3 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">🎮 Pokémon (${pokemonResults.length})</h3><div style="display: grid; gap: 8px;">${pokemonResults.map(p => `<button class="suggestion-btn" onclick="document.getElementById('pokemonSearch').value='${p.name}'; currentSearchCategory='pokemon'; searchPokemon();" style="padding: 10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; text-transform: capitalize;">${p.name.replace('-', ' ')}</button>`).join('')}</div></div>`;
        }
        
        if (moveResults.length > 0) {
            totalResults += moveResults.length;
            html += `<div style="margin-bottom: 20px;"><h3 style="color: #ff6b6b; border-bottom: 2px solid #ff6b6b; padding-bottom: 10px;">⚔️ Moves (${moveResults.length})</h3><div style="display: grid; gap: 8px;">${moveResults.map(m => `<button class="suggestion-btn" onclick="document.getElementById('pokemonSearch').value='${m.name}'; currentSearchCategory='moves'; searchPokemon();" style="padding: 10px; background: linear-gradient(135deg, #ff6b6b 0%, #ff2d55 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; text-transform: capitalize;">${m.name.replace('-', ' ')}</button>`).join('')}</div></div>`;
        }
        
        if (abilityResults.length > 0) {
            totalResults += abilityResults.length;
            html += `<div style="margin-bottom: 20px;"><h3 style="color: #ffd700; border-bottom: 2px solid #ffd700; padding-bottom: 10px;">✨ Abilities (${abilityResults.length})</h3><div style="display: grid; gap: 8px;">${abilityResults.map(a => `<button class="suggestion-btn" onclick="document.getElementById('pokemonSearch').value='${a.name}'; currentSearchCategory='abilities'; searchPokemon();" style="padding: 10px; background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); color: black; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; text-transform: capitalize;">${a.name.replace('-', ' ')}</button>`).join('')}</div></div>`;
        }
        
        if (itemResults.length > 0) {
            totalResults += itemResults.length;
            html += `<div style="margin-bottom: 20px;"><h3 style="color: #4ecdc4; border-bottom: 2px solid #4ecdc4; padding-bottom: 10px;">🎒 Items (${itemResults.length})</h3><div style="display: grid; gap: 8px;">${itemResults.map(i => `<button class="suggestion-btn" onclick="document.getElementById('pokemonSearch').value='${i.name}'; currentSearchCategory='items'; searchPokemon();" style="padding: 10px; background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; text-transform: capitalize;">${i.name.replace('-', ' ')}</button>`).join('')}</div></div>`;
        }
        
        if (typeResults.length > 0) {
            totalResults += typeResults.length;
            html += `<div style="margin-bottom: 20px;"><h3 style="color: #9b59b6; border-bottom: 2px solid #9b59b6; padding-bottom: 10px;">🔥 Types (${typeResults.length})</h3><div style="display: grid; gap: 8px;">${typeResults.map(t => `<button class="suggestion-btn" onclick="document.getElementById('pokemonSearch').value='${t.name}'; currentSearchCategory='types'; searchPokemon();" style="padding: 10px; background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; text-transform: capitalize;">${t.name.replace('-', ' ')}</button>`).join('')}</div></div>`;
        }
        
        if (pokeBallResults.length > 0) {
            totalResults += pokeBallResults.length;
            html += `<div style="margin-bottom: 20px;"><h3 style="color: #e74c3c; border-bottom: 2px solid #e74c3c; padding-bottom: 10px;">⚾ Poké Balls (${pokeBallResults.length})</h3><div style="display: grid; gap: 8px;">${pokeBallResults.map(p => `<button class="suggestion-btn" onclick="document.getElementById('pokemonSearch').value='${p.name}'; currentSearchCategory='pokeballs'; searchPokemon();" style="padding: 10px; background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; text-transform: capitalize;">${p.name.replace('-', ' ')}</button>`).join('')}</div></div>`;
        }
        
        if (tmResults.length > 0) {
            totalResults += tmResults.length;
            html += `<div style="margin-bottom: 20px;"><h3 style="color: #3498db; border-bottom: 2px solid #3498db; padding-bottom: 10px;">📀 TMs (${tmResults.length})</h3><div style="display: grid; gap: 8px;">${tmResults.map(t => `<button class="suggestion-btn" onclick="document.getElementById('pokemonSearch').value='${t.name}'; currentSearchCategory='tms'; searchPokemon();" style="padding: 10px; background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; text-transform: capitalize;">${t.name.replace('-', ' ')}</button>`).join('')}</div></div>`;
        }
        
        if (gmaxResults.length > 0) {
            totalResults += gmaxResults.length;
            html += `<div style="margin-bottom: 20px;"><h3 style="color: #f39c12; border-bottom: 2px solid #f39c12; padding-bottom: 10px;">💥 G-Max Moves (${gmaxResults.length})</h3><div style="display: grid; gap: 8px;">${gmaxResults.map(g => `<button class="suggestion-btn" onclick="document.getElementById('pokemonSearch').value='${g.name}'; currentSearchCategory='gmax'; searchPokemon();" style="padding: 10px; background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; text-transform: capitalize;">${g.name.replace('-', ' ')}</button>`).join('')}</div></div>`;
        }
        
        html += '</div>';
        
        if (totalResults === 0) {
            pokedexResult.innerHTML = `<p class="pokedex-error">No results found for "${query}" in any category</p>`;
        } else {
            pokedexResult.innerHTML = `<p style="text-align: center; font-weight: bold; color: #667eea; margin-bottom: 20px;">Found ${totalResults} total results</p>${html}`;
        }
    } catch (error) {
        console.error('Error searching all categories:', error);
        pokedexResult.innerHTML = '<p class="pokedex-error">Error searching categories. Please try again.</p>';
    }
}

// Helper search functions that return results instead of displaying them
async function searchPokemonCategoryAll(query) {
    try {
        const listResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000');
        const listData = await listResponse.json();
        
        const startsWith = [];
        const contains = [];
        const fuzzyMatches = [];
        
        for (const p of listData.results) {
            const pName = p.name.replace('-', ' ');
            const queryFormatted = query.replace('-', ' ');
            
            if (pName.startsWith(queryFormatted)) {
                startsWith.push(p);
            } else if (pName.includes(queryFormatted)) {
                contains.push(p);
            } else {
                let queryIndex = 0;
                for (let i = 0; i < pName.length && queryIndex < queryFormatted.length; i++) {
                    if (pName[i] === queryFormatted[queryIndex]) {
                        queryIndex++;
                    }
                }
                if (queryIndex === queryFormatted.length) {
                    fuzzyMatches.push(p);
                }
            }
        }
        
        return [...startsWith, ...contains, ...fuzzyMatches].slice(0, 10);
    } catch {
        return [];
    }
}

async function searchMovesAll(query) {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/move?limit=1000');
        const data = await response.json();
        
        const startsWith = [];
        const contains = [];
        const fuzzyMatches = [];
        
        for (const move of data.results) {
            const moveName = move.name.replace('-', ' ');
            const queryFormatted = query.replace('-', ' ');
            
            if (moveName.startsWith(queryFormatted)) {
                startsWith.push(move);
            } else if (moveName.includes(queryFormatted)) {
                contains.push(move);
            } else {
                let queryIndex = 0;
                for (let i = 0; i < moveName.length && queryIndex < queryFormatted.length; i++) {
                    if (moveName[i] === queryFormatted[queryIndex]) {
                        queryIndex++;
                    }
                }
                if (queryIndex === queryFormatted.length) {
                    fuzzyMatches.push(move);
                }
            }
        }
        
        return [...startsWith, ...contains, ...fuzzyMatches].slice(0, 10);
    } catch {
        return [];
    }
}

async function searchAbilitiesAll(query) {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/ability?limit=1000');
        const data = await response.json();
        
        const startsWith = [];
        const contains = [];
        const fuzzyMatches = [];
        
        for (const ability of data.results) {
            const abilityName = ability.name.replace('-', ' ');
            const queryFormatted = query.replace('-', ' ');
            
            if (abilityName.startsWith(queryFormatted)) {
                startsWith.push(ability);
            } else if (abilityName.includes(queryFormatted)) {
                contains.push(ability);
            } else {
                let queryIndex = 0;
                for (let i = 0; i < abilityName.length && queryIndex < queryFormatted.length; i++) {
                    if (abilityName[i] === queryFormatted[queryIndex]) {
                        queryIndex++;
                    }
                }
                if (queryIndex === queryFormatted.length) {
                    fuzzyMatches.push(ability);
                }
            }
        }
        
        return [...startsWith, ...contains, ...fuzzyMatches].slice(0, 10);
    } catch {
        return [];
    }
}

async function searchItemsAll(query) {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/item?limit=1000');
        const data = await response.json();
        
        const startsWith = [];
        const contains = [];
        const fuzzyMatches = [];
        
        for (const item of data.results) {
            const itemName = item.name.replace('-', ' ');
            const queryFormatted = query.replace('-', ' ');
            
            if (itemName.startsWith(queryFormatted)) {
                startsWith.push(item);
            } else if (itemName.includes(queryFormatted)) {
                contains.push(item);
            } else {
                let queryIndex = 0;
                for (let i = 0; i < itemName.length && queryIndex < queryFormatted.length; i++) {
                    if (itemName[i] === queryFormatted[queryIndex]) {
                        queryIndex++;
                    }
                }
                if (queryIndex === queryFormatted.length) {
                    fuzzyMatches.push(item);
                }
            }
        }
        
        return [...startsWith, ...contains, ...fuzzyMatches].slice(0, 10);
    } catch {
        return [];
    }
}

async function searchTypesAll(query) {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/type');
        const data = await response.json();
        
        const startsWith = [];
        const contains = [];
        const fuzzyMatches = [];
        
        for (const type of data.results) {
            const typeName = type.name.replace('-', ' ');
            const queryFormatted = query.replace('-', ' ');
            
            if (typeName.startsWith(queryFormatted)) {
                startsWith.push(type);
            } else if (typeName.includes(queryFormatted)) {
                contains.push(type);
            } else {
                let queryIndex = 0;
                for (let i = 0; i < typeName.length && queryIndex < queryFormatted.length; i++) {
                    if (typeName[i] === queryFormatted[queryIndex]) {
                        queryIndex++;
                    }
                }
                if (queryIndex === queryFormatted.length) {
                    fuzzyMatches.push(type);
                }
            }
        }
        
        return [...startsWith, ...contains, ...fuzzyMatches].slice(0, 10);
    } catch {
        return [];
    }
}

async function searchPokeballsAll(query) {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/item-category/34');
        const data = await response.json();
        
        const startsWith = [];
        const contains = [];
        const fuzzyMatches = [];
        
        for (const ball of data.items) {
            const ballName = ball.name.replace('-', ' ');
            const queryFormatted = query.replace('-', ' ');
            
            if (ballName.startsWith(queryFormatted)) {
                startsWith.push(ball);
            } else if (ballName.includes(queryFormatted)) {
                contains.push(ball);
            } else {
                let queryIndex = 0;
                for (let i = 0; i < ballName.length && queryIndex < queryFormatted.length; i++) {
                    if (ballName[i] === queryFormatted[queryIndex]) {
                        queryIndex++;
                    }
                }
                if (queryIndex === queryFormatted.length) {
                    fuzzyMatches.push(ball);
                }
            }
        }
        
        return [...startsWith, ...contains, ...fuzzyMatches].slice(0, 10);
    } catch {
        return [];
    }
}

async function searchTMsAll(query) {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/item-category/19');
        const data = await response.json();
        
        const startsWith = [];
        const contains = [];
        const fuzzyMatches = [];
        
        for (const tm of data.items) {
            const tmName = tm.name.replace('-', ' ');
            const queryFormatted = query.replace('-', ' ');
            
            if (tmName.startsWith(queryFormatted)) {
                startsWith.push(tm);
            } else if (tmName.includes(queryFormatted)) {
                contains.push(tm);
            } else {
                let queryIndex = 0;
                for (let i = 0; i < tmName.length && queryIndex < queryFormatted.length; i++) {
                    if (tmName[i] === queryFormatted[queryIndex]) {
                        queryIndex++;
                    }
                }
                if (queryIndex === queryFormatted.length) {
                    fuzzyMatches.push(tm);
                }
            }
        }
        
        return [...startsWith, ...contains, ...fuzzyMatches].slice(0, 10);
    } catch {
        return [];
    }
}

async function searchGMaxMovesAll(query) {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/move?limit=1000');
        const data = await response.json();
        
        const startsWith = [];
        const contains = [];
        const fuzzyMatches = [];
        
        for (const move of data.results) {
            // Filter for G-Max moves (contain "g-max" or "dynamax")
            if (!move.name.includes('g-max') && !move.name.includes('dynamax')) continue;
            
            const moveName = move.name.replace('-', ' ');
            const queryFormatted = query.replace('-', ' ');
            
            if (moveName.startsWith(queryFormatted)) {
                startsWith.push(move);
            } else if (moveName.includes(queryFormatted)) {
                contains.push(move);
            } else {
                let queryIndex = 0;
                for (let i = 0; i < moveName.length && queryIndex < queryFormatted.length; i++) {
                    if (moveName[i] === queryFormatted[queryIndex]) {
                        queryIndex++;
                    }
                }
                if (queryIndex === queryFormatted.length) {
                    fuzzyMatches.push(move);
                }
            }
        }
        
        return [...startsWith, ...contains, ...fuzzyMatches].slice(0, 10);
    } catch {
        return [];
    }
}

// Helper function for clicking on related Pokémon from ability/move results
async function searchPokemonForRelated(pokemonName) {
    console.log('searchPokemonForRelated called with:', pokemonName);
    document.getElementById('pokemonSearch').value = pokemonName;
    currentSearchCategory = 'pokemon';
    console.log('Set category to pokemon, about to call searchPokemon()');
    await searchPokemon();
}

async function searchPokemonCategory(query) {
    if (!query) {
        pokedexResult.innerHTML = '<p class="pokedex-error">Please enter a Pokémon name or number</p>';
        return;
    }
    
    query = query.toLowerCase().trim();
    
    // Check if query includes "shiny"
    let forceShiny = false;
    if (query.includes('shiny')) {
        forceShiny = true;
        query = query.replace(/shiny\s*/g, '').trim();
    }
    
    pokedexResult.innerHTML = '<p class="pokedex-placeholder">Searching...</p>';
    
    try {
        let pokemon;
        let foundDirectly = false;
        
        // Try direct search first (case-insensitive, handle spaces/hyphens)
        try {
            const searchQuery = query.replace(/\s+/g, '-').toLowerCase();
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchQuery}`);
            if (response.ok) {
                pokemon = await response.json();
                foundDirectly = true;
            }
        } catch (e) {
            // Direct search failed, will try fuzzy search
        }
        
        // If direct search failed, try fuzzy matching
        if (!foundDirectly) {
            // Fetch list of all Pokémon names
            const listResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000');
            const listData = await listResponse.json();
            
            // Sort matches by priority:
            // 1. Starts with query (first letters match)
            // 2. Contains query exactly
            // 3. Fuzzy match (letters in order)
            
            const startsWith = [];
            const contains = [];
            const fuzzyMatches = [];
            
            for (const p of listData.results) {
                const pName = p.name.replace('-', ' ');
                const queryFormatted = query.replace('-', ' ');
                
                if (pName.startsWith(queryFormatted)) {
                    startsWith.push(p);
                } else if (pName.includes(queryFormatted)) {
                    contains.push(p);
                } else {
                    // Fuzzy - letters in order
                    let queryIndex = 0;
                    for (let i = 0; i < pName.length && queryIndex < queryFormatted.length; i++) {
                        if (pName[i] === queryFormatted[queryIndex]) {
                            queryIndex++;
                        }
                    }
                    if (queryIndex === queryFormatted.length) {
                        fuzzyMatches.push(p);
                    }
                }
            }
            
            // Combine all matches, prioritized
            const allMatches = [...startsWith, ...contains, ...fuzzyMatches];
            
            if (allMatches.length === 0) {
                pokedexResult.innerHTML = `
                    <div class="pokemon-entry">
                        <p class="pokedex-error">No Pokémon found matching "${query}"</p>
                        <p style="margin-top: 15px; color: #666;">Try searching by:</p>
                        <ul style="margin: 10px 0; color: #666;">
                            <li>Full name: pikachu, charizard</li>
                            <li>Partial name: pika, char</li>
                            <li>Pokédex number: 25, 6</li>
                        </ul>
                    </div>
                `;
                return;
            }
            
            if (allMatches.length === 1) {
                const response = await fetch(allMatches[0].url);
                pokemon = await response.json();
            } else {
                // Show ALL matches - not just suggestions
                pokedexResult.innerHTML = `
                    <div class="pokemon-entry">
                        <p class="pokedex-error" style="margin-bottom: 20px;">Found ${allMatches.length} matches:</p>
                        <div style="display: grid; gap: 10px; max-height: 500px; overflow-y: auto;">
                            ${allMatches.map(m => `
                                <button class="suggestion-btn" onclick="document.getElementById('pokemonSearch').value='${m.name}'; searchPokemon();" 
                                        style="padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1rem; font-weight: bold; text-transform: capitalize;">
                                    ${m.name.replace('-', ' ')}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `;
                return;
            }
        }
        
        // Fetch species data for Pokédex entry
        const speciesResponse = await fetch(pokemon.species.url);
        const speciesData = await speciesResponse.json();
        
        // Get ALL English Pokédex entries
        const flavorTextEntries = speciesData.flavor_text_entries.filter(entry => entry.language.name === 'en');
        
        // Get sprite (shiny if mode is active OR if "shiny" was in query)
        // Get sprite - ONLY use shiny if explicitly requested with "shiny" keyword, NOT from isShinyMode
        const useShiny = forceShiny;
        const sprite = (useShiny && pokemon.sprites.other['official-artwork'].front_shiny) 
            ? pokemon.sprites.other['official-artwork'].front_shiny 
            : pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
        
        const shinyIndicator = (useShiny && pokemon.sprites.other['official-artwork'].front_shiny) ? ' ✨ SHINY ✨' : '';
        
        // Get types
        const types = pokemon.types.map(t => t.type.name);
        
        // Get stats
        const hp = pokemon.stats.find(s => s.stat.name === 'hp').base_stat;
        const attack = pokemon.stats.find(s => s.stat.name === 'attack').base_stat;
        const defense = pokemon.stats.find(s => s.stat.name === 'defense').base_stat;
        
        // Create descriptions HTML with navigation
        let descriptionsHTML = '';
        if (flavorTextEntries.length > 0) {
            // Store entries for navigation BEFORE creating HTML
            window.currentDexEntries = flavorTextEntries;
            window.currentDexIndex = 0;
            window.showAllEntries = false;
            
            descriptionsHTML = `
                <div id="singleEntryView">
                    <div class="pokemon-entry-description" id="pokedexDescription">${flavorTextEntries[0].flavor_text.replace(/\f/g, ' ')}</div>
                    ${flavorTextEntries.length > 1 ? `
                        <div style="margin-top: 15px; display: flex; align-items: center; justify-content: center; gap: 15px;">
                            <button id="prevEntry" style="padding: 8px 15px; background: #667eea; color: white; border: none; border-radius: 20px; cursor: pointer; font-weight: bold;">← Previous</button>
                            <div id="entryCounter" style="font-weight: bold; color: #667eea;">1 / ${flavorTextEntries.length}</div>
                            <button id="nextEntry" style="padding: 8px 15px; background: #667eea; color: white; border: none; border-radius: 20px; cursor: pointer; font-weight: bold;">Next →</button>
                        </div>
                        <div style="margin-top: 10px; font-size: 0.9rem; color: #666; text-align: center;" id="gameVersion">${flavorTextEntries[0].version.name.toUpperCase()}</div>
                        <div style="margin-top: 15px; text-align: center;">
                            <button id="showAllBtn" onclick="window.toggleDexView();" style="padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 20px; cursor: pointer; font-weight: bold; font-size: 1rem;">Show All Entries</button>
                        </div>
                    ` : ''}
                </div>
                <div id="allEntriesView" style="display: none;">
                    <div style="max-height: 500px; overflow-y: auto; padding: 10px;">
                        ${flavorTextEntries.map((entry, index) => `
                            <div style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%); padding: 15px; margin-bottom: 15px; border-radius: 15px; border-left: 4px solid #667eea;">
                                <div style="font-weight: bold; color: #667eea; margin-bottom: 8px; font-size: 1rem;">
                                    <span style="background: #667eea; color: white; padding: 3px 10px; border-radius: 10px; margin-right: 10px;">#${index + 1}</span>
                                    ${entry.version.name.toUpperCase().replace('-', ' ')}
                                </div>
                                <div style="color: #333; line-height: 1.6;">${entry.flavor_text.replace(/\f/g, ' ')}</div>
                            </div>
                        `).join('')}
                    </div>
                    <div style="margin-top: 15px; text-align: center;">
                        <button id="showSingleBtn" onclick="window.toggleDexView();" style="padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 20px; cursor: pointer; font-weight: bold; font-size: 1rem;">Show One at a Time</button>
                    </div>
                </div>
            `;
        } else {
            descriptionsHTML = '<div class="pokemon-entry-description">No description available.</div>';
        }
        
        // Get abilities and moves for related items
        const abilities = pokemon.abilities.map(a => a.ability);
        const moves = pokemon.moves.slice(0, 12).map(m => m.move);
        
        // Check if this Pokémon has a G-Max move
        let gmaxMoveHTML = '';
        if (gmaxMoves[pokemon.id]) {
            const gmax = gmaxMoves[pokemon.id];
            gmaxMoveHTML = `
                <div style="margin-bottom: 20px; background: linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%); padding: 20px; border-radius: 15px; box-shadow: 0 4px 15px rgba(255, 107, 157, 0.3);">
                    <h3 style="color: white; margin-bottom: 10px; display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.5rem;">💥</span>
                        Gigantamax Move
                        <span style="font-size: 1.5rem;">💥</span>
                    </h3>
                    <div style="background: rgba(255, 255, 255, 0.2); padding: 15px; border-radius: 10px; margin-top: 10px;">
                        <div style="font-size: 1.3rem; font-weight: bold; color: white; margin-bottom: 8px;">${gmax.move}</div>
                        <div style="display: inline-block; background: ${getTypeColor(gmax.type.toLowerCase())}; color: white; padding: 5px 15px; border-radius: 15px; font-weight: bold; margin-bottom: 10px;">${gmax.type}</div>
                        <div style="color: white; line-height: 1.6; margin-top: 10px;">${gmax.description}</div>
                    </div>
                </div>
            `;
        }
        
        let relatedContentHTML = `
            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #667eea;">
                ${gmaxMoveHTML}
                <h3 style="color: #667eea; margin-bottom: 15px;">Abilities:</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;">
                    ${abilities.map(ability => `
                        <button onclick="window.showAbilityDetail('${ability.name}');" 
                                style="padding: 10px 15px; background: #764ba2; color: white; border: none; border-radius: 15px; cursor: pointer; font-weight: bold; text-transform: capitalize;">
                            ${ability.name.replace('-', ' ')}
                        </button>
                    `).join('')}
                </div>
                
                <h3 style="color: #667eea; margin-bottom: 15px;">Some Moves (First 12):</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; max-height: 300px; overflow-y: auto;">
                    ${moves.map(move => `
                        <button onclick="window.showMoveDetail('${move.name}');" 
                                style="padding: 8px 12px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%); color: #667eea; border: 2px solid #667eea; border-radius: 10px; cursor: pointer; font-weight: bold; text-transform: capitalize; font-size: 0.9rem;">
                            ${move.name.replace('-', ' ')}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Display result
        pokedexResult.innerHTML = `
            <div class="pokemon-entry">
                <img src="${sprite}" alt="${pokemon.name}" class="pokemon-entry-image">
                <div class="pokemon-entry-name">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1).replace('-', ' ')}${shinyIndicator}</div>
                <div class="pokemon-entry-number">#${String(pokemon.id).padStart(4, '0')}</div>
                <div class="pokemon-entry-types">
                    ${types.map(type => `<span class="type-badge" style="background: ${getTypeColor(type)}">${type}</span>`).join('')}
                </div>
                <div class="pokemon-entry-stats">
                    <div class="stat-item">
                        <div class="stat-label">HP</div>
                        <div class="stat-value">${hp}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Attack</div>
                        <div class="stat-value">${attack}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Defense</div>
                        <div class="stat-value">${defense}</div>
                    </div>
                </div>
                ${descriptionsHTML}
                ${relatedContentHTML}
            </div>
        `;
        
        // Attach event listeners after DOM is updated
        if (flavorTextEntries.length > 1) {
            const prevBtn = document.getElementById('prevEntry');
            const nextBtn = document.getElementById('nextEntry');
            
            if (prevBtn) prevBtn.addEventListener('click', () => navigateDexEntry(-1));
            if (nextBtn) nextBtn.addEventListener('click', () => navigateDexEntry(1));
            // Toggle buttons use inline onclick handlers
        }
        
    } catch (error) {
        console.error('Search error:', error);
        console.error('Error stack:', error.stack);
        console.error('Query was:', query);
        pokedexResult.innerHTML = `<p class="pokedex-error">Pokémon not found: ${error.message || 'Unknown error'}. Please try a different search term.</p>`;
    }
}

// Incremental Pokémon listing with See More button
async function listPokemon() {
    const totalPokemon = 1025; // current total across generations
    if (!window.loadedPokemon) window.loadedPokemon = [];
    const startId = window.loadedPokemon.length + 1;
    const endId = Math.min(startId + 49, totalPokemon); // load 50 at a time
    const loadRange = [];
    for (let i = startId; i <= endId; i++) loadRange.push(i);

    const pokedexResult = document.getElementById('pokedexResult');
    pokedexResult.innerHTML = '<p class="pokedex-placeholder">Loading Pokémon...</p>';

    try {
        const promises = loadRange.map(id => fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(r => r.json()).catch(() => null));
        const batch = await Promise.all(promises);
        const valid = batch.filter(p => p);
        window.loadedPokemon = window.loadedPokemon.concat(valid);

        // Render grid of all loaded so far
        pokedexResult.innerHTML = `
            <div style="margin-bottom: 15px;">
                <p style="color:#667eea;font-weight:bold;">Loaded ${window.loadedPokemon.length} / ${totalPokemon} Pokémon</p>
            </div>
            <div style="max-height:500px; overflow-y:auto;">
                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(140px,1fr)); gap:12px;">
                    ${window.loadedPokemon.map(p => `
                        <div style=\"background:white; padding:10px; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.1); cursor:pointer; text-align:center; transition:transform .2s;\"
                             onclick=\"document.getElementById('pokemonSearch').value='${p.name}'; searchPokemon();\"
                             onmouseover=\"this.style.transform='translateY(-4px)'\"
                             onmouseout=\"this.style.transform='translateY(0)'\">
                            <img src=\"${p.sprites.other['official-artwork'].front_default || p.sprites.front_default}\" alt=\"${p.name}\" style=\"width:70px; height:70px; object-fit:contain;\">
                            <div style=\"font-weight:bold; color:#667eea; text-transform:capitalize; margin-top:5px; font-size:0.85rem;\">${p.name}</div>
                            <div style=\"color:#999; font-size:0.7rem;\">#${String(p.id).padStart(4,'0')}</div>
                        </div>
                    `).join('')}
                </div>
                ${window.loadedPokemon.length < totalPokemon ? `<div style=\"text-align:center; margin:20px 0;\"><button onclick=\"listPokemon()\" style=\"padding:10px 20px; background: linear-gradient(135deg,#667eea 0%, #764ba2 100%); color:white; border:none; border-radius:25px; font-weight:bold; cursor:pointer;\">See More (${totalPokemon - window.loadedPokemon.length} remaining)</button></div>` : '<p style="text-align:center; margin-top:15px; color:#667eea; font-weight:bold;">All Pokémon Loaded</p>'}
            </div>
        `;
    } catch (e) {
        console.error('Error loading Pokémon batch', e);
        pokedexResult.innerHTML = '<p class="pokedex-error">Error loading Pokémon list.</p>';
    }
}

// Re-added navigateDexEntry function after cleanup of Show All button code
function navigateDexEntry(direction) {
    if (!window.currentDexEntries || window.currentDexEntries.length === 0) return;
    if (typeof window.currentDexIndex !== 'number') window.currentDexIndex = 0;

    // Update index with wrap-around
    window.currentDexIndex = (window.currentDexIndex + direction + window.currentDexEntries.length) % window.currentDexEntries.length;
    const entry = window.currentDexEntries[window.currentDexIndex];
    if (!entry) return;

    const descriptionEl = document.getElementById('pokedexDescription');
    const counterEl = document.getElementById('entryCounter');
    const versionEl = document.getElementById('gameVersion');

    if (descriptionEl) descriptionEl.textContent = entry.flavor_text.replace(/\f/g, ' ');
    if (counterEl) counterEl.textContent = `${window.currentDexIndex + 1} / ${window.currentDexEntries.length}`;
    if (versionEl) versionEl.textContent = entry.version.name.toUpperCase();
}

// Toggle between single entry view and all entries view
function toggleDexView() {
    const singleView = document.getElementById('singleEntryView');
    const allView = document.getElementById('allEntriesView');
    
    if (singleView && allView) {
        if (singleView.style.display === 'none') {
            // Switch to single view
            singleView.style.display = 'block';
            allView.style.display = 'none';
        } else {
            // Switch to all entries view
            singleView.style.display = 'none';
            allView.style.display = 'block';
        }
    }
}

async function searchMoves(query, typeFilter = null, limitMode = false) {
    pokedexResult.innerHTML = '<p class="pokedex-placeholder">Searching moves...</p>';
    
    try {
        const listResponse = await fetch('https://pokeapi.co/api/v2/move?limit=1000');
        const listData = await listResponse.json();
        
        let moves = listData.results;
        
        // Filter if query provided
        if (query) {
            moves = moves.filter(m => m.name.includes(query));
        }
        
        // If type filter is provided, fetch move details to filter by type
        if (typeFilter) {
            pokedexResult.innerHTML = '<p class="pokedex-placeholder">Filtering by type...</p>';
            const moveDetailsPromises = moves.slice(0, 200).map(m => 
                fetch(m.url).then(r => r.json()).catch(() => null)
            );
            const moveDetails = await Promise.all(moveDetailsPromises);
            moves = moveDetails
                .filter(m => m && m.type.name === typeFilter)
                .map(m => ({ name: m.name, url: `https://pokeapi.co/api/v2/move/${m.name}` }));
        }
        
        if (moves.length === 0) {
            pokedexResult.innerHTML = '<p class="pokedex-error">No moves found</p>';
            return;
        }
        
        const totalCount = moves.length;
        let limited = false;
        if (limitMode && !query && !typeFilter && totalCount > 50) {
            moves = moves.slice(0, 50);
            limited = true;
        } else {
            moves = moves.slice(0, 200); // hard cap for performance when not limited
        }
        
        // Display type filter buttons
        const typeButtons = `
            <div style="margin-bottom: 20px;">
                <p style="color: #667eea; font-weight: bold; margin-bottom: 10px;">Filter by Type:</p>
                <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 15px;">
                    <button onclick="searchMoves('${query || ''}', null)" style="padding: 8px 15px; background: ${!typeFilter ? '#667eea' : 'white'}; color: ${!typeFilter ? 'white' : '#667eea'}; border: 2px solid #667eea; border-radius: 15px; cursor: pointer; font-weight: bold;">All</button>
                    ${['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'].map(type => `
                        <button onclick="searchMoves('${query || ''}', '${type}')" 
                                style="padding: 8px 15px; background: ${typeFilter === type ? getTypeColor(type) : 'white'}; color: ${typeFilter === type ? 'white' : '#333'}; border: 2px solid ${getTypeColor(type)}; border-radius: 15px; cursor: pointer; font-weight: bold; text-transform: capitalize;">
                            ${type}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Display as grid
        pokedexResult.innerHTML = typeButtons + `
            <div style="max-height: 400px; overflow-y: auto;">
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
                    ${moves.map(m => `
                        <div style="background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.2s;" 
                             onclick="window.showMoveDetail('${m.name}')" 
                             onmouseover="this.style.transform='translateY(-3px)'" 
                             onmouseout="this.style.transform='translateY(0)'">
                            <div style="font-weight: bold; color: #667eea; text-transform: capitalize; font-size: 1.1rem;">${m.name.replace('-', ' ')}</div>
                        </div>
                    `).join('')}
                </div>
                ${limited ? `<div style=\"text-align:center; margin-top:25px;\"><button onclick=\"searchMoves('${query || ''}', ${typeFilter ? `'${typeFilter}'` : 'null'}, false)\" style=\"padding:10px 20px; background: linear-gradient(135deg,#667eea 0%, #764ba2 100%); color:white; border:none; border-radius:25px; font-weight:bold; cursor:pointer;\">See More (${totalCount - 50} more)</button></div>` : ''}
            </div>
        `;
    } catch (error) {
        console.error('Search error:', error);
        pokedexResult.innerHTML = '<p class="pokedex-error">Error loading moves</p>';
    }
}

async function showMoveDetail(moveName) {
    pokedexResult.innerHTML = '<p class="pokedex-placeholder">Loading move details...</p>';
    
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/move/${moveName}`);
        const move = await response.json();
        
        const description = move.effect_entries.find(e => e.language.name === 'en')?.effect || 'No description available';
        const type = move.type.name;
        const power = move.power || 'N/A';
        const accuracy = move.accuracy || 'N/A';
        const pp = move.pp || 'N/A';
        
        // Fetch Pokémon that can learn this move
        const learnedByPokemon = move.learned_by_pokemon.slice(0, 12);
        let relatedPokemonHTML = '';
        
        if (learnedByPokemon.length > 0) {
            const pokemonPromises = learnedByPokemon.map(p => 
                fetch(p.url).then(r => r.json()).catch(() => null)
            );
            const pokemonData = await Promise.all(pokemonPromises);
            const validPokemon = pokemonData.filter(p => p !== null);
            
            relatedPokemonHTML = `
                <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #667eea;">
                    <h3 style="color: #667eea; margin-bottom: 15px;">Pokémon That Can Learn This Move:</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; max-height: 400px; overflow-y: auto;">
                        ${validPokemon.map(p => `
                            <div style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%); padding: 10px; border-radius: 10px; text-align: center; cursor: pointer;" 
                                 onclick="window.searchPokemonForRelated('${p.name}');">
                                <img src="${p.sprites.other['official-artwork'].front_default || p.sprites.front_default}" 
                                     alt="${p.name}" 
                                     style="width: 60px; height: 60px; object-fit: contain;">
                                <div style="font-weight: bold; font-size: 0.85rem; color: #667eea; text-transform: capitalize; margin-top: 5px;">${p.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        pokedexResult.innerHTML = `
            <div class="pokemon-entry">
                <div class="pokemon-entry-name">${move.name.charAt(0).toUpperCase() + move.name.slice(1).replace('-', ' ')}</div>
                <div class="pokemon-entry-types" style="margin-bottom: 20px;">
                    <span class="type-badge" style="background: ${getTypeColor(type)}">${type}</span>
                </div>
                <div class="pokemon-entry-stats">
                    <div class="stat-item">
                        <div class="stat-label">Power</div>
                        <div class="stat-value">${power}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Accuracy</div>
                        <div class="stat-value">${accuracy}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">PP</div>
                        <div class="stat-value">${pp}</div>
                    </div>
                </div>
                <div class="pokemon-entry-description">${description}</div>
                ${relatedPokemonHTML}
                <button onclick="searchMoves('')" style="margin-top: 20px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 20px; cursor: pointer; font-weight: bold;">← Back to Moves</button>
            </div>
        `;
    } catch (error) {
        console.error('Error loading move:', error);
        pokedexResult.innerHTML = '<p class="pokedex-error">Error loading move details</p>';
    }
}

// Make functions globally accessible for onclick handlers
window.searchPokemonForRelated = searchPokemonForRelated;
window.searchMoves = searchMoves;
window.showMoveDetail = showMoveDetail;
window.searchAbilities = searchAbilities;
window.showAbilityDetail = showAbilityDetail;
window.searchItems = searchItems;
window.showItemDetail = showItemDetail;
window.searchTypes = searchTypes;
window.showTypeDetail = showTypeDetail;
window.searchPokeballs = searchPokeballs;
window.showPokeballDetail = showPokeballDetail;
window.searchPokemonCategory = searchPokemonCategory;
window.navigateDexEntry = navigateDexEntry;
window.toggleDexView = toggleDexView;
// Removed global Show All button functions
window.searchGMaxMoves = searchGMaxMoves;
window.viewGMaxPokemon = viewGMaxPokemon;
window.showGMaxMoveDetail = showGMaxMoveDetail;
window.listPokemon = listPokemon;

async function searchAbilities(query, limitMode = false) {
    pokedexResult.innerHTML = '<p class="pokedex-placeholder">Searching abilities...</p>';
    
    try {
        const listResponse = await fetch('https://pokeapi.co/api/v2/ability?limit=400');
        const listData = await listResponse.json();
        
        let abilities = listData.results;
        
        if (query) {
            abilities = abilities.filter(a => a.name.includes(query));
        }
        
        if (abilities.length === 0) {
            pokedexResult.innerHTML = '<p class="pokedex-error">No abilities found</p>';
            return;
        }
        
        const totalCount = abilities.length;
        let limited = false;
        if (limitMode && !query && totalCount > 50) {
            abilities = abilities.slice(0, 50);
            limited = true;
        } else {
            abilities = abilities.slice(0, 150);
        }
        
        // Fetch details for all abilities to show descriptions
        pokedexResult.innerHTML = '<p class="pokedex-placeholder">Loading ability details...</p>';
        const abilityDetailsPromises = abilities.map(a => 
            fetch(a.url).then(r => r.json()).catch(() => null)
        );
        const abilityDetails = await Promise.all(abilityDetailsPromises);
        const validAbilities = abilityDetails.filter(a => a !== null);
        
        pokedexResult.innerHTML = `
            <div style="max-height: 500px; overflow-y: auto;">
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px;">
                    ${validAbilities.map(ability => {
                        const description = ability.effect_entries.find(e => e.language.name === 'en')?.short_effect || 
                                          ability.effect_entries.find(e => e.language.name === 'en')?.effect || 
                                          'No description available';
                        
                        return `
                        <div style="background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.2s; display: flex; flex-direction: column;" 
                             onclick="window.showAbilityDetail('${ability.name}')"
                             onmouseover="this.style.transform='translateY(-3px)'" 
                             onmouseout="this.style.transform='translateY(0)'">
                            <div style="font-weight: bold; color: #764ba2; text-transform: capitalize; font-size: 1.1rem; margin-bottom: 8px;">${ability.name.replace('-', ' ')}</div>
                            <div style="font-size: 0.85rem; color: #666; line-height: 1.4;">${description.length > 100 ? description.substring(0, 100) + '...' : description}</div>
                        </div>
                    `}).join('')}
                </div>
                ${limited ? `<div style=\"text-align:center; margin-top:25px;\"><button onclick=\"searchAbilities('${query || ''}', false)\" style=\"padding:10px 20px; background: linear-gradient(135deg,#764ba2 0%, #667eea 100%); color:white; border:none; border-radius:25px; font-weight:bold; cursor:pointer;\">See More (${totalCount - 50} more)</button></div>` : ''}
            </div>
        `;
    } catch (error) {
        console.error('Search error:', error);
        pokedexResult.innerHTML = '<p class="pokedex-error">Error loading abilities</p>';
    }
}

async function showAbilityDetail(abilityName) {
    pokedexResult.innerHTML = '<p class="pokedex-placeholder">Loading ability details...</p>';
    
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/ability/${abilityName}`);
        const ability = await response.json();
        
        const description = ability.effect_entries.find(e => e.language.name === 'en')?.effect || 'No description available';
        
        // Fetch Pokémon that have this ability
        const pokemonWithAbility = ability.pokemon.slice(0, 12);
        let relatedPokemonHTML = '';
        
        if (pokemonWithAbility.length > 0) {
            const pokemonPromises = pokemonWithAbility.map(p => 
                fetch(p.pokemon.url).then(r => r.json()).catch(() => null)
            );
            const pokemonData = await Promise.all(pokemonPromises);
            const validPokemon = pokemonData.filter(p => p !== null);
            
            relatedPokemonHTML = `
                <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #764ba2;">
                    <h3 style="color: #764ba2; margin-bottom: 15px;">Pokémon With This Ability:</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; max-height: 400px; overflow-y: auto;">
                        ${validPokemon.map(p => `
                            <div style="background: linear-gradient(135deg, rgba(118, 75, 162, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%); padding: 10px; border-radius: 10px; text-align: center; cursor: pointer;" 
                                 onclick="window.searchPokemonForRelated('${p.name}');">
                                <img src="${p.sprites.other['official-artwork'].front_default || p.sprites.front_default}" 
                                     alt="${p.name}" 
                                     style="width: 60px; height: 60px; object-fit: contain;">
                                <div style="font-weight: bold; font-size: 0.85rem; color: #764ba2; text-transform: capitalize; margin-top: 5px;">${p.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        pokedexResult.innerHTML = `
            <div class="pokemon-entry">
                <div class="pokemon-entry-name">${ability.name.charAt(0).toUpperCase() + ability.name.slice(1).replace('-', ' ')}</div>
                <div class="pokemon-entry-description" style="margin-top: 20px;">${description}</div>
                ${relatedPokemonHTML}
                <button onclick="searchAbilities('')" style="margin-top: 20px; padding: 10px 20px; background: #764ba2; color: white; border: none; border-radius: 20px; cursor: pointer; font-weight: bold;">← Back to Abilities</button>
            </div>
        `;
    } catch (error) {
        console.error('Error loading ability:', error);
        pokedexResult.innerHTML = '<p class="pokedex-error">Error loading ability details</p>';
    }
}

async function searchItems(query, limitMode = false) {
    pokedexResult.innerHTML = '<p class="pokedex-placeholder">Searching items...</p>';
    
    try {
        const listResponse = await fetch('https://pokeapi.co/api/v2/item?limit=2000');
        const listData = await listResponse.json();
        
        let items = listData.results;
        
        if (query) {
            items = items.filter(i => i.name.includes(query));
        }
        
        if (items.length === 0) {
            pokedexResult.innerHTML = '<p class="pokedex-error">No items found</p>';
            return;
        }
        
        const totalCount = items.length;
        let limited = false;
        if (limitMode && !query && totalCount > 50) {
            items = items.slice(0, 50);
            limited = true;
        } else {
            items = items.slice(0, 150);
        }
        
        // Fetch details for all items to show descriptions
        pokedexResult.innerHTML = '<p class="pokedex-placeholder">Loading item details...</p>';
        const itemDetailsPromises = items.map(i => 
            fetch(i.url).then(r => r.json()).catch(() => null)
        );
        const itemDetails = await Promise.all(itemDetailsPromises);
        const validItems = itemDetails.filter(i => i !== null);
        
        pokedexResult.innerHTML = `
            <div style="max-height: 500px; overflow-y: auto;">
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px;">
                    ${validItems.map(item => {
                        const description = item.effect_entries.find(e => e.language.name === 'en')?.short_effect || 
                                          item.flavor_text_entries.find(e => e.language.name === 'en')?.text?.replace(/\f/g, ' ') || 
                                          'No description available';
                        const sprite = item.sprites.default;
                        
                        return `
                        <div style="background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.2s; display: flex; flex-direction: column;" 
                             onclick="window.showItemDetail('${item.name}')"
                             onmouseover="this.style.transform='translateY(-3px)'" 
                             onmouseout="this.style.transform='translateY(0)'">
                            ${sprite ? `<img src="${sprite}" alt="${item.name}" style="width: 60px; height: 60px; image-rendering: pixelated; margin: 0 auto 10px;">` : ''}
                            <div style="font-weight: bold; color: #f5576c; text-transform: capitalize; font-size: 1.1rem; margin-bottom: 8px;">${item.name.replace('-', ' ')}</div>
                            <div style="font-size: 0.85rem; color: #666; line-height: 1.4;">${description.length > 100 ? description.substring(0, 100) + '...' : description}</div>
                        </div>
                    `}).join('')}
                </div>
                ${limited ? `<div style=\"text-align:center; margin-top:25px;\"><button onclick=\"searchItems('${query || ''}', false)\" style=\"padding:10px 20px; background: linear-gradient(135deg,#f5576c 0%, #f0932b 100%); color:white; border:none; border-radius:25px; font-weight:bold; cursor:pointer;\">See More (${totalCount - 50} more)</button></div>` : ''}
            </div>
        `;
    } catch (error) {
        console.error('Search error:', error);
        pokedexResult.innerHTML = '<p class="pokedex-error">Error loading items</p>';
    }
}

async function showItemDetail(itemName) {
    pokedexResult.innerHTML = '<p class="pokedex-placeholder">Loading item details...</p>';
    
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/item/${itemName}`);
        const item = await response.json();
        
        const description = item.effect_entries.find(e => e.language.name === 'en')?.effect || 
                           item.flavor_text_entries.find(e => e.language.name === 'en')?.text || 
                           'No description available';
        
        const sprite = item.sprites.default;
        
        pokedexResult.innerHTML = `
            <div class="pokemon-entry">
                ${sprite ? `<img src="${sprite}" alt="${item.name}" style="width: 100px; height: 100px; image-rendering: pixelated;">` : ''}
                <div class="pokemon-entry-name">${item.name.charAt(0).toUpperCase() + item.name.slice(1).replace('-', ' ')}</div>
                <div class="pokemon-entry-description" style="margin-top: 20px;">${description}</div>
                <button onclick="searchItems('')" style="margin-top: 20px; padding: 10px 20px; background: #f5576c; color: white; border: none; border-radius: 20px; cursor: pointer; font-weight: bold;">← Back to Items</button>
            </div>
        `;
    } catch (error) {
        console.error('Error loading item:', error);
        pokedexResult.innerHTML = '<p class="pokedex-error">Error loading item details</p>';
    }
}

// TMs list
const tmsList = [
    { id: 1, name: 'TM001 Focus Blast', move: 'Focus Blast', type: 'Fighting' },
    { id: 2, name: 'TM002 Dragon Claw', move: 'Dragon Claw', type: 'Dragon' },
    { id: 3, name: 'TM003 Curse', move: 'Curse', type: 'Ghost' },
    { id: 4, name: 'TM004 Agility', move: 'Agility', type: 'Psychic' },
    { id: 5, name: 'TM005 Scary Face', move: 'Scary Face', type: 'Normal' },
    { id: 6, name: 'TM006 Payback', move: 'Payback', type: 'Dark' },
    { id: 7, name: 'TM007 Protect', move: 'Protect', type: 'Normal' },
    { id: 8, name: 'TM008 Fire Punch', move: 'Fire Punch', type: 'Fire' },
    { id: 9, name: 'TM009 Bullet Punch', move: 'Bullet Punch', type: 'Steel' },
    { id: 10, name: 'TM010 Magical Leaf', move: 'Magical Leaf', type: 'Grass' },
    { id: 11, name: 'TM011 Water Pledge', move: 'Water Pledge', type: 'Water' },
    { id: 12, name: 'TM012 Snarl', move: 'Snarl', type: 'Dark' },
    { id: 13, name: 'TM013 Acid Spray', move: 'Acid Spray', type: 'Poison' },
    { id: 14, name: 'TM014 Acrobatics', move: 'Acrobatics', type: 'Flying' },
    { id: 15, name: 'TM015 Struggle Bug', move: 'Struggle Bug', type: 'Bug' },
    { id: 16, name: 'TM016 Psybeam', move: 'Psybeam', type: 'Psychic' },
    { id: 17, name: 'TM017 Sunny Day', move: 'Sunny Day', type: 'Fire' },
    { id: 18, name: 'TM018 Reflect', move: 'Reflect', type: 'Psychic' },
    { id: 19, name: 'TM019 Safeguard', move: 'Safeguard', type: 'Normal' },
    { id: 20, name: 'TM020 Substitute', move: 'Substitute', type: 'Normal' },
    { id: 21, name: 'TM021 Retaliate', move: 'Retaliate', type: 'Normal' },
    { id: 22, name: 'TM022 Flash Cannon', move: 'Flash Cannon', type: 'Steel' },
    { id: 23, name: 'TM023 Charge Beam', move: 'Charge Beam', type: 'Electric' },
    { id: 24, name: 'TM024 Psyshock', move: 'Psyshock', type: 'Psychic' },
    { id: 25, name: 'TM025 Fury Cutter', move: 'Fury Cutter', type: 'Bug' },
    { id: 26, name: 'TM026 Earthquake', move: 'Earthquake', type: 'Ground' },
    { id: 27, name: 'TM027 Leech Life', move: 'Leech Life', type: 'Bug' },
    { id: 28, name: 'TM028 Gyro Ball', move: 'Gyro Ball', type: 'Steel' },
    { id: 29, name: 'TM029 Hex', move: 'Hex', type: 'Ghost' },
    { id: 30, name: 'TM030 Ally Switch', move: 'Ally Switch', type: 'Psychic' },
    { id: 31, name: 'Tera Orb', move: 'Terastallize', type: 'Tera', description: 'Allows Pokémon to Terastallize in battle, changing their type and gaining stat boosts' }
];

async function searchTMs(query) {
    pokedexResult.innerHTML = '<p class="pokedex-placeholder">Loading TMs...</p>';
    
    try {
        let results = tmsList;
        
        if (query) {
            results = results.filter(tm => 
                tm.name.toLowerCase().includes(query.toLowerCase()) || 
                tm.move.toLowerCase().includes(query.toLowerCase())
            );
        }
        
        if (results.length === 0) {
            pokedexResult.innerHTML = '<p class="pokedex-error">No TMs found</p>';
            return;
        }
        
        pokedexResult.innerHTML = `
            <div style="max-height: 500px; overflow-y: auto;">
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px;">
                    ${results.map(tm => {
                        const typeColors = {
                            'Fire': '#F08030', 'Water': '#6890F0', 'Grass': '#78C850', 'Electric': '#F8D030',
                            'Ice': '#98D8D8', 'Fighting': '#C03028', 'Poison': '#A040A0', 'Ground': '#E0C068',
                            'Flying': '#A890F0', 'Psychic': '#F85888', 'Bug': '#A8B820', 'Rock': '#B8A038',
                            'Ghost': '#705898', 'Dragon': '#7038F8', 'Dark': '#705848', 'Steel': '#B8B8D0',
                            'Fairy': '#EE99AC', 'Tera': '#B0E0E6', 'Normal': '#A8A878'
                        };
                        const bgColor = typeColors[tm.type] || '#A0A0A0';
                        
                        return `
                        <div style="background: linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%); padding: 15px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); cursor: pointer; transition: transform 0.2s; color: white;"
                             onclick="window.showTMDetail(${tm.id})"
                             onmouseover="this.style.transform='translateY(-3px)'" 
                             onmouseout="this.style.transform='translateY(0)'">
                            <div style="font-weight: bold; font-size: 1.2rem; margin-bottom: 8px;">${tm.name}</div>
                            <div style="font-size: 0.95rem; margin-bottom: 8px;">Move: ${tm.move}</div>
                            <div style="font-size: 0.85rem; background: rgba(255,255,255,0.2); padding: 5px; border-radius: 5px;">Type: ${tm.type}</div>
                        </div>
                    `}).join('')}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Search error:', error);
        pokedexResult.innerHTML = '<p class="pokedex-error">Error loading TMs</p>';
    }
}

function showTMDetail(tmId) {
    const tm = tmsList.find(t => t.id == tmId);
    if (!tm) {
        pokedexResult.innerHTML = '<p class="pokedex-error">TM not found</p>';
        return;
    }
    
    const typeColors = {
        'Fire': '#F08030', 'Water': '#6890F0', 'Grass': '#78C850', 'Electric': '#F8D030',
        'Ice': '#98D8D8', 'Fighting': '#C03028', 'Poison': '#A040A0', 'Ground': '#E0C068',
        'Flying': '#A890F0', 'Psychic': '#F85888', 'Bug': '#A8B820', 'Rock': '#B8A038',
        'Ghost': '#705898', 'Dragon': '#7038F8', 'Dark': '#705848', 'Steel': '#B8B8D0',
        'Fairy': '#EE99AC', 'Tera': '#B0E0E6', 'Normal': '#A8A878'
    };
    const bgColor = typeColors[tm.type] || '#A0A0A0';
    
    pokedexResult.innerHTML = `
        <div class="pokemon-entry" style="background: linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%); color: white; padding: 30px; border-radius: 15px;">
            <div class="pokemon-entry-name" style="font-size: 2rem; margin-bottom: 20px;">${tm.name}</div>
            <div style="font-size: 1.3rem; margin-bottom: 15px; background: rgba(255,255,255,0.2); padding: 10px; border-radius: 10px;">
                <strong>Move:</strong> ${tm.move}
            </div>
            <div style="font-size: 1.1rem; margin-bottom: 15px; background: rgba(255,255,255,0.2); padding: 10px; border-radius: 10px;">
                <strong>Type:</strong> ${tm.type}
            </div>
            ${tm.description ? `<div style="font-size: 1rem; margin-top: 20px; background: rgba(255,255,255,0.15); padding: 15px; border-radius: 10px; line-height: 1.6;">${tm.description}</div>` : ''}
            <button onclick="window.searchTMs('')" style="margin-top: 25px; padding: 12px 25px; background: rgba(255,255,255,0.3); color: white; border: 2px solid white; border-radius: 20px; cursor: pointer; font-weight: bold; font-size: 1rem;">← Back to TMs</button>
        </div>
    `;
}

async function searchTypes(query) {
    pokedexResult.innerHTML = '<p class="pokedex-placeholder">Loading types...</p>';
    
    try {
        const listResponse = await fetch('https://pokeapi.co/api/v2/type');
        const listData = await listResponse.json();
        
        let types = listData.results.filter(t => !t.name.includes('unknown') && !t.name.includes('shadow'));
        
        if (query) {
            types = types.filter(t => t.name.includes(query));
        }
        
        if (types.length === 0) {
            pokedexResult.innerHTML = '<p class="pokedex-error">No types found</p>';
            return;
        }
        
        pokedexResult.innerHTML = `
            <div style="max-height: 500px; overflow-y: auto;">
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px;">
                    ${types.map(t => `
                        <div style="background: ${getTypeColor(t.name)}; padding: 20px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); cursor: pointer; transition: transform 0.2s;" 
                             onclick="window.showTypeDetail('${t.name}')"
                             onmouseover="this.style.transform='translateY(-3px)'" 
                             onmouseout="this.style.transform='translateY(0)'">
                            <div style="font-weight: bold; color: white; text-transform: uppercase; font-size: 1.2rem; text-align: center; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">${t.name}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Search error:', error);
        pokedexResult.innerHTML = '<p class="pokedex-error">Error loading types</p>';
    }
}

async function showTypeDetail(typeName) {
    pokedexResult.innerHTML = '<p class="pokedex-placeholder">Loading type details...</p>';
    
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
        const type = await response.json();
        
        const damageRelations = type.damage_relations;
        
        pokedexResult.innerHTML = `
            <div class="pokemon-entry">
                <div class="pokemon-entry-name" style="background: ${getTypeColor(typeName)}; color: white; padding: 15px; border-radius: 15px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">${typeName.toUpperCase()}</div>
                
                <div style="margin-top: 30px;">
                    <h3 style="color: #667eea; margin-bottom: 10px;">Super Effective Against:</h3>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px;">
                        ${damageRelations.double_damage_to.map(t => `<span class="type-badge" style="background: ${getTypeColor(t.name)}">${t.name}</span>`).join('') || '<span style="color: #999;">None</span>'}
                    </div>
                    
                    <h3 style="color: #667eea; margin-bottom: 10px;">Weak Against:</h3>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px;">
                        ${damageRelations.double_damage_from.map(t => `<span class="type-badge" style="background: ${getTypeColor(t.name)}">${t.name}</span>`).join('') || '<span style="color: #999;">None</span>'}
                    </div>
                    
                    <h3 style="color: #667eea; margin-bottom: 10px;">Resists:</h3>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px;">
                        ${damageRelations.half_damage_from.map(t => `<span class="type-badge" style="background: ${getTypeColor(t.name)}">${t.name}</span>`).join('') || '<span style="color: #999;">None</span>'}
                    </div>
                    
                    <h3 style="color: #667eea; margin-bottom: 10px;">Immune To:</h3>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        ${damageRelations.no_damage_from.map(t => `<span class="type-badge" style="background: ${getTypeColor(t.name)}">${t.name}</span>`).join('') || '<span style="color: #999;">None</span>'}
                    </div>
                </div>
                
                <button onclick="searchTypes('')" style="margin-top: 20px; padding: 10px 20px; background: ${getTypeColor(typeName)}; color: white; border: none; border-radius: 20px; cursor: pointer; font-weight: bold;">← Back to Types</button>
            </div>
        `;
    } catch (error) {
        console.error('Error loading type:', error);
        pokedexResult.innerHTML = '<p class="pokedex-error">Error loading type details</p>';
    }
}

async function searchPokeballs(query, limitMode = false) {
    pokedexResult.innerHTML = '<p class="pokedex-placeholder">Loading Poké Balls...</p>';
    
    try {
        // List of all Poké Ball items with their IDs
        const pokeballs = [
            { name: 'poke-ball', id: 4 },
            { name: 'great-ball', id: 3 },
            { name: 'ultra-ball', id: 2 },
            { name: 'master-ball', id: 1 },
            { name: 'safari-ball', id: 6 },
            { name: 'net-ball', id: 8 },
            { name: 'dive-ball', id: 7 },
            { name: 'nest-ball', id: 9 },
            { name: 'repeat-ball', id: 10 },
            { name: 'timer-ball', id: 11 },
            { name: 'luxury-ball', id: 12 },
            { name: 'premier-ball', id: 13 },
            { name: 'dusk-ball', id: 13 },
            { name: 'heal-ball', id: 14 },
            { name: 'quick-ball', id: 15 },
            { name: 'cherish-ball', id: 16 },
            { name: 'fast-ball', id: 492 },
            { name: 'level-ball', id: 493 },
            { name: 'lure-ball', id: 494 },
            { name: 'heavy-ball', id: 495 },
            { name: 'love-ball', id: 496 },
            { name: 'friend-ball', id: 497 },
            { name: 'moon-ball', id: 498 },
            { name: 'sport-ball', id: 499 },
            { name: 'park-ball', id: 500 },
            { name: 'dream-ball', id: 576 },
            { name: 'beast-ball', id: 851 }
        ];
        
        let filteredBalls = pokeballs;
        
        // Filter if query provided
        if (query) {
            filteredBalls = pokeballs.filter(b => b.name.includes(query));
        }
        
        if (filteredBalls.length === 0) {
            pokedexResult.innerHTML = '<p class="pokedex-error">No Poké Balls found</p>';
            return;
        }
        const totalCount = filteredBalls.length;
        let limited = false;
        if (limitMode && !query && totalCount > 30) {
            filteredBalls = filteredBalls.slice(0, 30);
            limited = true;
        }

        // Display as grid
        pokedexResult.innerHTML = `
            <div style="max-height: 500px; overflow-y: auto;">
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; padding: 10px;">
                    ${filteredBalls.map(ball => `
                        <div style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 20px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); cursor: pointer; transition: transform 0.2s; text-align: center;" 
                             onclick="window.showPokeballDetail('${ball.name}', ${ball.id})"
                             onmouseover="this.style.transform='translateY(-5px) scale(1.05)'" 
                             onmouseout="this.style.transform='translateY(0) scale(1)'">
                            <div style="font-weight: bold; color: #e74c3c; text-transform: capitalize; font-size: 1.2rem; margin-top: 10px;">${ball.name.replace('-', ' ')}</div>
                        </div>
                    `).join('')}
                </div>
                ${limited ? `<div style=\"text-align:center; margin-top:25px;\"><button onclick=\"searchPokeballs('', false)\" style=\"padding:10px 20px; background: linear-gradient(135deg,#e74c3c 0%, #c0392b 100%); color:white; border:none; border-radius:25px; font-weight:bold; cursor:pointer;\">See More (${totalCount - 30} more)</button></div>` : ''}
            </div>
        `;
    } catch (error) {
        console.error('Search error:', error);
        pokedexResult.innerHTML = '<p class="pokedex-error">Error loading Poké Balls</p>';
    }
}

async function showPokeballDetail(ballName, ballId) {
    pokedexResult.innerHTML = '<p class="pokedex-placeholder">Loading Poké Ball details...</p>';
    
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/item/${ballName}`);
        const ball = await response.json();
        
        const description = ball.effect_entries.find(e => e.language.name === 'en')?.effect || 
                           ball.flavor_text_entries.find(e => e.language.name === 'en')?.text || 
                           'No description available';
        
        const sprite = ball.sprites.default;
        
        pokedexResult.innerHTML = `
            <div class="pokemon-entry">
                ${sprite ? `<img src="${sprite}" alt="${ball.name}" style="width: 150px; height: 150px; image-rendering: pixelated; margin-bottom: 20px;">` : ''}
                <div class="pokemon-entry-name" style="color: #e74c3c;">${ball.name.charAt(0).toUpperCase() + ball.name.slice(1).replace('-', ' ')}</div>
                <div class="pokemon-entry-description" style="margin-top: 20px;">${description.replace(/\n/g, ' ')}</div>
                <button onclick="searchPokeballs('')" style="margin-top: 20px; padding: 10px 20px; background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; border: none; border-radius: 20px; cursor: pointer; font-weight: bold;">← Back to Poké Balls</button>
            </div>
        `;
    } catch (error) {
        console.error('Error loading Poké Ball:', error);
        pokedexResult.innerHTML = '<p class="pokedex-error">Error loading Poké Ball details</p>';
    }
}

// Search G-Max Moves
async function searchGMaxMoves(query) {
    // Correct ID is 'pokedexResult'
    const pokedexResult = document.getElementById('pokedexResult');
    dbg('searchGMaxMoves invoked with query:', query);
    
    if (!pokedexResult) {
        console.error('Could not find pokedex-result element');
        return;
    }

    try {
        // Convert gmaxMoves object to array with pokemon IDs
        const gmaxArray = Object.entries(gmaxMoves).map(([pokemonId, moveData]) => ({
            pokemonId: parseInt(pokemonId),
            ...moveData
        }));

        // Filter based on query if provided
        let filteredMoves = gmaxArray;
        if (query && query.trim()) {
            const searchTerm = query.toLowerCase();
            dbg('Filtering G-Max moves with term:', searchTerm);
            filteredMoves = gmaxArray.filter(gmax => 
                gmax.move.toLowerCase().includes(searchTerm) ||
                gmax.type.toLowerCase().includes(searchTerm)
            );
        }

        if (filteredMoves.length === 0) {
            pokedexResult.innerHTML = '<p class="pokedex-error">No G-Max Moves found matching your search.</p>';
            return;
        }

        // Create grid display
        let html = `<h2>G-Max Moves (${filteredMoves.length})</h2><div class="pokeball-grid">`;
        
        for (const gmax of filteredMoves) {
            // Fetch Pokemon name for display
            let pokemonName = `Pokémon #${gmax.pokemonId}`;
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${gmax.pokemonId}`);
                if (response.ok) {
                    const pokemonData = await response.json();
                    pokemonName = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
                    dbg('Fetched Pokémon for G-Max move:', pokemonName);
                }
            } catch (error) {
                console.error('Error fetching Pokemon name:', error);
            }

            html += `
                <div class="pokeball-card" onclick="showGMaxMoveDetail(${gmax.pokemonId})" style="background: linear-gradient(135deg, #ff006e 0%, #8338ec 100%); cursor: pointer;">
                    <div style="font-weight: bold; font-size: 1.1em; margin-bottom: 8px; color: white;">${gmax.move}</div>
                    <span class="type-badge ${gmax.type}">${gmax.type}</span>
                    <div style="margin-top: 8px; font-size: 0.9em; color: rgba(255, 255, 255, 0.9);">
                        Used by: ${pokemonName}
                    </div>
                    <div style="margin-top: 8px; font-size: 0.85em; line-height: 1.3; color: rgba(255, 255, 255, 0.8);">
                        ${gmax.description}
                    </div>
                </div>
            `;
        }
        
        html += '</div>';
        pokedexResult.innerHTML = html;

    } catch (error) {
        console.error('Error loading G-Max Moves:', error);
        pokedexResult.innerHTML = '<p class="pokedex-error">Error loading G-Max Moves</p>';
    }
}

// View Pokemon that has this G-Max move
async function viewGMaxPokemon(pokemonId) {
    currentSearchCategory = 'pokemon';
    
    // Update active category button
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        if (btn.getAttribute('data-category') === 'pokemon') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update search placeholder
    const pokemonSearch = document.getElementById('pokemonSearch');
    if (pokemonSearch) {
        pokemonSearch.placeholder = placeholders['pokemon'];
    }
    
    // Search for this Pokemon by ID
    await searchPokemonCategory(pokemonId.toString());
}

// Detailed G-Max move view
async function showGMaxMoveDetail(pokemonId) {
    const gmax = gmaxMoves[pokemonId];
    if (!gmax) {
        searchGMaxMoves('');
        return;
    }

    const pokedexResult = document.getElementById('pokedexResult');
    pokedexResult.innerHTML = '<p class="pokedex-placeholder">Loading G-Max move...</p>';

    let pokemonData = null;
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        if (response.ok) {
            pokemonData = await response.json();
        }
    } catch (e) {
        console.error('Failed to fetch Pokémon for G-Max move detail', e);
    }

    const sprite = pokemonData ? (pokemonData.sprites.other['official-artwork'].front_default || pokemonData.sprites.front_default) : '';
    const pokemonName = pokemonData ? pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1) : `Pokémon #${pokemonId}`;

    pokedexResult.innerHTML = `
        <div class="pokemon-entry" style="background: linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%); padding: 25px; border-radius: 20px; box-shadow: 0 6px 20px rgba(255,107,157,0.35); color: white;">
            <h2 style="margin: 0 0 15px; display: flex; align-items: center; gap: 10px; font-size: 1.8rem;">
                💥 ${gmax.move} 💥
            </h2>
            <div style="display: flex; flex-wrap: wrap; gap: 25px; align-items: flex-start;">
                ${sprite ? `<img src="${sprite}" alt="${pokemonName}" style="width: 200px; height: 200px; object-fit: contain; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));">` : ''}
                <div style="flex: 1; min-width: 250px;">
                    <div style="margin-bottom: 10px; font-size: 1.1rem; font-weight: bold;">Used by: ${pokemonName}</div>
                    <span style="display:inline-block; background:${getTypeColor(gmax.type.toLowerCase())}; padding:8px 18px; border-radius:25px; font-weight:bold; font-size:0.95rem; letter-spacing:0.5px;">${gmax.type} Type</span>
                    <div style="margin-top:18px; background: rgba(255,255,255,0.15); padding:15px 18px; border-radius:15px; line-height:1.6; font-size:1rem;">
                        ${gmax.description}
                    </div>
                </div>
            </div>
            <div style="margin-top:25px; display:flex; gap:15px; flex-wrap:wrap;">
                <button onclick="searchGMaxMoves('')" style="padding:10px 20px; background: linear-gradient(135deg,#8338ec 0%, #ff006e 100%); border:none; color:white; font-weight:bold; border-radius:25px; cursor:pointer;">← Back to All G-Max Moves</button>
                <button onclick="viewGMaxPokemon(${pokemonId})" style="padding:10px 20px; background: linear-gradient(135deg,#764ba2 0%, #667eea 100%); border:none; color:white; font-weight:bold; border-radius:25px; cursor:pointer;">View Pokémon Details</button>
            </div>
        </div>
    `;
}

if (searchBtn) {
    searchBtn.addEventListener('click', searchPokemon);
}



if (pokemonSearch) {
    pokemonSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchPokemon();
        }
    });
}

// Random suggestion feature
async function randomSuggest() {
    console.log('[CLICK] randomSuggest function called!');
    dbg('randomSuggest called');
    const pokedexResult = document.getElementById('pokedexResult');
    if (!pokedexResult) {
        console.error('pokedexResult element not found!');
        return;
    }
    pokedexResult.innerHTML = '<p class="pokedex-placeholder">🎲 Rolling a random suggestion...</p>';
    // Categories to choose from
    const categories = ['pokemon','moves','abilities','items','types','pokeballs','tms','gmax'];
    const category = categories[Math.floor(Math.random()*categories.length)];
    dbg('Random category chosen:', category);
    try {
        switch(category) {
            case 'pokemon': {
                const id = Math.floor(Math.random()*1025)+1; // 1-1025
                dbg('Random Pokémon ID:', id);
                await searchPokemonCategory(String(id));
                break;
            }
            case 'moves': {
                // Fetch move list once and cache
                if (!window.__allMoves) {
                    const res = await fetch('https://pokeapi.co/api/v2/move?limit=1000');
                    const data = await res.json();
                    window.__allMoves = data.results.map(r=>r.name);
                }
                const move = window.__allMoves[Math.floor(Math.random()*window.__allMoves.length)];
                dbg('Random Move:', move);
                await showMoveDetail(move);
                break;
            }
            case 'abilities': {
                if (!window.__allAbilities) {
                    const res = await fetch('https://pokeapi.co/api/v2/ability?limit=400');
                    const data = await res.json();
                    window.__allAbilities = data.results.map(r=>r.name);
                }
                const ability = window.__allAbilities[Math.floor(Math.random()*window.__allAbilities.length)];
                dbg('Random Ability:', ability);
                await showAbilityDetail(ability);
                break;
            }
            case 'items': {
                if (!window.__allItems) {
                    const res = await fetch('https://pokeapi.co/api/v2/item?limit=2000');
                    const data = await res.json();
                    window.__allItems = data.results.map(r=>r.name);
                }
                const item = window.__allItems[Math.floor(Math.random()*window.__allItems.length)];
                dbg('Random Item:', item);
                await showItemDetail(item);
                break;
            }
            case 'types': {
                const types = ['normal','fire','water','electric','grass','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy'];
                const type = types[Math.floor(Math.random()*types.length)];
                dbg('Random Type:', type);
                await showTypeDetail(type);
                break;
            }
            case 'pokeballs': {
                // Use list from searchPokeballs
                const balls = ['poke-ball','great-ball','ultra-ball','master-ball','safari-ball','net-ball','dive-ball','nest-ball','repeat-ball','timer-ball','luxury-ball','premier-ball','dusk-ball','heal-ball','quick-ball','cherish-ball','fast-ball','level-ball','lure-ball','heavy-ball','love-ball','friend-ball','moon-ball','sport-ball','park-ball','dream-ball','beast-ball'];
                const ball = balls[Math.floor(Math.random()*balls.length)];
                dbg('Random Poké Ball:', ball);
                await showPokeballDetail(ball, 0);
                break;
            }
            case 'tms': {
                const tm = tmsList[Math.floor(Math.random()*tmsList.length)];
                dbg('Random TM:', tm.name);
                showTMDetail(tm.id);
                break;
            }
            case 'gmax': {
                const entries = Object.entries(gmaxMoves);
                const pick = entries[Math.floor(Math.random()*entries.length)];
                const pokemonId = pick[0];
                dbg('Random G-Max Pokémon ID:', pokemonId);
                await showGMaxMoveDetail(pokemonId);
                break;
            }
        }
        // Inject reroll button
        const existing = pokedexResult.querySelector('.pokedex-entry, .pokemon-entry');
        const rerollBtnHTML = `<div style="margin-top:25px; text-align:center;"><button onclick="randomSuggest()" style="padding:10px 22px; background: linear-gradient(135deg,#ff8c00 0%, #ff2d55 100%); color:white; border:none; border-radius:30px; font-weight:bold; cursor:pointer; font-size:0.95rem;">🎲 Reroll Random</button></div>`;
        if (pokedexResult.innerHTML.indexOf('Reroll Random') === -1) {
            pokedexResult.innerHTML += rerollBtnHTML;
        }
    } catch (e) {
        console.error('Random selection error:', e);
        pokedexResult.innerHTML = '<p class="pokedex-error">Error generating random suggestion.</p>';
    }
}

if (randomSuggestBtn) {
    dbg('Attaching randomSuggest listener to button');
    randomSuggestBtn.addEventListener('click', randomSuggest);
    // Test the button
    console.log('[TEST] Random suggest button:', randomSuggestBtn);
    console.log('[TEST] Button click handler attached');
} else {
    console.warn('randomSuggestBtn not found in DOM');
}
window.randomSuggest = randomSuggest;
console.log('[TEST] randomSuggest exposed to window:', typeof window.randomSuggest);

console.log('[INIT] About to attach wheel option handlers. Count:', wheelOptions.length);
showDebug('Attaching handlers...');

wheelOptions.forEach((option, index) => {
    try {
        console.log(`[EVENT ${index}] Adding click handler to wheel option:`, option.getAttribute('data-generation'));
        
        // Simplest possible test
        const gen = option.getAttribute('data-generation');
        option.onclick = function() {
            if(window.openWheelGen) {
                window.openWheelGen(gen);
            }
        };
        
        // Verify it was set
        if (option.onclick) {
            showDebug('Handler SET for: ' + gen);
        } else {
            showDebug('Handler FAILED for: ' + gen);
        }
        
        // Check again after 1 second
        setTimeout(() => {
            if (option.onclick) {
                showDebug('Handler STILL EXISTS for: ' + gen);
            } else {
                showDebug('Handler REMOVED for: ' + gen + ' !!!');
            }
        }, 1000);
        
    } catch (error) {
        showDebug('ERROR setting handler: ' + error.message);
    }
});

console.log('[INIT] Finished attaching wheel handlers. Total:', wheelOptions.length);
document.title = 'Handlers: ' + wheelOptions.length;

// Expose test function
window.testWheelOpen = function() {
    document.title = 'TEST BUTTON CLICKED!';
    alert('Test function called!');
};
document.title = 'TestFunc: ' + (typeof window.testWheelOpen);

// Expose search functions globally for inline onclick
window.searchPokemon = searchPokemon;
window.randomSuggest = randomSuggest;
window.searchTMs = searchTMs;
window.showTMDetail = showTMDetail;

function triggerWheelMode(generation) {
    document.title = 'triggerWheelMode: ' + generation;
    
    // Handle random mode - pick a random generation
    if (generation === 'random') {
        const allGenerations = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'legendary', 'eeveelution', 'paradox', 'starters', 'fossil', 'zmoves', 'gigantamax', 'tera', 'regional', 'mega', 'games', 'ultimate'];
        generation = allGenerations[Math.floor(Math.random() * allGenerations.length)];
        console.log('Random mode selected:', generation);
    }
    
    isLegendaryMode = (generation === 'legendary');
    isEeveelutionMode = (generation === 'eeveelution');
    isParadoxMode = (generation === 'paradox');
    isStarterMode = (generation === 'starters');
    isFossilMode = (generation === 'fossil');
    isZMoveMode = (generation === 'zmoves');
    isGigantamaxMode = (generation === 'gigantamax');
    isTeraMode = (generation === 'tera');
    isRegionalMode = (generation === 'regional');
    isMegaMode = (generation === 'mega');
    isGamesMode = (generation === 'games');
    isUltimateMode = (generation === 'ultimate');

    // Reuse switch for subtitle
    let subtitle = '';
    switch(generation) {
        case '1': subtitle = 'Generation 1 - Kanto'; pokemonOffset=0; pokemonLimit=151; break;
        case '2': subtitle = 'Generation 2 - Johto'; pokemonOffset=151; pokemonLimit=100; break;
        case '3': subtitle = 'Generation 3 - Hoenn'; pokemonOffset=251; pokemonLimit=135; break;
        case '4': subtitle = 'Generation 4 - Sinnoh'; pokemonOffset=386; pokemonLimit=107; break;
        case '5': subtitle = 'Generation 5 - Unova'; pokemonOffset=493; pokemonLimit=156; break;
        case '6': subtitle = 'Generation 6 - Kalos'; pokemonOffset=649; pokemonLimit=72; break;
        case '7': subtitle = 'Generation 7 - Alola'; pokemonOffset=721; pokemonLimit=88; break;
        case '8': subtitle = 'Generation 8 - Galar'; pokemonOffset=809; pokemonLimit=96; break;
        case '9': subtitle = 'Generation 9 - Paldea'; pokemonOffset=905; pokemonLimit=120; break;
        case 'legendary': subtitle = 'Legendary & Mythical Pokémon'; pokemonLimit=0; break;
        case 'eeveelution': subtitle = 'Eeveelutions'; pokemonLimit=0; break;
        case 'paradox': subtitle = 'Paradox Pokémon'; pokemonLimit=0; break;
        case 'starters': subtitle = 'Starter Pokémon & Evolutions'; pokemonLimit=0; break;
        case 'fossil': subtitle = 'Fossil Pokémon'; pokemonLimit=0; break;
        case 'zmoves': subtitle = 'Z-Moves & Z-Crystals'; pokemonLimit=0; break;
        case 'gigantamax': subtitle = 'Gigantamax Pokémon'; pokemonLimit=0; break;
        case 'tera': subtitle = 'Terastallized Pokémon'; pokemonLimit=0; break;
        case 'regional': subtitle = 'Regional Variants'; pokemonLimit=0; break;
        case 'mega': subtitle = 'Mega Evolutions'; pokemonLimit=0; break;
        case 'games': subtitle = 'Pokémon Games'; pokemonLimit=0; break;
        case 'ultimate': subtitle = 'ULTIMATE WHEEL - All Pokémon!'; pokemonLimit=0; break;
    }
    selectedGeneration = subtitle;
    selectionScreen.style.display = 'none';
    mainScreen.style.display = 'flex';
    const subEl = document.querySelector('.subtitle');
    if (subEl) subEl.textContent = subtitle;
    initializePokemonList();
}
window.triggerWheelMode = triggerWheelMode;

// Initialize Pokémon list instead of wheel
async function initializePokemonList() {
    const container = document.getElementById('pokemonListView');
    const loading = document.getElementById('loading');
    
    container.innerHTML = '';
    loading.style.display = 'block';
    
    let pokemonList = [];
    
    try {
        // Fetch Pokémon based on current mode
        if (isLegendaryMode) {
            pokemonList = legendaryAndMythical;
        } else if (isEeveelutionMode) {
            pokemonList = eeveelutions;
        } else if (isParadoxMode) {
            pokemonList = paradoxPokemon;
        } else if (isStarterMode) {
            pokemonList = starterPokemon;
        } else if (isFossilMode) {
            pokemonList = fossilPokemon;
        } else if (isZMoveMode) {
            // Fetch Z-Move list
            const response = await fetch('https://pokeapi.co/api/v2/item-category/33');
            const data = await response.json();
            pokemonList = data.items.map((item, idx) => idx + 1);
        } else if (isGigantamaxMode) {
            // Placeholder for Gigantamax (would need specific IDs)
            pokemonList = [1, 3, 6, 9, 25, 39, 58, 74, 92, 104, 109, 133, 147, 152, 155, 158];
        } else if (isTeraMode) {
            // All Pokémon can Terastallize, fetch up to 1025
            for (let i = 1; i <= 1025; i++) pokemonList.push(i);
        } else if (isRegionalMode) {
            // Regional variants - specific IDs
            pokemonList = [25, 26, 27, 28, 37, 38, 50, 51, 52, 53, 74, 75, 76, 88, 89, 103, 104, 105, 106, 107, 150, 151];
        } else if (isMegaMode) {
            // Mega Evolution capable Pokémon
            pokemonList = [3, 6, 9, 65, 94, 130, 142, 149, 150, 151, 248, 384, 445, 384, 493];
        } else if (isGamesMode) {
            // Games - use game list instead
            pokemonList = Array.from({length: pokemonGames.length}, (_, i) => i + 1);
        } else if (isUltimateMode) {
            // All Pokémon
            for (let i = 1; i <= 1025; i++) pokemonList.push(i);
        } else {
            // Regular generations
            const start = pokemonOffset + 1;
            const end = pokemonOffset + pokemonLimit;
            for (let i = start; i <= end; i++) {
                pokemonList.push(i);
            }
        }
        
        // Fetch Pokémon details from API
        const pokemonDetails = [];
        for (const id of pokemonList) {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    pokemonDetails.push({
                        id: data.id,
                        name: data.name
                    });
                }
            } catch (e) {
                console.error(`Failed to fetch Pokémon ${id}`);
            }
        }
        
        // Render list
        container.innerHTML = pokemonDetails.map(p => `
            <div class="pokemon-list-item" onclick="this.querySelector('input[type=checkbox]').checked = !this.querySelector('input[type=checkbox]').checked; handleListItemCheck(this);">
                <input type="checkbox" data-pokemon-id="${p.id}" onchange="handleListItemCheck(this.parentElement)">
                <label>
                    <span class="pokemon-id">#${String(p.id).padStart(4, '0')}</span>
                    <span>${p.name.charAt(0).toUpperCase() + p.name.slice(1).replace('-', ' ')}</span>
                </label>
            </div>
        `).join('');
        
        loading.style.display = 'none';
    } catch (error) {
        console.error('Error loading Pokémon list:', error);
        container.innerHTML = '<p style="color: red; text-align: center;">Error loading Pokémon. Please try again.</p>';
        loading.style.display = 'none';
    }
}

// Region-based list initialization
async function initializeRegionDropdownList() {
    const container = document.getElementById('regionDropdowns');
    const loading = document.getElementById('loading');
    
    container.innerHTML = '';
    loading.style.display = 'block';
    
    try {
        // Define regions
        const regions = [
            { name: 'Kanto (Gen 1)', start: 1, end: 151 },
            { name: 'Johto (Gen 2)', start: 152, end: 251 },
            { name: 'Hoenn (Gen 3)', start: 252, end: 386 },
            { name: 'Sinnoh (Gen 4)', start: 387, end: 493 },
            { name: 'Unova (Gen 5)', start: 494, end: 649 },
            { name: 'Kalos (Gen 6)', start: 650, end: 721 },
            { name: 'Alola (Gen 7)', start: 722, end: 809 },
            { name: 'Galar (Gen 8)', start: 810, end: 905 },
            { name: 'Paldea (Gen 9)', start: 906, end: 1025 }
        ];
        
        // Build region dropdowns
        for (const region of regions) {
            const regionDiv = document.createElement('div');
            regionDiv.className = 'region-dropdown open';
            
            // Fetch Pokémon for this region
            const pokemonIds = [];
            for (let id = region.start; id <= region.end; id++) {
                pokemonIds.push(id);
            }
            
            // Fetch details
            const pokemonDetails = [];
            for (const id of pokemonIds) {
                try {
                    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
                    if (response.ok) {
                        const data = await response.json();
                        pokemonDetails.push({
                            id: data.id,
                            name: data.name
                        });
                    }
                } catch (e) {
                    console.error(`Failed to fetch Pokémon ${id}`);
                }
            }
            
            // Create header and list
            const header = document.createElement('div');
            header.className = 'region-dropdown-header';
            header.innerHTML = `
                <span>${region.name} (${pokemonDetails.length} Pokémon)</span>
                <span class="arrow">▼</span>
            `;
            header.onclick = function() {
                regionDiv.classList.toggle('open');
                list.classList.toggle('hidden');
            };
            
            const list = document.createElement('div');
            list.className = 'region-pokemon-list';
            list.innerHTML = pokemonDetails.map(p => `
                <div class="region-pokemon-item">
                    <input type="checkbox" id="pok-${p.id}" data-pokemon-id="${p.id}">
                    <label for="pok-${p.id}">#${String(p.id).padStart(4, '0')} ${p.name.charAt(0).toUpperCase() + p.name.slice(1).replace('-', ' ')}</label>
                </div>
            `).join('');
            
            // Add event listeners to checkboxes
            list.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.onchange = function() {
                    this.parentElement.classList.toggle('checked', this.checked);
                };
            });
            
            regionDiv.appendChild(header);
            regionDiv.appendChild(list);
            container.appendChild(regionDiv);
        }
        
        loading.style.display = 'none';
    } catch (error) {
        console.error('Error loading region dropdowns:', error);
        container.innerHTML = '<p style="color: red; text-align: center;">Error loading Pokémon. Please try again.</p>';
        loading.style.display = 'none';
    }
}

// Handle list item checkbox changes
function handleListItemCheck(element) {
    const checkbox = element.querySelector('input[type="checkbox"]');
    element.classList.toggle('checked', checkbox.checked);
}

// Back button functionality
function backToSelection() {
    console.log('Returning to selection screen');
    mainScreen.style.display = 'none';
    selectionScreen.style.display = 'flex';
    
    // Sync the main screen toggle button with current state
    if (mainShinyToggleBtn) {
        mainShinyToggleBtn.textContent = isShinyMode ? '✨ Shiny Mode ON' : '✨ Toggle Shiny Mode';
        if (isShinyMode) {
            mainShinyToggleBtn.classList.add('active');
        } else {
            mainShinyToggleBtn.classList.remove('active');
        }
    }
    
    // Reset the wheel
    pokemon = [];
    currentRotation = 0;
    isSpinning = false;
    
    // Close modal if open
    const modal = document.getElementById('resultModal');
    if (modal) {
        modal.style.display = 'none';
    }
}
window.backToSelection = backToSelection;

// Verify all elements exist
function initializeWheel() {
    if (!canvas) {
        console.error('Canvas element not found!');
        if (loadingDiv) loadingDiv.textContent = 'Error: Canvas not found. Please refresh.';
        return;
    }
    if (!ctx) {
        console.error('Canvas context not found!');
        if (loadingDiv) loadingDiv.textContent = 'Error: Canvas context failed. Please refresh.';
        return;
    }
    if (!resultDiv) {
        console.error('Result div not found!');
        return;
    }
    if (!loadingDiv) {
        console.error('Loading div not found!');
        return;
    }
    
    // Set canvas size
    const WHEEL_SIZE = 600;
    canvas.width = WHEEL_SIZE;
    canvas.height = WHEEL_SIZE;
    
    console.log('Initializing Pokémon Wheel Spinner...');
    // Force screen transition safety in case prior visibility change failed
    try {
        const sel = document.getElementById('selectionScreen');
        const main = document.getElementById('mainScreen');
        if (sel) sel.style.display = 'none';
        if (main) {
            main.style.display = 'flex';
            console.log('[INIT WHEEL] Main screen forced visible');
        } else {
            console.warn('[INIT WHEEL] Main screen element missing');
        }
    } catch(e) {
        console.error('Screen force error:', e);
    }
    // Attach canvas listeners before fetching
    attachCanvasListeners();
    fetchAllPokemon();
}

// Wheel configuration
async function fetchAllPokemon() {
    try {
        loadingDiv.style.display = 'block';
        canvas.style.cursor = 'wait';
        
        if (isZMoveMode) {
            console.log(`Loading ${zMoves.length} Z-Moves...`);
            
            // Z-Moves don't come from API, just use the array
            pokemon = zMoves.map((move, index) => ({
                name: move.name,
                id: index + 1,
                type: move.type,
                category: move.category
            }));
            
            console.log(`Loaded ${pokemon.length} Z-Moves`);
            loadingDiv.style.display = 'none';
            canvas.style.cursor = 'pointer';
            drawWheel();
            return;
            
        } else if (isGamesMode) {
            console.log(`Loading ${pokemonGames.length} Pokémon Games...`);
            
            // Games don't come from API, just use the array
            pokemon = pokemonGames.map((game, index) => ({
                name: game.name,
                id: index + 1,
                generation: game.generation,
                region: game.region,
                year: game.year
            }));
            
            console.log(`Loaded ${pokemon.length} Pokémon Games`);
            loadingDiv.style.display = 'none';
            canvas.style.cursor = 'pointer';
            drawWheel();
            return;
            
        } else if (isLegendaryMode) {
            console.log(`Fetching ${legendaryAndMythical.length} Legendary & Mythical Pokémon...`);
            
            // Fetch each legendary/mythical Pokémon individually
            const fetchPromises = legendaryAndMythical.map(id => 
                fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json())
            );
            
            const pokemonData = await Promise.all(fetchPromises);
            
            pokemon = pokemonData.map(p => ({
                name: p.name.charAt(0).toUpperCase() + p.name.slice(1).replace('-', ' '),
                id: p.id,
                sprite: p.sprites.other['official-artwork'].front_default || p.sprites.front_default,
                shinySprite: p.sprites.other['official-artwork'].front_shiny || p.sprites.front_shiny,
                types: p.types.map(t => t.type.name)
            }));
            
        } else if (isEeveelutionMode) {
            console.log(`Fetching ${eeveelutions.length} Eeveelutions...`);
            
            // Fetch each Eeveelution individually
            const fetchPromises = eeveelutions.map(id => 
                fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json())
            );
            
            const pokemonData = await Promise.all(fetchPromises);
            
            pokemon = pokemonData.map(p => ({
                name: p.name.charAt(0).toUpperCase() + p.name.slice(1).replace('-', ' '),
                id: p.id,
                sprite: p.sprites.other['official-artwork'].front_default || p.sprites.front_default,
                shinySprite: p.sprites.other['official-artwork'].front_shiny || p.sprites.front_shiny,
                types: p.types.map(t => t.type.name)
            }));
            
        } else if (isParadoxMode) {
            console.log(`Fetching ${paradoxPokemon.length} Paradox Pokémon...`);
            
            // Fetch each Paradox Pokémon individually
            const fetchPromises = paradoxPokemon.map(id => 
                fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json())
            );
            
            const pokemonData = await Promise.all(fetchPromises);
            
            pokemon = pokemonData.map(p => ({
                name: p.name.charAt(0).toUpperCase() + p.name.slice(1).replace('-', ' '),
                id: p.id,
                sprite: p.sprites.other['official-artwork'].front_default || p.sprites.front_default,
                shinySprite: p.sprites.other['official-artwork'].front_shiny || p.sprites.front_shiny,
                types: p.types.map(t => t.type.name)
            }));
            
        } else if (isStarterMode) {
            console.log(`Fetching ${starterPokemon.length} Starter Pokémon...`);
            
            // Fetch each Starter Pokémon individually
            const fetchPromises = starterPokemon.map(id => 
                fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json())
            );
            
            const pokemonData = await Promise.all(fetchPromises);
            
            pokemon = pokemonData.map(p => ({
                name: p.name.charAt(0).toUpperCase() + p.name.slice(1).replace('-', ' '),
                id: p.id,
                sprite: p.sprites.other['official-artwork'].front_default || p.sprites.front_default,
                shinySprite: p.sprites.other['official-artwork'].front_shiny || p.sprites.front_shiny,
                types: p.types.map(t => t.type.name)
            }));
            
        } else if (isFossilMode) {
            console.log(`Fetching ${fossilPokemon.length} Fossil Pokémon...`);
            
            // Fetch each Fossil Pokémon individually
            const fetchPromises = fossilPokemon.map(id => 
                fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json())
            );
            
            const pokemonData = await Promise.all(fetchPromises);
            
            pokemon = pokemonData.map(p => ({
                name: p.name.charAt(0).toUpperCase() + p.name.slice(1).replace('-', ' '),
                id: p.id,
                sprite: p.sprites.other['official-artwork'].front_default || p.sprites.front_default,
                shinySprite: p.sprites.other['official-artwork'].front_shiny || p.sprites.front_shiny,
                types: p.types.map(t => t.type.name)
            }));
            
        } else if (isGigantamaxMode) {
            console.log(`Fetching ${gigantamaxPokemon.length} Gigantamax-capable Pokémon...`);
            
            // Fetch each Gigantamax-capable Pokémon individually
            const fetchPromises = gigantamaxPokemon.map(id => 
                fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json())
            );
            
            const pokemonData = await Promise.all(fetchPromises);
            
            pokemon = pokemonData.map(p => ({
                name: p.name.charAt(0).toUpperCase() + p.name.slice(1).replace('-', ' '),
                id: p.id,
                sprite: p.sprites.other['official-artwork'].front_default || p.sprites.front_default,
                shinySprite: p.sprites.other['official-artwork'].front_shiny || p.sprites.front_shiny,
                types: p.types.map(t => t.type.name)
            }));
            
        } else if (isTeraMode) {
            console.log(`Fetching ${teraPokemon.length} Terastallized Pokémon...`);
            
            // Fetch each Tera Pokémon individually
            const fetchPromises = teraPokemon.map(id => 
                fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json())
            );
            
            const pokemonData = await Promise.all(fetchPromises);
            
            pokemon = pokemonData.map(p => ({
                name: p.name.charAt(0).toUpperCase() + p.name.slice(1).replace('-', ' '),
                id: p.id,
                sprite: p.sprites.other['official-artwork'].front_default || p.sprites.front_default,
                shinySprite: p.sprites.other['official-artwork'].front_shiny || p.sprites.front_shiny,
                types: p.types.map(t => t.type.name)
            }));
            
        } else if (isRegionalMode) {
            console.log(`Fetching ${regionalVariants.length} Regional Variant Pokémon...`);
            
            // Fetch each Regional Variant Pokémon individually
            const fetchPromises = regionalVariants.map(id => 
                fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json())
            );
            
            const pokemonData = await Promise.all(fetchPromises);
            
            pokemon = pokemonData.map(p => ({
                name: p.name.charAt(0).toUpperCase() + p.name.slice(1).replace('-', ' '),
                id: p.id,
                sprite: p.sprites.other['official-artwork'].front_default || p.sprites.front_default,
                shinySprite: p.sprites.other['official-artwork'].front_shiny || p.sprites.front_shiny,
                types: p.types.map(t => t.type.name)
            }));
            
        } else if (isMegaMode) {
            console.log(`Fetching ${megaEvolutions.length} Mega Evolution Pokémon...`);
            
            // Fetch each Mega Evolution Pokémon individually
            const fetchPromises = megaEvolutions.map(id => 
                fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json())
            );
            
            const pokemonData = await Promise.all(fetchPromises);
            
            pokemon = pokemonData.map(p => ({
                name: p.name.charAt(0).toUpperCase() + p.name.slice(1).replace('-', ' '),
                id: p.id,
                sprite: p.sprites.other['official-artwork'].front_default || p.sprites.front_default,
                shinySprite: p.sprites.other['official-artwork'].front_shiny || p.sprites.front_shiny,
                types: p.types.map(t => t.type.name)
            }));
            
        } else if (isUltimateMode) {
            console.log('Fetching ULTIMATE WHEEL - ALL Pokémon, Z-Moves, and Games combined!');
            
            // Combine all unique Pokémon IDs from all wheels
            const allPokemonIds = new Set();
            
            // Add all base Pokémon (Gen 1-9: IDs 1-1025)
            for (let i = 1; i <= 1025; i++) {
                allPokemonIds.add(i);
            }
            
            // Add all special forms
            legendaryAndMythical.forEach(id => allPokemonIds.add(id));
            eeveelutions.forEach(id => allPokemonIds.add(id));
            paradoxPokemon.forEach(id => allPokemonIds.add(id));
            starterPokemon.forEach(id => allPokemonIds.add(id));
            gigantamaxPokemon.forEach(id => allPokemonIds.add(id));
            teraPokemon.forEach(id => allPokemonIds.add(id));
            regionalVariants.forEach(id => allPokemonIds.add(id));
            megaEvolutions.forEach(id => allPokemonIds.add(id));
            
            const ultimatePokemonArray = Array.from(allPokemonIds).sort((a, b) => a - b);
            console.log(`Total unique Pokémon in Ultimate Wheel: ${ultimatePokemonArray.length}`);
            
            // Fetch all Pokémon
            const fetchPromises = ultimatePokemonArray.map(id => 
                fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
                    .then(res => res.json())
                    .catch(err => {
                        console.warn(`Failed to fetch Pokémon ${id}:`, err);
                        return null;
                    })
            );
            
            const pokemonData = await Promise.all(fetchPromises);
            
            pokemon = pokemonData
                .filter(p => p !== null)
                .map(p => ({
                    name: p.name.charAt(0).toUpperCase() + p.name.slice(1).replace('-', ' '),
                    id: p.id,
                    sprite: p.sprites.other['official-artwork'].front_default || p.sprites.front_default,
                    shinySprite: p.sprites.other['official-artwork'].front_shiny || p.sprites.front_shiny,
                    types: p.types.map(t => t.type.name),
                    isZMove: false,
                    isGame: false
                }));
            
            // Add Z-Moves to the ultimate wheel
            const zMovesData = zMoves.map((move, index) => ({
                name: move.name,
                id: 'zmove_' + index,
                type: move.type,
                category: move.category,
                isZMove: true,
                isGame: false
            }));
            
            // Add Pokémon Games to the ultimate wheel
            const gamesData = pokemonGames.map((game, index) => ({
                name: game.name,
                id: 'game_' + index,
                generation: game.generation,
                region: game.region,
                year: game.year,
                isZMove: false,
                isGame: true
            }));
            
            // Combine everything
            pokemon = [...pokemon, ...zMovesData, ...gamesData];
            console.log(`Total items in Ultimate Wheel: ${pokemon.length} (${pokemonData.filter(p => p !== null).length} Pokémon + ${zMoves.length} Z-Moves + ${pokemonGames.length} Games)`);
            
        } else {
            console.log(`Fetching ${pokemonLimit} Pokémon starting from #${pokemonOffset + 1}...`);
            
            // Fetch Pokémon based on selected limit and offset
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${pokemonLimit}&offset=${pokemonOffset}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // Fetch full details for each Pokemon to get sprites
            const detailPromises = data.results.map(p => 
                fetch(p.url).then(res => res.json())
            );
            const pokemonDetails = await Promise.all(detailPromises);
            
            pokemon = pokemonDetails.map((p, index) => ({
                name: p.name.charAt(0).toUpperCase() + p.name.slice(1).replace('-', ' '),
                id: pokemonOffset + index + 1,
                sprite: p.sprites.other['official-artwork'].front_default || p.sprites.front_default,
                shinySprite: p.sprites.other['official-artwork'].front_shiny || p.sprites.front_shiny,
                types: p.types.map(t => t.type.name)
            }));
        }
        
        console.log(`Loaded ${pokemon.length} Pokémon`);
        loadingDiv.style.display = 'none';
        canvas.style.cursor = 'pointer';
        drawWheel();
        
    } catch (error) {
        console.error('Error fetching Pokémon:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        document.title = 'ERROR: ' + error.message;
        loadingDiv.textContent = 'Error: ' + error.message + ' (Check console with C key)';
        loadingDiv.style.color = '#ff6b6b';
    }
}

// Draw the wheel
function drawWheel() {
    if (pokemon.length === 0) {
        console.warn('No Pokémon data to draw');
        return;
    }
    
    const centerX = WHEEL_SIZE / 2;
    const centerY = WHEEL_SIZE / 2;
    const radius = WHEEL_SIZE / 2 - 10;
    const totalPokemon = pokemon.length;
    const arcSize = (2 * Math.PI) / totalPokemon;
    
    ctx.clearRect(0, 0, WHEEL_SIZE, WHEEL_SIZE);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentRotation);
    
    // Draw each segment
    for (let i = 0; i < totalPokemon; i++) {
        const angle = i * arcSize;
        
        // Draw segment
        ctx.beginPath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, angle, angle + arcSize);
        ctx.lineTo(0, 0);
        ctx.fill();
        
        // Draw border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 0.5;
        ctx.stroke();
        
        // Draw text for all Pokémon names (151 is manageable)
        ctx.save();
        ctx.rotate(angle + arcSize / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#000';
        
        // Adjust font size based on number of Pokémon
        if (totalPokemon <= 151) {
            ctx.font = 'bold 7px Arial';
        } else if (totalPokemon <= 386) {
            ctx.font = 'bold 5px Arial';
        } else {
            ctx.font = 'bold 3px Arial';
        }
        
        // Only show names for smaller sets
        if (totalPokemon <= 386) {
            ctx.fillText(pokemon[i].name, radius - 5, 2);
        }
        ctx.restore();
    }
    
    ctx.restore(); // Restore before drawing Pokéball so it doesn't rotate
    
    // Draw Pokéball in center (stationary)
    ctx.save();
    ctx.translate(centerX, centerY);
    
    const ballRadius = 40;
    
    // Top half (red)
    ctx.beginPath();
    ctx.fillStyle = '#EE1515';
    ctx.arc(0, 0, ballRadius, Math.PI, 0, false);
    ctx.fill();
    
    // Bottom half (white)
    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.arc(0, 0, ballRadius, 0, Math.PI, false);
    ctx.fill();
    
    // Middle black band
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 8;
    ctx.moveTo(-ballRadius, 0);
    ctx.lineTo(ballRadius, 0);
    ctx.stroke();
    
    // Center white circle
    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.arc(0, 0, 15, 0, 2 * Math.PI);
    ctx.fill();
    
    // Center black outline
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.arc(0, 0, 15, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Outer black circle
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    ctx.arc(0, 0, ballRadius, 0, 2 * Math.PI);
    ctx.stroke();
    
    ctx.restore();
}

// Animation loop
function animate() {
    currentRotation += spinSpeed;
    spinSpeed *= 0.98; // Deceleration
    
    // Stop spinning when speed is very low
    if (Math.abs(spinSpeed) < 0.001) {
        isSpinning = false;
        spinSpeed = 0;
        // Don't change currentRotation here - keep it where it naturally stopped
        announceWinner();
        console.log('Spin complete');
        return;
    }
    
    drawWheel();
    requestAnimationFrame(animate);
}

// Spin the wheel
function spinWheel() {
    if (isSpinning) {
        console.log('Already spinning');
        return;
    }
    if (pokemon.length === 0) {
        console.error('No Pokémon data loaded');
        return;
    }
    
    console.log('Starting spin...');
    isSpinning = true;
    resultDiv.innerHTML = ''; // Clear any previous result
    resultDiv.className = 'result';
    
    // Random number of rotations (5-10 full spins) plus random position
    const extraSpins = 5 + Math.random() * 5;
    const randomAngle = Math.random() * Math.PI * 2;
    targetRotation = currentRotation + (extraSpins * Math.PI * 2) + randomAngle;
    
    // Initial spin speed
    spinSpeed = 0.3 + Math.random() * 0.2;
    
    animate();
}

// Announce the winner
function announceWinner() {
    // Normalize rotation to 0-2π range
    const normalizedRotation = (currentRotation % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    
    // The pointer is at the top (12 o'clock position)
    // Since we rotate the canvas, we need to find which segment is at the top
    // The top is at angle 3π/2 (or -π/2) when measuring from the right (0)
    const pointerAngle = (Math.PI * 3 / 2 - normalizedRotation) % (Math.PI * 2);
    const adjustedAngle = (pointerAngle + Math.PI * 2) % (Math.PI * 2);
    
    const arcSize = (Math.PI * 2) / pokemon.length;
    const winningIndex = Math.floor(adjustedAngle / arcSize) % pokemon.length;
    const winner = pokemon[winningIndex];
    
    console.log('Winner:', winner, 'Index:', winningIndex); // Debug log
    console.log('Winner types:', winner.types); // Debug types
    
    // Use a slight delay to ensure the animation completes
    setTimeout(() => {
        try {
            // Determine which sprite to use (shiny or normal)
            const displaySprite = (isShinyMode && winner.shinySprite) ? winner.shinySprite : winner.sprite;
            const shinyText = (isShinyMode && winner.shinySprite) ? ' ✨ SHINY! ✨' : '';
            
            if (isLegendaryMode) {
                const genInfo = getGenerationInfo(winner.id);
                resultDiv.innerHTML = `
                    <div class="congrats-message">
                        <div class="congrats-text">🎉 Congratulations!${shinyText} 🎉</div>
                        <img src="${displaySprite}" alt="${winner.name}" class="pokemon-image">
                        <div class="pokemon-name">You got ${winner.name}!</div>
                        <div class="pokemon-generation">Generation ${genInfo.gen} - ${genInfo.region}</div>
                    </div>
                `;
            } else if (isEeveelutionMode) {
                const eeveelutionData = eeveelutionInfo[winner.id];
                resultDiv.innerHTML = `
                    <div class="congrats-message">
                        <div class="congrats-text">🎉 Congratulations!${shinyText} 🎉</div>
                        <img src="${displaySprite}" alt="${winner.name}" class="pokemon-image">
                        <div class="pokemon-name">You got ${winner.name}!</div>
                        <div class="pokemon-type">${eeveelutionData.type} Type</div>
                        <div class="pokemon-description">${eeveelutionData.description}</div>
                    </div>
                `;
            } else if (isParadoxMode) {
                const paradoxData = paradoxInfo[winner.id];
                resultDiv.innerHTML = `
                    <div class="congrats-message">
                        <div class="congrats-text">🎉 Congratulations!${shinyText} 🎉</div>
                        <img src="${displaySprite}" alt="${winner.name}" class="pokemon-image">
                        <div class="pokemon-name">You got ${winner.name}!</div>
                        <div class="pokemon-paradox-era">${paradoxData.era} Paradox</div>
                        <div class="pokemon-description">Based on ${paradoxData.basedOn}</div>
                    </div>
                `;
            } else if (isStarterMode) {
                const starterData = starterInfo[winner.id];
                resultDiv.innerHTML = `
                    <div class="congrats-message">
                        <div class="congrats-text">🎉 Congratulations!${shinyText} 🎉</div>
                        <img src="${displaySprite}" alt="${winner.name}" class="pokemon-image">
                        <div class="pokemon-name">You got ${winner.name}!</div>
                        <div class="pokemon-starter-stage">${starterData.stage} - Generation ${starterData.generation}</div>
                        <div class="pokemon-type">${starterData.type} Type</div>
                    </div>
                `;
            } else if (isZMoveMode) {
                resultDiv.innerHTML = `
                    <div class="congrats-message">
                        <div class="congrats-text">💎 Z-Power Activated! ✨</div>
                        <div class="zmove-crystal">💎✨</div>
                        <div class="pokemon-name">${winner.name}!</div>
                        <div class="pokemon-zmove-type">${winner.type} Type</div>
                        <div class="pokemon-description">${winner.category}</div>
                    </div>
                `;
            } else if (isGigantamaxMode) {
                resultDiv.innerHTML = `
                    <div class="congrats-message">
                        <div class="congrats-text">⚡ Dynamax Energy Detected!${shinyText} 🔴</div>
                        <img src="${displaySprite}" alt="${winner.name}" class="pokemon-image">
                        <div class="pokemon-name">${winner.name}!</div>
                        <div class="pokemon-description">Gigantamax Form Available</div>
                    </div>
                `;
            } else if (isTeraMode) {
                resultDiv.innerHTML = `
                    <div class="congrats-message">
                        <div class="congrats-text">💎 Terastallized!${shinyText} ✨</div>
                        <img src="${displaySprite}" alt="${winner.name}" class="pokemon-image">
                        <div class="pokemon-name">${winner.name}!</div>
                        <div class="pokemon-description">Tera Type Available</div>
                    </div>
                `;
            } else if (isRegionalMode) {
                resultDiv.innerHTML = `
                    <div class="congrats-message">
                        <div class="congrats-text">🌍 Regional Variant!${shinyText} 🔄</div>
                        <img src="${displaySprite}" alt="${winner.name}" class="pokemon-image">
                        <div class="pokemon-name">${winner.name}!</div>
                        <div class="pokemon-description">Regional Form</div>
                    </div>
                `;
            } else if (isMegaMode) {
                resultDiv.innerHTML = `
                    <div class="congrats-message">
                        <div class="congrats-text">🔮 Mega Evolution!${shinyText} ⚡</div>
                        <img src="${displaySprite}" alt="${winner.name}" class="pokemon-image">
                        <div class="pokemon-name">${winner.name}!</div>
                        <div class="pokemon-description">Mega Evolved Form</div>
                    </div>
                `;
            } else if (isGamesMode) {
                resultDiv.innerHTML = `
                    <div class="congrats-message">
                        <div class="congrats-text">🎮 Play This Game! 📱</div>
                        <div class="pokemon-name">${winner.name}</div>
                        <div class="pokemon-generation">${winner.generation}</div>
                        <div class="pokemon-region">${winner.region} Region • ${winner.year}</div>
                    </div>
                `;
            } else if (isUltimateMode) {
                // Check if it's a Z-Move or Game in Ultimate Mode
                if (winner.isZMove) {
                    resultDiv.innerHTML = `
                        <div class="congrats-message">
                            <div class="congrats-text">🌟👑 ULTIMATE WINNER! 👑✨</div>
                            <div class="zmove-crystal">💎✨</div>
                            <div class="pokemon-name">${winner.name}!</div>
                            <div class="pokemon-zmove-type">${winner.type} Type Z-Move</div>
                            <div class="pokemon-description">${winner.category}</div>
                        </div>
                    `;
                } else if (winner.isGame) {
                    resultDiv.innerHTML = `
                        <div class="congrats-message">
                            <div class="congrats-text">🌟👑 ULTIMATE WINNER! 👑✨</div>
                            <div class="pokemon-name">${winner.name}</div>
                            <div class="pokemon-generation">${winner.generation}</div>
                            <div class="pokemon-region">${winner.region} Region • ${winner.year}</div>
                        </div>
                    `;
                } else {
                    resultDiv.innerHTML = `
                        <div class="congrats-message">
                            <div class="congrats-text">🌟👑 ULTIMATE WINNER!${shinyText} 👑✨</div>
                            <img src="${displaySprite}" alt="${winner.name}" class="pokemon-image">
                            <div class="pokemon-name">${winner.name}!</div>
                            <div class="pokemon-description">From ALL Pokémon!</div>
                        </div>
                    `;
                }
            } else {
                resultDiv.innerHTML = `
                    <div class="congrats-message">
                        <div class="congrats-text">🎉 Congratulations!${shinyText} 🎉</div>
                        <img src="${displaySprite}" alt="${winner.name}" class="pokemon-image">
                        <div class="pokemon-name">You got ${winner.name}!</div>
                    </div>
                `;
            }
            
            // Apply type-based gradient to modal (if not Z-Move mode)
            const modal = document.getElementById('resultModal');
            const modalContent = modal.querySelector('.modal-content');
            
            console.log('Applying background. isZMoveMode:', isZMoveMode, 'isGigantamaxMode:', isGigantamaxMode, 'isTeraMode:', isTeraMode, 'isRegionalMode:', isRegionalMode, 'isMegaMode:', isMegaMode, 'isGamesMode:', isGamesMode, 'isUltimateMode:', isUltimateMode, 'winner.types:', winner.types);
            
            if (!isZMoveMode && !isGigantamaxMode && !isTeraMode && !isRegionalMode && !isMegaMode && !isGamesMode && !isUltimateMode && winner.types && winner.types.length > 0) {
                const gradient = getTypeGradient(winner.types);
                console.log('Setting gradient:', gradient);
                modalContent.style.background = gradient;
            } else if (isZMoveMode) {
                modalContent.style.background = 'linear-gradient(135deg, #8e44ad 0%, #3498db 50%, #e74c3c 100%)';
            } else if (isGamesMode) {
                modalContent.style.background = 'linear-gradient(135deg, #e74c3c 0%, #f39c12 50%, #27ae60 100%)';
            } else if (isGigantamaxMode && winner.types && winner.types.length > 0) {
                const gradient = getTypeGradient(winner.types);
                console.log('Setting Gigantamax gradient:', gradient);
                modalContent.style.background = gradient;
            } else if (isTeraMode && winner.types && winner.types.length > 0) {
                const gradient = getTypeGradient(winner.types);
                console.log('Setting Tera gradient:', gradient);
                modalContent.style.background = gradient;
            } else if (isRegionalMode && winner.types && winner.types.length > 0) {
                const gradient = getTypeGradient(winner.types);
                console.log('Setting Regional gradient:', gradient);
                modalContent.style.background = gradient;
            } else if (isMegaMode && winner.types && winner.types.length > 0) {
                const gradient = getTypeGradient(winner.types);
                console.log('Setting Mega gradient:', gradient);
                modalContent.style.background = gradient;
            } else if (isUltimateMode) {
                // Handle Ultimate Mode gradients based on item type
                if (winner.isZMove) {
                    modalContent.style.background = 'linear-gradient(135deg, #8e44ad 0%, #3498db 50%, #e74c3c 100%)';
                } else if (winner.isGame) {
                    modalContent.style.background = 'linear-gradient(135deg, #e74c3c 0%, #f39c12 50%, #27ae60 100%)';
                } else if (winner.types && winner.types.length > 0) {
                    const gradient = getTypeGradient(winner.types);
                    console.log('Setting Ultimate Pokémon gradient:', gradient);
                    modalContent.style.background = gradient;
                } else {
                    modalContent.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 25%, #ffd300 50%, #4facfe 75%, #00f2fe 100%)';
                }
            } else {
                console.log('Using default gradient');
                modalContent.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            }
            
            // Show modal
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        } catch (error) {
            console.error('Error displaying result:', error);
            console.log('Winner data:', winner);
        }
    }, 300);
}

// Event listeners - DEFERRED until canvas exists
function attachCanvasListeners() {
    if (!canvas) {
        console.error('Canvas not found when attaching listeners');
        return;
    }
    
    console.log('Attaching canvas click listener');
    
    canvas.addEventListener('click', (e) => {
        console.log('Canvas click event fired. isSpinning:', isSpinning, 'pokemon.length:', pokemon.length);
        document.title = 'Canvas click! isSpinning=' + isSpinning + ' pokemon=' + pokemon.length;
        
        if (!isSpinning && pokemon.length > 0) {
            // Check if click is on the center Pokéball (within 40px radius)
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left - WHEEL_SIZE / 2;
            const y = e.clientY - rect.top - WHEEL_SIZE / 2;
            const distance = Math.sqrt(x * x + y * y);
            
            console.log(`Click detected at distance: ${distance.toFixed(2)}px from center`);
            document.title = `Distance: ${distance.toFixed(2)}px`;
            
            if (distance <= 40) {
                console.log('Pokéball clicked! Starting spin...');
                document.title = 'SPINNING!';
                canvas.style.cursor = 'wait';
                spinWheel();
            } else {
                console.log('Click outside Pokéball zone');
            }
        } else {
            console.log('Cannot spin: isSpinning=' + isSpinning + ' or no pokemon data');
        }
    });

    // Hover effect for Pokéball
    canvas.addEventListener('mousemove', (e) => {
        if (!isSpinning && pokemon.length > 0) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left - WHEEL_SIZE / 2;
            const y = e.clientY - rect.top - WHEEL_SIZE / 2;
            const distance = Math.sqrt(x * x + y * y);
            
            canvas.style.cursor = distance <= 40 ? 'pointer' : 'default';
        }
    });
}

function closeResultModal() {
    console.log('Closing result modal');
    const resultModal = document.getElementById('resultModal');
    if (resultModal) {
        resultModal.classList.remove('show');
        setTimeout(() => {
            resultModal.style.display = 'none';
            resultDiv.innerHTML = '';
            isSpinning = false;
            canvas.style.cursor = 'pointer';
        }, 300);
    }
}
window.closeResultModal = closeResultModal;

const closeModalBtn = document.getElementById('closeModal');
const resultModal = document.getElementById('resultModal');

if (resultModal) {
    resultModal.addEventListener('click', (e) => {
        if (e.target === resultModal) {
            closeResultModal();
        }
    });
}

// ============================================
// POKÉMON CHECKLIST FUNCTIONALITY
// ============================================

const pokemonByGeneration = {
    1: { start: 1, end: 151, name: 'Kanto' },
    2: { start: 152, end: 251, name: 'Johto' },
    3: { start: 252, end: 386, name: 'Hoenn' },
    4: { start: 387, end: 493, name: 'Sinnoh' },
    5: { start: 494, end: 649, name: 'Unova' },
    6: { start: 650, end: 721, name: 'Kalos' },
    7: { start: 722, end: 809, name: 'Alola' },
    8: { start: 810, end: 905, name: 'Galar' },
    9: { start: 906, end: 1025, name: 'Paldea' }
};

let currentChecklistRegion = 'all';
let checklistData = {};

// Load checklist data from localStorage
function loadChecklistData() {
    const saved = localStorage.getItem('pokemonChecklist');
    if (saved) {
        checklistData = JSON.parse(saved);
    }
}

// Save checklist data to localStorage
function saveChecklistData() {
    localStorage.setItem('pokemonChecklist', JSON.stringify(checklistData));
}

// Open checklist screen
async function openChecklistScreen() {
    document.getElementById('selectionScreen').style.display = 'none';
    document.getElementById('checklistScreen').style.display = 'flex';
    loadChecklistData();
    await populateChecklist('all');
    setupChecklistEventListeners();
}
window.openChecklistScreen = openChecklistScreen;

// Populate checklist based on region
async function populateChecklist(region) {
    currentChecklistRegion = region;
    const container = document.getElementById('checklistContainer');
    container.innerHTML = '<p style="text-align: center; color: #999;">Loading Pokémon...</p>';
    
    let pokemonList = [];
    
    if (region === 'all') {
        // Fetch all Pokémon
        for (let gen = 1; gen <= 9; gen++) {
            const genData = pokemonByGeneration[gen];
            for (let id = genData.start; id <= genData.end; id++) {
                pokemonList.push(id);
            }
        }
    } else {
        // Fetch specific generation
        const genData = pokemonByGeneration[region];
        for (let id = genData.start; id <= genData.end; id++) {
            pokemonList.push(id);
        }
    }
    
    // Fetch Pokémon names from API
    const pokemonDetails = [];
    try {
        for (const id of pokemonList) {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    pokemonDetails.push({
                        id: data.id,
                        name: data.name
                    });
                }
            } catch (e) {
                console.error(`Failed to fetch Pokémon ${id}`);
            }
        }
    } catch (e) {
        console.error('Error fetching Pokémon:', e);
    }
    
    // Render checklist
    container.innerHTML = pokemonDetails.map(p => `
        <div class="checklist-item ${checklistData[p.id] ? 'checked' : ''}">
            <input type="checkbox" id="pok-${p.id}" ${checklistData[p.id] ? 'checked' : ''} data-pokemon-id="${p.id}">
            <label for="pok-${p.id}">#${p.id} ${p.name.charAt(0).toUpperCase() + p.name.slice(1).replace('-', ' ')}</label>
        </div>
    `).join('');
    
    updateChecklistStats();
}

// Update stats display
function updateChecklistStats() {
    const container = document.getElementById('checklistContainer');
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    const total = checkboxes.length;
    
    document.getElementById('checkedCount').textContent = checked;
    document.getElementById('totalCount').textContent = total;
}

// Setup event listeners for checklist
function setupChecklistEventListeners() {
    // Region buttons
    document.querySelectorAll('.region-btn').forEach(btn => {
        btn.removeEventListener('click', handleRegionClick);
        btn.addEventListener('click', handleRegionClick);
    });
    
    // Back button
    const backBtn = document.getElementById('checklistBackBtn');
    if (backBtn) {
        backBtn.removeEventListener('click', backToSelection);
        backBtn.addEventListener('click', backToSelection);
    }
    
    // Checkboxes
    document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.removeEventListener('change', handleCheckboxChange);
        checkbox.addEventListener('change', handleCheckboxChange);
    });
    
    // Checklist items (for click to toggle)
    document.querySelectorAll('.checklist-item').forEach(item => {
        item.removeEventListener('click', handleChecklistItemClick);
        item.addEventListener('click', handleChecklistItemClick);
    });
}

function handleRegionClick(e) {
    document.querySelectorAll('.region-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    populateChecklist(e.target.dataset.region);
}

function handleCheckboxChange(e) {
    const pokemonId = parseInt(e.target.dataset.pokemonId);
    checklistData[pokemonId] = e.target.checked;
    saveChecklistData();
    
    // Update item styling
    e.target.parentElement.classList.toggle('checked', e.target.checked);
    updateChecklistStats();
}

function handleChecklistItemClick(e) {
    if (e.target.tagName !== 'LABEL') return;
    const checkbox = e.currentTarget.querySelector('input[type="checkbox"]');
    if (checkbox) {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    }
}

// Back to selection
function backToSelectionFromChecklist() {
    document.getElementById('checklistScreen').style.display = 'none';
    document.getElementById('selectionScreen').style.display = 'flex';
}

// Override backToSelection to handle checklist
const originalBackToSelection = backToSelection;
function backToSelectionNew() {
    const checklistScreen = document.getElementById('checklistScreen');
    if (checklistScreen && checklistScreen.style.display !== 'none') {
        backToSelectionFromChecklist();
    } else {
        originalBackToSelection();
    }
}
backToSelection = backToSelectionNew;
window.backToSelection = backToSelection;

// Initialize checklist data on load
loadChecklistData();

// Initialize command input listener
document.addEventListener('DOMContentLoaded', function() {
    const commandInput = document.getElementById('commandInput');
    if (commandInput) {
        commandInput.addEventListener('input', function(e) {
            const value = e.target.value.trim().toLowerCase();
            const listViewContainer = document.getElementById('listViewContainer');
            const wheelViewContainer = document.getElementById('wheelViewContainer');
            
            if (value === 'list') {
                // Show list view
                listViewContainer.style.display = 'block';
                wheelViewContainer.style.display = 'none';
                
                // Initialize region dropdowns if not already done
                const regionDropdowns = document.getElementById('regionDropdowns');
                if (regionDropdowns.innerHTML === '') {
                    initializeRegionDropdownList();
                }
            } else {
                // Show wheel view
                listViewContainer.style.display = 'none';
                wheelViewContainer.style.display = 'block';
            }
        });
    }
});

// Don't auto-initialize - wait for user selection
console.log('Pokémon Wheel Spinner loaded. Waiting for generation selection...');
console.log('=== INITIALIZATION COMPLETE ===');;

