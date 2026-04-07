// --- State & Config ---
const DATA_DIR = 'pokemon-tcg-data';
let setsMetadata = {};       // id -> set object
let setsArray = [];          // For Fuse search
let activeSetIds = new Set();// Track checked sets
let loadedSets = {};         // Cache: id -> cards array
let selectedCard = null;

let setsFuse = null;

// --- DOM Elements ---
const listSets = document.getElementById('list-sets');
const searchSets = document.getElementById('search-sets');
const listCards = document.getElementById('list-cards');
const searchCards = document.getElementById('search-cards');
const textCardDetails = document.getElementById('text-card-details');
const comboTextStyle = document.getElementById('combo-text-style');
const textOutput = document.getElementById('text-output');
const textDecklist = document.getElementById('text-decklist');
const comboFormat = document.getElementById('combo-format');
const statusBar = document.getElementById('status-bar');

function setStatus(msg) {
    statusBar.textContent = msg;
    setTimeout(() => { if(statusBar.textContent === msg) statusBar.textContent = 'Ready'; }, 3000);
}

// --- Initialization ---
async function init() {
    setupTabs();
    setupEventListeners();
    updateDecklistPlaceholder(); // Set initial placeholder

    try {
        const res = await fetch(`${DATA_DIR}/sets/en.json`);
        if (!res.ok) throw new Error("Could not load sets file.");
        setsArray = await res.json();
        setsArray.sort((a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0));
        
        setsArray.forEach(s => setsMetadata[s.id] = s);
        
        setsFuse = new Fuse(setsArray, {
            keys: ['id', 'ptcgoCode', 'name'],
            threshold: 0.4,
            ignoreLocation: true
        });

        renderSetsList();
    } catch (err) {
        setStatus(`Error initializing: ${err.message}`);
        console.error(err);
    }
}

// --- UI Logic ---
function setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });
}

function updateDecklistPlaceholder() {
    const format = comboFormat.value;
    const examples = {
        Standard: `Pokémon: 1\n4 Nemona SV10 48\n\nTrainer: 1\n4 Cynthia UPR 119`,
        Legacy: `4x Nemona (Scarlet & Violet)\n4x Cynthia (Ultra Prism)`
    };
    const footer = `\n\n#set: SV10 (Filters context to specific sets)\n- Note (Adds a note to the card above)`;
    textDecklist.placeholder = `${examples[format]}${footer}`;
}

function setupEventListeners() {
    searchSets.addEventListener('input', () => renderSetsList(searchSets.value));
    searchCards.addEventListener('input', () => renderCardsList(searchCards.value));
    comboTextStyle.addEventListener('change', renderCardDetails);
    comboFormat.addEventListener('change', updateDecklistPlaceholder);

    document.getElementById('btn-add-output').addEventListener('click', () => {
        if(!selectedCard) return;
        const txt = textCardDetails.value;
        const current = textOutput.value;
        textOutput.value = current ? current + "\n\n---\n\n" + txt : txt;
        setStatus("Appended to Output Scratchpad!");
    });
    
    document.getElementById('btn-copy-card').addEventListener('click', () => copyToClipboard(textCardDetails.value));
    document.getElementById('btn-copy-output').addEventListener('click', () => copyToClipboard(textOutput.value));
    document.getElementById('btn-clear-output').addEventListener('click', () => textOutput.value = '');
    document.getElementById('btn-clear-decklist').addEventListener('click', () => textDecklist.value = '');

    document.getElementById('btn-preview-html').addEventListener('click', () => handleDecklistExport('html', true));
    document.getElementById('btn-export-html').addEventListener('click', () => handleDecklistExport('html', false));
    document.getElementById('btn-export-txt').addEventListener('click', () => handleDecklistExport('txt', false));
}

async function copyToClipboard(text) {
    if(!text) return;
    try { await navigator.clipboard.writeText(text); setStatus("Copied to clipboard!"); }
    catch(e) { setStatus("Failed to copy."); }
}

