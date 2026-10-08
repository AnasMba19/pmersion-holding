import { decisions } from './decision-data.3765b110e6cc3f9f.js';
import { updateProjectPlan } from './project-plan.06416ee77cc91aba.js';
const byId = id => document.getElementById(id);
const euro = value => new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(value);
const scene = byId('signature-scene');
const reduced = () => document.documentElement.dataset.motion === 'reduced' || matchMedia('(prefers-reduced-motion: reduce)').matches;
const animations = new Set();
function animate(element,frames,options={}) {
 if(!element || reduced() || !element.animate) return;
 const animation=element.animate(frames,{duration:650,easing:'cubic-bezier(.16,1,.3,1)',...options});
 animations.add(animation);
 animation.finished.catch(()=>{}).finally(()=>animations.delete(animation));
}
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
 const entry=decisions[key];scene.dataset.decision=key;
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
 updateProjectPlan(byId('home-project-plan'),entry.plan);
 byId('decision-remaining').style.width=`${(390000-entry.savings)/1200000*100}%`;
 byId('decision-action').style.width=`${entry.actionCost/1200000*100}%`;
 byId('cash-marker').textContent=entry.postponed?'60 000 € reportés · coût inchangé':'Pas de paiement reporté';
 animate(byId('decision-cost'),[{opacity:.35,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}]);
 animate(byId('decision-lesson'),[{opacity:.4,transform:'translateX(8px)'},{opacity:1,transform:'translateX(0)'}]);
}
for(const button of document.querySelectorAll('[data-decision-choice]')){button.disabled=false;button.addEventListener('click',()=>choose(button.dataset.decisionChoice));}
byId('decision-reset').disabled=false;byId('decision-reset').addEventListener('click',()=>choose('initial'));
for(const [index,bar] of document.querySelectorAll('[data-plan-task]').entries()) {
 animate(bar,[{opacity:.2,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:950,delay:index*70});
}
animate(document.querySelector('.decision-intro h2 span'),[{transform:'translateY(18px)',opacity:.3},{transform:'translateY(0)',opacity:1}],{duration:850});
window.addEventListener('pagehide',()=>{for(const animation of animations)animation.cancel();});
