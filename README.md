# Create a dynamodb backup for all tables within a prod stage environment

The application reads all the dynamodb tables from a given "prod" stage environment and backups the data.

Create a backup so that you get a list of all the tables and fetch only the ones that are in prod (ending with "-prod").  When you get those tables, then you set a backup name and process the backup.

Need to do the following
```
npm install
npm install serverless-pseudo-parameters
sls deploy
sls invoke -f backup
```

You should see two tables backed up.  You should go to your dynamodb and see the backup.