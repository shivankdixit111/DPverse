const z = require('zod')

const signupSchema = z.object({
    name: z.string().nonempty({message: "Name is required"}),
    email: z.string().nonempty({message: "Email is required"}).email({message: "Invalid email"}),
    password: z.string().nonempty({message: "Password is required"}).min(8,{message: "Password must be atleast 8 characters"}),
    graduationYear: z.string().nonempty({message: "graduationYear is required"})  
})

const loginSchema = z.object({ 
    email: z.string().nonempty({message: "Email is required"}).email({message: "Invalid email"}),
    password: z.string().nonempty({message: "Password is required"}) 
})

module.exports = {signupSchema, loginSchema}

