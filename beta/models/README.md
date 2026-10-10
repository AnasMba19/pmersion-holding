# Maquette Hôtel, géométrie cible fictive

Le GLB et le manifeste sont générés depuis packages/content/hotel-model.ts et
packages/ui/hotel-geometry.ts. Ils comprennent 120 chambres identifiées, quatre
niveaux et un RDC de services. La chambre témoin est room-101. Les dimensions
sont des hypothèses. Ce fichier n’est pas une maquette BIM, un plan exécutable,
un relevé du chantier ou une attestation de conformité.

Exporter avec Node :

```sh
npx esbuild scripts/export-hotel-model.mjs --bundle --platform=node --format=esm --outfile=/tmp/pmersion-export-model.mjs
node /tmp/pmersion-export-model.mjs
```

Blender peut ouvrir le GLB. Pour reconstruire une scène avec ses objets nommés
depuis le manifeste :

```sh
blender --background --python scripts/blender-hotel.py -- docs/work/models/hotel-geometry-2/manifest.json /tmp/pmersion-blender
```

Le runtime Blender n’a pas été exécuté dans cet environnement. Ce script reste
à qualifier dans Blender ; aucun fichier .blend n’est présenté comme produit.
