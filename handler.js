'use strict';

const AWS = require('aws-sdk')
const DynamoDBService = new AWS.DynamoDB()

/**
 * The application should perform the entire backup of the databases
 */
module.exports.backup = async () => {
  const tablesInfo = await DynamoDBService.listTables().promise()
  return await getAllProdTables(tablesInfo)
  
}

const getAllProdTables = async tables => {
  if (!tables || !tables.TableNames) {
    throw new TypeError('Tables are required')
  }

  const dateYearMonthDayFormatted = backupName(new Date())
  const backup = createBackup(dateYearMonthDayFormatted)
  return await Promise.all(tables.TableNames
    .filter(isProdTable)
    .map(backup))

}

const backupName = date => date.toISOString().split('T')[0]

const isProdTable = name => name.endsWith('-prod')

const createBackup = backupName => async tableName => {
  if (!backupName || !tableName) {
    throw new TypeError('The backup name and table name are required')
  }
  const backup = {
    BackupName: backupName,
    TableName: tableName
  }
  await DynamoDBService.createBackup(backup).promise()
  console.log('Table name', tableName, 'backed up with the name', backupName)
  return backup
}
