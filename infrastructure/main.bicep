targetScope = 'subscription'

param location string = 'westeurope'
param environmentName string = 'prod'
param projectName string = 'digicamp-monitoring'

var resourceGroupName = '${projectName}-${environmentName}-rg'

resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: resourceGroupName
  location: location
}

module sqlServer './modules/sql-server.bicep' = {
  scope: rg
  name: 'sqlServerDeployment'
  params: {
    location: location
    serverName: '${projectName}-${environmentName}-sql'
    administratorLogin: 'sqladmin'
    databaseName: 'digicampdb'
  }
}

module appService './modules/app-service.bicep' = {
  scope: rg
  name: 'appServiceDeployment'
  params: {
    location: location
    appServicePlanName: '${projectName}-${environmentName}-plan'
    backendAppName: '${projectName}-backend-${environmentName}'
  }
}

module storage './modules/storage.bicep' = {
  scope: rg
  name: 'storageDeployment'
  params: {
    location: location
    storageAccountName: '${replace(projectName, '-', '')}${environmentName}sa'
  }
}

module staticWebApp './modules/static-web-app.bicep' = {
  scope: rg
  name: 'staticWebAppDeployment'
  params: {
    location: location
    name: '${projectName}-frontend-${environmentName}'
  }
}

output resourceGroupName string = rg.name
output sqlServerName string = sqlServer.outputs.serverName
output backendUrl string = appService.outputs.backendUrl
output frontendUrl string = staticWebApp.outputs.frontendUrl
output storageAccountName string = storage.outputs.storageAccountName