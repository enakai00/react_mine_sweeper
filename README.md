# React Mine Sweeper Example

Disclaimer: This is not an official Google product.

## Manual setup for local testing
```
npm install
npm start
```

## Deploying on Google Cloud

1. Create a new project and open Cloud Shell

    Run the following commands on Cloud Shell terminal.

2. Set project ID and enable APIs

```
$ gcloud config set project [PROJECT ID]
$ PROJECT_ID=$(gcloud config list --format 'value(core.project)')
$ gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com
```

3. Clone the repository

```
$ git clone https://github.com/enakai00/react_mine_sweeper.git
$ cd react_mine_sweeper
```

4. Build a container image

```
$ gcloud builds submit --tag gcr.io/$PROJECT_ID/react-mine-sweeper 
```

5. Deploy the image using Cloud Run

```
$ gcloud run deploy react-mine-sweeper \
  --image gcr.io/$PROJECT_ID/react-mine-sweeper \
  --platform=managed --region=asia-northeast1 \
  --allow-unauthenticated
```

When the image has been deployed successfully, you see the Service URL in the ouput.

```
Service URL: https://react-mine-sweeper-xxxxxxxxxx-xx.x.run.app
```

Open the URL with your web browser and enjoy the game :)


## Screenshot
![Screenshot](doc/img/screenshot.png)
