const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(token, SECRET_KEY);
		const userId = decodedToken.userId;
		if (req.body.userId && req.body.userId !== userId) {
			throw "User ID non valable !";
		} else {
			next();
		}
	} catch (error) {
		res.status(401).json({ error: error | "requete non authentifiée !" });
	}
};
