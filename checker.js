import axios from 'axios';
import { writeFileSync, appendFileSync, existsSync } from 'fs';

// Configuration
const CONFIG = {
    baseUrl: 'https://api.hytl.tools/check',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'Priority': 'u=4',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache'
    },
    referrer: 'https://hytl.tools/',
    delayMs: 200, // Delay between batches
    maxConcurrent: 5, // Concurrent requests
    maxRetries: 5, // Maximum retry attempts for 429 errors
    retryDelay429: 10000, // Initial delay for 429 (10 seconds)
    retryDelayMultiplier: 1.5 // Exponential backoff multiplier
};

// Generate PREMIUM OG usernames ONLY - Real words with $1000+ potential
function generateOGUsernames() {
    const usernames = [];

    // GAME CHARACTER NAMES - Iconic characters from major franchises
    const premiumWords = [
        // Nintendo Icons
        'mario', 'luigi', 'peach', 'bowser', 'yoshi', 'toad', 'wario', 'waluigi',
        'link', 'zelda', 'ganon', 'sheik', 'epona', 'navi', 'midna', 'impa',
        'samus', 'ridley', 'kirby', 'meta', 'dedede', 'waddle',
        'pikachu', 'charizard', 'mewtwo', 'lucario', 'greninja', 'eevee', 'jigglypuff',
        'fox', 'falco', 'wolf', 'krystal', 'slippy', 'peppy',
        'ness', 'lucas', 'marth', 'roy', 'ike', 'lucina', 'robin', 'chrom',
        'pit', 'palutena', 'dark', 'olimar', 'pikmin',
        'donkey', 'diddy', 'dixie', 'cranky', 'funky',

        // Pokemon (Popular/Legendary)
        'bulbasaur', 'ivysaur', 'venusaur', 'charmander', 'charmeleon',
        'squirtle', 'wartortle', 'blastoise', 'caterpie', 'metapod', 'butterfree',
        'pidgey', 'pidgeotto', 'pidgeot', 'rattata', 'raticate', 'spearow', 'fearow',
        'arbok', 'raichu', 'sandshrew', 'sandslash', 'nidoran', 'nidorina', 'nidoqueen',
        'nidorino', 'nidoking', 'clefairy', 'clefable', 'vulpix', 'ninetales',
        'wigglytuff', 'zubat', 'golbat', 'oddish', 'gloom', 'vileplume', 'paras',
        'parasect', 'venonat', 'venomoth', 'diglett', 'dugtrio', 'meowth', 'persian',
        'psyduck', 'golduck', 'mankey', 'primeape', 'growlithe', 'arcanine',
        'poliwag', 'poliwhirl', 'poliwrath', 'abra', 'kadabra', 'alakazam',
        'machop', 'machoke', 'machamp', 'bellsprout', 'weepinbell', 'victreebel',
        'tentacool', 'tentacruel', 'geodude', 'graveler', 'golem', 'ponyta', 'rapidash',
        'slowpoke', 'slowbro', 'magnemite', 'magneton', 'farfetchd', 'doduo', 'dodrio',
        'seel', 'dewgong', 'grimer', 'muk', 'shellder', 'cloyster', 'gastly', 'haunter',
        'gengar', 'onix', 'drowzee', 'hypno', 'krabby', 'kingler', 'voltorb', 'electrode',
        'exeggcute', 'exeggutor', 'cubone', 'marowak', 'hitmonlee', 'hitmonchan',
        'lickitung', 'koffing', 'weezing', 'rhyhorn', 'rhydon', 'chansey', 'tangela',
        'kangaskhan', 'horsea', 'seadra', 'goldeen', 'seaking', 'staryu', 'starmie',
        'scyther', 'jynx', 'electabuzz', 'magmar', 'pinsir', 'tauros', 'magikarp',
        'gyarados', 'lapras', 'ditto', 'vaporeon', 'jolteon', 'flareon', 'porygon',
        'omanyte', 'omastar', 'kabuto', 'kabutops', 'aerodactyl', 'snorlax',
        'articuno', 'zapdos', 'moltres', 'dratini', 'dragonair', 'dragonite', 'mew',

        // Sonic
        'sonic', 'tails', 'knuckles', 'shadow', 'rouge', 'silver', 'blaze', 'amy',
        'cream', 'eggman', 'robotnik', 'metal', 'chaos', 'tikal',

        // Final Fantasy
        'cloud', 'tifa', 'aerith', 'sephiroth', 'zack', 'barret', 'yuffie', 'vincent',
        'squall', 'rinoa', 'seifer', 'quistis', 'zell', 'selphie', 'irvine',
        'tidus', 'yuna', 'wakka', 'lulu', 'auron', 'rikku', 'kimahri',
        'lightning', 'snow', 'hope', 'vanille', 'fang', 'sazh',
        'noctis', 'prompto', 'gladio', 'ignis', 'luna', 'ardyn',
        'terra', 'locke', 'edgar', 'sabin', 'celes', 'cyan', 'shadow', 'gau',
        'cecil', 'kain', 'rosa', 'rydia', 'edge', 'yang',
        'firion', 'maria', 'leon', 'gordon', 'leila',
        'bartz', 'lenna', 'faris', 'galuf', 'krile',

        // Street Fighter
        'ryu', 'ken', 'chun', 'guile', 'blanka', 'zangief', 'dhalsim', 'sagat',
        'vega', 'balrog', 'bison', 'cammy', 'fei', 'akuma', 'sakura', 'dan',
        'rose', 'juri', 'abel', 'seth', 'gouken', 'oni', 'poison', 'hugo',

        // Mortal Kombat
        'scorpion', 'subzero', 'raiden', 'liu', 'kang', 'sonya', 'jax', 'kano',
        'johnny', 'cage', 'kitana', 'mileena', 'jade', 'reptile', 'ermac', 'noob',
        'smoke', 'cyrax', 'sektor', 'kabal', 'stryker', 'nightwolf', 'sindel',
        'shao', 'khan', 'shang', 'tsung', 'quan', 'chi', 'shinnok', 'fujin',

        // Overwatch
        'tracer', 'genji', 'reaper', 'pharah', 'soldier', 'mccree', 'hanzo', 'junkrat',
        'mei', 'bastion', 'torbjorn', 'widowmaker', 'dva', 'reinhardt', 'roadhog',
        'winston', 'zarya', 'mercy', 'lucio', 'zenyatta', 'symmetra', 'ana', 'sombra',
        'orisa', 'doomfist', 'moira', 'brigitte', 'ashe', 'baptiste', 'sigma', 'echo',

        // League of Legends (Popular)
        'ahri', 'akali', 'alistar', 'amumu', 'anivia', 'annie', 'ashe', 'azir',
        'blitz', 'brand', 'braum', 'cait', 'darius', 'diana', 'draven', 'ekko',
        'elise', 'ezreal', 'fiddlesticks', 'fiora', 'fizz', 'garen', 'gnar', 'graves',
        'hecarim', 'irelia', 'janna', 'jarvan', 'jax', 'jayce', 'jhin', 'jinx',
        'karma', 'karthus', 'kassadin', 'katarina', 'kayle', 'kayn', 'kennen', 'khazix',
        'kindred', 'kled', 'leblanc', 'leesin', 'leona', 'lissandra', 'lucian', 'lulu',
        'lux', 'malphite', 'malzahar', 'maokai', 'master', 'miss', 'fortune', 'mordekaiser',
        'morgana', 'nami', 'nasus', 'nautilus', 'neeko', 'nidalee', 'nocturne', 'nunu',
        'olaf', 'orianna', 'ornn', 'pantheon', 'poppy', 'pyke', 'qiyana', 'quinn',
        'rakan', 'rammus', 'reksai', 'renekton', 'rengar', 'riven', 'rumble', 'ryze',
        'sejuani', 'senna', 'sett', 'shaco', 'shen', 'shyvana', 'singed', 'sion',
        'sivir', 'skarner', 'sona', 'soraka', 'swain', 'sylas', 'syndra', 'tahm',
        'taliyah', 'talon', 'taric', 'teemo', 'thresh', 'tristana', 'trundle', 'tryndamere',
        'twisted', 'twitch', 'udyr', 'urgot', 'varus', 'vayne', 'veigar', 'velkoz',
        'viego', 'viktor', 'vladimir', 'volibear', 'warwick', 'wukong', 'xayah', 'xerath',
        'xinzhao', 'yasuo', 'yone', 'yorick', 'yuumi', 'zac', 'zed', 'ziggs', 'zilean',
        'zoe', 'zyra',

        // Minecraft
        'steve', 'alex', 'herobrine', 'notch', 'creeper', 'enderman', 'skeleton', 'zombie',

        // Fortnite
        'jonesy', 'ramirez', 'wildcat', 'headhunter', 'banshee', 'spitfire',

        // Halo
        'master', 'chief', 'cortana', 'arbiter', 'johnson', 'keyes', 'miranda', 'guilty',
        'spark', 'noble', 'emile', 'jorge', 'kat', 'jun', 'carter',

        // God of War
        'kratos', 'atreus', 'freya', 'baldur', 'mimir', 'brok', 'sindri', 'thor', 'odin',

        // Assassin's Creed
        'ezio', 'altair', 'connor', 'edward', 'kenway', 'arno', 'jacob', 'evie', 'bayek',
        'kassandra', 'alexios', 'eivor', 'desmond', 'shaun', 'rebecca',

        // Metal Gear
        'snake', 'solid', 'liquid', 'ocelot', 'otacon', 'raiden', 'meryl', 'naomi',
        'venom', 'quiet', 'miller', 'kaz', 'big', 'boss',

        // Resident Evil
        'leon', 'claire', 'jill', 'chris', 'ada', 'wesker', 'nemesis', 'tyrant',
        'ethan', 'mia', 'alcina', 'dimitrescu', 'heisenberg', 'moreau', 'donna',

        // Witcher
        'geralt', 'ciri', 'yennefer', 'triss', 'dandelion', 'vesemir', 'lambert', 'eskel',

        // Dark Souls
        'solaire', 'artorias', 'ornstein', 'smough', 'gwyn', 'nito', 'seath', 'priscilla',

        // Bloodborne
        'hunter', 'gehrman', 'maria', 'ludwig', 'laurence', 'ebrietas',

        // Sekiro
        'sekiro', 'wolf', 'kuro', 'emma', 'isshin', 'genichiro',

        // Elden Ring
        'tarnished', 'melina', 'ranni', 'radahn', 'malenia', 'godrick', 'rennala', 'morgott',

        // Portal
        'chell', 'glados', 'wheatley', 'cave', 'johnson', 'atlas', 'peabody',

        // Half-Life
        'gordon', 'freeman', 'alyx', 'vance', 'barney', 'calhoun', 'gman',

        // Bioshock
        'jack', 'ryan', 'atlas', 'fontaine', 'tenenbaum', 'suchong', 'booker', 'dewitt',
        'elizabeth', 'comstock', 'daisy', 'fitzroy',

        // Fallout
        'vault', 'dweller', 'courier', 'sole', 'survivor', 'dogmeat', 'codsworth',
        'piper', 'nick', 'valentine', 'hancock', 'cait', 'curie', 'danse', 'deacon',

        // Elder Scrolls
        'dovahkiin', 'dragonborn', 'alduin', 'paarthurnax', 'delphine', 'esbern',
        'ulfric', 'tullius', 'serana', 'harkon', 'isran', 'aela', 'farkas', 'vilkas',

        // Mass Effect
        'shepard', 'garrus', 'tali', 'liara', 'wrex', 'mordin', 'thane', 'legion',
        'miranda', 'jack', 'grunt', 'samara', 'kasumi', 'zaeed', 'ashley', 'kaidan',

        // Dragon Age
        'hawke', 'varric', 'cassandra', 'solas', 'dorian', 'sera', 'blackwall',
        'vivienne', 'cole', 'iron', 'bull', 'cullen', 'josephine', 'leliana',

        // Persona
        'joker', 'ryuji', 'ann', 'yusuke', 'makoto', 'futaba', 'haru', 'akechi',
        'morgana', 'kasumi', 'maruki',

        // Kingdom Hearts
        'sora', 'riku', 'kairi', 'roxas', 'axel', 'xion', 'namine', 'aqua', 'terra',
        'ventus', 'xehanort', 'ansem', 'xemnas', 'saix', 'demyx', 'luxord',

        // Tekken
        'kazuya', 'heihachi', 'jin', 'paul', 'law', 'king', 'yoshimitsu', 'nina',
        'anna', 'xiaoyu', 'asuka', 'lili', 'bryan', 'steve', 'hwoarang', 'eddy',

        // Guilty Gear
        'sol', 'badguy', 'ky', 'kiske', 'may', 'millia', 'zato', 'potemkin', 'chipp',
        'faust', 'axl', 'venom', 'slayer', 'dizzy', 'baiken', 'anji', 'testament',

        // BlazBlue
        'ragna', 'jin', 'kisaragi', 'noel', 'vermillion', 'rachel', 'alucard', 'taokaka',
        'iron', 'tager', 'litchi', 'bang', 'carl', 'hakumen', 'nu', 'lambda',

        // Apex Legends
        'wraith', 'pathfinder', 'lifeline', 'bloodhound', 'gibraltar', 'caustic',
        'mirage', 'octane', 'wattson', 'crypto', 'revenant', 'loba', 'rampart',
        'horizon', 'fuse', 'valkyrie', 'seer', 'ash', 'mad', 'maggie',

        // Valorant
        'jett', 'phoenix', 'sage', 'sova', 'viper', 'cypher', 'brimstone', 'omen',
        'reyna', 'killjoy', 'breach', 'skye', 'yoru', 'astra', 'kayo', 'chamber',
        'neon', 'fade', 'harbor', 'gekko',

        // Dota 2 (Popular)
        'pudge', 'invoker', 'rubick', 'mirana', 'juggernaut', 'phantom', 'assassin',
        'axe', 'sniper', 'drow', 'ranger', 'crystal', 'maiden', 'lina', 'shadow',
        'fiend', 'anti', 'mage', 'faceless', 'void', 'earthshaker', 'storm', 'spirit',

        // Smash Bros (Non-Nintendo)
        'snake', 'sonic', 'cloud', 'sephiroth', 'joker', 'hero', 'banjo', 'kazooie',
        'terry', 'byleth', 'min', 'steve', 'sephiroth', 'pyra', 'mythra', 'kazuya',
        'sora',

        // Genshin Impact
        'aether', 'lumine', 'paimon', 'amber', 'kaeya', 'lisa', 'barbara', 'razor',
        'xiangling', 'beidou', 'ningguang', 'bennett', 'fischl', 'sucrose', 'chongyun',
        'noelle', 'diluc', 'jean', 'mona', 'keqing', 'qiqi', 'venti', 'klee', 'tartaglia',
        'zhongli', 'albedo', 'ganyu', 'xiao', 'hutao', 'rosaria', 'yanfei', 'eula',
        'kazuha', 'ayaka', 'yoimiya', 'sayu', 'raiden', 'shogun', 'kokomi', 'thoma',
        'itto', 'gorou', 'yunjin', 'shenhe', 'yae', 'miko', 'ayato', 'yelan', 'shinobu',
        'heizou', 'tighnari', 'collei', 'dori', 'candace', 'cyno', 'nilou', 'nahida',
        'layla', 'faruzan', 'wanderer', 'alhaitham', 'yaoyao', 'dehya', 'mika', 'baizhu',
        'kaveh', 'kirara'
    ];
    usernames.push(...premiumWords);

    return usernames;
}

