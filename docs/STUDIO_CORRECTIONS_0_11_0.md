# PMersion 0.11.0 : corrections du cas Hôtel

Lot du 11 octobre 2026. La compilation qualifiée utilise la source exacte
`324c66b32f725825d34ca20369cfb6c899169f63`, fusion de la PR source 103.
`beta/release.json` désigne `hotel-scenario.4` comme exercice actif.
Les moteurs précédents restent des archives de leurs propres études.

## Parcours corrigé

Le bouton principal conserve le jaune actuel, avec un texte sombre lisible.
Le logo utilise le SVG existant de septembre, variante A sur fond sombre.
La géométrie et le texte sont conservés ; un titre accessible est ajouté.
Le PNG comportant un texte erroné est exclu et retiré des fichiers publiés.
Ce lot conserve la palette et les polices actuelles.

Le rôle du joueur, le retard des menuiseries et les conditions du témoin sont
annoncés avant les décisions. La maquette cible s'ouvre à la demande, après
les leviers et les pièces. La navigation reste utilisable aux quatre largeurs
de qualification. Une table accompagne la représentation du planning.

Le planning relie livraison et protection, validation du témoin, reproduction
dans 119 chambres, OPR et reprises, préparation finale et ouverture.
La perte d'exploitation compte des jours calendaires. Le chantier utilise
une semaine fictive du lundi au vendredi, sans jours fériés.
Les dépenses, la marge perdue, le risque et la créance fournisseur sont séparés.
Aucune pénalité n'est supposée encaissée.

Les preuves proviennent de onze pièces pédagogiques fixes. Le produit, le
critère, le constat et l'approbation déterminent leur suffisance dans l'exercice.
Une valeur saisie ne constitue plus une preuve. Une pièce incompatible ou un
essai insuffisant garde le témoin bloqué. Le tableau dit « Aucune pièce choisie »
tant qu'une pièce n'a pas été jointe.

Trois objections MOA proposent chacune trois réponses et leurs conséquences
scriptées. La note libre est conservée sans notation sémantique ni agent IA
produit. Conserver une étude reste possible avec réserves ; cela n'autorise
pas les travaux.

## Comparaison et limites du modèle

Les chiffres suivants sont des sorties du moteur sous **hypothèses par défaut
non relues** : livraison inchangée, contrôles programmés, marge hypothétique
de 5 000 euros par jour calendaire et cible d'ouverture J60.

| Plan repère | Témoin ouvré | Ouverture ouvrée | Dépenses | Perte calculée | Risque pédagogique | Confirmations supplémentaires |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| Maintenir | J50 | J68 | 38 200 € | 60 000 € sur 12 jours calendaires | 4 800 € | 0 |
| Accélérer | J35 | J58 | 35 200 € | 0 € | 8 800 € | 1 |
| Alternative | J32 | J58 | 33 800 € | 0 € | 15 200 € | 2 |
| Préparer hors zone, livraison maintenue | J42 | J60 | 33 800 € | 0 € | 8 000 € | 1 |

Ces quatre plans sont non dominés sur dépenses plus perte, date d'ouverture,
risque pédagogique et confirmations, à contrôles identiques. Cette conclusion
dépend des coefficients non calibrés. Sur les seuls coût et date, l'alternative
domine accélérer et préparer. Quatre combinaisons sont dominées parmi les douze
aux hypothèses par défaut. Le débrief indique le périmètre de sa comparaison.
Par défaut, les quatre preuves manquent pour chaque plan.

## Conservation et représentation

La clé `pmersion.hotel-scenario.v4` conserve explicitement les vingt dernières
études, les pièces choisies et les réponses MOA. Le brouillon peut être recommencé
puis restauré avant une nouvelle modification ou conservation. Les erreurs,
formats futurs et conflits ne permettent pas de remplacer silencieusement
une étude protégée.

La clé historique `pmersion.hotel-mission.v3` reste lue avec son moteur .3,
sans conversion ni réécriture. Les autres parcours historiques sont conservés.
Les huit archétypes du catalogue comptent une mission Hôtel approfondie,
cinq exercices historiques distincts et deux dossiers de contexte sans moteur.
Les vingt-quatre pièces du catalogue sont fictives ; elles ne désignent pas
les onze pièces de l'exercice actif.

La maquette Three.js et le GLB de 120 objets chambre restent disponibles.
Ils représentent un état cible pédagogique, sans constat d'avancement ni
qualification BIM. Aucun fichier Blender exécuté ou .blend n'est revendiqué.

## Qualification et publication

La source passe 287 tests locaux, typage, lint, formatage et compilation.
La PR source 103 passe 156 parcours de l'atelier et 134 parcours de régression :
runs `38153542950`, `38153542952` et qualité `38153542955`.

Le premier compile exact `38153110056` a échoué sur l'interpréteur d'esbuild.
Le correctif sépare lancement natif et lancement JavaScript. Sept tests
d'intégrité vérifient notamment ce dispatch réellement exécuté.
Le run `38154010561` compile et contrôle l'artefact
`11707916442` depuis le SHA source indiqué, sans copie locale modifiée.
L'archive a l'empreinte SHA-256
`c7a4eb0193b350147241e7d90440e58f7845ce703980fe708a3314c551e5456b`.

`public-release.json` liste les fichiers autorisés et leurs empreintes.
Les blobs de publication sont comparés aux octets de cet artefact.
Les modèles, polices et assets inchangés conservent leurs empreintes.
Les contrôles de cette PR et du domaine réel doivent réussir avant de déclarer
la livraison observée. Les preuves de publication sont conservées par les workflows.

Les 35 chapitres du sommaire directeur restent suivis dans le dépôt source.
Le lot ne livre pas Projects, Enterprise, comptes, reprise entre appareils,
ingestion de documents réels ni IA documentaire. La calibration professionnelle,
l'observation d'utilisateurs et l'acceptation esthétique ne sont pas déduites
des tests. Aucun GO G5 à G10 ou résultat commercial n'est accordé par ce lot.
