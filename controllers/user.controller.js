const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select('-password');
  res.status(200).json(users);
};

// récupérer les information du client qui se connecte
module.exports.userInfo = (req, res) => {
  //req.body c'est quand on a des infos dans les inputs, req.params c'est les infos qu'on a dans l'URL | Vérifie si l'ID en paramètre est connu
  console.log(req.params);
  //si les ID dans mongo ne coorespondent pas à l'ID dans le params
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown : ' + req.params.id);

  UserModel.findById(req.params.id, (err, docs) => {
    //si pas d'erreur ça renvoi des datas (docs)
    if (!err) res.send(docs);
    else console.log('ID unknown: ' + err);
  }).select('-password');
};

module.exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown : ' + req.params.id);

  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .then((docs) => res.send(docs))
      .catch((err) => res.status(500).send({ message: err }));
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown : ' + req.params.id);

  try {
    await UserModel.deleteOne({ _id: req.params.id }).exec();
    res.status(200).json({ message: 'Successfully deleted.' });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.follow = async (req, res) => {
  if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow))
    return res.status(400).send('ID unknown : ' + req.params.id);

  try {
    // add to the follower List
    await UserModel.findByIdAndUpdate(
      req.params.id,
      // $addToSet veut dire rajoute à ce qu'on a déjà mis
      { $addToSet: { following: req.body.idToFollow } },
      { new: true, upsert: true }
    )
      .then((docs) => res.status(201).json(docs))
      .catch((err) => res.status(400).json(err));

    // add to following list
    await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { followers: req.params.id } },
      { new: true, upsert: true }
    ).catch((err) => res.status(400).json(err));
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.unFollow = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnFollow))
    return res.status(400).send('ID unknown : ' + req.params.id);

  try {
    await UserModel.findByIdAndUpdate(
      req.params.id,
      // $pull veut dire retirer
      { $pull: { following: req.body.idToUnFollow } },
      { new: true, upsert: true }
    )
      .then((docs) => res.status(201).json(docs))
      .catch((err) => res.status(400).json(err));

    // add to following list
    await UserModel.findByIdAndUpdate(
      req.body.idToUnFollow,
      { $pull: { followers: req.params.id } },
      { new: true, upsert: true }
    ).catch((err) => res.status(400).json(err));
  } catch (err) {
    return res.status(500).json({ message: err });
  }
}