// --- Browser Logic ---
function renderSetsList(query = "") {
    listSets.innerHTML = '';
    let results = setsArray;
    if (query.trim()) {
        results = setsFuse.search(query).map(r => r.item);
    }

    results.forEach(s => {
        const li = document.createElement('li');
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = activeSetIds.has(s.id);
        
        cb.addEventListener('change', async (e) => {
            if (e.target.checked) {
                activeSetIds.add(s.id);
                await loadSetCards(s.id);
            } else {
                activeSetIds.delete(s.id);
            }
            renderCardsList(searchCards.value);
        });

        li.appendChild(cb);
        li.appendChild(document.createTextNode(`${s.name} (${s.ptcgoCode || s.id.toUpperCase()})`));
        li.addEventListener('click', (e) => { if(e.target !== cb) cb.click(); });
        listSets.appendChild(li);
    });
}

async function loadSetCards(setId) {
    if (loadedSets[setId]) return;
    try {
        const res = await fetch(`${DATA_DIR}/cards/en/${setId}.json`);
        if (res.ok) {
            loadedSets[setId] = await res.json();
        }
    } catch(err) {
        console.error(`Failed to load cards for set: ${setId}`);
    }
}

function renderCardsList(query = "") {
    listCards.innerHTML = '';
    let availableCards = [];
    activeSetIds.forEach(setId => {
        if (loadedSets[setId]) availableCards.push(...loadedSets[setId]);
    });

    let results = availableCards;
    if (query.trim()) {
        const cardsFuse = new Fuse(availableCards, { keys: ['name'], threshold: 0.4 });
        results = cardsFuse.search(query).map(r => r.item);
    } else {
        results.sort((a, b) => {
            let numA = parseInt(a.number) || 999;
            let numB = parseInt(b.number) || 999;
            return numA - numB;
        });
        results = results.slice(0, 200); 
    }

    results.forEach(card => {
        const li = document.createElement('li');
        const setCode = card.id.substring(0, card.id.lastIndexOf('-')).toUpperCase();
        li.textContent = `${card.name} (${setCode} ${card.number || '?'})`;
        li.addEventListener('click', () => {
            document.querySelectorAll('#list-cards li').forEach(el => el.classList.remove('selected'));
            li.classList.add('selected');
            selectedCard = card;
            renderCardDetails();
        });
        listCards.appendChild(li);
    });
}

// --- Text Formatting Logic ---
function getSetMeta(card) {
    const setId = card.id.substring(0, card.id.lastIndexOf('-'));
    return setsMetadata[setId] || { name: 'Unknown Set' };
}

function getEnergySymbol(typeStr, brackets = "[]") {
    const mapping = {
        "Grass": "G", "Fire": "R", "Water": "W", "Lightning": "L",
        "Psychic": "P", "Fighting": "F", "Darkness": "D", "Metal": "M",
        "Fairy": "Y", "Dragon": "N", "Colorless": "C"
    };
    const code = mapping[typeStr] || (typeStr ? typeStr[0] : "?");
    return `${brackets[0]}${code}${brackets[1]}`;
}

function wrapText(text, width) {
    if (!text) return [];
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    for (let word of words) {
        if ((currentLine + word).length > width) {
            if (currentLine) lines.push(currentLine.trimRight());
            currentLine = word + ' ';
        } else {
            currentLine += word + ' ';
        }
    }
    if (currentLine) lines.push(currentLine.trimRight());
    return lines;
}

