FROM gcr.io/distroless/nodejs24-debian13

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
