const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sanitize = require('mongo-sanitize');
const CryptoJS = require("crypto-js");
const SECRET_KEY = process.env.SECRET_KEY;

//ROUTES
const User = require("../models/user");
const passwordValidator = require('../middlewares/passwordValidator')
let emailCrypted
const emailCrypt = CryptoJS.AES.encrypt(emailCrypted, process.env.CRYPT_KEY).toString()

//PASS HASHED BY BCRYPT
exports.signup = (req, res, next) => {

	const isValid = passwordValidator.validate(req.body.password);
    if (!isValid) {
        return res.status(400).json({ message: "Le mot de passe n'est pas valide" });
    }

	emailCrypted = req.body.email;

	bcrypt.hash(req.body.password, 10)
		.then(hash => {
			const user = new User({
				email: emailCrypt,
				password: hash,
			});
			user
				.save()
				.then(() => res.status(201).json({ message: "Utilisateur créé ! " }))
				.catch(error => res.status(400).json({ error }));
		})
		.catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {	

	emailCrypted = req.body.email;

	const decryptMail = CryptoJS.AES.decrypt(emailCrypt, process.env.CRYPT_KEY).toString(CryptoJS.enc.Utf8);	

	const mail = sanitize(emailCrypt);
	const password = sanitize(req.body.password);

	User.findOne({ email: emailCrypt })
		.then((user) => {
			if (!user) {
				return res.status(401).json({ error: "Utilisateur non trouvé !" });
			}
			bcrypt
				.compare(password, user.password)
				.then((valid) => {
					if (!valid) {
						return res.status(401).json({ error: "Mot de passe incorrect !" });
					}
					res.status(200).json({
						userId: user._id,
						token: jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "24h" }),
					});
				})
				.catch(error => res.status(500).json({ error } ));
		})
		.catch(error => res.status(500).json({ error }));
};