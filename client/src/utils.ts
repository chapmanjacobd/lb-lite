export function html(...args: [string | TemplateStringsArray]) {
    return args
}

export function shuffle(lst: any[]): any {
    return lst[Math.floor(Math.random() * lst.length)];
};


function hashCode(str: string) {
    let hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}
export function randomPASTEL(str: string) {
    return `hsla(${~(hashCode(str) % 360)}, 70%,70%,0.4)`;
}
export function secondsToFriendlyTime(seconds: number) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);

    let display = [];
    if (d > 0) display.push(d + ' d')
    if (h > 0) display.push(h + ' h')
    if (m > 0) display.push(m + ' m')
    if (display.length == 0) display.push('<1m')

    return display.join(', ');
}
export function downloadBlob(blob: Blob, filename: string) {
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", URL.createObjectURL(blob));
    downloadAnchorNode.setAttribute("download", filename);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
export function downloadObjectAsJson(exportObj: object, exportName: string) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
export async function fileToJSON(event: Event): Promise<object> {
    // let data = await fileToJSON(event)
    const file = event.target.files[0]
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onload = event => resolve(JSON.parse(event.target.result))
        fileReader.onerror = error => reject(error)
        fileReader.readAsText(file)
    })
}
export function randimal() {
    return shuffle([
        "🌸",
        "🐄",
        "🐉",
        "🐋",
        "🐕‍🦺",
        "🐘",
        "🐙",
        "🐠",
        "🐢",
        "🐬",
        "🐳",
        "🐸",
        "🐹",
        "💐",
        "💮",
        "🕊️",
        "🙈",
        "🙉",
        "🙊",
        "🦅",
        "🦆",
        "🦈",
        "🦋",
        "🦎",
        "🦐",
        "🦓",
        "🦖",
        "🦗",
        "🦘",
        "🦚",
        "🦜",
        "🦞",
        "🦢",
        "🦧",
        "🦩",
    ]);
}
export function onomonopia() {
    // https://youtu.be/tuFRz18rMQk
    return shuffle([
        "ahem",
        "ahhh",
        "arf.",
        "argh",
        "arr!",
        "baa.",
        "bah.",
        "bark",
        "beep",
        "beoi",
        "bleh",
        "blet",
        "bonk",
        "boom",
        "burp",
        "chir",
        "chow",
        "clik",
        "eaar",
        "eek!",
        "eep.",
        "grol",
        "grr.",
        "hewo",
        "hun.",
        "kerh",
        "kroo",
        "lah.",
        "loow",
        "meow",
        "mew.",
        "moo.",
        "oink",
        "oweh",
        "phew",
        "psst",
        "purr",
        "rats",
        "rawr",
        "roar",
        "sigh",
        "slam",
        "sqak",
        "ssss",
        "toot",
        "tsk.",
        "ugh.",
        "umm.",
        "uuk.",
        "vrüm",
        "vwop",
        "wee.",
        "woof",
        "wow~",
        'yarr',
        "yip.",
        "zip.",
        "zonk",
        "quak",
    ]);
}