// Delay function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Check username availability with retry logic for 429
async function checkUsername(username, retryCount = 0) {
    try {
        const url = `${CONFIG.baseUrl}/${encodeURIComponent(username)}`;
        const requestConfig = {
            headers: CONFIG.headers,
            timeout: 10000
        };

        const response = await axios.get(url, requestConfig);

        return {
            username,
            available: response.data.available || false,
            response: response.data,
            status: 'success',
            retries: retryCount
        };
    } catch (error) {
        // Handle 429 Rate Limit
        if (error.response && error.response.status === 429) {
            if (retryCount < CONFIG.maxRetries) {
                const waitTime = CONFIG.retryDelay429 * Math.pow(CONFIG.retryDelayMultiplier, retryCount);
                console.log(`⏳ Rate limited (429) on "${username}". Waiting ${(waitTime / 1000).toFixed(1)}s before retry ${retryCount + 1}/${CONFIG.maxRetries}...`);

                await delay(waitTime);
                return checkUsername(username, retryCount + 1);
            } else {
                return {
                    username,
                    available: false,
                    error: `Rate limited after ${CONFIG.maxRetries} retries`,
                    status: 'rate_limited',
                    retries: retryCount
                };
            }
        }

        // Handle other errors
        return {
            username,
            available: false,
            error: error.message,
            statusCode: error.response?.status,
            status: 'error',
            retries: retryCount
        };
    }
}

