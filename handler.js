'use strict';

const AWS = require('aws-cdk')
const DynamoDBService = new AWS.DynamoDB.DocumentClient()

/**
 * The application should perform the entire backup of the databases
 */
module.exports.backup = async () => {
  const tablesInfo = DynamoDBService.listTables().promise()
  return await Promise.all(getAllProdTables(tablesInfo))
  
}

const getAllProdTables = tables => {
  if (!tables || !tables.data.TableNames) {
    throw new TypeError('Tables are required')
  }

  const isProdTable = name => name.endsWith('-prod')
  const createBackup = backupName => tableName => {
    if (!backupName || !tableName) {
      throw new TypeError('The backup name and table name are required')
    }
    const backup = {
      BackupName: backupName,
      TableName: tableName
    }
    DynamoDBService.createBackup(backup).promise()
    console.log('Table name', tableName, 'backed up with the name', backupName)
    return backup
  }
  const backup = createBackup(`manual-backup-${new Date()}`)
  return tables.data.TableNames.filter(isProdTable).map(backup)

}
