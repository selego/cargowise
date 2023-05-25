const util = require('util');
const fetch = require('node-fetch');
const soap = require('soap');
const url = require('url');
const zlib = require('zlib');
const gzip = util.promisify(zlib.gzip);

/**
* Compresses a given message.
*
* @param {string} message - The message to be compressed.
* @returns {Promise<string>} A promise that resolves to the compressed message.
*/
async function compressMessage(message) {
  try {
    const input = Buffer.from(message, 'utf8');
    const result = await gzip(input, { level: 1, windowBits: 9 });
    return result.toString('base64');
  } catch (err) {
    throw new Error(`Failed to compress message: ${err}`);
  }
}

/**
* Sets up the SOAP client.
*
* @param {Config} config - The configuration for the SOAP client.
* @returns {Promise<soap.Client>} A promise that resolves to the SOAP client.
*/
async function setupSoap(config) {
  const parsedUrl = new url.URL(config.wsdlUrl);

  if (typeof config.wsdlXml !== "string") {
    const res = await fetch(config.wsdlUrl);
    config.wsdlXml = await res.text();
  }

  const wsdlXml = config.wsdlXml.replace(/Server:SOAPWebServicePort/gi, parsedUrl.hostname);

  const wsdl = new soap.WSDL(wsdlXml, config.wsdlUrl, {});

  await new Promise((resolve, reject) => wsdl.onReady((err) => (err ? reject(err) : resolve(undefined))));

  const client = new soap.Client(wsdl);
  client.setSecurity(new soap.WSSecurity(config.username, config.password));

  return { wsdl, client };
}

module.exports = {
  compressMessage,
  setupSoap,
};
