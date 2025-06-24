import{C as r,g as d}from"./index-9e4fb58b.js";const l={metadata:{name:"help",description:"Display available commands",usage:"help [command]",category:r.CORE,aliases:["?","commands"]},execute(c=[]){const m=d();if(c.length>0){const e=c[0].toLowerCase(),o=m[e];if(!o)return`Command '${e}' not found. Type 'help' for a list of available commands.`;const{metadata:a}=o;return`
Help: ${a.name}
${"=".repeat(a.name.length+6)}
Description: ${a.description}
Usage: ${a.usage}
Category: ${a.category}
Aliases: ${a.aliases.join(", ")||"None"}
`}let t=`Available commands:
`;const n={};return Object.entries(m).forEach(([e,o])=>{const a=o.metadata.category;n[a]||(n[a]=[]),n[a].push(e)}),Object.entries(n).forEach(([e,o])=>{t+=`
${e.charAt(0).toUpperCase()+e.slice(1)}:
`,o.sort().forEach(a=>{const s=m[a];t+=`<cmd>${a}</cmd> - ${s.metadata.description}
`})}),t+=`
Type '<cmd>help</cmd> [command]' for more information about a specific command.`,t}};export{l as default};
