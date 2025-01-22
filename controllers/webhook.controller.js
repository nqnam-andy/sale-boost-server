const jwt = require("jsonwebtoken");
const { webhook } = require("../configs");
const WebhookModel = require("../models/webhook.model");
const SiteModel = require("../models/site.model");
const PlatformModel = require("../models/platform.model");
const { sendSlackMessage } = require("../hooks/slackWebhook.hook");
const { hooks } = require("../configs");
const { messageOrderCreated, messageOrderCanceled } = require("../helpers/hooks.helper");

const ORDER_CREATED = "Order Created";
const ORDER_CANCELED = "Order Canceled";

exports.orderCreatedWebhook = async (req, res) => {
  let event;
  let eventData;

  try {
    const rawPayload = jwt.verify(req.body, webhook.public_key);
    event = JSON.parse(rawPayload.data);
    eventData = JSON.parse(event.data);
  } catch (err) {
    console.error(err);
    res.status(400).send(`Webhook error: ${err.message}`);
    return;
  }

  const site = await SiteModel.findOne({
    instanceId: event.instanceId,
  });

  if (!site) {
    return res.status(200).send("Please set up the site settings first!");
  }

  const platform = await PlatformModel.findOne({
    siteObjectId: site._id,
  });

  if (!platform || !site) {
    return res.status(200).send("Please set up the platform settings first!");
  }

  const message = messageOrderCreated(eventData.createdEvent.entity);
  const result = await sendSlackMessage({url: platform.url, data: eventData.createdEvent.entity, site, type: ORDER_CREATED});

  if (result) {
    await WebhookModel.create({
      siteObjectId: site._id,
      type: webhook.type,
      description: message,
      objectId: eventData.createdEvent.entity.id,
      name: ORDER_CREATED,
    });

    await SiteModel.findOneAndUpdate(
      {
        instanceId: event.instanceId,
      },
      {
        $inc: { amountAction: -1 },
      }
    );

    res.status(200).send("Notification order created sent to Slack successfully!");
  }

  res.status(200).send();
};

exports.orderCanceledWebhook = async (req, res) => {
  let event;
  let eventData;

  try {
    const rawPayload = jwt.verify(req.body, webhook.public_key);
    event = JSON.parse(rawPayload.data);
    eventData = JSON.parse(event.data);
  } catch (err) {
    console.error(err);
    res.status(400).send(`Webhook error: ${err.message}`);
    return;
  }

  const site = await SiteModel.findOne({
    instanceId: event.instanceId,
  });

  if (!site) {
    return res.status(200).send("Please set up the site settings first!");
  }

  const platform = await PlatformModel.findOne({
    siteObjectId: site._id,
  });

  if (!platform) {
    return res.status(200).send("Please set up the platform settings first!");
  }

  const message = messageOrderCanceled(eventData.actionEvent.body);
  const result = await sendSlackMessage({url: platform.url, data: eventData.actionEvent.body, site, type: ORDER_CANCELED});

  if (result) {
    await WebhookModel.create({
      siteObjectId: site._id,
      type: webhook.type,
      description: message,
      objectId: eventData.actionEvent.body.order.id,
      name: ORDER_CANCELED,
    });

    await SiteModel.findOneAndUpdate(
      {
        instanceId: event.instanceId,
      },
      {
        $inc: { amountAction: -1 },
      }
    );

    res.status(200).send("Notification order canceled sent to Slack successfully!");
  }

  res.status(200).send();
};

exports.settingsWebhook = async (req, res) => {
  const { siteId, instanceId, url , key } = req.body;

  let site = await SiteModel.findOne({
    instanceId,
  });

  if (!site) {
    site = SiteModel.create({
      siteId,
      instanceId,
    });
  }

  let platform = await PlatformModel.findOne({
    siteObjectId: site._id,
  });

  if (!platform) {
    platform = await PlatformModel.create({
      siteObjectId: site._id,
      url,
      key,
      hookName: hooks.name,
    });
  } else {
    platform = await PlatformModel.findOneAndUpdate(
      {
        siteObjectId: site._id,
      },
      {
        url,
        key,
      },
      {
        new: true,
      }
    );
  }

  res.status(200).json(platform);
}

exports.getOrders = async (req, res) => {
  const { instanceId } = req.params;
  const site = await SiteModel.findOne({ instanceId });

  if (!site) {
    return res.status(200).json({orders: []});
  }
  
  const orders = await WebhookModel.find({ siteObjectId: site._id, type: webhook.type }).sort({ createdAt: -1 });

  const ordersResult = orders.map(order => {
    return {
      name: order.name,
      description: order.description,
      link: `https://manage.wix.com/dashboard/${site.siteId}/ecom-platform/order-details/${order.objectId}`,
      createdAt: order.createdAt,
    };
  });

  res.status(200).json({orders: ordersResult});
}
