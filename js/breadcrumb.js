(() => {
  const canonical =
    document.querySelector('link[rel="canonical"]')?.href ||
    window.location.href;

  const path = new URL(canonical).pathname;

  // Don't show breadcrumb on homepage or 404 page
  if (path === "/" || path === "/index.html" || path.includes("404")) {
    return;
  }

  // Use custom breadcrumb name if available, otherwise use page title
  const pageTitle =
    document.body.dataset.breadcrumb ||
    document.title.split("|")[0].trim();

  // Create visual breadcrumb
  const crumb = document.querySelector(".crumb");

  if (crumb) {
    crumb.innerHTML = `
      <a href="https://examresultsbd.com/">Home</a>
      <span aria-hidden="true"> › </span>
      <span>${pageTitle}</span>
    `;
  }

  // Create BreadcrumbList schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://examresultsbd.com/"
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
  script.textContent = JSON.stringify(schema);

  document.head.appendChild(script);
})();
