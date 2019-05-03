const Vallox = require('@danielbayerlein/vallox-api')

let Characteristic, Service

module.exports = homebridge => {
  Service = homebridge.hap.Service
  Characteristic = homebridge.hap.Characteristic
  homebridge.registerAccessory('homebridge-vallox', 'Vallox', ValloxAccessory)
}

class ValloxAccessory {
  constructor (log, config) {
    this.log = log
    this.client = new Vallox({ ip: config.ip, port: config.port })

    // const fanService = new Service.Fan()

    const informationService = new Service.AccessoryInformation()
      .setCharacteristic(Characteristic.Manufacturer, 'Vallox')
    this.informationService = informationService

    const supplyAirService = new Service.TemperatureSensor()
      .getCharacteristic(Characteristic.CurrentTemperature)
      .on('get', async (callback) => {
        callback(null, await this.client.fetchMetric('A_CYC_TEMP_SUPPLY_AIR'))
      })
    this.supplyAirService = supplyAirService
  }

  getServices () {
    return [
      // this.fanService,
      this.informationService,
      this.supplyAirService
    ]
  }
}
