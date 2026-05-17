import Lead from "../models/lead.js";
// CREATE LEAD
export const createLead = async (req, res) => {
    try {
        const lead = await Lead.create(req.body);
        return res.status(201).json(lead);
    }
    catch (error) {
        console.log("LEAD ERROR:", error);
        return res.status(500).json({
            message: error.message
        });
    }
};
// GET ALL LEADS
export const getLeads = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = 5;
        const filters = {};
        if (req.query.search) {
            filters.$or = [
                {
                    name: {
                        $regex: String(req.query.search),
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: String(req.query.search),
                        $options: "i"
                    }
                }
            ];
        }
        if (req.query.status) {
            filters.status = String(req.query.status);
        }
        if (req.query.source) {
            filters.source = String(req.query.source);
        }
        const count = await Lead.countDocuments(filters);
        const leads = await Lead.find(filters)
            .sort({
            createdAt: -1
        })
            .skip((page - 1) * limit)
            .limit(limit);
        res.json({
            leads,
            page,
            pages: Math.ceil(count / limit),
            total: count
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
// UPDATE LEAD
export const updateLead = async (req, res) => {
    try {
        const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        res.json(lead);
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
// DELETE LEAD
export const deleteLead = async (req, res) => {
    try {
        if (req.user?.role !== "Admin") {
            return res.status(401).json({
                message: "Admin only"
            });
        }
        await Lead.findByIdAndDelete(req.params.id);
        res.json({
            message: "Lead deleted"
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
//# sourceMappingURL=leadController.js.map