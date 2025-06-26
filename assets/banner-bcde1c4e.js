import{C as a,p as n}from"./index-95b12b48.js";const o={metadata:{name:"banner",description:"Display welcome banner",usage:"banner",category:a.CORE,aliases:["welcome","intro","home","h"]},execute(){return`
${`_   _       _         _____
| \\ | |     | |       / ____|
|  \\| | __ _| |_ ___ | |  __ _ __ ___  ___ _ __
| . \` |/ _\` | __/ _ \\| | |_ | '__/ _ \\/ _ \\ '_ \\
| |\\  | (_| | ||  __/| |__| | | |  __/  __/ | | |
|_| \\_|\\__,_|\\__\\___| \\_____|_|  \\___|\\__|_| |_|`.split("").map((_,e)=>_===" "||_===`
`?_:`<span class="rainbow-char" style="animation-delay: ${e*.1}s">${_}</span>`).join("")}

Welcome to the nate.green interactive terminal [Version ${n.version}]

Available ng-cli commands:
<cmd>about</cmd> - Who dis?
<cmd>contact</cmd> - Get in touch
<cmd>projects</cmd> - Open source stuff
<cmd>skills</cmd> - List my technical skills

Type '<cmd>help</cmd>' for all commands.`}};export{o as default};
