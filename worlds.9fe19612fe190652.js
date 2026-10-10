//#region packages/content/project-taxonomy.ts
var e = [
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
], t = [
	{
		id: "agriculture",
		classificationSection: "A",
		title: "Agriculture, forêt et pêche",
		shortTitle: "Agriculture, forêt et pêche",
		summary: "Production végétale et animale, exploitation forestière, pêche et aquaculture. La transformation alimentaire relève de l’industrie.",
		accent: "#4D3FC4",
		scene: "interfaces",
		environments: [
			{
				id: "agricole",
				title: "Infrastructure agricole",
				object: "Équipements, saison et exploitation",
				interface: "Préparation → disponibilité → installation → usage",
				owner: "Exploitant, fournisseurs et projet",
				acceptance: "Fenêtre d’intervention et disponibilité confirmées"
			},
			{
				id: "foret",
				title: "Exploitation forestière",
				object: "Parcelles, accès et calendrier de récolte",
				interface: "Autorisation → accès → intervention → remise du site",
				owner: "Exploitant forestier, propriétaires et prestataires",
				acceptance: "Interventions et remise du site contrôlées"
			},
			{
				id: "aquaculture",
				title: "Projet aquacole",
				object: "Équipements d’élevage et continuité de production",
				interface: "Approvisionnement → installation → essais → exploitation",
				owner: "Exploitant, fournisseurs et équipe de projet",
				acceptance: "Capacité et conditions d’exploitation documentées"
			}
		]
	},
	{
		id: "extraction",
		classificationSection: "B",
		title: "Extraction minière et carrières",
		shortTitle: "Mines et carrières",
		summary: "Extraction de minerais, pierres et ressources brutes, avec les services de soutien associés. Leur transformation relève de l’industrie.",
		accent: "#A65C35",
		scene: "interfaces",
		environments: [{
			id: "carriere",
			title: "Modernisation d’une carrière",
			object: "Installations d’extraction et flux de matériaux",
			interface: "Études → équipements → essais → remise à l’exploitant",
			owner: "Exploitant, ingénierie et fournisseurs",
			acceptance: "Capacité, contrôles et responsabilités de remise documentés"
		}, {
			id: "mine",
			title: "Déploiement d’un site minier",
			object: "Lots d’équipements et accès au site",
			interface: "Autorisations → accès → installation → essais",
			owner: "Responsable de site, entreprises et exploitant",
			acceptance: "Jalons et résultats de contrôle traçables"
		}]
	},
	{
		id: "industrie",
		classificationSection: "C",
		title: "Industrie manufacturière",
		shortTitle: "Industrie manufacturière",
		summary: "Fabrication et transformation de biens : alimentation, chimie, pharmacie, machines, robotique, véhicules, aéronautique et spatial.",
		accent: "#B34842",
		scene: "industrie",
		context: "industrie",
		environments: [
			{
				id: "ligne",
				title: "Ligne de production",
				object: "Équipements et capacité de production",
				interface: "Commande → intégration → essais → montée en cadence",
				owner: "Achats, intégrateur, production et qualité",
				acceptance: "Capacité répétable dans les conditions du site"
			},
			{
				id: "process",
				title: "Site de process",
				object: "Installation et interfaces de procédés",
				interface: "Conception → installation → essais → transfert",
				owner: "Ingénierie, fournisseur et exploitation",
				acceptance: "Périmètre comparable et conditions de transfert documentées"
			},
			{
				id: "cellule",
				title: "Cellule robotisée",
				object: "Robot, vision et convoyeur",
				interface: "Interfaces → intégration → essais variés → cadence",
				owner: "Intégrateur, production et qualité",
				acceptance: "Essais sur variations représentatives ; aucune qualification machine",
				scene: "robotique",
				context: "robotique"
			},
			{
				id: "systeme",
				title: "Intégration d’un système complexe",
				object: "Sous-systèmes et configuration",
				interface: "Références → interfaces → intégration → vérification",
				owner: "Ingénierie système, fournisseurs et qualité",
				acceptance: "Exigences et résultats de vérification liés ; aucune certification"
			},
			{
				id: "spatial",
				title: "Programme spatial",
				object: "Équipements et jalons d’intégration",
				interface: "Fourniture → qualification documentaire → intégration → revue",
				owner: "Responsable programme et responsables de sous-systèmes",
				acceptance: "Écarts de configuration et autorités de décision traçables"
			},
			{
				id: "agro",
				title: "Transformation agro-industrielle",
				object: "Chaîne de production et qualité",
				interface: "Approvisionnement → installation → essais → production",
				owner: "Production, achats et qualité",
				acceptance: "Contrôles documentés ; aucune instruction sanitaire"
			},
			{
				id: "life-sciences",
				title: "Développement pharmaceutique",
				object: "Livrables et dossier de qualification",
				interface: "Conception → protocoles → résultats → revue",
				owner: "Projet, qualité et autorités désignées",
				acceptance: "Traçabilité documentaire ; aucune validation réglementaire"
			}
		]
	},
	{
		id: "energie",
		classificationSection: "D",
		title: "Électricité, gaz et réseaux de chaleur",
		shortTitle: "Énergie",
		summary: "Production et distribution d’électricité, de gaz, de vapeur et de chaleur. L’eau, les déchets et la dépollution ont leur propre secteur.",
		accent: "#3C5EAC",
		scene: "nucleaire",
		context: "nucleaire",
		environments: [
			{
				id: "nucleaire",
				title: "Projet nucléaire",
				object: "Configuration documentaire et équipements",
				interface: "Référence applicable → interfaces → revue habilitée",
				owner: "Responsables habilités du projet et fournisseurs",
				acceptance: "Versions et questions ouvertes traçables ; aucune qualification de sûreté",
				scene: "nucleaire"
			},
			{
				id: "renouvelables",
				title: "Production renouvelable",
				object: "Production et raccordement",
				interface: "Équipements → raccordement → essais → exploitation",
				owner: "Développeur, gestionnaire de réseau et exploitant",
				acceptance: "Conditions d’essais et de raccordement confirmées"
			},
			{
				id: "utilities",
				title: "Réseaux électriques, gaz et chaleur",
				object: "Réseau et services associés",
				interface: "Travaux → contrôles → bascule → service",
				owner: "Gestionnaire de réseau et équipes d’exploitation",
				acceptance: "Conditions de transition et continuité convenues"
			}
		]
	},
	{
		id: "eau-environnement",
		classificationSection: "E",
		title: "Eau, déchets et dépollution",
		shortTitle: "Eau et environnement",
		summary: "Captage et distribution d’eau, assainissement, collecte, traitement des déchets, valorisation et remise en état des sites.",
		accent: "#81518D",
		scene: "interfaces",
		environments: [
			{
				id: "eau",
				title: "Réseau d’eau et assainissement",
				object: "Ouvrages, réseau et continuité du service",
				interface: "Travaux → essais → bascule → remise en service",
				owner: "Gestionnaire, collectivité et entreprise",
				acceptance: "Résultats d’essais et conditions de continuité acceptés"
			},
			{
				id: "dechets",
				title: "Centre de traitement des déchets",
				object: "Équipements de tri, traitement et valorisation",
				interface: "Approvisionnement → intégration → essais de flux → exploitation",
				owner: "Exploitant, fournisseurs et responsable de projet",
				acceptance: "Capacité et critères de réception documentés"
			},
			{
				id: "depollution",
				title: "Remise en état d’un site",
				object: "Zones d’intervention et contrôles de restitution",
				interface: "Diagnostic → intervention → contrôles → restitution",
				owner: "Maître d’ouvrage, entreprise et autorités désignées",
				acceptance: "Résultats de contrôle liés au périmètre convenu"
			}
		]
	},
	{
		id: "construction",
		classificationSection: "F",
		title: "Construction et génie civil",
		shortTitle: "Construction",
		summary: "Travaux de bâtiments, ouvrages d’art, infrastructures et réseaux. Le conseil en architecture relève des services professionnels ; l’exploitation immobilière a son propre secteur.",
		accent: "#946312",
		scene: "construction",
		context: "construction",
		environments: [
			{
				id: "hotel",
				title: "Rénovation d’un hôtel",
				object: "120 chambres · lot menuiseries extérieures",
				interface: "Fourniture → hors d’eau → doublages → finitions",
				owner: "Architecte, BET, entreprise et maître d’ouvrage",
				acceptance: "Échantillon, performances prescrites et réception du lot"
			},
			{
				id: "bureaux",
				title: "Immeuble de bureaux",
				object: "Plateaux et lots techniques",
				interface: "Structure → réservations → équipements → essais",
				owner: "Maîtrise d’œuvre et responsables de lots",
				acceptance: "Interfaces et essais documentés avant occupation"
			},
			{
				id: "logements",
				title: "Programme de logements",
				object: "Bâtiments, parties communes et livraisons",
				interface: "Approvisionnement → pose → contrôles → réception",
				owner: "Maîtrise d’ouvrage, entreprises et contrôleur qualité",
				acceptance: "Réserves attribuées et critères de réception vérifiés"
			},
			{
				id: "ouvrage",
				title: "Ouvrage d’art",
				object: "Ouvrage et raccordements",
				interface: "Études → ouvrages provisoires → travaux → contrôles",
				owner: "Maîtrise d’œuvre, entreprise et exploitant",
				acceptance: "Dossier de contrôle et conditions de remise à l’exploitant"
			},
			{
				id: "reseaux",
				title: "Réseaux et aménagement urbain",
				object: "Réseaux et zones d’intervention",
				interface: "Autorisations → déviations → travaux → remise en service",
				owner: "Collectivité, concessionnaires et entreprise",
				acceptance: "Continuité de service et réception par les responsables"
			}
		]
	},
	{
		id: "retail",
		classificationSection: "G",
		title: "Commerce de gros et de détail",
		shortTitle: "Commerce",
		summary: "Distribution et vente de biens en magasin, à distance ou entre entreprises. La fabrication, le transport et l’hôtellerie restent dans leurs secteurs respectifs.",
		accent: "#4D3FC4",
		scene: "interfaces",
		environments: [
			{
				id: "commerce",
				title: "Réseau de points de vente",
				object: "Déploiement et expérience en magasin",
				interface: "Concept → pilote → équipement → déploiement",
				owner: "Retail, fournisseurs et équipes locales",
				acceptance: "Pilote évalué et conditions de généralisation définies"
			},
			{
				id: "ecommerce",
				title: "Déploiement d’un commerce en ligne",
				object: "Catalogue, commandes et fonctionnement commercial",
				interface: "Catalogue → interfaces → commandes tests → ouverture",
				owner: "Équipe commerciale, SI et opérations",
				acceptance: "Commandes, retours et responsabilités de service vérifiés"
			},
			{
				id: "grossiste",
				title: "Plateforme de distribution en gros",
				object: "Catalogue professionnel et circuit de commandes",
				interface: "Fournisseurs → catalogue → préparation → livraison",
				owner: "Achats, commercial et responsables de distribution",
				acceptance: "Disponibilité et circuit de commande confirmés"
			}
		]
	},
	{
		id: "transport",
		classificationSection: "H",
		title: "Transport et entreposage",
		shortTitle: "Transport et logistique",
		summary: "Transport de voyageurs et de marchandises, entreposage, logistique, activités postales et de courrier. La construction des infrastructures reste distincte.",
		accent: "#A65C35",
		scene: "interfaces",
		environments: [
			{
				id: "mobilite",
				title: "Mobilité et exploitation",
				object: "Système, infrastructures et services",
				interface: "Travaux → interfaces → essais → service",
				owner: "Exploitant, autorités du projet et intégrateurs",
				acceptance: "Conditions de mise en service et responsabilités clarifiées"
			},
			{
				id: "supply",
				title: "Supply chain et logistique",
				object: "Flux et capacité de livraison",
				interface: "Fourniture → réception → stock → distribution",
				owner: "Achats, fournisseurs et opérations",
				acceptance: "Délais et capacités documentés sur le même périmètre"
			},
			{
				id: "automatisation",
				title: "Automatisation logistique",
				object: "Flux, équipements et orchestration",
				interface: "Données → interfaces → essais de flux → exploitation",
				owner: "Intégrateur et responsable logistique",
				acceptance: "Scénarios de flux et récupération des exceptions vérifiés",
				scene: "robotique"
			},
			{
				id: "poste",
				title: "Modernisation d’un réseau postal",
				object: "Tri, tournées et services de livraison",
				interface: "Préparation → pilote → contrôles de flux → déploiement",
				owner: "Exploitation, équipes locales et fournisseurs",
				acceptance: "Délais et gestion des exceptions vérifiés"
			}
		]
	},
	{
		id: "hospitalite",
		classificationSection: "I",
		title: "Hébergement et restauration",
		shortTitle: "Hôtellerie et restauration",
		summary: "Exploitation d’hôtels, d’hébergements et de restaurants. Les travaux d’un bâtiment hôtelier sont un projet de construction distinct.",
		accent: "#B34842",
		scene: "interfaces",
		environments: [{
			id: "hotel",
			title: "Ouverture d’un hôtel",
			object: "Service, recrutement et préparation des chambres",
			interface: "Travaux → préparation → essais de service → ouverture",
			owner: "Direction, exploitation et projet",
			acceptance: "Chambres et fonctionnement acceptés avec réserves explicites"
		}, {
			id: "restaurant",
			title: "Ouverture d’un restaurant",
			object: "Équipe, équipements et préparation du service",
			interface: "Livraison → préparation → essais de service → ouverture",
			owner: "Direction, exploitation et fournisseurs",
			acceptance: "Organisation et essais de service acceptés"
		}]
	},
	{
		id: "medias",
		classificationSection: "J",
		title: "Édition, médias et production de contenus",
		shortTitle: "Médias et édition",
		summary: "Édition, audiovisuel, diffusion et distribution de contenus. Les télécommunications et services informatiques appartiennent au secteur numérique.",
		accent: "#3C5EAC",
		scene: "interfaces",
		environments: [{
			id: "edition",
			title: "Lancement d’une publication",
			object: "Contenus, droits et calendrier de diffusion",
			interface: "Commande → édition → validation → publication",
			owner: "Éditeur, auteurs et responsable de production",
			acceptance: "Droits, versions et calendrier de publication confirmés"
		}, {
			id: "audiovisuel",
			title: "Production audiovisuelle",
			object: "Équipe, tournage et livrables de diffusion",
			interface: "Préparation → production → postproduction → livraison",
			owner: "Production, prestataires et diffuseur",
			acceptance: "Livrables et autorisations de diffusion documentés"
		}]
	},
	{
		id: "numerique",
		classificationSection: "K",
		title: "Télécommunications et services informatiques",
		shortTitle: "Numérique et télécoms",
		summary: "Télécommunications, logiciels, conseil informatique, infrastructures numériques et services d’information. Data et IA sont des types de projets de ce secteur, sans carte en double.",
		accent: "#81518D",
		scene: "si-data",
		context: "si-data",
		environments: [
			{
				id: "erp",
				title: "ERP et finance",
				object: "Processus, référentiels et clôture",
				interface: "Reprise → rapprochement → recette métier → bascule",
				owner: "Finance, métiers et responsable SI",
				acceptance: "Rapprochements et cas de clôture documentés"
			},
			{
				id: "crm",
				title: "CRM",
				object: "Relation client et interfaces commerciales",
				interface: "Référentiels → interfaces → recette → adoption",
				owner: "Métiers, SI et responsables des données",
				acceptance: "Cas métiers, droits et qualité de reprise vérifiés"
			},
			{
				id: "sirh",
				title: "SIRH",
				object: "Processus RH et interfaces",
				interface: "Paramétrage → reprise fictive → recette → transition",
				owner: "RH, SI et propriétaire du processus",
				acceptance: "Cas d’usage et droits vérifiés sans données personnelles réelles"
			},
			{
				id: "cloud",
				title: "Cloud et cybersécurité",
				object: "Migration technique et fonctionnement métier",
				interface: "Inventaire → dépendances → essais → retour arrière",
				owner: "SI, sécurité et exploitation",
				acceptance: "Conditions de bascule et reprise démontrées"
			},
			{
				id: "bi",
				title: "BI et analytique",
				object: "Indicateurs et décisions métier",
				interface: "Sources → transformations → rapprochements → validation",
				owner: "Data owners et métier",
				acceptance: "Définitions et contrôles des indicateurs traçables"
			},
			{
				id: "qualite",
				title: "Qualité des données et MDM",
				object: "Référentiels et exceptions",
				interface: "Profilage → règles → correction → validation",
				owner: "Responsable de données et propriétaire métier",
				acceptance: "Exceptions expliquées et règles versionnées"
			},
			{
				id: "ia",
				title: "Produit IA",
				object: "Cas d’usage et dossier d’évaluation",
				interface: "Données → évaluation → revue → intégration",
				owner: "Produit, équipe data et autorité de validation",
				acceptance: "Jeu d’évaluation et limites explicités ; aucune certification"
			},
			{
				id: "telecom",
				title: "Déploiement d’un réseau télécom",
				object: "Sites, équipements et couverture du service",
				interface: "Équipements → raccordements → essais → activation",
				owner: "Opérateur, fournisseurs et exploitant",
				acceptance: "Couverture et conditions de service vérifiées"
			}
		]
	},
	{
		id: "finance",
		classificationSection: "L",
		title: "Finance et assurance",
		shortTitle: "Finance et assurance",
		summary: "Banque, assurance, fonds et services financiers auxiliaires. Le conseil en gestion et la comptabilité relèvent des services professionnels.",
		accent: "#946312",
		scene: "interfaces",
		environments: [{
			id: "banque",
			title: "Transformation d’un service bancaire",
			object: "Processus de service et contrôles associés",
			interface: "Exigences → intégration → recette → mise en service",
			owner: "Métiers, SI et contrôle interne",
			acceptance: "Cas métier et contrôles convenus documentés"
		}, {
			id: "assurance",
			title: "Transformation d’un service d’assurance",
			object: "Processus et système de service",
			interface: "Exigences → intégration → contrôles → déploiement",
			owner: "Métiers, SI et contrôle interne",
			acceptance: "Cas de contrôle convenus ; aucun conseil financier"
		}]
	},
	{
		id: "immobilier",
		classificationSection: "M",
		title: "Activités immobilières",
		shortTitle: "Immobilier",
		summary: "Transaction, location et gestion de biens immobiliers. Les travaux sont classés en construction et l’exploitation hôtelière en hébergement.",
		accent: "#4D3FC4",
		scene: "interfaces",
		environments: [{
			id: "gestion",
			title: "Transformation de la gestion immobilière",
			object: "Patrimoine, contrats et processus de gestion",
			interface: "Inventaire → rapprochement → pilote → déploiement",
			owner: "Gestionnaire, propriétaire et prestataires",
			acceptance: "Périmètre du patrimoine et responsabilités validés"
		}, {
			id: "commercialisation",
			title: "Commercialisation d’un actif",
			object: "Dossier, disponibilité et parcours de remise",
			interface: "Dossier → revue → commercialisation → remise",
			owner: "Propriétaire, gestionnaire et commercialisateur",
			acceptance: "Documents et conditions de remise cohérents"
		}]
	},
	{
		id: "services-professionnels",
		classificationSection: "N",
		title: "Services professionnels, scientifiques et techniques",
		shortTitle: "Conseil, ingénierie et recherche",
		summary: "Architecture et ingénierie, recherche, conseil en gestion, droit, comptabilité, publicité et activités vétérinaires. Les technologies et méthodes restent des types de projets.",
		accent: "#A65C35",
		scene: "interfaces",
		environments: [
			{
				id: "conseil",
				title: "Mission de services professionnels",
				object: "Dossier et livrables client",
				interface: "Mandat → analyse → revue → remise",
				owner: "Chef de mission et sponsor",
				acceptance: "Périmètre de remise et réserves explicites"
			},
			{
				id: "architecture",
				title: "Étude d’architecture et d’ingénierie",
				object: "Dossier de conception et interfaces entre disciplines",
				interface: "Besoins → études → coordination → remise du dossier",
				owner: "Architecte, BET et maître d’ouvrage",
				acceptance: "Versions et réserves du dossier liées à la commande"
			},
			{
				id: "recherche",
				title: "Programme de recherche",
				object: "Hypothèses, protocoles et résultats expérimentaux",
				interface: "Hypothèse → protocole → résultats → revue",
				owner: "Équipe scientifique, partenaires et sponsor",
				acceptance: "Résultats, limites et conditions de reproductibilité documentés"
			},
			{
				id: "prototype",
				title: "Recherche et expérimentation de prototype",
				object: "Hypothèse et preuve expérimentale",
				interface: "Hypothèse → protocole → résultat → décision",
				owner: "Produit, recherche et sponsor",
				acceptance: "Critère falsifiable et limites de validité explicites"
			},
			{
				id: "produit",
				title: "Conception d’un produit pour un client",
				object: "Produit et capacité de livraison",
				interface: "Conception → validation → industrialisation → lancement",
				owner: "Produit, ingénierie et opérations",
				acceptance: "Acceptation et dépendances de lancement convenues"
			},
			{
				id: "processus",
				title: "Conseil en processus et organisation",
				object: "Nouveau fonctionnement et rôles",
				interface: "Diagnostic → conception → pratique → adoption",
				owner: "Sponsor et propriétaires de processus",
				acceptance: "Pratique observée et charge de transition soutenable"
			},
			{
				id: "change",
				title: "Conseil en conduite du changement",
				object: "Équipes et usages cibles",
				interface: "Impacts → relais → expérimentation → suivi",
				owner: "Managers, utilisateurs et équipe de changement",
				acceptance: "Usage vérifié plutôt que simple présence en formation"
			},
			{
				id: "transversal",
				title: "Mission de conseil sur mesure",
				object: "Un résultat, des acteurs et une contrainte",
				interface: "Livrable amont → dépendance → acceptation",
				owner: "Responsable du projet et sponsor",
				acceptance: "Faits, hypothèses et demande de décision distincts"
			},
			{
				id: "veterinaire",
				title: "Transformation d’un service vétérinaire",
				object: "Organisation, équipements et continuité du service",
				interface: "Préparation → disponibilité → pilote → transition",
				owner: "Direction, équipes et responsable du fonctionnement",
				acceptance: "Organisation et continuité convenues"
			}
		]
	},
	{
		id: "services-support",
		classificationSection: "O",
		title: "Services administratifs et de soutien",
		shortTitle: "Services aux organisations",
		summary: "Location, emploi, agences de voyages, sécurité privée, nettoyage, organisation d’événements professionnels et soutien administratif.",
		accent: "#B34842",
		scene: "interfaces",
		environments: [
			{
				id: "emploi",
				title: "Déploiement d’un service de recrutement",
				object: "Équipes, processus et circuit de candidatures fictives",
				interface: "Besoins → préparation → pilote → déploiement",
				owner: "Direction, responsables de processus et équipes",
				acceptance: "Rôles, délais et cas d’usage documentés"
			},
			{
				id: "facility",
				title: "Coordination de services sur site",
				object: "Prestations, accès et continuité des locaux",
				interface: "Planification → mobilisation → intervention → contrôle",
				owner: "Gestionnaire de site et responsables de prestations",
				acceptance: "Périmètre et preuves de réalisation acceptés"
			},
			{
				id: "voyages",
				title: "Transformation d’un service de voyages",
				object: "Réservations et services aux voyageurs",
				interface: "Offres → interfaces → essais → mise en service",
				owner: "Agence, prestataires et équipes de service",
				acceptance: "Réservations et gestion des exceptions vérifiées"
			}
		]
	},
	{
		id: "public",
		classificationSection: "P",
		title: "Administration publique, défense et protection sociale",
		shortTitle: "Administration et défense",
		summary: "Services administratifs, justice, sécurité, défense et sécurité sociale obligatoire. L’enseignement et la santé publics restent dans leurs secteurs d’activité.",
		accent: "#3C5EAC",
		scene: "interfaces",
		environments: [
			{
				id: "service",
				title: "Service public",
				object: "Service et partenaires de déploiement",
				interface: "Mandat → préparation → pilote → déploiement",
				owner: "Sponsor, équipes et partenaires",
				acceptance: "Bénéfice attendu, responsabilités et critères de passage explicités"
			},
			{
				id: "defense",
				title: "Coordination d’un programme de défense",
				object: "Livrables non sensibles, configuration et autorités de décision",
				interface: "Mandat → références → interfaces → revue",
				owner: "Sponsor, responsables habilités et fournisseurs",
				acceptance: "Versions et décisions traçables dans un cas fictif"
			},
			{
				id: "protection-sociale",
				title: "Transformation d’un service de protection sociale",
				object: "Processus et circuit de traitement fictif",
				interface: "Exigences → préparation → recette → déploiement",
				owner: "Organisme, métiers et responsable SI",
				acceptance: "Cas de traitement et responsabilités vérifiés sans données réelles"
			}
		]
	},
	{
		id: "education",
		classificationSection: "Q",
		title: "Enseignement et formation",
		shortTitle: "Enseignement et formation",
		summary: "Enseignement scolaire, supérieur, professionnel et autres services éducatifs, indépendamment du caractère public ou privé de l’établissement.",
		accent: "#81518D",
		scene: "interfaces",
		environments: [{
			id: "education",
			title: "Déploiement d’un programme pédagogique",
			object: "Programme, équipements et usages pédagogiques",
			interface: "Besoins → moyens → expérimentation → bilan",
			owner: "Équipe pédagogique et sponsor",
			acceptance: "Résultats et limites distingués des attentes initiales"
		}, {
			id: "campus",
			title: "Transformation d’un campus",
			object: "Services aux étudiants et équipements du campus",
			interface: "Besoins → préparation → essais d’usage → transition",
			owner: "Direction, équipes pédagogiques et services du campus",
			acceptance: "Usage, disponibilité et responsabilités de transition vérifiés"
		}]
	},
	{
		id: "sante",
		classificationSection: "R",
		title: "Santé humaine et action sociale",
		shortTitle: "Santé et médico-social",
		summary: "Services de santé, établissements médico-sociaux et action sociale. La fabrication pharmaceutique relève de l’industrie manufacturière.",
		accent: "#946312",
		scene: "services-sante",
		context: "services-sante",
		environments: [{
			id: "etablissement",
			title: "Transformation d’un établissement",
			object: "Organisation et continuité du service",
			interface: "Préparation → disponibilité → pilote → transition",
			owner: "Direction, équipes et propriétaire du fonctionnement",
			acceptance: "Charge et continuité convenues ; aucune recommandation clinique"
		}, {
			id: "medico-social",
			title: "Transformation d’un service médico-social",
			object: "Organisation et continuité de l’accompagnement",
			interface: "Préparation → disponibilité → pilote → transition",
			owner: "Direction, équipes et partenaires du service",
			acceptance: "Charge et continuité convenues sans données de bénéficiaires"
		}]
	},
	{
		id: "culture-sport",
		classificationSection: "S",
		title: "Culture, sport et loisirs",
		shortTitle: "Culture, sport et loisirs",
		summary: "Spectacle, patrimoine, musées, activités sportives, loisirs et jeux. L’édition et l’audiovisuel relèvent des médias.",
		accent: "#4D3FC4",
		scene: "interfaces",
		environments: [{
			id: "musee",
			title: "Déploiement d’un parcours muséal",
			object: "Collections, installations et accueil des visiteurs",
			interface: "Conception → installation → essais d’usage → ouverture",
			owner: "Équipe du musée, prestataires et responsables d’accueil",
			acceptance: "Parcours, accessibilité et responsabilités de mise en service documentés"
		}, {
			id: "sport",
			title: "Organisation d’un événement sportif",
			object: "Sites, équipes et fonctionnement de l’événement",
			interface: "Préparation → mobilisation → essais → événement",
			owner: "Organisateur, exploitants et partenaires",
			acceptance: "Capacités, responsabilités et conditions d’accueil confirmées"
		}]
	},
	{
		id: "services-personnels",
		classificationSection: "T",
		title: "Associations, réparation et services personnels",
		shortTitle: "Services personnels et associatifs",
		summary: "Organisations associatives, réparation de véhicules et de biens, services personnels. La réparation industrielle et les soins de santé restent classés dans leurs secteurs.",
		accent: "#A65C35",
		scene: "interfaces",
		environments: [{
			id: "association",
			title: "Déploiement d’un service associatif",
			object: "Équipe, bénévoles et service aux adhérents",
			interface: "Mandat → préparation → pilote → déploiement",
			owner: "Responsables associatifs, équipe et partenaires",
			acceptance: "Bénéfice attendu et responsabilités de service explicités"
		}, {
			id: "reparation",
			title: "Organisation d’un atelier de réparation",
			object: "Pièces, équipements et circuit de remise",
			interface: "Diagnostic → approvisionnement → intervention → contrôle",
			owner: "Responsable d’atelier, fournisseurs et équipe",
			acceptance: "Résultats de contrôle et réserves liés à la commande"
		}]
	},
	{
		id: "menages",
		classificationSection: "U",
		title: "Activités économiques des ménages",
		shortTitle: "Activités des ménages",
		summary: "Ménages employeurs de personnel domestique et production non différenciée pour leur propre usage. Les entreprises de services sont classées selon leur activité.",
		accent: "#B34842",
		scene: "interfaces",
		environments: [{
			id: "emploi-domestique",
			title: "Organisation d’un service à domicile",
			object: "Interventions et continuité d’un service domestique fictif",
			interface: "Besoins → disponibilités → organisation → suivi",
			owner: "Ménage employeur et intervenants fictifs",
			acceptance: "Horaires, responsabilités et continuité convenus"
		}]
	},
	{
		id: "organisations-internationales",
		classificationSection: "V",
		title: "Organisations et organismes extraterritoriaux",
		shortTitle: "Organisations internationales",
		summary: "Organismes internationaux et représentations extraterritoriales. Les ONG et associations de droit local sont classées selon leur activité principale.",
		accent: "#3C5EAC",
		scene: "interfaces",
		environments: [{
			id: "programme",
			title: "Coordination d’un programme international",
			object: "Partenaires, financements et livrables de programme",
			interface: "Mandat → accords → déploiement → revue",
			owner: "Organisme, responsables de programme et partenaires",
			acceptance: "Autorités de décision, livrables et conditions de remise documentés"
		}]
	}
], n = {
	infrastructures: {
		family: "construction",
		environment: "ouvrage"
	},
	robotique: {
		family: "industrie",
		environment: "cellule"
	},
	"data-ia": {
		family: "numerique",
		environment: "bi"
	},
	aerospatial: {
		family: "industrie",
		environment: "systeme"
	},
	innovation: {
		family: "services-professionnels",
		environment: "prototype"
	},
	transformation: {
		family: "services-professionnels",
		environment: "processus"
	},
	personnalise: {
		family: "services-professionnels",
		environment: "transversal"
	}
}, r = {
	"retail/hotel": {
		family: "hospitalite",
		environment: "hotel"
	},
	"finance/conseil": {
		family: "services-professionnels",
		environment: "conseil"
	},
	"public/education": {
		family: "education",
		environment: "education"
	},
	"agriculture/agro": {
		family: "industrie",
		environment: "agro"
	},
	"sante/life-sciences": {
		family: "industrie",
		environment: "life-sciences"
	},
	"robotique/logistique": {
		family: "transport",
		environment: "automatisation"
	}
}, i = (e, t) => Object.hasOwn(e, t) ? e[t] : void 0;
function a(e) {
	if (!e) return;
	let r = i(n, e);
	return t.find((t) => t.id === (r?.family ?? e));
}
function o(t, o, s) {
	let c = i(r, `${t ?? ""}/${o ?? ""}`), l = t ? i(n, t) : void 0, u = a(c?.family ?? t) ?? a("construction");
	if (!u) throw Error("PROJECT_TAXONOMY_EMPTY");
	let d = u.environments.find((e) => e.id === (c?.environment ?? (o || l?.environment))) ?? u.environments[0];
	if (!d) throw Error("PROJECT_ENVIRONMENT_EMPTY");
	let f = e.find((e) => e.id === s) ?? e[2], p = u.id === "construction" && d.id === "hotel" && f.id === "realisation";
	return {
		family: u,
		environment: d,
		phase: f,
		playable: p,
		coverage: p ? "simulation" : "context",
		scene: d.scene ?? u.scene,
		context: d.context ?? u.context
	};
}
function s(e, t, n) {
	let r = o(e, t, n);
	return `/univers/${r.family.id}?environnement=${r.environment.id}&phase=${r.phase.id}`;
}
//#endregion
//#region packages/ui/sector-scene.ts
var c = [
	"construction",
	"nucleaire",
	"robotique",
	"si-data",
	"industrie",
	"services-sante",
	"interfaces"
], l = {
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
function u(e, t = -35, n = !1) {
	if (!c.includes(e) || !Number.isFinite(t) || Math.abs(t) > 3600 || typeof n != "boolean") throw RangeError("INVALID_SCENE_ANNOTATION");
	let r = t * Math.PI / 180;
	return (l[e] ?? []).map(([e, t, i], a) => ({
		number: a + 1,
		x: 380 + (e * Math.cos(r) - t * Math.sin(r)) * 1.55,
		y: 350 + ((e * Math.sin(r) + t * Math.cos(r)) * .42 - (i + (n && a < 2 ? 20 : 0)) * .9) * 1.55
	}));
}
var d = {
	roof: "var(--scene-roof, #e5eadc)",
	front: "var(--scene-front, #a8bba8)",
	side: "var(--scene-side, #647e6b)",
	dark: "var(--scene-dark, #294e3d)",
	accent: "var(--sector-accent, #b96b39)",
	glass: "var(--scene-glass, #86aaa3)",
	light: "var(--scene-light, #f2f2df)"
};
function f(e, t = {}) {
	if (!c.includes(e)) throw RangeError("UNKNOWN_SECTOR_SCENE");
	let n = t.angle ?? -35;
	if (!Number.isFinite(n) || Math.abs(n) > 3600) throw RangeError("INVALID_SCENE_ANGLE");
	if (t.exploded !== void 0 && typeof t.exploded != "boolean") throw RangeError("INVALID_SCENE_EXPLODED");
	if (t.annotated !== void 0 && typeof t.annotated != "boolean") throw RangeError("INVALID_SCENE_ANNOTATED");
	if (t.focused !== void 0 && ![
		1,
		2,
		3
	].includes(t.focused)) throw RangeError("INVALID_SCENE_FOCUS");
	let r = n * Math.PI / 180, i = Math.cos(r), a = Math.sin(r), o = t.exploded ? 20 : 0, s = [], l = ([e, t, n]) => (e * a + t * i) * .9 + n * .42, f = ([e, t, n]) => [380 + (e * i - t * a) * 1.55, 350 + ((e * a + t * i) * .42 - n * .9) * 1.55], p = (e) => f(e).map((e) => Number(e.toFixed(2))).join(","), m = (e, t) => s.push({
		points: e,
		tone: t,
		depth: e.reduce((e, t) => e + l(t), 0) / e.length
	});
	function h(e, t = d.front) {
		m([
			e[0],
			e[1],
			e[2],
			e[3]
		], d.side), m([
			e[0],
			e[1],
			e[5],
			e[4]
		], t), m([
			e[1],
			e[2],
			e[6],
			e[5]
		], d.side), m([
			e[2],
			e[3],
			e[7],
			e[6]
		], t), m([
			e[3],
			e[0],
			e[4],
			e[7]
		], d.side), m([
			e[4],
			e[5],
			e[6],
			e[7]
		], t === d.front ? d.roof : t);
	}
	function g(e, t, n, r, i, a, o = d.front) {
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
	function _(e, t, n, r, i, a = d.front) {
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
		], e % 4 == 0 ? d.side : a);
		m(s, d.roof);
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
			], i % 2 ? d.roof : d.front);
		}
	}
	function y(e, t, n, r = d.accent) {
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
	g(-175, -118, -9, 350, 236, 9, d.roof);
	let b = s.splice(0);
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
			]) for (let n of [-56, 40]) g(e, n, t + 6, 6, 6, 34, d.light);
			if (e > 0) {
				g(-85, -61, t - 29, 130, 2, 23, d.glass);
				for (let e of [
					-83,
					-50,
					-17,
					16,
					47
				]) g(e, -63, t - 30, 2, 4, 26, d.dark);
			}
		}
		g(-105, -67, 90 + o * 2, 176, 120, 6, d.accent), g(84, -45, 0, 48, 75, 4, d.side);
		for (let e = 0; e < 5; e++) g(83 + e * 8, -45, 4 + e * 3, 8, 75, 3, d.light);
		g(-122, 65, 0, 235, 5, 3, d.dark);
	} else if (e === "nucleaire") {
		_(-67, -8, 0, 43, 65, d.front), v(-67, -8, 65 + o, 43), g(-10, -54, 0, 130, 90, 47), g(-14, -58, 47 + o, 138, 98, 7, d.accent);
		for (let e = 0; e < 6; e++) g(3 + e * 18, -57, 12, 10, 3, 20, d.glass);
		g(36, 51, 0, 74, 35, 30, d.front), g(32, 48, 30, 82, 41, 4, d.roof), _(-130, 61, 0, 12, 28, d.dark), _(-97, 66, 0, 10, 22, d.front), g(-145, -96, 0, 277, 4, 6, d.dark);
	} else if (e === "robotique") {
		g(-130, -76, 0, 246, 148, 7, d.dark), g(-115, -59, 9, 53, 48, 12, d.front), _(-89, -35, 21, 15, 14, d.accent), y([
			-89,
			-35,
			35
		], [
			-50,
			-35,
			93 + o
		], 17), _(-50, -35, 89 + o, 12, 11, d.dark), y([
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
		], 10, d.dark), g(21, -45, 34, 5, 5, 18, d.accent), g(21, -29, 34, 5, 5, 18, d.accent), g(-15, -20, 9, 118, 35, 11, d.front);
		for (let e = 0; e < 11; e++) g(-11 + e * 10, -22, 20, 5, 39, 3, d.dark);
		for (let e of [
			4,
			51,
			88
		]) g(e, -15, 24, 13, 22, 12, d.accent);
		for (let e of [-130, 110]) for (let t of [-76, 67]) g(e, t, 7, 4, 4, 110, d.dark);
		for (let e of [-76, 67]) g(-130, e, 117 + o, 244, 4, 4, d.front);
		for (let e of [-130, 110]) g(e, -76, 117 + o, 4, 147, 4, d.front);
		g(132, -55, 0, 22, 24, 47, d.front), g(132, -57, 31, 20, 2, 12, d.glass);
	} else if (e === "si-data") {
		for (let e = 0; e < 2; e++) for (let t = 0; t < 3; t++) {
			let n = -104 + t * 69, r = -68 + e * 86, i = t === 1 ? o : 0;
			g(n, r, i, 40, 40, 91, d.dark), g(n - 2, r - 2, i + 91, 44, 44, 3, d.accent);
			for (let e = 0; e < 6; e++) g(n + 4, r - 2, i + 9 + e * 12, 30, 2, 7, d.front), g(n + 27, r - 3, i + 11 + e * 12, 3, 1, 3, d.accent);
		}
		for (let e = 0; e < 3; e++) g(-110 + e * 69, -105, 1, 8, 207, 2, d.accent);
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
			], d.roof), m([
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
			], d.glass);
		}
		for (let e of [
			-96,
			-45,
			6,
			57
		]) g(e, -62, 5, 27, 3, 30, d.dark);
		_(118, 17, 0, 17, 79, d.front), _(118, 65, 0, 17, 64, d.accent), g(-120, 78, 0, 197, 22, 4, d.dark);
		for (let e of [
			-95,
			-47,
			1,
			49
		]) g(e, 78, 4, 29, 22, 18, d.front);
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
			g(e ?? 0, t ?? 0, 0, 50, 50, (n ?? 40) + o, d.front), g((e ?? 0) - 3, (t ?? 0) - 3, (n ?? 40) + o, 56, 56, 5, d.accent);
			for (let n = 0; n < 3; n++) g((e ?? 0) + 5, (t ?? 0) - 2, 10 + n * 12, 34, 3, 4, d.glass);
		}
		g(-98, -23, 3, 100, 5, 5, d.dark), g(-2, -23, 3, 5, 66, 5, d.dark), g(0, 39, 3, 102, 5, 5, d.dark), g(98, -27, 3, 5, 71, 5, d.dark);
	} else {
		g(-118, -62, 0, 184, 90, 53), g(-123, -67, 53 + o, 194, 100, 6, d.roof), g(-48, 28, 0, 72, 65, 28, d.front), g(-52, 25, 28 + o, 80, 71, 5, d.accent);
		for (let e = 0; e < 2; e++) for (let t = 0; t < 7; t++) g(-108 + t * 23, -65, 11 + e * 23, 14, 3, 14, d.glass);
		g(-32, 91, 0, 39, 3, 21, d.glass), g(-42, 98, 0, 60, 12, 3, d.light);
		for (let e of [100, 132]) _(e, -55, 0, 3, 23, d.dark), v(e, -55, 21, 17);
		g(93, 13, 0, 50, 50, 4, d.dark), g(104, 24, 4, 27, 27, 20, d.front);
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
	let S = b.sort((e, t) => e.depth - t.depth).map((e) => `<polygon points="${e.points.map(p).join(" ")}" fill="${e.tone}"/>`).join(""), C = s.sort((e, t) => e.depth - t.depth).map((e) => `<polygon points="${e.points.map(p).join(" ")}" fill="${e.tone}"/>`).join(""), w = (e, t) => `<path d="M${p(e)}L${p(t)}"/>`, T = t.annotated ? u(e, n, t.exploded).map((e) => `<g data-scene-interface="${e.number}" transform="translate(${e.x.toFixed(2)} ${e.y.toFixed(2)})"><circle r="${t.focused === e.number ? 20 : 16}" fill="${t.focused === e.number ? d.accent : d.dark}" stroke="${d.light}" stroke-width="2"/><text text-anchor="middle" dy="5" fill="${d.light}" font-family="sans-serif" font-size="15" font-weight="700">${e.number}</text></g>`).join("") : "";
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
var p = {
	families: t.length,
	examples: t.reduce((e, t) => e + t.environments.length, 0),
	classification: "NACE Rev. 2.1",
	playable: ["construction/hotel/realisation"]
}, m = (e, t) => e.map((e) => `<option value="${e.id}"${e.id === t ? " selected" : ""}>${e.title}</option>`).join(""), h = (e) => `<ol class="context-map" aria-label="Interfaces du projet"><li><span>01 / OBJET</span><strong>${e.environment.title}</strong><p>${e.environment.object}</p></li><li><span>02 / DÉPENDANCE</span><strong>Relier les acteurs</strong><p>${e.environment.interface}</p></li><li><span>03 / ACCEPTATION</span><strong>Vérifier avant de livrer</strong><p>${e.environment.acceptance}</p></li></ol>`;
function g() {
	let n = o();
	return `<section class="world-home wrap" aria-labelledby="world-home-title">
  <div class="world-heading"><div><p class="eyebrow">PMERSION / STUDIO DE DÉCISION</p><h1 id="world-home-title">Voyez le projet.<br><em>Défendez votre décision.</em></h1></div><div class="world-heading-copy"><p>Un fournisseur en retard. Un budget à préserver. Un jalon à défendre. Examinez les pièces, comparez les plans et voyez ce que votre choix change.</p><a class="world-context-link" href="/beta/#/mission/construction">Commencer la mission Hôtel →</a><p class="world-caption">Sans compte · Cas fictifs · Sauvegarde sur votre navigateur</p></div></div>
  <div class="world-studio" style="--sector-accent:${n.family.accent}">
    <div class="world-selector"><p>CHOISISSEZ VOTRE CONTEXTE</p><div class="world-hierarchy">
      <label for="home-domain">Secteur d’activité<select id="home-domain" aria-label="Secteur d’activité" data-world-family disabled>${m(t, n.family.id)}</select></label>
      <label for="home-environment">Type de projet<select id="home-environment" aria-label="Type de projet" data-world-environment disabled>${m(n.family.environments, n.environment.id)}</select></label>
      <label for="home-phase">Phase du projet<select id="home-phase" aria-label="Phase du projet" data-world-phase disabled>${m(e, n.phase.id)}</select></label>
    </div><p data-world-selection-summary>${n.family.title} · ${n.environment.title}</p></div>
    <div class="world-model" id="world-home-model"><div data-world-scene aria-hidden="true">${f("construction", {
		annotated: !0,
		focused: 1
	})}</div><span class="world-model-label" data-world-model-label>HÔTEL / MAQUETTE ILLUSTRATIVE</span></div>
    <div class="world-context"><p class="eyebrow" data-world-kicker>${n.phase.title}</p><div aria-live="polite" aria-atomic="true"><h2 data-world-title>${n.environment.title}</h2><p data-world-description>${n.environment.object}</p><p class="world-coverage" data-world-coverage>Mission calculée · 4 plans à comparer</p></div><a data-world-open href="/beta/#/mission/construction">Lire les pièces et comparer <span aria-hidden="true">↗</span></a><div class="world-tools" role="group" aria-label="Explorer la maquette"><button type="button" data-world-turn disabled>Tourner ↻</button><button type="button" data-world-explode aria-pressed="false" disabled>Voir la coupe et les lots</button></div></div>
  </div><div class="world-interface-reading"><div class="world-tools" role="group" aria-label="Lire les interfaces du contexte"><button type="button" data-world-interface="1" aria-pressed="true" disabled>1 · Menuiseries</button><button type="button" data-world-interface="2" aria-pressed="false" disabled>2 · Fermeture de la zone</button><button type="button" data-world-interface="3" aria-pressed="false" disabled>3 · Chambre témoin</button></div><p data-world-focus aria-live="polite">Livraison J25 → fermeture de la zone J30 → chambre témoin J50. Le jalon attendu reste J30.</p></div>
  <div class="world-studio-footer"><span>22 secteurs d’activité · 71 exemples contextuels · Une mission Hôtel calculée</span><a href="/beta/#/secteurs">Explorer les secteurs →</a></div>
  <noscript><p>Le cas et ses pièces restent accessibles dans <a href="/beta/#/mission/construction">la mission Hôtel</a>. La sélection interactive nécessite JavaScript.</p></noscript>
  </section>`;
}
function _(e) {
	let t = o(), n = -35, r = !1, i = 1, a = 0, c = !1, l, u = e.querySelector("[data-world-scene]"), d = e.querySelector(".world-studio"), p = e.querySelector("[data-world-family]"), g = e.querySelector("[data-world-environment]"), _ = e.querySelector("[data-world-phase]"), v = e.querySelector("[data-world-turn]"), y = e.querySelector("[data-world-explode]"), b = e.querySelector("[data-world-open]"), x = [...e.querySelectorAll("[data-world-interface]")];
	if (!u || !d || !p || !g || !_ || !v || !y || !b) return () => {};
	let S = () => {
		a++;
		let e = a;
		l?.dispose(), l = void 0;
		let o = t.family.id === "construction" && t.environment.id === "hotel";
		if (u.closest(".world-model")?.classList.toggle("has-context-map", !o), u.setAttribute("aria-hidden", String(o)), o) {
			u.innerHTML = `<div class="hotel-scene" data-renderer="diagram"><div class="hotel-scene-fallback">${f("construction", {
				angle: n,
				exploded: r,
				annotated: !0,
				focused: i
			})}</div><div class="hotel-scene-canvas"></div></div>`;
			let t = u.querySelector(".hotel-scene"), o = u.querySelector(".hotel-scene-canvas");
			t && o && import("./hotel-scene-DOt99-ck.js").then(({ mountHotelScene: s }) => {
				c || e !== a || (l = s(o, {
					angle: n,
					exploded: r,
					focus: i,
					onUnavailable: () => {
						t.dataset.renderer = "diagram";
					}
				}), o.querySelector("canvas") && (t.dataset.renderer = "webgl"));
			}).catch(() => {
				t.dataset.renderer = "diagram";
			});
		} else u.innerHTML = h(t);
	}, C = (a = !0) => {
		if (a) S();
		else {
			l?.update({
				angle: n,
				exploded: r,
				focus: i
			});
			let e = u.querySelector(".hotel-scene-fallback");
			e && u.querySelector(".hotel-scene")?.dataset.renderer !== "webgl" && (e.innerHTML = f("construction", {
				angle: n,
				exploded: r,
				annotated: !0,
				focused: i
			}));
		}
		let o = t.family.id === "construction" && t.environment.id === "hotel";
		d.style.setProperty("--sector-accent", t.family.accent), p.value = t.family.id, g.innerHTML = m(t.family.environments, t.environment.id), _.value = t.phase.id;
		let c = o ? [
			"Livraison J25 : les menuiseries conditionnent la fermeture de la zone. Comparez les engagements des fournisseurs.",
			"Fermeture de la zone J30 : les doublages commencent ensuite. Un gain amont se propage dans le planning.",
			"Chambre témoin J50, cible J30 : 20 jours ouvrés de retard. Le contrôle documentaire reste ouvert."
		] : [
			`${t.environment.object}. Acteurs : ${t.environment.owner}.`,
			`${t.environment.interface}. ${t.phase.question}`,
			`${t.environment.acceptance}. Un contrôle prévu n’est pas une acceptation démontrée.`
		], h = [
			["[data-world-kicker]", t.phase.title],
			["[data-world-selection-summary]", `${t.family.title} · ${t.environment.title}`],
			["[data-world-title]", t.environment.title],
			["[data-world-description]", t.environment.object],
			["[data-world-coverage]", t.playable ? "Mission calculée · 4 plans à comparer" : "Dossier exploratoire · repères métier, sans simulation chiffrée"],
			["[data-world-focus]", c[i - 1] ?? ""],
			["[data-world-model-label]", o ? "HÔTEL / MAQUETTE ILLUSTRATIVE" : "INTERFACES / LECTURE DU PROJET"]
		];
		for (let [t, n] of h) {
			let r = e.querySelector(t ?? "");
			r && (r.textContent = n ?? "");
		}
		b.href = t.playable ? "/beta/#/mission/construction" : `/beta/#${s(t.family.id, t.environment.id, t.phase.id)}`, b.textContent = t.playable ? "Lire les pièces et comparer ↗" : "Examiner les repères métier ↗", v.hidden = y.hidden = !o, y.setAttribute("aria-pressed", String(r)), x.forEach((e, t) => {
			e.setAttribute("aria-pressed", String(t + 1 === i)), e.textContent = o ? [
				"1 · Menuiseries",
				"2 · Fermeture de la zone",
				"3 · Chambre témoin"
			][t] ?? "" : [
				"1 · Objet",
				"2 · Dépendances",
				"3 · Acceptation"
			][t] ?? "";
		});
	}, w = () => {
		n = -35, r = !1, i = 1;
	}, T = () => {
		t = o(p.value), w(), C();
	}, E = () => {
		t = o(t.family.id, g.value, _.value), w(), C();
	}, D = () => {
		t = o(t.family.id, t.environment.id, _.value), C(!1);
	}, O = (e) => {
		i = Number(e.currentTarget.dataset.worldInterface), C(!1);
	}, k = () => {
		n = n >= 235 ? -35 : n + 90, C(!1);
	}, A = () => {
		r = !r, C(!1);
	};
	return [
		p,
		g,
		_,
		v,
		y,
		...x
	].forEach((e) => {
		e.disabled = !1;
	}), p.addEventListener("change", T), g.addEventListener("change", E), _.addEventListener("change", D), v.addEventListener("click", k), y.addEventListener("click", A), x.forEach((e) => {
		e.addEventListener("click", O);
	}), C(), () => {
		c = !0, a++, l?.dispose(), p.removeEventListener("change", T), g.removeEventListener("change", E), _.removeEventListener("change", D), v.removeEventListener("click", k), y.removeEventListener("click", A), x.forEach((e) => {
			e.removeEventListener("click", O);
		});
	};
}
if (typeof document < "u") {
	let e = document.getElementById("home-project-worlds");
	e && _(e);
}
//#endregion
export { p as contextTaxonomy, _ as mountSectorHome, g as renderSectorHome };
