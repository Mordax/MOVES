const utils = require('./util');
const fs = require('fs');
const all = Object.keys(utils.ROUTES).map(k => Object.keys(utils.ROUTES[k].PATH).map(k2 => utils.ROUTES[k].BASE_ROUTE + utils.ROUTES[k].PATH[k2])).reduce((r, a) => r.concat(a)).map(k3 => {return{name:k3, claim:(utils.FULL_PATHS[k3]?utils.FULL_PATHS[k3].CLAIMS.map(c=>{var a={};a[c.type]=c.value;return a;}):null), type:null, auth:null, params: null, body:null, return:null, comment:null};});
const role = Object.keys(utils.ROLES).map(c => {return {name: c, value: c, comment: null}});
const claim = Object.keys(utils.CLAIMS).map(c => Object.keys(utils.CLAIMS[c]).filter(c3=> c != "TYPES").map(c2=>{return {name: `${c}: ${c2}`, value: c2, claim:`{"type":"${c}", "value":"${c2}"}`, comment: null}})).reduce((r,a)=>r.concat(a));
try{const usage = require('./usage.json');
try{
const new_usage = usage.routes.map(r => {console.log(r);let m = all.map(v => v.name); if (m.includes(r.name)){let i=all.findIndex(a=>a.name==r.name);r.claim=all[i].claim;Object.keys(r).map(r2=>{r[r2]=all[i][r2]==null?r[r2]:all[i][r2];})}else{r=all.filter(r3 => r3.name == r.name)[0]};return r;});
const new_claims = usage.claims.map(r => {let m = claim.map(v => v.name); if (m.includes(r.name)){let i=claim.findIndex(a=>a.name==r.name);Object.keys(r).map(r2=>{r[r2]=claim[i][r2]==null?r[r2]:claim[i][r2];})}else{r=claim.filter(r3 => r3.name == r.name)[0]};return r;});
const new_roles = usage.roles.map(r => {let m = role.map(v => v.name); if (m.includes(r.name)){let i=role.findIndex(a=>a.name==r.name);Object.keys(r).map(r2=>{r[r2]=role[i][r2]==null?r[r2]:role[i][r2];})}else{r=role.filter(r3 => r3.name == r.name)[0]};return r;});
fs.writeFileSync('./usage.json', JSON.stringify({roles: new_roles, claims: new_claims, routes: new_usage}, null, 4));
}catch(err){fs.writeFileSync('./usage_new.json', JSON.stringify({roles: role, claims: claim, routes: all}, null, 4));}
}catch(err){fs.writeFileSync('./usage.json', JSON.stringify({roles: role, claims: claim, routes: all}, null, 4));}
// run `node generate-usage.js` to update usage.json for usage.html