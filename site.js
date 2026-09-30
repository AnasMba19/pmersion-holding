import { snapshots } from './dossier-data.js';
const euro = value => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
const previews = {
 budget: { title: '90 000 € d’écart.\nQuelle option défendre ?', metric: 'Coût final prévu', first: ['Budget approuvé','1 000 000 €'], second: ['Économies possibles, à vérifier','40 000 €'], insight: 'Reporter une dépense ne réduit pas son coût. L’arbitrage commence par cette distinction.', verified: 'Les économies vérifiées réduisent la prévision. La référence approuvée reste inchangée.', link: 'Ouvrir le dossier budget', hypothesis: 'Tester 40 000 € d’économies vérifiées' },
 planning: { title: 'Une livraison retardée.\nQuel jalon annoncer ?', metric: 'Fin prévue', first: ['Engagement externe','J47'], second: ['Récupération conditionnelle','4 jours'], insight: 'Le gain de délai exige des interfaces validées et une récupération vérifiée dans la simulation.', verified: 'Quatre jours récupérés. Neuf jours de retard restent à présenter au comité.', link: 'Ouvrir le dossier planning', hypothesis: 'Tester les conditions de récupération vérifiées' },
 risques: { title: 'Une capacité sous pression.\nQuand faut-il agir ?', metric: 'Exposition modélisée', first: ['Seuil d’alerte capacité','Sous 80 %'], second: ['Qualification au plus tôt','J5'], insight: 'Un plan de réponse n’est pas un effet acquis. Testez les observations jusqu’à l’incident.', verified: 'L’alternative qualifiée à J5 réduit l’exposition modélisée. Le risque ne disparaît pas.', link: 'Ouvrir le dossier risques', hypothesis: 'Tester une alternative qualifiée à J5' }
};
for (const button of document.querySelectorAll('[data-preview],[data-stage],#hypothesis-toggle')) button.disabled = false;
const set = (id,value) => { document.getElementById(id).textContent = value; };
let preview = 'budget'; let verified = false;
function pulse(element) {
 if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) element.animate([{opacity:.45,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:260,easing:'ease-out'});
}
function renderPreview() {
 const entry = previews[preview]; const report = snapshots.reports[verified ? 'verified' : 'prepare'];
 const value = preview === 'budget' ? euro(report.baseCost) : preview === 'planning' ? `J${report.finish}` : `${report.exposure} / 25`;
 for (const button of document.querySelectorAll('[data-preview]')) button.setAttribute('aria-pressed',String(button.dataset.preview === preview));
 document.getElementById('preview-title').innerText = entry.title;
 set('metric-label',entry.metric); set('metric-value',value);
 set('metric-variance',preview === 'budget' ? `+${Math.round((report.baseCost / 1000000 - 1) * 100)} %` : preview === 'planning' ? `+${report.finish - report.target} j` : 'SYN–R01');
 set('row-one-label',entry.first[0]); set('row-one-value',entry.first[1]);
 set('row-two-label',verified ? 'Hypothèse appliquée dans cet aperçu' : entry.second[0]); set('row-two-value',verified ? 'Vérifiée' : entry.second[1]);
 set('preview-insight',verified ? entry.verified : entry.insight); set('hypothesis-label',entry.hypothesis);
 document.getElementById('hypothesis-toggle').setAttribute('aria-pressed',String(verified));
 document.getElementById('hypothesis-toggle').querySelector('span').textContent = verified ? '✓' : '＋';
 const fraction = preview === 'budget' ? report.baseCost / 1200000 : preview === 'planning' ? report.finish / 80 : report.exposure / 25;
 document.getElementById('effect-fill').style.width = `${fraction * 100}%`;
 const marker = document.getElementById('effect-reference'); marker.hidden = preview === 'risques'; marker.style.left = preview === 'budget' ? '83.33%' : '58.75%';
 set('effect-caption',preview === 'budget' ? 'La référence approuvée reste à 1 000 000 €.' : preview === 'planning' ? 'La cible externe reste J47 · Axe J0–J80.' : 'Indice ordinal sur 25 · Ce n’est pas une probabilité.');
 const link = document.getElementById('preview-link'); link.href = `/beta/#/atelier/${preview}`; link.textContent = `${entry.link} ↗`;
 pulse(document.getElementById('metric-value'));
}
for (const button of document.querySelectorAll('[data-preview]')) button.addEventListener('click',() => { preview = button.dataset.preview; verified = false; renderPreview(); });
document.getElementById('hypothesis-toggle').addEventListener('click',() => { verified = !verified; renderPreview(); });
for (const button of document.querySelectorAll('[data-stage]')) button.addEventListener('click',() => {
 const stage = button.dataset.stage; const report = snapshots.reports[stage];
 for (const peer of document.querySelectorAll('[data-stage]')) peer.setAttribute('aria-pressed',String(peer === button));
 set('living-cost',report.cost === null ? 'À compléter' : euro(report.cost)); set('living-date',report.finish === null ? 'À compléter' : `J${report.finish}`); set('living-risk',report.exposure === null ? 'Incident' : `${report.exposure} / 25`);
 set('living-savings',euro(report.savings)); set('living-actions',euro(report.actionCost));
 const bar = document.getElementById('living-bar'); bar.setAttribute('visibility',report.finish === null ? 'hidden' : 'visible');
 if (report.finish !== null) bar.setAttribute('width',String(Math.round(report.finish / 80 * 360)));
 set('living-chart-date',report.finish === null ? '?' : `J${report.finish}`);
 set('living-chart-title',report.finish === null ? 'L’incident reste à chiffrer : la date finale est inconnue, pas nulle.' : `Jalon externe J47, fin prévue J${report.finish} : ${report.finish - report.target} jours d’écart.`);
 set('living-insight',stage === 'incident' ? `Le sous-total connu est ${euro(report.knownCost)}. Les impacts de l’incident sont inconnus : le coût final et la date restent à compléter.` : stage === 'verified' ? 'Les effets sont supposés vérifiés : 40 000 € d’économies et quatre jours récupérés. Les actions coûtent toujours 11 000 €.' : 'Un plan n’est pas un gain acquis. Les coûts des actions sont prévus ; leurs effets restent à vérifier.');
 pulse(document.getElementById('living-cost'));
});
