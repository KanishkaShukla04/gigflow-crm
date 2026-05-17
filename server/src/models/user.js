import mongoose, { Schema, Document } from "mongoose";
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["Admin", "Sales"],
        default: "Sales"
    }
}, {
    timestamps: true
});
export default mongoose.model("User", UserSchema);
//# sourceMappingURL=user.js.map