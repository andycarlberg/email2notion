# Build front end
FROM node:latest as fe_build
WORKDIR /app
COPY ./frontend ./
RUN npm ci
RUN npm run build

# Serve back end
FROM python:3.8-alpine

# RUN adduser -D email2notion

# WORKDIR /home/email2notion
WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
RUN pip install gunicorn

COPY boot.sh ./
COPY ./email2notion ./email2notion
RUN chmod +x boot.sh

COPY --from=fe_build /app/build ./frontend/build

ENV FLASK_APP email2notion

# RUN chown -R email2notion:email2notion ./email2notion
# USER email2notion

VOLUME /config

EXPOSE 5000
ENTRYPOINT ["./boot.sh"]
