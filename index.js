const { v4: uuidv4 } = require('uuid');
const { compressMessage, setupSoap } = require('./utils');

/**
 * Represents the configuration for a SOAP client.
 */
class Config {
  /**
   * Creates a new Config.
   *
   * @param {Object} params - The configuration parameters.
   * @param {string} params.wsdlUrl - The WSDL URL.
   * @param {string} params.wsdlXml - The WSDL XML.
   * @param {string} params.clientId - The client ID.
   * @param {string} params.username - The username.
   * @param {string} params.password - The password.
   */
  constructor({ wsdlUrl, wsdlXml, clientId, username, password }) {
    this.wsdlUrl = wsdlUrl;
    this.wsdlXml = wsdlXml;
    this.clientId = clientId;
    this.username = username;
    this.password = password;
  }
}

/**
 * Represents the EAdapter client.
 */
class CargoWiseClient {
  /**
   * Creates a new EAdapterClient.
   *
   * @param {Config} config - The configuration for the EAdapterClient.
   */
  constructor(config) {
    this.config = config;
    this.soapClient = setupSoap(config).then((res) => res.client);
  }

  /**
   * Pings the SOAP client.
   *
   * @returns {Promise<string>} A promise that resolves to the ping result.
   */
  async ping() {
    const client = await this.soapClient;
    const [result] = await client.PingAsync({});
    return result.PingResult;
  }

  /**
   * Sends a list of messages.
   *
   * @param {Array} messages - The list of messages to send.
   * @returns {Promise<Array<string>>} A promise that resolves to the list of tracking IDs.
   */
  async send(messages) {
    const eHubMessages = await Promise.all(
      messages.map(async (msg) => {
        const param = typeof msg === 'string' ? { message: msg } : msg;
        const compressedXml = await compressMessage(param.message);
        return {
          attributes: {
            ClientID: param.clientId || this.config.clientId,
            TrackingID: param.trackingId || uuidv4(),
            ApplicationCode: param.type === 'native-xml' ? 'NDM' : 'UDM',
            SchemaName:
              param.type === 'native-xml'
                ? 'http://www.cargowise.com/Schemas/Native#UniversalInterchange'
                : 'http://www.cargowise.com/Schemas/Universal/2011/11#UniversalInterchange',
            SchemaType: 'Xml',
          },
          $value: compressedXml,
        };
      })
    );

    const trackingIds = eHubMessages.map((m) => m.attributes.TrackingID);

    const client = await this.soapClient;
    try {
      await client.SendStreamAsync({
        Payload: {
          Message: eHubMessages,
        },
      });
    } catch (err) {
      throw new Error(`Failed to send messages: ${err}`);
    }

    return trackingIds;
  }
}

module.exports = {
  Config,
  CargoWiseClient,
};