function formatCardClean(card) {
    const supertype = card.supertype || "";
    const setName = getSetMeta(card).name;
    let lines = [];

    if (supertype === "Pokémon") {
        lines.push(`${card.name} (${setName})`);
        const subtypes = (card.subtypes || []).join(" ");
        const types = (card.types || ["Colorless"]).join("/");
        const hp = card.hp ? `${card.hp} HP` : "";
        let stats = `${subtypes} | ${types}`;
        if (hp) stats += ` | ${hp}`;
        lines.push(stats);
        if (card.evolvesFrom) lines.push(`Evolves from: ${card.evolvesFrom}`);
    } else {
        lines.push(`${card.name} (${setName})`);
        const subtypes = (card.subtypes || []).join(" ");
        lines.push(`${supertype} - ${subtypes}`);
    }

    lines.push("");

    (card.rules || []).forEach(rule => {
        lines.push(`Rule: ${rule}`); lines.push("");
    });

    (card.abilities || []).forEach(ab => {
        lines.push(`[${ab.type || 'Ability'}] ${ab.name}`);
        lines.push(`  ${ab.text}`); lines.push("");
    });

    (card.attacks || []).forEach(atk => {
        const cost = (atk.cost || []).map(c => getEnergySymbol(c)).join("");
        const dmg = atk.damage ? ` (${atk.damage})` : "";
        lines.push(`${cost} ${atk.name}${dmg}`);
        if (atk.text) lines.push(`  ${atk.text}`);
        lines.push("");
    });

    if (supertype === "Pokémon") {
        const w = (card.weaknesses || []).map(x => `${getEnergySymbol(x.type)} ${x.value}`).join(", ") || "None";
        const r = (card.resistances || []).map(x => `${getEnergySymbol(x.type)} ${x.value}`).join(", ") || "None";
        const ret = Array((card.retreatCost || []).length).fill(getEnergySymbol("Colorless")).join("") || "None";
        lines.push(`Weakness: ${w} | Resistance: ${r} | Retreat: ${ret}`);
    }

    return lines.join("\n").trim();
}

function formatCardBox(card) {
    const width = 50;
    const border = "-".repeat(width);
    let lines = [border];

    const supertype = card.supertype || "";
    const name = card.name || "Unknown";
    const setName = getSetMeta(card).name;

    if (supertype === "Pokémon") {
        const hp = `${card.hp || '??'} HP`;
        const types = `[${(card.types || ["C"]).join("/")}]`;
        const rightText = `${hp} ${types}`;
        let spaceLen = width - name.length - rightText.length - 2;
        if (spaceLen < 1) spaceLen = 1;
        lines.push(` ${name}${" ".repeat(spaceLen)}${rightText} `);
        lines.push(` Evolves from ${card.evolvesFrom || 'Basic'}`);
    } else {
        const rightText = `[${supertype}]`;
        let spaceLen = width - name.length - rightText.length - 2;
        if (spaceLen < 1) spaceLen = 1;
        lines.push(` ${name}${" ".repeat(spaceLen)}${rightText} `);
        lines.push(` ${(card.subtypes || []).join(" ")} (${setName})`);
    }

    lines.push(border);

    (card.rules || []).forEach(rule => {
        wrapText(rule, width - 4).forEach(w => lines.push(`  ${w}`));
        lines.push("");
    });

    (card.abilities || []).forEach(ab => {
        const abType = (ab.type || 'Ability')[0];
        lines.push(` [${abType}] ${ab.name}`);
        wrapText(ab.text || '', width - 4).forEach(w => lines.push(`  ${w}`));
        lines.push("");
    });

    (card.attacks || []).forEach(atk => {
        const cost = (atk.cost || []).map(c => getEnergySymbol(c, "()")).join("");
        const dmg = atk.damage ? String(atk.damage) : "";
        const leftPart = ` ${cost} ${atk.name}`;
        let space = width - leftPart.length - dmg.length - 1;
        if (space < 1) space = 1;
        lines.push(`${leftPart}${" ".repeat(space)}${dmg}`);
        if (atk.text) {
            wrapText(atk.text, width - 4).forEach(w => lines.push(`  ${w}`));
        }
        lines.push("");
    });

    lines.push(border);

    if (supertype === "Pokémon") {
        const wList = (card.weaknesses || []).map(x => `${x.type.substring(0,3)} ${x.value}`);
        const wkStr = wList.length ? `Wk: ${wList.join(", ")}` : "Wk: -";
        const retStr = `Ret: ${(card.retreatCost || []).length}`;
        let space = width - wkStr.length - retStr.length - 2;
        if (space < 1) space = 1;
        lines.push(` ${wkStr}${" ".repeat(space)}${retStr} `);
        lines.push(border);
    }

    return lines.join("\n");
}

