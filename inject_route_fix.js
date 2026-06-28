const fs = require('fs');
let html = fs.readFileSync('d:/Freddiebusiness/index.html', 'utf8');

const scriptStr = `
<script>
  (function() {
    const routeMap = {
      "/": "uBwvtZvLi",
      "/brands": "DtYEUQUD6",
      "/individuals": "AzbXK4Tl8",
      "/portfo": "TPqCF0Oli",
      "/about-us": "s2lsDv_cx",
      "/forms": "ZJt6RChkv",
      "/thank-you-page": "YQLMVpfK4",
      "/build-deli": "mHi7eeRUT",
      "/privacy-policy": "wTPKjjQ8N",
      "/terms-of-service": "vOcQg0DRt",
      "/build-deli-pro": "zdjfs1PgZ",
      "/kannappa": "oOoW1NiwG",
      "/kolapasi": "lvk0HYjNr"
    };
    const path = window.location.pathname;
    const normalizedPath = path !== '/' && path.endsWith('/') ? path.slice(0, -1) : path;
    const correctRouteId = routeMap[normalizedPath];
    if (correctRouteId) {
      const mainDiv = document.getElementById('main');
      if (mainDiv) {
        const hydrateAttr = mainDiv.getAttribute('data-framer-hydrate-v2');
        if (hydrateAttr) {
          try {
            const data = JSON.parse(hydrateAttr);
            if (data.routeId !== correctRouteId) {
              data.routeId = correctRouteId;
              mainDiv.setAttribute('data-framer-hydrate-v2', JSON.stringify(data));
              console.log("Forced route to: " + correctRouteId);
            }
          } catch(e) {}
        }
      }
    }
  })();
</script>
`;

html = html.replace('</body>', scriptStr + '\n</body>');
fs.writeFileSync('d:/Freddiebusiness/index.html', html, 'utf8');
console.log('Injected routing fix');
