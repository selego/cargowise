

### If you are interested in integrating CargoWise into your business and need assistance, please fill out our [integration form](https://l.linklyhq.com/l/1ny0n) and our team will get in touch with you.

# CargoWise Client

A simplified SOAP client for interacting with CargoWise eAdaptor SOAP web services.

## Installation

Install the package with npm:

```bash
npm install cargowise --save
```

## Usage

```javascript
const { CargoWiseClient, Config } = require("cargowise");

// Define your config
const config = new Config({
  wsdlUrl: process.env.WSDL_URL,
  clientId: process.env.CLIENT_ID,
  username: process.env.SOAP_USERNAME,
  password: process.env.SOAP_PASSWORD,
});

// Create a new CargoWiseClient instance
const cargoWiseClient = new CargoWiseClient(config);

// Define a message to send
const message = `...`;

// Send the message
cargoWiseClient
  .send([{ message }])
  .then((trackingIds) => console.log(trackingIds))
  .catch((err) => console.error(err));
```

## API

### Config

A class for creating a configuration object.

### CargoWiseClient

A class for interacting with the CargoWise SOAP web service. It has the following methods:

#### send(messages: { message: string }[])

Sends a message to the CargoWise SOAP web service. Returns a promise that resolves to an array of tracking IDs.

## Environment

The following environment variables are required:

- `WSDL_URL`: The URL of the CargoWise SOAP web service WSDL.
- `CLIENT_ID`: The client ID for the CargoWise SOAP web service.
- `SOAP_USERNAME`: The username for the CargoWise SOAP web service.
- `SOAP_PASSWORD`: The password for the CargoWise SOAP web service.

## License

[MIT](https://choosealicense.com/licenses/mit/)

This package has been developed by [Docloop](https://l.linklyhq.com/l/1nexe), an integrator for CargoWise.


**Disclaimer: This is an unofficial package and not officially endorsed or maintained by CargoWise.**
