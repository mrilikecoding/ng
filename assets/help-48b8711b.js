import{C as i,g as r}from"./index-95f00b94.js";const p={metadata:{name:"help",description:"Display available commands",usage:"help [command]",category:i.CORE,aliases:["?","commands"]},execute(s=[]){const c=r();if(s.length>0){const e=s[0].toLowerCase(),o=c[e];if(!o)return`Command '${e}' not found. Type 'help' for a list of available commands.`;const{metadata:a}=o;return`
Help: ${a.name}
${"=".repeat(a.name.length+6)}
Description: ${a.description}
Usage: ${a.usage}
Category: ${a.category}
Aliases: ${a.aliases.join(", ")||"None"}
`}let t=`Available commands:
`;const n={};Object.entries(c).forEach(([e,o])=>{const a=o.metadata.category;n[a]||(n[a]=[]),n[a].push(e)});const d=["content","core","system","utility"];return d.forEach(e=>{if(n[e]){const o=n[e];t+=`
${e.charAt(0).toUpperCase()+e.slice(1)}:
`,o.sort().forEach(a=>{const m=c[a];t+=`<cmd>${a}</cmd> - ${m.metadata.description}
`})}}),Object.entries(n).forEach(([e,o])=>{d.includes(e)||(t+=`
${e.charAt(0).toUpperCase()+e.slice(1)}:
`,o.sort().forEach(a=>{const m=c[a];t+=`<cmd>${a}</cmd> - ${m.metadata.description}
`}))}),t+=`
Type '<cmd>help</cmd> [command]' for more information about a specific command.`,t}};export{p as default};
