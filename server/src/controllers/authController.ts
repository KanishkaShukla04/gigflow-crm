import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";
export const registerUser=async(
req:Request,
res:Response
)=>{

try{

const{
name,
email,
password,
role
}=req.body;

const userExists=
await User.findOne({email});

if(userExists){

return res.status(400).json({
message:"User already exists"
});

}

const salt=
await bcrypt.genSalt(10);

const hashedPassword=
await bcrypt.hash(
password,
salt
);

const user=
await User.create({

name,

email,

password:hashedPassword,

role

});

res.status(201).json({

_id:user._id,

name:user.name,

email:user.email,

role:user.role,

token:generateToken(
String(user._id)
)
});

}catch(error:any){

console.log("REGISTER ERROR:", error);

res.status(500).json({
message:error.message
})
}
}
export const loginUser = async (req: Request, res: Response) => {
  try {


    const { email, password } = req.body;

    const user = await User.findOne({ email });


    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);


    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    return res.status(200).json({

  _id: user._id,

  name: user.name,

  email: user.email,

  role: user.role,

  token: generateToken(
    String(user._id)
  )

});
  } catch (error: any) {

    console.log("LOGIN ERROR:", error);

    return res.status(500).json({
      message: error.message
    });

  }
};
