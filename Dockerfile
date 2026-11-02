# Chainguard-image fra Navs speil: https://sikkerhet.nav.no/docs/verktoy/chainguard-dockerimages/
# Bevisst uten digest: Chainguard backporter ikke fikser til eldre patch-versjoner, og Dependabot når ikke speilet.
# Major-taggen gir nyeste bygg av Node 24 ved hvert image-bygg.
FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:26-slim

WORKDIR /usr/src/app

COPY ./dist ./dist
COPY ./node_modules ./node_modules

# Uten TZ kjører imaget UTC, og datoen vi viser brukeren blir feil dag rundt midnatt.
# Koden setter timeZone eksplisitt i Intl, men imaget settes likt som meldekort-mikrofrontend.
ENV TZ="Europe/Oslo"
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["./dist/server/entry.mjs"]

EXPOSE $PORT