function renderCardDetails() {
    if(!selectedCard) return;
    const style = comboTextStyle.value;
    textCardDetails.value = style === "Box" ? formatCardBox(selectedCard) : formatCardClean(selectedCard);
}

// --- Decklist Annotator Logic ---
const reStandard = /^(\d+)\s+(.+?)\s+([a-z0-9]{2,6})\s+(\d+)$/i;
const reLegacy = /^(\d+)x?\s+(.+?)(?:\((.+?)\))?$/i;

function parseLine(line, format) {
    line = line.trim();
    let qty, name, setStr;
    
    if (format === "Standard") {
        const m = line.match(reStandard);
        if (m) {
            qty = m[1]; name = m[2].trim(); setStr = m[3];
        }
    } else if (format === "Legacy") {
        const m = line.match(reLegacy);
        if (m) {
            qty = m[1]; name = m[2].trim(); setStr = m[3] ? m[3].trim() : null;
        }
    }

    if(name) return { qty, name, setStr, original: line };
    return null;
}

function getTintColor(score) {
    if (score >= 95) return "#000000";
    if (score <= 65) return "#cc0000";
    const ratio = (95 - score) / 30.0;
    const r = Math.floor(204 * ratio);
    return `#${r.toString(16).padStart(2, '0')}0000`;
}

async function findCardFuzzy(name, targetSets) {
    let cardCorpus = [];
    for (let setId of targetSets) {
        await loadSetCards(setId);
        if (loadedSets[setId]) cardCorpus.push(...loadedSets[setId]);
    }
    
    if(cardCorpus.length === 0) return null;
    
    const f = new Fuse(cardCorpus, { keys: ['name'], includeScore: true });
    const results = f.search(name);
    if(results.length === 0) return null;
    
    const best = results[0];
    const score = Math.round((1 - best.score) * 100);
    return { card: best.item, score: score };
}

function formatCardHtml(card) {
    const setName = getSetMeta(card).name;
    const supertype = card.supertype || "";
    let html = ``;
    
    if (supertype === "Pokémon") {
        const types = (card.types || ["Colorless"]).join("/");
        html += `<div class='card-header'><strong>${card.name}</strong> &bull; ${types} &bull; ${card.hp || '??'} HP <span class='set-name'>(${setName})</span></div>`;
        if (card.evolvesFrom) html += `<div class='card-sub'><em>Evolves from ${card.evolvesFrom}</em></div>`;
    } else {
        const subtypes = (card.subtypes || []).join(" ");
        html += `<div class='card-header'><strong>${card.name}</strong> &bull; ${supertype} - ${subtypes} <span class='set-name'>(${setName})</span></div>`;
    }

    (card.rules || []).forEach(rule => {
        html += `<p class='card-rule'><em>${rule}</em></p>`;
    });

    if (supertype === "Pokémon") {
        (card.abilities || []).forEach(ab => {
            html += `<p><strong><span style='color:#b30000;'>[${ab.type || 'Ability'}]</span> ${ab.name}</strong>: ${ab.text}</p>`;
        });
        (card.attacks || []).forEach(atk => {
            const costHtml = (atk.cost || []).map(c => `<span class='energy e-${c}'>${c[0]}</span>`).join("");
            const dmg = atk.damage ? ` <strong>${atk.damage}</strong>` : "";
            const text = atk.text ? `<br><span class='atk-text'>${atk.text}</span>` : "";
            html += `<p class='attack'>${costHtml} <strong>${atk.name}</strong>${dmg}${text}</p>`;
        });
        
        const w = (card.weaknesses || []).map(wk => `${wk.type} ${wk.value}`).join(", ") || "None";
        const r = (card.resistances || []).map(rs => `${rs.type} ${rs.value}`).join(", ") || "None";
        const ret = Array((card.retreatCost || []).length).fill("<span class='energy e-Colorless'>C</span>").join("") || "None";
        html += `<div class='card-footer'><strong>Weakness:</strong> ${w} | <strong>Resistance:</strong> ${r} | <strong>Retreat:</strong> ${ret}</div>`;
    }
    return html;
}

