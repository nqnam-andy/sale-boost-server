const axios = require('axios');
const { messageOrderCreated, messageOrderCanceled } = require('../helpers/hooks.helper');

exports.sendSlackMessage = async ({url, data, site, type}) => {
  let message;
  let orderId;

  switch (type) {
    case "Order Created":
      message = messageOrderCreated(data);
      orderId = data.id;
      break;
    case "Order Canceled":
      message = messageOrderCanceled(data);
      orderId = data.order.id;
      break;
    // case "Order Purchased":
    //   message = messageOrderPurchased(order);
    //   break;
    default:
      message = ""
      break;
    }
  console.log('message', message);
  console.log('orderId', orderId);
  const content = {
    attachments: [
      {
        color: "#36a64f",
        pretext: `*${type}*`,
        title: `Order ID: ${orderId}`,
        text: message,
        actions: [
          {
            type: "button",
            text: "View Order",
            url: `https://manage.wix.com/dashboard/${site.siteId}/ecom-platform/order-details/${orderId}`,
          },
        ],
      },
    ],
  };

  try {
    const response = await axios.post(url, content);
    console.log("Notification sent to Slack");
    return response;
  } catch (error) {
    console.error("Error sending notification to Slack", error);
    return false;
  }
}
