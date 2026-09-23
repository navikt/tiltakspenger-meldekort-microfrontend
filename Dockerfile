# Distroless har ingen semver-tagger — versjonen ligger i repo-navnet (nodejs24-debian13) — så taggen er `latest`.
# Digesten er det som faktisk kjører; taggen er det Dependabot følger, og gir PR når `latest` flyttes.
FROM gcr.io/distroless/nodejs24-debian13:latest@sha256:b1fc33242cc74151f50c62b4a03d48afd759dccf81279b5f8e401db4546479c1

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
