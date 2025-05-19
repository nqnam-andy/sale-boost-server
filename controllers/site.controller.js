const Site = require('../models/site.model');
const PlatformModel = require('../models/platform.model');
const { data } = require('../configs/');
const { hooks } = require("../configs");
const Package = require('../models/package.model');

exports.createOrReloadSite = async (req, res) => {
    try {
        const { siteId, instanceId, billing } = req.body;
        const packages = await Package.find()

        const amountAction =
            packages.find((pkg) => {
                if (!pkg.title) return false
                return slugify(pkg.title) === billing
            })?.amountQuestion || data.default_amount_action

        const existingSite = await Site.findOne({ instanceId });
        console.log(existingSite);
        if (existingSite) {
            let updatedSite = await reloadAmountActionForNewDay({ instanceId, amountAction });
            if (billing !== updatedSite.billing) {
                updatedSite = await Site.findOneAndUpdate(
                    { instanceId },
                    {
                        billing,
                        amountAction: amountAction
                    },
                    { new: true, runValidators: true }
                );
            }

            return res.status(200).json(updatedSite);
        }

        let newSite = new Site({ siteId, instanceId, billing });

        await newSite.save();
        res.status(201).json(newSite);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const slugify = (text) => {
    return text
        .trim() // Cắt khoảng trắng đầu và cuối
        .toLowerCase() // Đưa về chữ thường
        .replace(/\s+/g, '-') // Thay thế khoảng trắng giữa các từ bằng dấu -
}

exports.updateAmount = async (req, res) => {
    try {
        const { billing } = req.body;
        const currentDate = new Date().toISOString().split('T')[0];
        let site = await Site.findOne({ instanceId: req.params.instanceId });
        let amountAction = Number(site.amountAction);
        console.log(currentDate);
        console.log(site.updatedAt.toISOString().split('T')[0]);
        if (site && site.updatedAt.toISOString().split('T')[0] !== currentDate) {
            const packages = await Package.find()

            amountAction =
                packages.find((pkg) => {
                    if (!pkg.title) return false
                    return slugify(pkg.title) === billing
                })?.amountQuestion || data.default_amount_action
        }

        if (amountAction === -1) {
            // Nếu là gói không giới hạn, chỉ trả về site mà không update
            site = await Site.findOne({ instanceId: req.params.instanceId });
        } else {
            site = await Site.findOneAndUpdate(
                { instanceId: req.params.instanceId },
                { amountAction: amountAction - 1 },
                { new: true, runValidators: true }
            );
        }
        console.log(site);
        if (!site) return res.status(404).json({ error: 'Site not found' });
        res.status(200).json(site);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

async function reloadAmountActionForNewDay({ instanceId, amountAction }) {
    const currentDate = new Date().toISOString().split('T')[0];
    let site = await Site.findOne({ instanceId });
    if (site && site.updatedAt.toISOString().split('T')[0] !== currentDate) {
        site = await Site.findOneAndUpdate(
            { instanceId: instanceId },
            { amountAction: amountAction },
            { new: true }
        );
    }

    return site;
}
