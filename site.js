const previews = {
  budget: { title: "90 000 € d’écart.\nQuelle option défendre ?", metric: "Coût final prévu", value: "1 090 000 €", variance: "+9 %", first: ["Budget approuvé", "1 000 000 €"], second: ["Économies possibles, à vérifier", "40 000 €"], insight: "Reporter une dépense ne réduit pas son coût. L’arbitrage commence par cette distinction.", link: "Ouvrir le dossier budget" },
  planning: { title: "Une livraison retardée.\nQuel jalon annoncer ?", metric: "Fin prévue sans récupération", value: "J60", variance: "+13 j", first: ["Engagement externe", "J47"], second: ["Récupération conditionnelle", "4 jours"], insight: "Le gain de délai exige des interfaces validées et une récupération vérifiée dans la simulation.", link: "Ouvrir le dossier planning" },
  risques: { title: "Une capacité sous pression.\nQuand faut-il agir ?", metric: "Exposition initiale modélisée", value: "20 / 25", variance: "SYN–R01", first: ["Seuil d’alerte capacité", "Sous 80 %"], second: ["Qualification au plus tôt", "J5"], insight: "Un plan de réponse n’est pas un effet acquis. Testez les observations jusqu’à l’incident.", link: "Ouvrir le dossier risques" },
};
for (const button of document.querySelectorAll("[data-preview]")) {
  button.addEventListener("click", () => {
    const key = button.dataset.preview;
    const entry = previews[key];
    if (!entry) return;
    for (const peer of document.querySelectorAll("[data-preview]")) peer.setAttribute("aria-pressed", String(peer === button));
    document.getElementById("preview-title").innerText = entry.title;
    document.getElementById("metric-label").textContent = entry.metric;
    document.getElementById("metric-value").textContent = entry.value;
    document.getElementById("metric-variance").textContent = entry.variance;
    document.getElementById("row-one-label").textContent = entry.first[0];
    document.getElementById("row-one-value").textContent = entry.first[1];
    document.getElementById("row-two-label").textContent = entry.second[0];
    document.getElementById("row-two-value").textContent = entry.second[1];
    document.getElementById("preview-insight").textContent = entry.insight;
    const link = document.getElementById("preview-link");
    link.href = `/beta/#/atelier/${key}`;
    link.textContent = `${entry.link} ↗`;
  });
}