async function processDecklist(rawText, formatMode, exportHtml, textStyle) {
    const lines = rawText.split('\n');
    let processedItems = [];
    let activeContextSets = [];

    setStatus("Processing decklist...");

    for (let line of lines) {
        const cleanLine = line.trim();
        if (!cleanLine) {
            processedItems.push({ type: 'text', content: '' });
            continue;
        }

        if (cleanLine.toLowerCase().startsWith("#set:")) {
            const rawSets = cleanLine.substring(5).split(",");
            activeContextSets = [];
            for (let sName of rawSets) {
                sName = sName.trim();
                if(!sName || sName.toLowerCase() === 'none') continue;
                const matches = setsFuse.search(sName);
                if (matches.length > 0) activeContextSets.push(matches[0].item.id);
            }
            continue;
        }

        if (cleanLine.startsWith("-")) {
            for (let i = processedItems.length - 1; i >= 0; i--) {
                const item = processedItems[i];
                if (item.type === 'card') {
                    item.notes.push(cleanLine.substring(1).trim());
                    break;
                }
                if (['header', 'text'].includes(item.type) && item.content) break;
            }
            continue;
        }

        const parsed = parseLine(cleanLine, formatMode);
        if (!parsed) {
            processedItems.push({ type: 'header', content: cleanLine });
            continue;
        }

        let targetSets = [];
        if (parsed.setStr) {
            const setMatches = setsFuse.search(parsed.setStr);
            if (setMatches.length > 0) targetSets = [setMatches[0].item.id];
        }
        if (targetSets.length === 0 && activeContextSets.length > 0) targetSets = activeContextSets;
        
        let finalTargetSets = targetSets.length > 0 ? targetSets : Object.keys(setsMetadata);
        
        let matchResult = await findCardFuzzy(parsed.name, finalTargetSets);
        let cardData = null, cScore = 0, sScore = 0;

        if (matchResult) {
            cardData = matchResult.card;
            cScore = matchResult.score;
            if (cScore < 70 && targetSets.length > 0) {
                const fallback = await findCardFuzzy(parsed.name, Object.keys(setsMetadata));
                if (fallback && fallback.score > cScore) {
                    cardData = fallback.card;
                    cScore = fallback.score;
                    sScore = 0;
                } else {
                    sScore = 100;
                }
            } else {
                sScore = targetSets.length > 0 ? 100 : 0;
            }
        }

        processedItems.push({
            type: 'card', parsed, cardData, cScore, sScore, notes: []
        });
    }

    let output = [];
    for (let item of processedItems) {
        if (item.type === 'text') {
            output.push(item.content);
        } else if (item.type === 'header') {
            if (exportHtml) output.push(`<h3>${item.content}</h3>`);
            else output.push(item.content);
        } else if (item.type === 'card') {
            const { parsed, cardData, notes, cScore, sScore } = item;
            if (exportHtml) {
                if (cardData) {
                    const cardHtml = formatCardHtml(cardData);
                    const cColor = getTintColor(cScore);
                    const sColor = getTintColor(sScore);
                    const setHtml = parsed.setStr ? ` (<span style='color: ${sColor};' title='Set Match: ${sScore}%'>${parsed.setStr}</span>)` : "";
                    const summaryLine = `${parsed.qty}x <span style='color: ${cColor};' title='Card Match: ${cScore}%'>${parsed.name}</span>${setHtml}`;
                    const notesHtml = notes.length ? `<div class='card-note'>↳ ${notes.join('<br>↳ ')}</div>` : "";
                    
                    output.push(`
                    <div class="deck-entry">
                        <div class="deck-line">${summaryLine}</div>
                        ${notesHtml}
                        <div class="card-body">
                            ${cardHtml}
                        </div>
                    </div>`);
                } else {
                    output.push(`<div class='deck-entry'><div class='deck-line'>${parsed.original} <span style='color:red;'>[Card Data Not Found]</span></div></div>`);
                }
            } else {
                output.push(parsed.original);
                notes.forEach(n => output.push(`  - ${n}`));
                if (cardData) {
                    const txt = textStyle === "Box" ? formatCardBox(cardData) : formatCardClean(cardData);
                    output.push(txt);
                    output.push("-".repeat(30));
                } else {
                    output.push("    [Card Data Not Found]");
                }
            }
        }
    }
    return output.join("\n");
}