// Process usernames in batches with 429 retry support
async function processBatch(usernames, batchSize = CONFIG.maxConcurrent) {
    const results = {
        available: [],
        unavailable: [],
        errors: [],
        rateLimited: []
    };

    console.log(`\n🚀 Starting to check ${usernames.length} PREMIUM usernames...\n`);

    let rateLimitedUsernames = [];

    for (let i = 0; i < usernames.length; i += batchSize) {
        const batch = usernames.slice(i, i + batchSize);
        const promises = batch.map(username => checkUsername(username));

        const batchResults = await Promise.all(promises);

        for (const result of batchResults) {
            if (result.status === 'rate_limited') {
                results.rateLimited.push(result);
                rateLimitedUsernames.push(result.username);
                console.log(`🚫 Rate limited: "${result.username}" (will retry later)`);
            } else if (result.status === 'error') {
                results.errors.push(result);
                console.log(`❌ Error checking "${result.username}": ${result.error}`);
            } else if (result.available) {
                results.available.push(result);
                console.log(`✅ AVAILABLE: "${result.username}"${result.retries > 0 ? ` (after ${result.retries} retries)` : ''}`);

                // Immediately save available usernames
                appendFileSync('available_usernames.txt', `${result.username}\n`);
            } else {
                results.unavailable.push(result);
                console.log(`⛔ Taken: "${result.username}"`);
            }
        }

        // Progress update
        const progress = Math.min(i + batchSize, usernames.length);
        const percentage = ((progress / usernames.length) * 100).toFixed(1);
        console.log(`\n📊 Progress: ${progress}/${usernames.length} (${percentage}%)`);
        console.log(`   Available: ${results.available.length} | Taken: ${results.unavailable.length} | Errors: ${results.errors.length} | Rate Limited: ${results.rateLimited.length}\n`);

        // Delay between batches to avoid rate limiting
        if (i + batchSize < usernames.length) {
            await delay(CONFIG.delayMs);
        }
    }

    // Retry rate-limited usernames
    if (rateLimitedUsernames.length > 0) {
        console.log(`\n🔄 Retrying ${rateLimitedUsernames.length} rate-limited usernames after cooldown...\n`);
        await delay(CONFIG.retryDelay429 * 2); // Extra cooldown before retry batch

        for (const username of rateLimitedUsernames) {
            const result = await checkUsername(username);

            if (result.status === 'error' || result.status === 'rate_limited') {
                results.errors.push(result);
                console.log(`❌ Failed retry for "${result.username}": ${result.error || 'rate limited'}`);
            } else if (result.available) {
                results.available.push(result);
                console.log(`✅ AVAILABLE: "${result.username}" (retry successful)`);
                appendFileSync('available_usernames.txt', `${result.username}\n`);
            } else {
                results.unavailable.push(result);
                console.log(`⛔ Taken: "${result.username}"`);
            }

            await delay(CONFIG.delayMs * 2); // Extra delay for retries
        }
    }

    return results;
}

