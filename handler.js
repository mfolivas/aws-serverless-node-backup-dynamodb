'use strict';

const AWS = require('aws-sdk')
const DynamoDBService = new AWS.DynamoDB()

/**
 * The application should perform the entire backup of the databases
 */
module.exports.backup = async () => {
  const tablesInfo = await DynamoDBService.listTables().promise()
  // return JSON.stringify(tablesInfo)
  return await Promise.all(getAllProdTables(tablesInfo))
  
}

const getAllProdTables = tables => {
  if (!tables || !tables.TableNames) {
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
  const backup = createBackup(`manual-backup-${new Date().toISOString()}`)
  return tables.TableNames.filter(isProdTable).map(backup)

}
