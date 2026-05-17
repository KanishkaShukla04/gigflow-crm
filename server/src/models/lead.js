import mongoose, { Schema, Document } from "mongoose";
const LeadSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: [
            "New",
            "Contacted",
            "Qualified",
            "Lost"
        ],
        default: "New"
    },
    source: {
        type: String,
        enum: [
            "Website",
            "Instagram",
            "Referral", "Linkedin"
        ]
    }
}, {
    timestamps: true
});
export default mongoose.model("Lead", LeadSchema);
//# sourceMappingURL=lead.js.map