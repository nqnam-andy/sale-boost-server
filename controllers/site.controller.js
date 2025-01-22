const Site = require('../models/site.model');
const PlatformModel = require('../models/platform.model');
const { data } = require('../configs/')
const { hooks } = require("../configs");

exports.createOrReloadSite = async (req, res) => {
    try {
        const { siteId, instanceId } = req.body;

        const existingSite = await Site.findOne({ instanceId });
        console.log(existingSite);
        if (existingSite) {
            let updatedSite = await reloadAmountActionForNewDay({ instanceId });
            const platform = await getPlatform(updatedSite._id);
            updatedSite = updatedSite.toJSON();
            updatedSite.url = platform?.url ? platform.url : "";
            return res.status(200).json(updatedSite);
        }

        let newSite = new Site({ siteId, instanceId });

        await newSite.save();
        const platform = await getPlatform(newSite._id);
        newSite = newSite.toJSON();
        newSite.url = platform?.url ? platform.url : "";
        res.status(201).json(newSite);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

async function getPlatform(siteId) {
    let platform = PlatformModel.findOne({ siteObjectId: siteId, hookName: hooks.name });
    if (!platform) {
        return null;
    }

    return platform;
}

exports.updateAmount = async (req, res) => {
    try {
        const currentDate = new Date().toISOString().split('T')[0];
        let site = await Site.findOne({ instanceId: req.params.instanceId });
        let amountAction = Number(site.amountAction);
        console.log(currentDate);
        console.log(site.updatedAt.toISOString().split('T')[0]);
        if (site && site.updatedAt.toISOString().split('T')[0] !== currentDate) {
          amountAction = 20;
        }
        site = await Site.findOneAndUpdate(
            { instanceId: req.params.instanceId },
            { amountAction: amountAction - 1 },
            { new: true, runValidators: true }
        );
        console.log(site);
        if (!site) return res.status(404).json({ error: 'Site not found' });
        res.status(200).json(site);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

async function reloadAmountActionForNewDay({ instanceId }) {
    const currentDate = new Date().toISOString().split('T')[0];
    let site = await Site.findOne({ instanceId });
    if (site && site.updatedAt.toISOString().split('T')[0] !== currentDate) {
        site = await Site.findOneAndUpdate(
            { instanceId: instanceId },
            { amountAction: data.default_amount_action },
            { new: true }
        );
    }

    return site;
}
