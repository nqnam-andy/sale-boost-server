exports.messageOrderCreated = (order) => {
  const productDetails = order.lineItems.map(
    (item) =>
      `${item.productName.original} (${item.quantity} x ${item.price.formattedAmount})`
  ).join(", ");
  const message = `
  *New Order Notification*

  - *Order Number:* ${order.number}
  - *Buyer:* ${order.buyerInfo?.email || ""}
  - *Product:* ${productDetails}
  - *Total:* ${order.priceSummary?.total?.formattedAmount}
  - *Status:* ${order.paymentStatus}, ${order.fulfillmentStatus}
  - *Date:* ${new Date(order.createdDate).toUTCString()}

  Please review and process the order.
    `;
  return message;
}

exports.messageOrderCanceled = (data) => {
  const order = data.order;
  const productDetails = order.lineItems.map(
    (item) =>
      `${item.productName.original} (${item.quantity} x ${item.price.formattedAmount})`
  ).join(", ");
  const message = `
  *Order canceled Notification*

  - *Order Number:* ${order.number}
  - *Buyer:* ${order.buyerInfo?.email || ""}
  - *Product:* ${productDetails}
  - *Total:* ${order.priceSummary?.total?.formattedAmount}
  - *Status:* ${order.paymentStatus}, ${order.fulfillmentStatus}
  - *Reason:* ${data.customMessage}
  - *Date:* ${new Date(order.createdDate).toUTCString()}

  Please review and process the order.
    `;
  return message;
}