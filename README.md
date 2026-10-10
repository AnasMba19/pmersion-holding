# PMersion : atelier public de projet

L’entrée principale présente le nouvel atelier issu de la direction D 12ui.
Huit archétypes ouvrent 24 pièces fictives. Six missions sont calculées ; deux
archétypes restent des contextes sans moteur. Les anciens parcours restent
accessibles dans le navigateur et la présentation précédente à /classique.html.

L’atelier Hôtel possède six vues et un modèle hotel-mission.3 distinct des archives.
Il relie des leviers combinables, des pertes d’exploitation sous hypothèses, une
créance fournisseur distincte des encaissements et quatre critères qualité. Les
preuves sont déclarées par l’utilisateur. Une NC ou une preuve manquante bloque
l’acceptation, sans prétendre accepter un ouvrage réel.

La géométrie cible Three.js contient 120 chambres identifiées. Le GLB et le
manifeste sont accessibles dans beta/models. Les dimensions sont fictives ; ce
n’est pas du BIM. Aucun runtime Blender, agent IA produit, Projects, Enterprise
ou compte cloud n’est présenté comme nouvellement livré.

La sauvegarde pmersion.hotel-mission.v3 conserve explicitement vingt études, leur
justification et les preuves déclarées. Le changement de fournisseur retire les
preuves du produit précédent. Les dossiers historiques gardent leurs clés et
leurs modèles. Il n’y a pas de synchronisation entre appareils.

Le manifeste beta/release.json contient les versions, la source exacte et les
empreintes. Les ressources compilées immuables sont conservées pour les caches.
La CI vérifie les parcours à quatre largeurs ; le contrôle publié vérifie aussi
le domaine. Aucun test automatique ne vaut acceptation esthétique, évaluation
pédagogique auprès des utilisateurs ou décision GO G5–G10.

```sh
npm ci
npx playwright install chromium
npm test
```

Retour arrière : revert du commit de publication, sans changement DNS ni
environnement privé connecté. L’ancienne présentation a conservé ses tests
fonctionnels ; de nouveaux tests qualifient l’entrée principale et l’atelier.
