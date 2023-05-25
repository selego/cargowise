// Import the necessary classes from the library
const { CargoWiseClient, Config } = require("./index");

// Define fake environment variables for the purpose of this example
process.env.WSDL_URL = 'https://fake-soap-service.wsdl';
process.env.CLIENT_ID = 'FAKE_CLIENT_ID';
process.env.SOAP_USERNAME = 'FAKE_USERNAME';
process.env.SOAP_PASSWORD = 'FAKE_PASSWORD';

// Create a config object with the required properties
// Sensitive information like the username and password is loaded from environment variables
const config = new Config({
  wsdlUrl: process.env.WSDL_URL,
  clientId: process.env.CLIENT_ID,
  username: process.env.SOAP_USERNAME,
  password: process.env.SOAP_PASSWORD,
});

// Create an instance of the EAdapterClient class
const cargoWiseClient = new CargoWiseClient(config);

// Example of a message to send to the SOAP service
// The structure and content of this message would depend on your specific SOAP service
const message = `
<UniversalInterchange xmlns="http://www.cargowise.com/Schemas/Universal/2011/11">
 <Header>
 <SenderID>abc</SenderID>
 <RecipientID>${process.env.CLIENT_ID}</RecipientID>
 </Header>
 <Body>
 <Native xmlns="http://www.cargowise.com/Schemas/Native/2011/11">
 <Header>
 <OwnerCode>abc</OwnerCode>
 <EnableCodeMapping>false</EnableCodeMapping>
 </Header>
 <Body>
 <UNLOCO version="2.0">
 <RefUNLOCO Action="UPDATE">
 <Code>AUANN</Code>
 <PortName>Annandale</PortName>
 <HasRail>true</HasRail>
 </RefUNLOCO>
 </UNLOCO>
 </Body>
 </Native>
 </Body>
</UniversalInterchange>
`;

// Send the message using the eAdapterClient
cargoWiseClient.send([{ message }])
  .then(trackingIds => {
    console.log("Successfully sent message. Tracking IDs:", trackingIds);
  })
  .catch(err => {
    console.error("Failed to send message:", err);
  });
