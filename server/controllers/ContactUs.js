const mailSender=require("../utils/mailSender");
const {contactUsEmail}=require("../mail/templates/contactFormRes");

exports.contactUsController=async(req,res)=>{
    const {firstName,lastName,email,message,phoneNo,countryCode}=req.body;
    
    // if(!firstName || !lastName || !email || !phoneNo || !message || !countryCode){
    //     return res.status(400).json({
    //         success:false,
    //         message:"Please fill the required Data"
    //     })
    // }
    console.log(req.body);
    try {

        const mailSended=await mailSender(email,"Your Data Send Successfully",
            contactUsEmail(email, firstName, lastName, message, phoneNo, countryCode));
        
        console.log(mailSended);

        if(!mailSended){
            return res.json({
                success:false,
                message:"Error occurred"
            })
        }
        console.log("email res",mailSended);
        return res.status(200).json({
            success:true,
            message:"Mail sended successfully"
        })

        
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"something went wrong"
        })
    }
}
