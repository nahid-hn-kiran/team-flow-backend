export const validateRequest = (zodSchema) => {
    return (req, res, next) => {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        }
        const parsedResult = zodSchema.safeParse(req.body);
        if (!parsedResult.success) {
            next(parsedResult.error);
        }
        req.body = parsedResult.data;
        next();
    };
};
