/*
    The `schema` parameter is a Zod-defined structure used to validate request data.
        - parseAsync() is a Zod method available on every Zod schema object.
        - It comes from Zod itself, not your code.
        - It validates data asynchronously (useful if your schema includes async refinements).
*/

const validate = (schema)=> async(req, res, next) => {
    try{
        const parseBody = await schema.parseAsync(req.body);
        req.body = parseBody;
        next(); //proceed to next middleware or route handler
    } catch(error) {
        const message = error.errors[0].message;
        return res.status(400).json({message: message})
    }
}

module.exports = validate;