// Save results to file
function saveResults(results) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `results_${timestamp}.json`;

    writeFileSync(filename, JSON.stringify(results, null, 2));
    console.log(`\n💾 Full results saved to: ${filename}`);

    if (results.available.length > 0) {
        console.log(`\n🎉 Found ${results.available.length} available PREMIUM usernames!`);
        console.log(`   Check available_usernames.txt for the list`);
    } else {
        console.log(`\n😞 No available usernames found`);
    }
}

// Main execution
async function main() {
    console.log('═══════════════════════════════════════════════');
    console.log('   HYTALE GAME CHARACTER NAME CHECKER');
    console.log('   Checking iconic gaming character names');
    console.log('═══════════════════════════════════════════════');

    // Clear previous available usernames file
    if (existsSync('available_usernames.txt')) {
        writeFileSync('available_usernames.txt', '');
    }

    const usernames = generateOGUsernames();
    console.log(`\n📝 Generated ${usernames.length} game character names to check`);
    console.log(`⚙️  Configuration:`);
    console.log(`   - Delay between batches: ${CONFIG.delayMs}ms`);
    console.log(`   - Concurrent requests: ${CONFIG.maxConcurrent}`);
    console.log(`   - Max retries for 429: ${CONFIG.maxRetries}`);
    console.log(`   - Initial 429 retry delay: ${CONFIG.retryDelay429}ms`);

    const startTime = Date.now();
    const results = await processBatch(usernames);
    const endTime = Date.now();

    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n═══════════════════════════════════════════════');
    console.log('                 FINAL RESULTS');
    console.log('═══════════════════════════════════════════════');
    console.log(`⏱️  Time taken: ${duration} seconds`);
    console.log(`✅ Available: ${results.available.length}`);
    console.log(`⛔ Taken: ${results.unavailable.length}`);
    console.log(`❌ Errors: ${results.errors.length}`);
    console.log(`🚫 Rate Limited (failed): ${results.rateLimited.length}`);
    console.log('═══════════════════════════════════════════════\n');

    saveResults(results);
}

// Run the checker
main().catch(console.error);
