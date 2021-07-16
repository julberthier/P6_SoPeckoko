const Sauce = require("../models/sauce");
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const saucesObject = JSON.parse(req.body.sauce);
	delete saucesObject._id;
	const sauce = new Sauce({
		...saucesObject, 
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
		likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
		userId: saucesObject.userId
	});
	sauce
		.save()
		.then(() => { res.status(201).json({ message: "Post saved successfully!" });
		})
		.catch(error => { res.status(400).json({ error: error });
		});
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
		_id: req.params.id,
	})
		.then((sauce) => { res.status(200).json(sauce) })
		.catch(error => { res.status(404).json({ error: error });
		});	

}

exports.modifySauce = (req, res, next) => {
		const sauceObject =  req.file? 
		// ? =>  Operateur ternaire pour savoir si req.file existe.
		{ 
			...JSON.parse(req.body.sauce),
			imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
		} : { ...req.body}
		Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
			.then(() => {
				res.status(201).json({ message: "Sauce mise à jour !" })
			})
			.catch(error => { res.status(400).json({ error: error });
			});
}

exports.deleteSauce = (req, res, next) => {
Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () =>{
            Sauce.deleteOne({ _id: req.params.id })
				.then(() => {
					res.status(200).json({message: "Sauce supprimée !"});
				})
				.catch(error => res.status(400).json({ error: error }));
        })
    })
    .catch(error => res.status(500).json({ error: error }));
}

exports.getAllSauce = (req, res, next) => {
	Sauce.find()
		.then((sauces) => { res.status(200).json(sauces)})
		.catch(error => { res.status(400).json({ error: error });
		});
}

exports.likeSauce = (req, res, next) => {

	const userId = req.body.userId;
	const numberLikes = req.body.like;
	
	Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        switch(numberLikes) {
            case +1:
                Sauce.updateOne({_id: req.params.id}, { $push: {usersLiked: userId}, $inc: {likes: +1}
				})
            .then(() => res.status(200).json({ message: "J'aime la sauce !" }))
            .catch(error => res.status(400).json({ error }));
            break;

            case -1:
                Sauce.updateOne({_id: req.params.id}, { $push: {usersDisliked: userId}, $inc: {dislikes: +1}
				})
            .then(() => res.status(200).json({ message: "Je n'aime pas la sauce !"}))
            .catch(error => res.status(400).json({ error }));
            break;

            case 0:				
				let promise;
				if (sauce.usersLiked.find((element) => element === userId)) {
					promise = Sauce.updateOne({_id: req.params.id}, { $pull: {usersLiked: userId}, $inc: {likes: -1}})			
				} else {
					promise = Sauce.updateOne({_id: req.params.id}, { $pull: {usersDisliked: userId}, $inc: {dislikes: -1}})
				} 
				promise               
					.then(() => res.status(200).json({ message: "Avis mis à jour !"}))
					.catch(error => res.status(400).json({ error }));
					break;
        }
    })
	.catch(error => res.status(400).json({ error: error }))
}