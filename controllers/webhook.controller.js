const jwt = require("jsonwebtoken");



exports.createProductWebhook = async (req, res) => {
  let event;
  let eventData;

  try {
    const rawPayload = jwt.verify(req.body, PUBLIC_KEY);
    event = JSON.parse(rawPayload.data);
    eventData = JSON.parse(event.data);
    console.log(event);
  } catch (err) {
    console.error(err);
    res.status(400).send(`Webhook error: ${err.message}`);
    return;
  }

  switch (event.eventType) {
    case "com.wix.ecommerce.catalog.api.v1.ProductCreated":
      console.log(`com.wix.ecommerce.catalog.api.v1.ProductCreated event received with data:`, eventData);
      //
      // handle your event here
      //
      break;
    default:
      console.log(`Received unknown event type: ${event.eventType}`);
      break;
  }

  res.status(200).send();
};
