param location string
param name string

resource staticWebApp 'Microsoft.Web/staticSites@2022-09-01' = {
  name: name
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    repositoryUrl: 'https://github.com/Soufiane4906/DigicampMonitoring'
    branch: 'main'
    buildProperties: {
      appLocation: '/front'
      apiLocation: ''
      outputLocation: 'dist/digicamp-monitoring'
    }
  }
}

output frontendUrl string = 'https://${staticWebApp.properties.defaultHostname}'
output staticWebAppId string = staticWebApp.id