const htmlTemplateStart = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Annotated Decklist</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.5; max-width: 900px; margin: 20px auto; padding: 0 15px; background: #fff; color: #333; }
  h2, h3 { color: #111; margin-top: 1.5em; border-bottom: 2px solid #eee; padding-bottom: 5px; }
  
  .deck-entry { margin-bottom: 25px; page-break-inside: avoid; }
  .deck-line { font-weight: bold; font-size: 1.1em; background: #f8f9fa; padding: 8px 12px; border-radius: 4px; }
  
  .card-note { font-weight: normal; font-style: italic; color: #556677; font-size: 0.9em; margin: 6px 0 10px 20px; }
  
  .card-body { margin-left: 15px; padding-left: 15px; border-left: 3px solid #e2e8f0; margin-top: 10px; }

  .card-header { font-size: 1.1em; margin-bottom: 8px; }
  .set-name { font-size: 0.8em; color: #666; font-weight: normal; float: right; margin-top: 2px; }
  .card-sub { color: #555; margin-bottom: 8px; font-style: italic; }
  .card-rule { background: #fff8e6; padding: 6px 10px; border-left: 4px solid #f6e05e; margin: 8px 0; color: #744210; font-size: 0.9em; }

  .attack { margin-bottom: 10px; }
  .atk-text { display: block; margin-top: 3px; color: #4a5568; font-size: 0.9em; }
  .card-footer { margin-top: 12px; padding-top: 8px; border-top: 1px dotted #cbd5e0; font-size: 0.85em; color: #4a5568; }

  .energy { 
    display: inline-block; width: 18px; height: 18px; 
    line-height: 18px; text-align: center; border-radius: 50%; 
    font-size: 11px; font-weight: bold; font-family: sans-serif;
    margin-right: 3px; border: 1px solid rgba(0,0,0,0.1);
  }
  .e-Grass { background: #78C850; color: white; } .e-Fire { background: #F08030; color: white; }
  .e-Water { background: #6890F0; color: white; } .e-Psychic { background: #F85888; color: white; }
  .e-Fighting { background: #C03028; color: white; } .e-Darkness { background: #705848; color: white; }
  .e-Dragon { background: #7038F8; color: white; } .e-Lightning { background: #F8D030; color: black; }
  .e-Metal { background: #B8B8D0; color: black; } .e-Fairy { background: #EE99AC; color: black; }
  .e-Colorless { background: #A8A878; color: black; }
</style>
</head>
<body>
<h2>Decklist</h2>
`;

const htmlTemplateEnd = `
</body>
</html>`;

async function handleDecklistExport(type, isPreview) {
    const rawText = textDecklist.value;
    if (!rawText.trim()) return alert("Decklist is empty.");
    
    const formatMode = comboFormat.value;
    const textStyle = document.getElementById('combo-export-style').value;
    const isHtml = (type === 'html');
    
    const content = await processDecklist(rawText, formatMode, isHtml, textStyle);
    
    let finalContent = isHtml ? htmlTemplateStart + content + htmlTemplateEnd : content;
    
    const blob = new Blob([finalContent], { type: isHtml ? 'text/html' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    if (isPreview) {
        window.open(url, '_blank');
        setStatus("Opened preview in new tab.");
    } else {
        const a = document.createElement('a');
        a.href = url;
        a.download = `annotated_decklist.${type}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setStatus("Export downloaded.");
    }
    
    setTimeout(() => URL.revokeObjectURL(url), 10000); 
}

// Start app
window.addEventListener('DOMContentLoaded', init);