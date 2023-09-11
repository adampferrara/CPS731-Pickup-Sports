import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;

        if (!auth) {
            return;
        }

        const token = auth.split(" ")[1];
        const isCustom = token.length < 500;

        let decodedData;
        if (token) {
            decodedData = jwt.verify(token, "test");
            req.userId = decodedData?.id;
        }

        next();
    } catch (error) {
        console.error(`ERROR AT ${error}`);
    }
};

export default auth;