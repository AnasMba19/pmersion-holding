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
//#region packages/content/project-taxonomy.ts
var n = [
	{
		id: "cadrage",
		title: "Cadrage et mandat",
		question: "Quel résultat et quelle autorité de décision sont convenus ?"
	},
	{
		id: "conception",
		title: "Conception et préparation",
		question: "Quelle interface doit être validée avant de s’engager ?"
	},
	{
		id: "realisation",
		title: "Réalisation et intégration",
		question: "Quelle dépendance menace le prochain jalon ?"
	},
	{
		id: "reception",
		title: "Réception et transition",
		question: "Quelle preuve permet d’accepter le résultat et de passer le relais ?"
	}
], r = (e, t, n, r, i, a) => ({
	id: e,
	title: t,
	object: n,
	interface: r,
	owner: i,
	acceptance: a
}), i = [
	{
		id: "construction",
		title: "Construction, architecture et immobilier",
		shortTitle: "Construction",
		accent: "#b96b39",
		scene: "construction",
		context: "construction",
		environments: [
			r("hotel", "Rénovation d’un hôtel", "120 chambres · lot menuiseries extérieures", "Fourniture → hors d’eau → doublages → finitions", "Architecte, BET, entreprise et maître d’ouvrage", "Échantillon, performances prescrites et réception du lot"),
			r("bureaux", "Immeuble de bureaux", "Plateaux et lots techniques", "Structure → réservations → équipements → essais", "Maîtrise d’œuvre et responsables de lots", "Interfaces et essais documentés avant occupation"),
			r("logements", "Programme de logements", "Bâtiments, parties communes et livraisons", "Approvisionnement → pose → contrôles → réception", "Maîtrise d’ouvrage, entreprises et contrôleur qualité", "Réserves attribuées et critères de réception vérifiés")
		]
	},
	{
		id: "infrastructures",
		title: "Infrastructures et génie civil",
		shortTitle: "Infrastructures",
		accent: "#8a7953",
		scene: "interfaces",
		environments: [r("ouvrage", "Ouvrage d’art", "Ouvrage et raccordements", "Études → ouvrages provisoires → travaux → contrôles", "Maîtrise d’œuvre, entreprise et exploitant", "Dossier de contrôle et conditions de remise à l’exploitant"), r("reseaux", "Réseaux et aménagement urbain", "Réseaux et zones d’intervention", "Autorisations → déviations → travaux → remise en service", "Collectivité, concessionnaires et entreprise", "Continuité de service et réception par les responsables")]
	},
	{
		id: "energie",
		title: "Énergie et utilities",
		shortTitle: "Énergie",
		accent: "#617bbc",
		scene: "nucleaire",
		context: "nucleaire",
		environments: [
			r("nucleaire", "Projet nucléaire", "Configuration documentaire et équipements", "Référence applicable → interfaces → revue habilitée", "Responsables habilités du projet et fournisseurs", "Versions et questions ouvertes traçables ; aucune qualification de sûreté"),
			r("renouvelables", "Production renouvelable", "Production et raccordement", "Équipements → raccordement → essais → exploitation", "Développeur, gestionnaire de réseau et exploitant", "Conditions d’essais et de raccordement confirmées"),
			r("utilities", "Distribution et utilities", "Réseau et services associés", "Travaux → contrôles → bascule → service", "Gestionnaire de réseau et équipes d’exploitation", "Conditions de transition et continuité convenues")
		]
	},
	{
		id: "industrie",
		title: "Industrie et manufacturing",
		shortTitle: "Industrie",
		accent: "#8c854b",
		scene: "industrie",
		context: "industrie",
		environments: [r("ligne", "Ligne de production", "Équipements et capacité de production", "Commande → intégration → essais → montée en cadence", "Achats, intégrateur, production et qualité", "Capacité répétable dans les conditions du site"), r("process", "Site de process", "Installation et interfaces de procédés", "Conception → installation → essais → transfert", "Ingénierie, fournisseur et exploitation", "Périmètre comparable et conditions de transfert documentées")]
	},
	{
		id: "robotique",
		title: "Robotique et automation",
		shortTitle: "Robotique",
		accent: "#ba7840",
		scene: "robotique",
		context: "robotique",
		environments: [r("cellule", "Cellule robotisée", "Robot, vision et convoyeur", "Interfaces → intégration → essais variés → cadence", "Intégrateur, production et qualité", "Essais sur variations représentatives ; aucune qualification machine"), r("logistique", "Automatisation logistique", "Flux, équipements et orchestration", "Données → interfaces → essais de flux → exploitation", "Intégrateur et responsable logistique", "Scénarios de flux et récupération des exceptions vérifiés")]
	},
	{
		id: "numerique",
		title: "Numérique et systèmes d’information",
		shortTitle: "Numérique et SI",
		accent: "#4e938b",
		scene: "si-data",
		context: "si-data",
		environments: [
			r("erp", "ERP et finance", "Processus, référentiels et clôture", "Reprise → rapprochement → recette métier → bascule", "Finance, métiers et responsable SI", "Rapprochements et cas de clôture documentés"),
			r("crm", "CRM", "Relation client et interfaces commerciales", "Référentiels → interfaces → recette → adoption", "Métiers, SI et responsables des données", "Cas métiers, droits et qualité de reprise vérifiés"),
			r("sirh", "SIRH", "Processus RH et interfaces", "Paramétrage → reprise fictive → recette → transition", "RH, SI et propriétaire du processus", "Cas d’usage et droits vérifiés sans données personnelles réelles"),
			r("cloud", "Cloud et cybersécurité", "Migration technique et fonctionnement métier", "Inventaire → dépendances → essais → retour arrière", "SI, sécurité et exploitation", "Conditions de bascule et reprise démontrées")
		]
	},
	{
		id: "data-ia",
		title: "Data et intelligence artificielle",
		shortTitle: "Data et IA",
		accent: "#537c89",
		scene: "si-data",
		context: "si-data",
		environments: [
			r("bi", "BI et analytique", "Indicateurs et décisions métier", "Sources → transformations → rapprochements → validation", "Data owners et métier", "Définitions et contrôles des indicateurs traçables"),
			r("qualite", "Qualité des données et MDM", "Référentiels et exceptions", "Profilage → règles → correction → validation", "Responsable de données et propriétaire métier", "Exceptions expliquées et règles versionnées"),
			r("ia", "Produit IA", "Cas d’usage et dossier d’évaluation", "Données → évaluation → revue → intégration", "Produit, équipe data et autorité de validation", "Jeu d’évaluation et limites explicités ; aucune certification")
		]
	},
	{
		id: "transport",
		title: "Transport, mobilité et logistique",
		shortTitle: "Transport",
		accent: "#597aa0",
		scene: "interfaces",
		environments: [r("mobilite", "Mobilité et exploitation", "Système, infrastructures et services", "Travaux → interfaces → essais → service", "Exploitant, autorités du projet et intégrateurs", "Conditions de mise en service et responsabilités clarifiées"), r("supply", "Supply chain et logistique", "Flux et capacité de livraison", "Fourniture → réception → stock → distribution", "Achats, fournisseurs et opérations", "Délais et capacités documentés sur le même périmètre")]
	},
	{
		id: "sante",
		title: "Santé, médico-social et life sciences",
		shortTitle: "Santé",
		accent: "#9a6685",
		scene: "services-sante",
		context: "services-sante",
		environments: [r("etablissement", "Transformation d’un établissement", "Organisation et continuité du service", "Préparation → disponibilité → pilote → transition", "Direction, équipes et propriétaire du fonctionnement", "Charge et continuité convenues ; aucune recommandation clinique"), r("life-sciences", "Projet life sciences", "Livrables et dossier de qualification", "Conception → protocoles → résultats → revue", "Projet, qualité et autorités désignées", "Traçabilité documentaire ; aucune validation réglementaire")]
	},
	{
		id: "public",
		title: "Secteur public, éducation et recherche",
		shortTitle: "Public et recherche",
		accent: "#7b7394",
		scene: "interfaces",
		environments: [r("service", "Service public", "Service et partenaires de déploiement", "Mandat → préparation → pilote → déploiement", "Sponsor, équipes et partenaires", "Bénéfice attendu, responsabilités et critères de passage explicités"), r("education", "Éducation et recherche", "Programme, équipements et usages", "Besoins → moyens → expérimentation → bilan", "Équipe pédagogique ou scientifique et sponsor", "Résultats et limites distingués des attentes initiales")]
	},
	{
		id: "finance",
		title: "Finance, assurance et services professionnels",
		shortTitle: "Finance et services",
		accent: "#627065",
		scene: "interfaces",
		environments: [r("assurance", "Banque et assurance", "Processus et système de service", "Exigences → intégration → contrôles → déploiement", "Métiers, SI et contrôle interne", "Cas de contrôle convenus ; aucun conseil financier"), r("conseil", "Mission de services professionnels", "Dossier et livrables client", "Mandat → analyse → revue → remise", "Chef de mission et sponsor", "Périmètre de remise et réserves explicites")]
	},
	{
		id: "retail",
		title: "Retail, consommation, luxe et hospitalité",
		shortTitle: "Retail et hospitalité",
		accent: "#a77355",
		scene: "interfaces",
		environments: [r("hotel", "Ouverture d’un hôtel", "Service, recrutement et préparation des chambres", "Travaux → préparation → essais de service → ouverture", "Direction, exploitation et projet", "Chambres et fonctionnement acceptés avec réserves explicites"), r("commerce", "Réseau de points de vente", "Déploiement et expérience en magasin", "Concept → pilote → équipement → déploiement", "Retail, fournisseurs et équipes locales", "Pilote évalué et conditions de généralisation définies")]
	},
	{
		id: "transformation",
		title: "Transformation organisationnelle",
		shortTitle: "Transformation",
		accent: "#6f8776",
		scene: "interfaces",
		environments: [r("processus", "Processus et organisation", "Nouveau fonctionnement et rôles", "Diagnostic → conception → pratique → adoption", "Sponsor et propriétaires de processus", "Pratique observée et charge de transition soutenable"), r("change", "Conduite du changement", "Équipes et usages cibles", "Impacts → relais → expérimentation → suivi", "Managers, utilisateurs et équipe de changement", "Usage vérifié plutôt que simple présence en formation")]
	},
	{
		id: "innovation",
		title: "R&D, innovation et développement produit",
		shortTitle: "Innovation et produit",
		accent: "#887da4",
		scene: "interfaces",
		environments: [r("prototype", "Prototype et expérimentation", "Hypothèse et preuve expérimentale", "Hypothèse → protocole → résultat → décision", "Produit, recherche et sponsor", "Critère falsifiable et limites de validité explicites"), r("produit", "Développement et lancement produit", "Produit et capacité de livraison", "Conception → validation → industrialisation → lancement", "Produit, ingénierie et opérations", "Acceptation et dépendances de lancement convenues")]
	},
	{
		id: "agriculture",
		title: "Agriculture et agro-industrie",
		shortTitle: "Agro-industrie",
		accent: "#768643",
		scene: "interfaces",
		environments: [r("agricole", "Infrastructure agricole", "Équipements, saison et exploitation", "Préparation → disponibilité → installation → usage", "Exploitant, fournisseurs et projet", "Fenêtre d’intervention et disponibilité confirmées"), r("agro", "Transformation agro-industrielle", "Chaîne de production et qualité", "Approvisionnement → installation → essais → production", "Production, achats et qualité", "Contrôles documentés ; aucune instruction sanitaire")]
	},
	{
		id: "aerospatial",
		title: "Aéronautique, spatial et systèmes complexes",
		shortTitle: "Systèmes complexes",
		accent: "#71839a",
		scene: "interfaces",
		environments: [r("systeme", "Intégration d’un système complexe", "Sous-systèmes et configuration", "Références → interfaces → intégration → vérification", "Ingénierie système, fournisseurs et qualité", "Exigences et résultats de vérification liés ; aucune certification"), r("spatial", "Programme spatial", "Équipements et jalons d’intégration", "Fourniture → qualification documentaire → intégration → revue", "Responsable programme et responsables de sous-systèmes", "Écarts de configuration et autorités de décision traçables")]
	},
	{
		id: "personnalise",
		title: "Personnalisé et autre environnement",
		shortTitle: "Autre environnement",
		accent: "#727b76",
		scene: "interfaces",
		environments: [r("transversal", "Cas transversal fictif", "Un résultat, des acteurs et une contrainte", "Livrable amont → dépendance → acceptation", "Responsable du projet et sponsor", "Faits, hypothèses et demande de décision distincts")]
	}
];
function a(e, t, r) {
	let a = i.find((t) => t.id === e) ?? i[0];
	if (!a) throw Error("PROJECT_TAXONOMY_EMPTY");
	let o = a.environments.find((e) => e.id === t) ?? a.environments[0];
	if (!o) throw Error("PROJECT_ENVIRONMENT_EMPTY");
	let s = n.find((e) => e.id === r) ?? n[2];
	return {
		family: a,
		environment: o,
		phase: s,
		playable: a.id === "construction" && o.id === "hotel" && s.id === "realisation"
	};
}
function o(e, t, n) {
	let r = a(e, t, n);
	return `/univers/${r.family.id}?environnement=${r.environment.id}&phase=${r.phase.id}`;
}
//#endregion
//#region packages/ui/sector-scene.ts
var s = [
	"construction",
	"nucleaire",
	"robotique",
	"si-data",
	"industrie",
	"services-sante",
	"interfaces"
], c = {
	construction: [
		[
			-70,
			-62,
			56
		],
		[
			52,
			-63,
			38
		],
		[
			104,
			-20,
			8
		]
	],
	nucleaire: [
		[
			-65,
			-8,
			103
		],
		[
			46,
			-54,
			48
		],
		[
			70,
			64,
			32
		]
	],
	robotique: [
		[
			-50,
			-35,
			100
		],
		[
			58,
			-10,
			26
		],
		[
			141,
			-52,
			39
		]
	],
	"si-data": [
		[
			-84,
			-68,
			90
		],
		[
			-12,
			18,
			70
		],
		[
			54,
			-68,
			92
		]
	],
	industrie: [
		[
			-58,
			-45,
			62
		],
		[
			116,
			17,
			78
		],
		[
			8,
			84,
			21
		]
	],
	"services-sante": [
		[
			-85,
			-64,
			54
		],
		[
			-7,
			47,
			34
		],
		[
			115,
			39,
			25
		]
	],
	interfaces: [
		[
			-100,
			-35,
			62
		],
		[
			0,
			32,
			92
		],
		[
			100,
			-30,
			46
		]
	]
};
function l(e, t = -35, n = !1) {
	if (!s.includes(e) || !Number.isFinite(t) || Math.abs(t) > 3600 || typeof n != "boolean") throw RangeError("INVALID_SCENE_ANNOTATION");
	let r = t * Math.PI / 180;
	return (c[e] ?? []).map(([e, t, i], a) => ({
		number: a + 1,
		x: 380 + (e * Math.cos(r) - t * Math.sin(r)) * 1.55,
		y: 350 + ((e * Math.sin(r) + t * Math.cos(r)) * .42 - (i + (n && a < 2 ? 20 : 0)) * .9) * 1.55
	}));
}
var u = {
	roof: "var(--scene-roof, #e5eadc)",
	front: "var(--scene-front, #a8bba8)",
	side: "var(--scene-side, #647e6b)",
	dark: "var(--scene-dark, #294e3d)",
	accent: "var(--sector-accent, #b96b39)",
	glass: "var(--scene-glass, #86aaa3)",
	light: "var(--scene-light, #f2f2df)"
};
function d(e, t = {}) {
	if (!s.includes(e)) throw RangeError("UNKNOWN_SECTOR_SCENE");
	let n = t.angle ?? -35;
	if (!Number.isFinite(n) || Math.abs(n) > 3600) throw RangeError("INVALID_SCENE_ANGLE");
	if (t.exploded !== void 0 && typeof t.exploded != "boolean") throw RangeError("INVALID_SCENE_EXPLODED");
	if (t.annotated !== void 0 && typeof t.annotated != "boolean") throw RangeError("INVALID_SCENE_ANNOTATED");
	if (t.focused !== void 0 && ![
		1,
		2,
		3
	].includes(t.focused)) throw RangeError("INVALID_SCENE_FOCUS");
	let r = n * Math.PI / 180, i = Math.cos(r), a = Math.sin(r), o = t.exploded ? 20 : 0, c = [], d = ([e, t, n]) => (e * a + t * i) * .9 + n * .42, f = ([e, t, n]) => [380 + (e * i - t * a) * 1.55, 350 + ((e * a + t * i) * .42 - n * .9) * 1.55], p = (e) => f(e).map((e) => Number(e.toFixed(2))).join(","), m = (e, t) => c.push({
		points: e,
		tone: t,
		depth: e.reduce((e, t) => e + d(t), 0) / e.length
	});
	function h(e, t = u.front) {
		m([
			e[0],
			e[1],
			e[2],
			e[3]
		], u.side), m([
			e[0],
			e[1],
			e[5],
			e[4]
		], t), m([
			e[1],
			e[2],
			e[6],
			e[5]
		], u.side), m([
			e[2],
			e[3],
			e[7],
			e[6]
		], t), m([
			e[3],
			e[0],
			e[4],
			e[7]
		], u.side), m([
			e[4],
			e[5],
			e[6],
			e[7]
		], t === u.front ? u.roof : t);
	}
	function g(e, t, n, r, i, a, o = u.front) {
		h([
			[
				e,
				t,
				n
			],
			[
				e + r,
				t,
				n
			],
			[
				e + r,
				t + i,
				n
			],
			[
				e,
				t + i,
				n
			],
			[
				e,
				t,
				n + a
			],
			[
				e + r,
				t,
				n + a
			],
			[
				e + r,
				t + i,
				n + a
			],
			[
				e,
				t + i,
				n + a
			]
		], o);
	}
	function _(e, t, n, r, i, a = u.front) {
		let o = [], s = [];
		for (let a = 0; a < 20; a++) {
			let c = a * Math.PI / 10;
			o.push([
				e + r * Math.cos(c),
				t + r * Math.sin(c),
				n
			]), s.push([
				e + r * Math.cos(c),
				t + r * Math.sin(c),
				n + i
			]);
		}
		for (let e = 0; e < 20; e++) m([
			o[e],
			o[(e + 1) % 20],
			s[(e + 1) % 20],
			s[e]
		], e % 4 == 0 ? u.side : a);
		m(s, u.roof);
	}
	function v(e, t, n, r) {
		for (let i = 0; i < 6; i++) for (let a = 0; a < 20; a++) {
			let o = (i, a) => {
				let o = a * Math.PI / 10, s = i * Math.PI / 12;
				return [
					e + r * Math.cos(s) * Math.cos(o),
					t + r * Math.cos(s) * Math.sin(o),
					n + r * Math.sin(s)
				];
			};
			m([
				o(i, a),
				o(i, a + 1),
				o(i + 1, a + 1),
				o(i + 1, a)
			], i % 2 ? u.roof : u.front);
		}
	}
	function y(e, t, n, r = u.accent) {
		let i = t[0] - e[0], a = t[2] - e[2], o = Math.hypot(i, a) || 1, s = -a / o * n / 2, c = i / o * n / 2, l = n / 2;
		h([
			[
				e[0] - s,
				e[1] - l,
				e[2] - c
			],
			[
				e[0] + s,
				e[1] - l,
				e[2] + c
			],
			[
				e[0] + s,
				e[1] + l,
				e[2] + c
			],
			[
				e[0] - s,
				e[1] + l,
				e[2] - c
			],
			[
				t[0] - s,
				t[1] - l,
				t[2] - c
			],
			[
				t[0] + s,
				t[1] - l,
				t[2] + c
			],
			[
				t[0] + s,
				t[1] + l,
				t[2] + c
			],
			[
				t[0] - s,
				t[1] + l,
				t[2] - c
			]
		], r);
	}
	g(-175, -118, -9, 350, 236, 9, u.roof);
	let b = c.splice(0);
	if (e === "construction") {
		for (let e of [
			0,
			1,
			2
		]) {
			let t = e * (40 + o);
			if (g(-100, -63, t, 165, 113, 6), e < 2) for (let e of [
				-94,
				-20,
				54
			]) for (let n of [-56, 40]) g(e, n, t + 6, 6, 6, 34, u.light);
			if (e > 0) {
				g(-85, -61, t - 29, 130, 2, 23, u.glass);
				for (let e of [
					-83,
					-50,
					-17,
					16,
					47
				]) g(e, -63, t - 30, 2, 4, 26, u.dark);
			}
		}
		g(-105, -67, 90 + o * 2, 176, 120, 6, u.accent), g(84, -45, 0, 48, 75, 4, u.side);
		for (let e = 0; e < 5; e++) g(83 + e * 8, -45, 4 + e * 3, 8, 75, 3, u.light);
		g(-122, 65, 0, 235, 5, 3, u.dark);
	} else if (e === "nucleaire") {
		_(-67, -8, 0, 43, 65, u.front), v(-67, -8, 65 + o, 43), g(-10, -54, 0, 130, 90, 47), g(-14, -58, 47 + o, 138, 98, 7, u.accent);
		for (let e = 0; e < 6; e++) g(3 + e * 18, -57, 12, 10, 3, 20, u.glass);
		g(36, 51, 0, 74, 35, 30, u.front), g(32, 48, 30, 82, 41, 4, u.roof), _(-130, 61, 0, 12, 28, u.dark), _(-97, 66, 0, 10, 22, u.front), g(-145, -96, 0, 277, 4, 6, u.dark);
	} else if (e === "robotique") {
		g(-130, -76, 0, 246, 148, 7, u.dark), g(-115, -59, 9, 53, 48, 12, u.front), _(-89, -35, 21, 15, 14, u.accent), y([
			-89,
			-35,
			35
		], [
			-50,
			-35,
			93 + o
		], 17), _(-50, -35, 89 + o, 12, 11, u.dark), y([
			-50,
			-35,
			98 + o
		], [
			8,
			-35,
			67 + o
		], 14), y([
			8,
			-35,
			67 + o
		], [
			25,
			-35,
			49
		], 10, u.dark), g(21, -45, 34, 5, 5, 18, u.accent), g(21, -29, 34, 5, 5, 18, u.accent), g(-15, -20, 9, 118, 35, 11, u.front);
		for (let e = 0; e < 11; e++) g(-11 + e * 10, -22, 20, 5, 39, 3, u.dark);
		for (let e of [
			4,
			51,
			88
		]) g(e, -15, 24, 13, 22, 12, u.accent);
		for (let e of [-130, 110]) for (let t of [-76, 67]) g(e, t, 7, 4, 4, 110, u.dark);
		for (let e of [-76, 67]) g(-130, e, 117 + o, 244, 4, 4, u.front);
		for (let e of [-130, 110]) g(e, -76, 117 + o, 4, 147, 4, u.front);
		g(132, -55, 0, 22, 24, 47, u.front), g(132, -57, 31, 20, 2, 12, u.glass);
	} else if (e === "si-data") {
		for (let e = 0; e < 2; e++) for (let t = 0; t < 3; t++) {
			let n = -104 + t * 69, r = -68 + e * 86, i = t === 1 ? o : 0;
			g(n, r, i, 40, 40, 91, u.dark), g(n - 2, r - 2, i + 91, 44, 44, 3, u.accent);
			for (let e = 0; e < 6; e++) g(n + 4, r - 2, i + 9 + e * 12, 30, 2, 7, u.front), g(n + 27, r - 3, i + 11 + e * 12, 3, 1, 3, u.accent);
		}
		for (let e = 0; e < 3; e++) g(-110 + e * 69, -105, 1, 8, 207, 2, u.accent);
	} else if (e === "industrie") {
		g(-113, -59, 0, 199, 108, 48);
		for (let e = 0; e < 4; e++) {
			let t = -115 + e * 51;
			m([
				[
					t,
					-63,
					48 + o
				],
				[
					t + 40,
					-63,
					71 + o
				],
				[
					t + 40,
					54,
					71 + o
				],
				[
					t,
					54,
					48 + o
				]
			], u.roof), m([
				[
					t + 40,
					-63,
					71 + o
				],
				[
					t + 51,
					-63,
					48 + o
				],
				[
					t + 51,
					54,
					48 + o
				],
				[
					t + 40,
					54,
					71 + o
				]
			], u.glass);
		}
		for (let e of [
			-96,
			-45,
			6,
			57
		]) g(e, -62, 5, 27, 3, 30, u.dark);
		_(118, 17, 0, 17, 79, u.front), _(118, 65, 0, 17, 64, u.accent), g(-120, 78, 0, 197, 22, 4, u.dark);
		for (let e of [
			-95,
			-47,
			1,
			49
		]) g(e, 78, 4, 29, 22, 18, u.front);
	} else if (e === "interfaces") {
		for (let [e, t, n] of [
			[
				-125,
				-55,
				55
			],
			[
				-25,
				10,
				85
			],
			[
				75,
				-50,
				40
			]
		]) {
			g(e ?? 0, t ?? 0, 0, 50, 50, (n ?? 40) + o, u.front), g((e ?? 0) - 3, (t ?? 0) - 3, (n ?? 40) + o, 56, 56, 5, u.accent);
			for (let n = 0; n < 3; n++) g((e ?? 0) + 5, (t ?? 0) - 2, 10 + n * 12, 34, 3, 4, u.glass);
		}
		g(-98, -23, 3, 100, 5, 5, u.dark), g(-2, -23, 3, 5, 66, 5, u.dark), g(0, 39, 3, 102, 5, 5, u.dark), g(98, -27, 3, 5, 71, 5, u.dark);
	} else {
		g(-118, -62, 0, 184, 90, 53), g(-123, -67, 53 + o, 194, 100, 6, u.roof), g(-48, 28, 0, 72, 65, 28, u.front), g(-52, 25, 28 + o, 80, 71, 5, u.accent);
		for (let e = 0; e < 2; e++) for (let t = 0; t < 7; t++) g(-108 + t * 23, -65, 11 + e * 23, 14, 3, 14, u.glass);
		g(-32, 91, 0, 39, 3, 21, u.glass), g(-42, 98, 0, 60, 12, 3, u.light);
		for (let e of [100, 132]) _(e, -55, 0, 3, 23, u.dark), v(e, -55, 21, 17);
		g(93, 13, 0, 50, 50, 4, u.dark), g(104, 24, 4, 27, 27, 20, u.front);
	}
	let x = [];
	for (let e = -150; e <= 150; e += 30) x.push(`<path d="M${p([
		e,
		-105,
		1
	])}L${p([
		e,
		105,
		1
	])}M${p([
		-165,
		e * .65,
		1
	])}L${p([
		165,
		e * .65,
		1
	])}"/>`);
	let S = b.sort((e, t) => e.depth - t.depth).map((e) => `<polygon points="${e.points.map(p).join(" ")}" fill="${e.tone}"/>`).join(""), C = c.sort((e, t) => e.depth - t.depth).map((e) => `<polygon points="${e.points.map(p).join(" ")}" fill="${e.tone}"/>`).join(""), w = (e, t) => `<path d="M${p(e)}L${p(t)}"/>`, T = t.annotated ? l(e, n, t.exploded).map((e) => `<g data-scene-interface="${e.number}" transform="translate(${e.x.toFixed(2)} ${e.y.toFixed(2)})"><circle r="${t.focused === e.number ? 20 : 16}" fill="${t.focused === e.number ? u.accent : u.dark}" stroke="${u.light}" stroke-width="2"/><text text-anchor="middle" dy="5" fill="${u.light}" font-family="sans-serif" font-size="15" font-weight="700">${e.number}</text></g>`).join("") : "";
	return `<svg class="sector-scene" data-sector-scene="${e}" viewBox="0 0 760 520" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><ellipse cx="380" cy="399" rx="242" ry="65" fill="var(--scene-shadow, #21392b)" opacity=".09"/>${S}<g class="sector-scene__grid" fill="none" stroke="var(--scene-grid, #a5b9a5)" stroke-width=".7">${x.join("")}</g><g class="sector-scene__model" stroke="var(--scene-edge, #43634e)" stroke-width=".65" stroke-linejoin="round">${C}</g><g class="sector-scene__dimensions" fill="none" stroke="var(--sector-accent, #b96b39)" stroke-width="1" opacity=".7">${w([
		-174,
		138,
		0
	], [
		174,
		138,
		0
	])}${w([
		-174,
		132,
		0
	], [
		-174,
		144,
		0
	])}${w([
		174,
		132,
		0
	], [
		174,
		144,
		0
	])}${w([
		194,
		-115,
		0
	], [
		194,
		115,
		0
	])}${w([
		188,
		-115,
		0
	], [
		200,
		-115,
		0
	])}${w([
		188,
		115,
		0
	], [
		200,
		115,
		0
	])}</g>${T}</svg>`;
}
//#endregion
//#region packages/ui/sector-home.ts
var f = {
	construction: "construction",
	nucleaire: "energie",
	robotique: "robotique",
	"si-data": "numerique",
	industrie: "industrie",
	"services-sante": "sante"
}, p = (e, t) => e.map((e) => `<option value="${e.id}"${e.id === t ? " selected" : ""}>${e.title}</option>`).join("");
function m() {
	let t = a();
	return `<section class="world-home wrap" aria-labelledby="world-home-title">
    <div class="world-heading"><div><p class="eyebrow">PMERSION / STUDIO DE DÉCISION</p><h1 id="world-home-title">Vos décisions<br><em>prennent forme.</em></h1></div><div class="world-heading-copy"><p>Un projet a des lieux, des équipes et des interfaces. Explorez votre terrain, examinez les pièces et construisez une décision que vous pouvez défendre.</p><a class="world-context-link" href="/beta/#/mission/construction">Examiner le cas de l’hôtel →</a><p class="world-caption">Accessible sans compte · Cas fictifs · Une mission approfondie et des ateliers</p></div></div>
    <div class="world-studio" style="--sector-accent:${t.family.accent}">
      <div class="world-selector"><p>VOTRE TERRAIN DE PROJET</p><div class="world-hierarchy">
        <label for="home-domain">Domaine<select id="home-domain" data-world-family disabled>${p(i, t.family.id)}</select></label>
        <label for="home-environment">Environnement<select id="home-environment" data-world-environment disabled>${p(t.family.environments, t.environment.id)}</select></label>
        <label for="home-phase">Phase<select id="home-phase" data-world-phase disabled>${p(n, t.phase.id)}</select></label>
        </div><p class="world-quick-label">SIX MAQUETTES ILLUSTRÉES</p><div class="world-quick" role="group" aria-label="Accès aux maquettes sectorielles">${e.map((e) => `<button type="button" data-world-sector="${e.slug}" aria-pressed="${e.slug === "construction"}" disabled><span>${e.shortTitle}</span><b aria-hidden="true">↗</b></button>`).join("")}</div></div>
      <div class="world-model world-enter" id="world-home-model"><div data-world-scene aria-hidden="true">${d(t.family.scene, {
		annotated: !0,
		focused: 1
	})}</div><span class="world-model-label">MODÈLE DE CONTEXTE / INTERFACES NUMÉROTÉES</span></div>
      <div class="world-context"><p class="eyebrow" data-world-kicker>${t.phase.title}</p><div aria-live="polite" aria-atomic="true"><h2 data-world-title>${t.family.shortTitle}</h2><p data-world-description>${t.environment.object}</p><p class="world-coverage" data-world-coverage>Mission Hôtel disponible · Arbitrage fournisseur</p></div><a data-world-open href="/beta/#${o(t.family.id, t.environment.id, t.phase.id)}">Ouvrir ce dossier <span aria-hidden="true">↗</span></a><div class="world-tools" role="group" aria-label="Explorer la maquette"><button type="button" data-world-turn disabled>Tourner ↻</button><button type="button" data-world-explode aria-pressed="false" disabled>Séparer les volumes</button></div></div>
    </div><div class="world-interface-reading"><div class="world-tools" role="group" aria-label="Lire les interfaces du contexte"><button type="button" data-world-interface="1" aria-pressed="true" disabled>1 · Objet</button><button type="button" data-world-interface="2" aria-pressed="false" disabled>2 · Dépendances</button><button type="button" data-world-interface="3" aria-pressed="false" disabled>3 · Acceptation</button></div><p data-world-focus aria-live="polite">${t.environment.object}. Acteurs : ${t.environment.owner}.</p></div>
    <div class="world-studio-footer"><span>17 familles · Domaine, environnement et phase · Couverture indiquée dans chaque dossier</span><a href="/beta/#/secteurs">Explorer tous les domaines →</a></div>
    <noscript><p>La sélection interactive nécessite JavaScript. Retrouvez les 17 familles dans <a href="/beta/#/secteurs">le catalogue de projet</a>. Le cas et le plan ci-dessous restent lisibles.</p></noscript>
  </section>`;
}
function h(e) {
	let n = a(), r = -35, i = !1, s = 1, c = e.querySelector("[data-world-scene]"), l = e.querySelector(".world-studio"), u = [...e.querySelectorAll("[data-world-sector]")], m = [...e.querySelectorAll("[data-world-interface]")], h = e.querySelector("[data-world-family]"), g = e.querySelector("[data-world-environment]"), _ = e.querySelector("[data-world-phase]"), v = e.querySelector("[data-world-turn]"), y = e.querySelector("[data-world-explode]"), b = e.querySelector("[data-world-open]");
	if (!c || !l || !h || !g || !_ || !v || !y || !b) return () => {};
	let x = matchMedia("(prefers-reduced-motion: reduce)"), S, C = () => S?.cancel(), w = () => {
		(x.matches || document.documentElement.dataset.motion === "reduced") && C();
	}, T = new MutationObserver(w);
	T.observe(document.documentElement, {
		attributes: !0,
		attributeFilter: ["data-motion"]
	}), x.addEventListener("change", w), window.addEventListener("pagehide", C);
	let E = () => {
		C(), c.innerHTML = d(n.family.scene, {
			angle: r,
			exploded: i,
			annotated: !0,
			focused: s
		}), l.style.setProperty("--sector-accent", n.family.accent), h.value = n.family.id, g.innerHTML = p(n.family.environments, n.environment.id), _.value = n.phase.id;
		let t = [
			`${n.environment.object}. Acteurs : ${n.environment.owner}.`,
			`${n.environment.interface}. ${n.phase.question}`,
			`${n.environment.acceptance}. Un contrôle prévu n’est pas une acceptation démontrée.`
		];
		for (let [r, i] of [
			["[data-world-kicker]", n.phase.title],
			["[data-world-title]", n.family.shortTitle],
			["[data-world-description]", n.environment.object],
			["[data-world-coverage]", n.playable ? "Mission Hôtel disponible · Arbitrage fournisseur" : "Dossier de contexte · Moteur spécifique en préparation"],
			["[data-world-focus]", t[s - 1] ?? t[0] ?? ""]
		]) {
			let t = e.querySelector(r);
			t && (t.textContent = i);
		}
		b.href = `/beta/#${o(n.family.id, n.environment.id, n.phase.id)}`, b.setAttribute("aria-label", `Ouvrir le dossier ${n.environment.title}`), y.setAttribute("aria-pressed", String(i));
		for (let e of u) e.setAttribute("aria-pressed", String(f[e.dataset.worldSector ?? ""] === n.family.id));
		for (let e of m) e.setAttribute("aria-pressed", String(Number(e.dataset.worldInterface) === s));
		!x.matches && document.documentElement.dataset.motion !== "reduced" && (S = c.animate([{
			opacity: .55,
			transform: "translateY(7px)"
		}, {
			opacity: 1,
			transform: "translateY(0)"
		}], {
			duration: 420,
			easing: "cubic-bezier(.22,.68,.25,1)"
		}));
	}, D = () => {
		r = -35, i = !1, s = 1;
	}, O = (e) => {
		let r = e.currentTarget.dataset.worldSector ?? "";
		t(r) && (n = a(f[r]), D(), E());
	}, k = () => {
		n = a(h.value), D(), E();
	}, A = () => {
		n = a(n.family.id, g.value, _.value), D(), E();
	}, j = () => {
		n = a(n.family.id, n.environment.id, _.value), E();
	}, M = (e) => {
		let t = Number(e.currentTarget.dataset.worldInterface);
		[
			1,
			2,
			3
		].includes(t) && (s = t, E());
	}, N = () => {
		r = r >= 235 ? -35 : r + 90, E();
	}, P = () => {
		i = !i, E();
	};
	for (let e of u) e.disabled = !1, e.addEventListener("click", O);
	for (let e of m) e.disabled = !1, e.addEventListener("click", M);
	for (let e of [
		h,
		g,
		_
	]) e.disabled = !1;
	return h.addEventListener("change", k), g.addEventListener("change", A), _.addEventListener("change", j), v.disabled = !1, y.disabled = !1, v.addEventListener("click", N), y.addEventListener("click", P), () => {
		C(), T.disconnect(), x.removeEventListener("change", w), window.removeEventListener("pagehide", C);
		for (let e of u) e.removeEventListener("click", O);
		for (let e of m) e.removeEventListener("click", M);
		h.removeEventListener("change", k), g.removeEventListener("change", A), _.removeEventListener("change", j), v.removeEventListener("click", N), y.removeEventListener("click", P);
	};
}
if (typeof document < "u") {
	let e = document.getElementById("home-project-worlds");
	e && h(e);
}
//#endregion
export { h as mountSectorHome, m as renderSectorHome };
