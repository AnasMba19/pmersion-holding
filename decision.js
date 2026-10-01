import { decisions } from './decision-data.js';
const byId = id => document.getElementById(id);
const euro = value => new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(value);
const scene = byId('signature-scene');
const reduced = () => document.documentElement.dataset.motion === 'reduced' || matchMedia('(prefers-reduced-motion: reduce)').matches;
const animations = new Set();
function animate(element,frames,options={}) {
 if(reduced() || !element.animate) return;
 const animation=element.animate(frames,{duration:850,easing:'cubic-bezier(.16,1,.3,1)',...options});
 animations.add(animation);
 animation.finished.catch(()=>{}).finally(()=>animations.delete(animation));
}
let current = 'initial';
const summaries = {
 initial:'Le budget et le délai attendent un arbitrage.',
 savings:'40 000 € évités. Le délai reste inchangé.',
 defer:'60 000 € reportés. Coût évité : 0 €.',
 recover:'4 jours gagnés, pour 6 000 € d’action.'
};
for(const [key,entry] of Object.entries(decisions)) {
 if(key === 'initial')continue;
 const tr=document.createElement('tr');tr.dataset.choice=key;
 for(const [index,text] of [entry.label,euro(entry.cost),`J${entry.finish}`,summaries[key]].entries()) {
 const cell=document.createElement(index===0?'th':'td');if(index===0)cell.scope='row';cell.textContent=text;tr.append(cell);
 }
 byId('decision-comparison-body').append(tr);
}
function choose(key) {
 if(!Object.hasOwn(decisions,key))return;
 for(const animation of animations)animation.cancel();
 const prior=decisions[current];const entry=decisions[key];current=key;
 scene.dataset.decision=key;
 for(const button of document.querySelectorAll('[data-decision-choice]'))button.setAttribute('aria-pressed',String(button.dataset.decisionChoice===key));
 for(const row of document.querySelectorAll('[data-choice]'))row.dataset.selected=String(row.dataset.choice===key);
 byId('decision-label').textContent=entry.label;
 byId('decision-cost').textContent=euro(entry.cost);
 byId('decision-cost-delta').textContent=`+${euro(entry.cost-entry.baseline)} au budget approuvé`;
 byId('decision-finish').textContent=`J${entry.finish}`;
 byId('decision-delay').textContent=`${entry.finish-entry.target} jours après la cible`;
 byId('decision-tradeoff').textContent=summaries[key];
 byId('decision-lesson').textContent=entry.lesson;
 byId('decision-caution').textContent=entry.caution;
 byId('decision-next').href=entry.route;
 // Fixed chart axes: 0–1.2M EUR and J0–J80. Geometry presents generated values only.
 const moneyScale=660/1200000;
 const remaining=byId('decision-remaining');
 const oldWidth=Number(remaining.getAttribute('width'));
 const newWidth=214.5-entry.savings*moneyScale;
 remaining.setAttribute('width',String(newWidth));
 animate(remaining,[{width:`${oldWidth}px`},{width:`${newWidth}px`}]);
 const action=byId('decision-action');const oldAction=Number(action.getAttribute('width'));
 action.setAttribute('x',String(421+newWidth));action.setAttribute('width',String(entry.actionCost*moneyScale));
 animate(action,[{width:`${oldAction}px`},{width:`${entry.actionCost*moneyScale}px`}]);
 const x=36+entry.finish/80*660;const previousX=36+prior.finish/80*660;
 const marker=byId('finish-marker');marker.setAttribute('transform',`translate(${x} 245)`);
 animate(marker,[{transform:`translate(${previousX}px,245px)`},{transform:`translate(${x}px,245px)`}]);
 byId('finish-marker-label').textContent=`J${entry.finish}`;
 byId('decision-route').setAttribute('d',`M36 245H${x}`);
 animate(byId('decision-route'),[{strokeDasharray:'660',strokeDashoffset:'660'},{strokeDasharray:'660',strokeDashoffset:'0'}],{duration:1100});
 const cash=byId('cash-marker');const cashX=entry.postponed?440:36;
 cash.querySelector('text').textContent=entry.postponed?'60 000 € reportés · plus tard':'Pas de paiement reporté';
 cash.setAttribute('transform',`translate(${cashX} 333)`);
 animate(cash,[{transform:`translate(${prior.postponed?440:36}px,333px)`},{transform:`translate(${cashX}px,333px)`}],{duration:1000});
 animate(byId('decision-cost'),[{opacity:.25,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:600});
 animate(byId('decision-lesson'),[{opacity:.4,transform:'translateX(14px)'},{opacity:1,transform:'translateX(0)'}],{duration:650});
}
for(const button of document.querySelectorAll('[data-decision-choice]')){button.disabled=false;button.addEventListener('click',()=>choose(button.dataset.decisionChoice));}
byId('decision-reset').disabled=false;byId('decision-reset').addEventListener('click',()=>choose('initial'));
// One coordinated finite entrance. No autoplay decisions and no perpetual RAF loop.
animate(byId('budget-shape'),[{transform:'translateY(36px)',opacity:.2},{transform:'translateY(0)',opacity:1}],{duration:1500});
animate(byId('decision-route'),[{strokeDasharray:'660',strokeDashoffset:'660'},{strokeDasharray:'660',strokeDashoffset:'0'}],{duration:1800,delay:100});
animate(document.querySelector('.decision-intro h1 span'),[{transform:'translateY(28px)',opacity:.15},{transform:'translateY(0)',opacity:1}],{duration:1000});
window.addEventListener('pagehide',()=>{for(const animation of animations)animation.cancel();});
