## Deploy to Google Cloud Run

Create a new version number. This is unfortunately currently manual.

Submit the code for building.

Replace VERSION as appropriate

```bash
gcloud builds submit --tag gcr.io/rampart-sh/grandbot:{{VERSION}}
```

Once successful update the **infra/service.yaml** definition with the appropriate image version. Then push with.

```bash
gcloud beta run services replace infra/service.yaml --platform managed
```

#### Build image remote

```bash
gcloud builds submit --tag gcr.io/rampart-sh/grandbot:10
```

#### Build image locally

```bash
docker build . --tag gcr.io/rampart-sh/grandbot:11
```

#### Push locally built image

```bash
docker push gcr.io/rampart-sh/grandbot:11
```

#### Push service definition

```bash
gcloud beta run services replace infra/service.yaml --platform managed
```

#### Pull service definition

```bash
gcloud run services describe grandbot --format export --platform managed > infra/service.yaml
```
