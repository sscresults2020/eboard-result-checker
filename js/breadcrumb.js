(() => {
  const siteUrl = "https://examresultsbd.com";

  const canonical =
    document.querySelector('link[rel="canonical"]')?.href ||
    window.location.href;

  const path = new URL(canonical).pathname;

  // Skip homepage and 404
  if (path === "/" || path === "/index.html" || path.includes("404")) {
    return;
  }

  // Use custom breadcrumb label or page title
  const pageTitle =
    document.body.dataset.breadcrumb ||
    document.title.split("|")[0].trim();

  // -------------------------
  // Visual Breadcrumb
  // -------------------------

  const crumb = document.querySelector(".crumb");

  if (crumb) {
    crumb.innerHTML = `
      <a href="${siteUrl}/">Home</a>
      <span aria-hidden="true"> › </span>
      <span aria-current="page">${pageTitle}</span>
    `;
  }

  // -------------------------
  // Prevent duplicate schema
  // -------------------------

  if (document.querySelector('script[data-breadcrumb-schema]')) {
    return;
  }

  // -------------------------
  // Breadcrumb Schema
  // -------------------------

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${siteUrl}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": pageTitle,
        "item": canonical
      }
    ]
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.dataset.breadcrumbSchema = "true";
  script.textContent = JSON.stringify(schema);

  document.head.appendChild(script);
})();
