import mongoose,{Schema,Document} from "mongoose";

export interface ILead extends Document{
name:string;
email:string;
status:string;
source:string;
}

const LeadSchema=new Schema<ILead>(
{
name:{
type:String,
required:true
},

email:{
type:String,
required:true
},

status:{
type:String,
enum:[
"New",
"Contacted",
"Qualified",
"Lost"
],
default:"New"
},

source:{
type:String,
enum:[
"Website",
"Instagram",
"Referral","Linkedin"
]
}

},
{
timestamps:true
}
)

export default mongoose.model<ILead>(
"Lead",
LeadSchema
)