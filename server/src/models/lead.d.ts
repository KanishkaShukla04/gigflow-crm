import mongoose, { Document } from "mongoose";
export interface ILead extends Document {
    name: string;
    email: string;
    status: string;
    source: string;
}
declare const _default: mongoose.Model<ILead, {}, {}, {}, mongoose.Document<unknown, {}, ILead, {}, mongoose.DefaultSchemaOptions> & ILead & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ILead>;
export default _default;
//# sourceMappingURL=lead.d.ts.map