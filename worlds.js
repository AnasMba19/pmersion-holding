//#region packages/content/sectors.ts
var e = [
	{
		slug: "construction",
		title: "Construction et architecture",
		shortTitle: "Construction",
		accent: "#b96b39",
		kicker: "Interfaces · Lots · Réception",
		description: "Un bâtiment prend forme. Les plans, les approvisionnements et les interventions doivent avancer ensemble.",
		challenge: "La façade attend un détail d’interface encore ouvert. Comment protéger la suite du chantier sans présenter une date non démontrée ?",
		questions: [
			"Quel livrable bloque réellement le lot suivant ?",
			"Qui confirme la disponibilité du plan et de la zone de travail ?",
			"Quelle conséquence présenter si l’interface reste ouverte ?"
		],
		documents: [
			{
				title: "Compte rendu de coordination",
				kind: "Pièce fictive · Interfaces",
				body: "L’entreprise de façade attend la position définitive des réservations. Le bureau d’études doit consolider les remarques du lot structure. Le compte rendu ne contient pas encore de confirmation commune : inscrire un responsable et une condition de levée explicite."
			},
			{
				title: "Extrait de séquencement",
				kind: "Pièce fictive · Planning",
				body: "Les relevés précèdent la validation des détails, puis la fabrication et la pose. La préparation des accès peut avancer en parallèle. Une anticipation de fabrication reste une hypothèse à examiner ; aucun gain de délai n’est déjà acquis."
			},
			{
				title: "Demande du maître d’ouvrage",
				kind: "Pièce fictive · Arbitrage",
				body: "Le maître d’ouvrage demande une date prévisionnelle et les conditions qui la soutiennent. Présenter la référence, les informations manquantes et les options, puis distinguer la décision demandée des vérifications encore attendues."
			}
		],
		workshop: "planning"
	},
	{
		slug: "nucleaire",
		title: "Projets du secteur nucléaire",
		shortTitle: "Nucléaire",
		accent: "#617bbc",
		kicker: "Configuration · Interfaces · Traçabilité",
		description: "Dans un environnement à fortes exigences, les versions documentaires et les interfaces structurent le pilotage du projet.",
		challenge: "Une évolution d’équipement remet en question plusieurs documents d’interface. Comment préparer un arbitrage traçable avec les informations disponibles ?",
		questions: [
			"Quelle version documentaire constitue la référence de travail ?",
			"Quels responsables doivent examiner les impacts de la modification ?",
			"Quelles incertitudes empêchent encore une décision étayée ?"
		],
		documents: [
			{
				title: "Bordereau documentaire",
				kind: "Pièce fictive · Configuration",
				body: "Le dossier d’interface et la fiche fournisseur mentionnent deux révisions différentes. L’équipe doit identifier la référence applicable avec les responsables habilités du projet. Cet extrait ne définit aucune exigence de sûreté ni autorisation d’intervention."
			},
			{
				title: "Fiche d’évolution fournisseur",
				kind: "Pièce fictive · Changement",
				body: "Un équipement est proposé dans une nouvelle configuration. Les incidences sur l’encombrement, les interfaces et la documentation sont à instruire. Les estimations de coût et de délai ne sont pas encore consolidées : elles restent inconnues, pas nulles."
			},
			{
				title: "Préparation de revue",
				kind: "Pièce fictive · Gouvernance",
				body: "La revue doit identifier les pièces examinées, leurs versions, les questions ouvertes et l’autorité de décision prévue par le projet. L’exercice traite de coordination documentaire ; il ne qualifie ni une installation ni une décision de sûreté."
			}
		],
		workshop: "risques"
	},
	{
		slug: "robotique",
		title: "Robotique et automatisation",
		shortTitle: "Robotique",
		accent: "#ba7840",
		kicker: "Intégration · Essais · Cadence",
		description: "Une cellule associe équipement, logiciel et flux de production. Sa valeur dépend de l’intégration de ces éléments.",
		challenge: "La cellule fonctionne sur une pièce d’essai, mais les variations de production restent à vérifier. Quel jalon annoncer ?",
		questions: [
			"Quels cas d’usage ont réellement été testés ?",
			"Quelle interface conditionne les essais d’ensemble ?",
			"Quelle preuve distingue une démonstration d’une capacité répétable ?"
		],
		documents: [
			{
				title: "Journal de démonstration",
				kind: "Pièce fictive · Essais",
				body: "La démonstration utilise une seule référence de pièce. Le journal ne couvre pas les variations de position ni les changements de série. Un résultat observé dans ce cadre ne démontre pas encore le comportement sur tous les cas de production."
			},
			{
				title: "Liste d’interfaces",
				kind: "Pièce fictive · Intégration",
				body: "Le convoyeur, la vision et le programme de cellule échangent des informations. La disponibilité du format de message reste à confirmer avant l’essai d’ensemble. Nommer l’interlocuteur et le livrable attendu plutôt que déclarer l’interface terminée."
			},
			{
				title: "Note de préparation des essais",
				kind: "Pièce fictive · Décision",
				body: "Comparer la poursuite de l’intégration avec une campagne d’essais élargie. Rendre visibles les cas encore non couverts, les moyens nécessaires et les conditions d’acceptation à convenir. Cette note ne prescrit aucun réglage ni dispositif de sécurité machine."
			}
		],
		workshop: "planning"
	},
	{
		slug: "si-data",
		title: "Systèmes d’information et données",
		shortTitle: "SI et données",
		accent: "#4e938b",
		kicker: "Migration · Qualité · Adoption",
		description: "La mise en production relie migration, fonctionnement métier et capacité à revenir à un état maîtrisé.",
		challenge: "Un essai de migration révèle des écarts de données. Comment éclairer la décision de bascule ?",
		questions: [
			"Quels écarts sont compris, corrigés ou encore ouverts ?",
			"Qui valide les données du point de vue métier ?",
			"Quelles conditions permettent de maintenir ou reporter la bascule ?"
		],
		documents: [
			{
				title: "Rapport de migration à blanc",
				kind: "Pièce fictive · Données",
				body: "Les contrôles distinguent lignes transférées, rapprochements réussis et exceptions. Certaines exceptions ne sont pas expliquées. Une quantité de lignes importées ne suffit pas à établir la qualité métier ; conserver la liste des anomalies et leurs responsables."
			},
			{
				title: "Compte rendu métier",
				kind: "Pièce fictive · Validation",
				body: "Les utilisateurs ont testé les opérations courantes. La clôture de période reste à examiner. Le compte rendu doit distinguer les cas validés, les réserves et les cas non exécutés plutôt que déclarer une recette globale acquise."
			},
			{
				title: "Options de bascule",
				kind: "Pièce fictive · Arbitrage",
				body: "Comparer la date envisagée avec un report permettant de traiter les écarts. Documenter les dépendances, les vérifications de reprise et la décision attendue. Les coûts de report restent à estimer ; aucune économie ou disponibilité technique n’est supposée."
			}
		],
		workshop: "risques"
	},
	{
		slug: "industrie",
		title: "Industrie et équipements",
		shortTitle: "Industrie",
		accent: "#8c854b",
		kicker: "Achats · Capacité · Qualification",
		description: "L’investissement devient utile lorsque les équipements, les approvisionnements et les équipes sont prêts ensemble.",
		challenge: "Une offre fournisseur change de périmètre. Comment comparer les options sans confondre prix d’achat et coût du projet ?",
		questions: [
			"Qu’inclut exactement chaque offre ?",
			"Quels coûts d’intégration et d’essais restent à prévoir ?",
			"Quelle condition justifie une économie annoncée ?"
		],
		documents: [
			{
				title: "Comparatif des offres",
				kind: "Pièce fictive · Achats",
				body: "Une offre inclut l’intégration, une autre la traite en option. Les prix affichés ne couvrent donc pas le même périmètre. Reconstituer les prestations comparables avant de conclure à un écart favorable."
			},
			{
				title: "Revue de capacité",
				kind: "Pièce fictive · Préparation",
				body: "La cadence annoncée provient d’une configuration fournisseur. Les conditions du site et les variations du produit restent à confronter à cette hypothèse. Une capacité annoncée n’est pas une capacité démontrée dans le contexte du projet."
			},
			{
				title: "Note d’investissement",
				kind: "Pièce fictive · Budget",
				body: "Distinguer les montants déjà engagés, le reste à engager et les hypothèses de réduction. Reporter une commande ne supprime pas le besoin. Présenter les coûts restant inconnus et les conditions associées à chaque option."
			}
		],
		workshop: "budget"
	},
	{
		slug: "services-sante",
		title: "Services et organisations de santé",
		shortTitle: "Services et santé",
		accent: "#9a6685",
		kicker: "Organisation · Charge · Continuité",
		description: "Une transformation se concrétise dans le travail des équipes et la continuité du service rendu.",
		challenge: "Un nouveau fonctionnement doit être déployé tandis que les équipes assurent le service courant. Comment préparer une transition réaliste ?",
		questions: [
			"Qui assure le fonctionnement pendant la transition ?",
			"Quelle charge de préparation est prévue et disponible ?",
			"Quels signes permettront de vérifier l’adoption du nouveau fonctionnement ?"
		],
		documents: [
			{
				title: "Carte des responsabilités",
				kind: "Pièce fictive · Organisation",
				body: "Le responsable du projet est identifié ; le propriétaire du fonctionnement après déploiement reste à confirmer. Clarifier les responsabilités de transition et d’exploitation avant de déclarer l’organisation prête."
			},
			{
				title: "Prévision de charge",
				kind: "Pièce fictive · Ressources",
				body: "La préparation mobilise des personnes déjà engagées dans le service courant. Les disponibilités doivent être confirmées avec leurs responsables. Cet exemple traite de charge organisationnelle, sans données de patient ni recommandation clinique."
			},
			{
				title: "Retour du site pilote",
				kind: "Pièce fictive · Adoption",
				body: "Les équipes ont reçu une présentation, mais toutes n’ont pas encore pratiqué le nouveau processus. Comparer un déploiement progressif avec un lancement unique, en explicitant les relais, les vérifications et les conditions de continuité du service."
			}
		],
		workshop: "planning"
	}
];
function t(t) {
	return e.find((e) => e.slug === t);
}
//#endregion
//#region packages/ui/sector-scene.ts
var n = [
	"construction",
	"nucleaire",
	"robotique",
	"si-data",
	"industrie",
	"services-sante"
], r = {
	roof: "var(--scene-roof, #e5eadc)",
	front: "var(--scene-front, #a8bba8)",
	side: "var(--scene-side, #647e6b)",
	dark: "var(--scene-dark, #294e3d)",
	accent: "var(--sector-accent, #b96b39)",
	glass: "var(--scene-glass, #86aaa3)",
	light: "var(--scene-light, #f2f2df)"
};
function i(e, t = {}) {
	if (!n.includes(e)) throw RangeError("UNKNOWN_SECTOR_SCENE");
	let i = t.angle ?? -35;
	if (!Number.isFinite(i) || Math.abs(i) > 3600) throw RangeError("INVALID_SCENE_ANGLE");
	if (t.exploded !== void 0 && typeof t.exploded != "boolean") throw RangeError("INVALID_SCENE_EXPLODED");
	let a = i * Math.PI / 180, o = Math.cos(a), s = Math.sin(a), c = t.exploded ? 20 : 0, l = [], u = ([e, t, n]) => (e * s + t * o) * .9 + n * .42, d = ([e, t, n]) => [380 + (e * o - t * s) * 1.55, 350 + ((e * s + t * o) * .42 - n * .9) * 1.55], f = (e) => d(e).map((e) => Number(e.toFixed(2))).join(","), p = (e, t) => l.push({
		points: e,
		tone: t,
		depth: e.reduce((e, t) => e + u(t), 0) / e.length
	});
	function m(e, t = r.front) {
		p([
			e[0],
			e[1],
			e[2],
			e[3]
		], r.side), p([
			e[0],
			e[1],
			e[5],
			e[4]
		], t), p([
			e[1],
			e[2],
			e[6],
			e[5]
		], r.side), p([
			e[2],
			e[3],
			e[7],
			e[6]
		], t), p([
			e[3],
			e[0],
			e[4],
			e[7]
		], r.side), p([
			e[4],
			e[5],
			e[6],
			e[7]
		], t === r.front ? r.roof : t);
	}
	function h(e, t, n, i, a, o, s = r.front) {
		m([
			[
				e,
				t,
				n
			],
			[
				e + i,
				t,
				n
			],
			[
				e + i,
				t + a,
				n
			],
			[
				e,
				t + a,
				n
			],
			[
				e,
				t,
				n + o
			],
			[
				e + i,
				t,
				n + o
			],
			[
				e + i,
				t + a,
				n + o
			],
			[
				e,
				t + a,
				n + o
			]
		], s);
	}
	function g(e, t, n, i, a, o = r.front) {
		let s = [], c = [];
		for (let r = 0; r < 20; r++) {
			let o = r * Math.PI / 10;
			s.push([
				e + i * Math.cos(o),
				t + i * Math.sin(o),
				n
			]), c.push([
				e + i * Math.cos(o),
				t + i * Math.sin(o),
				n + a
			]);
		}
		for (let e = 0; e < 20; e++) p([
			s[e],
			s[(e + 1) % 20],
			c[(e + 1) % 20],
			c[e]
		], e % 4 == 0 ? r.side : o);
		p(c, r.roof);
	}
	function _(e, t, n, i) {
		for (let a = 0; a < 6; a++) for (let o = 0; o < 20; o++) {
			let s = (r, a) => {
				let o = a * Math.PI / 10, s = r * Math.PI / 12;
				return [
					e + i * Math.cos(s) * Math.cos(o),
					t + i * Math.cos(s) * Math.sin(o),
					n + i * Math.sin(s)
				];
			};
			p([
				s(a, o),
				s(a, o + 1),
				s(a + 1, o + 1),
				s(a + 1, o)
			], a % 2 ? r.roof : r.front);
		}
	}
	function v(e, t, n, i = r.accent) {
		let a = t[0] - e[0], o = t[2] - e[2], s = Math.hypot(a, o) || 1, c = -o / s * n / 2, l = a / s * n / 2, u = n / 2;
		m([
			[
				e[0] - c,
				e[1] - u,
				e[2] - l
			],
			[
				e[0] + c,
				e[1] - u,
				e[2] + l
			],
			[
				e[0] + c,
				e[1] + u,
				e[2] + l
			],
			[
				e[0] - c,
				e[1] + u,
				e[2] - l
			],
			[
				t[0] - c,
				t[1] - u,
				t[2] - l
			],
			[
				t[0] + c,
				t[1] - u,
				t[2] + l
			],
			[
				t[0] + c,
				t[1] + u,
				t[2] + l
			],
			[
				t[0] - c,
				t[1] + u,
				t[2] - l
			]
		], i);
	}
	h(-175, -118, -9, 350, 236, 9, r.roof);
	let y = l.splice(0);
	if (e === "construction") {
		for (let e of [
			0,
			1,
			2
		]) {
			let t = e * (40 + c);
			if (h(-100, -63, t, 165, 113, 6), e < 2) for (let e of [
				-94,
				-20,
				54
			]) for (let n of [-56, 40]) h(e, n, t + 6, 6, 6, 34, r.light);
			if (e > 0) {
				h(-85, -61, t - 29, 130, 2, 23, r.glass);
				for (let e of [
					-83,
					-50,
					-17,
					16,
					47
				]) h(e, -63, t - 30, 2, 4, 26, r.dark);
			}
		}
		h(-105, -67, 90 + c * 2, 176, 120, 6, r.accent), h(84, -45, 0, 48, 75, 4, r.side);
		for (let e = 0; e < 5; e++) h(83 + e * 8, -45, 4 + e * 3, 8, 75, 3, r.light);
		h(-122, 65, 0, 235, 5, 3, r.dark);
	} else if (e === "nucleaire") {
		g(-67, -8, 0, 43, 65, r.front), _(-67, -8, 65 + c, 43), h(-10, -54, 0, 130, 90, 47), h(-14, -58, 47 + c, 138, 98, 7, r.accent);
		for (let e = 0; e < 6; e++) h(3 + e * 18, -57, 12, 10, 3, 20, r.glass);
		h(36, 51, 0, 74, 35, 30, r.front), h(32, 48, 30, 82, 41, 4, r.roof), g(-130, 61, 0, 12, 28, r.dark), g(-97, 66, 0, 10, 22, r.front), h(-145, -96, 0, 277, 4, 6, r.dark);
	} else if (e === "robotique") {
		h(-130, -76, 0, 246, 148, 7, r.dark), h(-115, -59, 9, 53, 48, 12, r.front), g(-89, -35, 21, 15, 14, r.accent), v([
			-89,
			-35,
			35
		], [
			-50,
			-35,
			93 + c
		], 17), g(-50, -35, 89 + c, 12, 11, r.dark), v([
			-50,
			-35,
			98 + c
		], [
			8,
			-35,
			67 + c
		], 14), v([
			8,
			-35,
			67 + c
		], [
			25,
			-35,
			49
		], 10, r.dark), h(21, -45, 34, 5, 5, 18, r.accent), h(21, -29, 34, 5, 5, 18, r.accent), h(-15, -20, 9, 118, 35, 11, r.front);
		for (let e = 0; e < 11; e++) h(-11 + e * 10, -22, 20, 5, 39, 3, r.dark);
		for (let e of [
			4,
			51,
			88
		]) h(e, -15, 24, 13, 22, 12, r.accent);
		for (let e of [-130, 110]) for (let t of [-76, 67]) h(e, t, 7, 4, 4, 110, r.dark);
		for (let e of [-76, 67]) h(-130, e, 117 + c, 244, 4, 4, r.front);
		for (let e of [-130, 110]) h(e, -76, 117 + c, 4, 147, 4, r.front);
		h(132, -55, 0, 22, 24, 47, r.front), h(132, -57, 31, 20, 2, 12, r.glass);
	} else if (e === "si-data") {
		for (let e = 0; e < 2; e++) for (let t = 0; t < 3; t++) {
			let n = -104 + t * 69, i = -68 + e * 86, a = t === 1 ? c : 0;
			h(n, i, a, 40, 40, 91, r.dark), h(n - 2, i - 2, a + 91, 44, 44, 3, r.accent);
			for (let e = 0; e < 6; e++) h(n + 4, i - 2, a + 9 + e * 12, 30, 2, 7, r.front), h(n + 27, i - 3, a + 11 + e * 12, 3, 1, 3, r.accent);
		}
		for (let e = 0; e < 3; e++) h(-110 + e * 69, -105, 1, 8, 207, 2, r.accent);
	} else if (e === "industrie") {
		h(-113, -59, 0, 199, 108, 48);
		for (let e = 0; e < 4; e++) {
			let t = -115 + e * 51;
			p([
				[
					t,
					-63,
					48 + c
				],
				[
					t + 40,
					-63,
					71 + c
				],
				[
					t + 40,
					54,
					71 + c
				],
				[
					t,
					54,
					48 + c
				]
			], r.roof), p([
				[
					t + 40,
					-63,
					71 + c
				],
				[
					t + 51,
					-63,
					48 + c
				],
				[
					t + 51,
					54,
					48 + c
				],
				[
					t + 40,
					54,
					71 + c
				]
			], r.glass);
		}
		for (let e of [
			-96,
			-45,
			6,
			57
		]) h(e, -62, 5, 27, 3, 30, r.dark);
		g(118, 17, 0, 17, 79, r.front), g(118, 65, 0, 17, 64, r.accent), h(-120, 78, 0, 197, 22, 4, r.dark);
		for (let e of [
			-95,
			-47,
			1,
			49
		]) h(e, 78, 4, 29, 22, 18, r.front);
	} else {
		h(-118, -62, 0, 184, 90, 53), h(-123, -67, 53 + c, 194, 100, 6, r.roof), h(-48, 28, 0, 72, 65, 28, r.front), h(-52, 25, 28 + c, 80, 71, 5, r.accent);
		for (let e = 0; e < 2; e++) for (let t = 0; t < 7; t++) h(-108 + t * 23, -65, 11 + e * 23, 14, 3, 14, r.glass);
		h(-32, 91, 0, 39, 3, 21, r.glass), h(-42, 98, 0, 60, 12, 3, r.light);
		for (let e of [100, 132]) g(e, -55, 0, 3, 23, r.dark), _(e, -55, 21, 17);
		h(93, 13, 0, 50, 50, 4, r.dark), h(104, 24, 4, 27, 27, 20, r.front);
	}
	let b = [];
	for (let e = -150; e <= 150; e += 30) b.push(`<path d="M${f([
		e,
		-105,
		1
	])}L${f([
		e,
		105,
		1
	])}M${f([
		-165,
		e * .65,
		1
	])}L${f([
		165,
		e * .65,
		1
	])}"/>`);
	let x = y.sort((e, t) => e.depth - t.depth).map((e) => `<polygon points="${e.points.map(f).join(" ")}" fill="${e.tone}"/>`).join(""), S = l.sort((e, t) => e.depth - t.depth).map((e) => `<polygon points="${e.points.map(f).join(" ")}" fill="${e.tone}"/>`).join(""), C = (e, t) => `<path d="M${f(e)}L${f(t)}"/>`;
	return `<svg class="sector-scene" data-sector-scene="${e}" viewBox="0 0 760 520" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><ellipse cx="380" cy="399" rx="242" ry="65" fill="var(--scene-shadow, #21392b)" opacity=".09"/>${x}<g class="sector-scene__grid" fill="none" stroke="var(--scene-grid, #a5b9a5)" stroke-width=".7">${b.join("")}</g><g class="sector-scene__model" stroke="var(--scene-edge, #43634e)" stroke-width=".65" stroke-linejoin="round">${S}</g><g class="sector-scene__dimensions" fill="none" stroke="var(--sector-accent, #b96b39)" stroke-width="1" opacity=".7">${C([
		-174,
		138,
		0
	], [
		174,
		138,
		0
	])}${C([
		-174,
		132,
		0
	], [
		-174,
		144,
		0
	])}${C([
		174,
		132,
		0
	], [
		174,
		144,
		0
	])}${C([
		194,
		-115,
		0
	], [
		194,
		115,
		0
	])}${C([
		188,
		-115,
		0
	], [
		200,
		-115,
		0
	])}${C([
		188,
		115,
		0
	], [
		200,
		115,
		0
	])}</g></svg>`;
}
//#endregion
//#region packages/ui/sector-home.ts
function a() {
	let t = e[0];
	if (!t) throw Error("Sector catalogue is empty");
	return `<section class="world-home wrap" aria-labelledby="world-home-title">
    <div class="world-heading"><div><p class="eyebrow">PMERSION / MONDES DE PROJET</p><h1 id="world-home-title">Vos décisions<br><em>prennent forme.</em></h1></div><div class="world-heading-copy"><p>Un projet n’est jamais abstrait. Il a des lieux, des équipes, des interfaces. Entrez dans votre univers et apprenez à défendre vos décisions.</p><a class="button" href="/beta/" aria-label="Essayer la bêta PMersion">Essayer la bêta <span aria-hidden="true">↗</span></a><p class="world-caption">Accessible sans compte · Données fictives · À votre rythme</p></div></div>
    <div class="world-studio" style="--sector-accent:${t.accent}">
      <div class="world-selector" role="group" aria-label="Choisir un secteur"><p>VOTRE TERRAIN DE PROJET</p>${e.map((e) => `<button type="button" data-world-sector="${e.slug}" aria-pressed="${e.slug === t.slug}" disabled><span>${e.shortTitle}</span><b aria-hidden="true">↗</b></button>`).join("")}</div>
      <div class="world-model world-enter" id="world-home-model"><div data-world-scene aria-hidden="true">${i(t.slug)}</div><span class="world-model-label">MAQUETTE DE CONTEXTE / VUE AXONOMÉTRIQUE</span></div>
      <div class="world-context"><p class="eyebrow" data-world-kicker>${t.kicker}</p><div aria-live="polite" aria-atomic="true"><h2 data-world-title>${t.shortTitle}</h2><p data-world-description>${t.description}</p></div><a data-world-open href="/beta/#/secteurs/${t.slug}">Ouvrir cet univers <span aria-hidden="true">↗</span></a><div class="world-tools" role="group" aria-label="Explorer la maquette"><button type="button" data-world-turn disabled>Tourner ↻</button><button type="button" data-world-explode aria-pressed="false" disabled>Séparer les volumes</button></div></div>
    </div><div class="world-studio-footer"><span>Six univers · Des pièces à examiner · Des questions à arbitrer</span><a href="/beta/#/secteurs">Explorer tous les secteurs →</a></div>
    <noscript><p>Choisissez votre contexte : ${e.map((e) => `<a href="/beta/#/secteurs/${e.slug}">${e.shortTitle}</a>`).join(" · ")}. Les pages sectorielles nécessitent JavaScript ; le plan ci-dessous reste lisible.</p></noscript>
  </section>`;
}
function o(n) {
	let r = e[0]?.slug ?? "construction", a = -35, o = !1, s = n.querySelector("[data-world-scene]"), c = n.querySelector(".world-studio"), l = [...n.querySelectorAll("[data-world-sector]")], u = n.querySelector("[data-world-turn]"), d = n.querySelector("[data-world-explode]"), f = n.querySelector("[data-world-open]");
	if (!s || !c || !u || !d || !f) return () => {};
	let p = matchMedia("(prefers-reduced-motion: reduce)"), m, h = () => m?.cancel(), g = () => {
		(p.matches || document.documentElement.dataset.motion === "reduced") && h();
	}, _ = new MutationObserver(g);
	_.observe(document.documentElement, {
		attributes: !0,
		attributeFilter: ["data-motion"]
	}), p.addEventListener("change", g), window.addEventListener("pagehide", h);
	let v = () => {
		h();
		let e = t(r);
		if (e) {
			s.innerHTML = i(r, {
				angle: a,
				exploded: o
			}), c.style.setProperty("--sector-accent", e.accent);
			for (let [t, r] of [
				["[data-world-kicker]", e.kicker],
				["[data-world-title]", e.shortTitle],
				["[data-world-description]", e.description]
			]) {
				let e = n.querySelector(t);
				e && (e.textContent = r);
			}
			f.href = `/beta/#/secteurs/${e.slug}`, f.setAttribute("aria-label", `Ouvrir l’univers ${e.shortTitle}`), d.setAttribute("aria-pressed", String(o));
			for (let e of l) e.setAttribute("aria-pressed", String(e.dataset.worldSector === r));
			!matchMedia("(prefers-reduced-motion: reduce)").matches && document.documentElement.dataset.motion !== "reduced" && (m = s.animate([{
				opacity: .5,
				transform: "translateY(7px)"
			}, {
				opacity: 1,
				transform: "translateY(0)"
			}], {
				duration: 420,
				easing: "cubic-bezier(.22,.68,.25,1)"
			}));
		}
	}, y = (e) => {
		let n = e.currentTarget;
		t(n.dataset.worldSector ?? "") && (r = n.dataset.worldSector ?? r, a = -35, o = !1, v());
	}, b = () => {
		a = a >= 235 ? -35 : a + 90, v();
	}, x = () => {
		o = !o, v();
	};
	for (let e of l) e.disabled = !1, e.addEventListener("click", y);
	return u.disabled = !1, d.disabled = !1, u.addEventListener("click", b), d.addEventListener("click", x), () => {
		h(), _.disconnect(), p.removeEventListener("change", g), window.removeEventListener("pagehide", h);
		for (let e of l) e.removeEventListener("click", y);
		u.removeEventListener("click", b), d.removeEventListener("click", x);
	};
}
if (typeof document < "u") {
	let e = document.getElementById("home-project-worlds");
	e && o(e);
}
//#endregion
export { o as mountSectorHome, a as renderSectorHome };
