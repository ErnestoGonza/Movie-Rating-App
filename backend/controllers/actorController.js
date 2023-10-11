const { isValidObjectId } = require('mongoose');
const Actor = require('../models/actorSchema');
const {
  uploadImageToCloud,
  destroyImageFromCloud,
} = require('../utils/helper');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

exports.createActor = async (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req;

  const newActor = new Actor({ name, about, gender });

  if (file) {
    const newAvatar = await uploadImageToCloud(file);
    newActor.avatar = { ...newAvatar };
  }
  await newActor.save();

  res.status(201).json({
    id: newActor._id,
    name,
    about,
    gender,
    avatar: newActor.avatar?.url,
  });
};

exports.updateActor = async (req, res) => {
  const { name, about, gender } = req.body;
  const { id } = req.params;
  const { file } = req;

  if (!isValidObjectId(id)) res.status(401).json({ error: 'Invalid request!' });

  const actor = await Actor.findById(id);
  if (!actor) return res.status(404).json({ error: 'Actor not found!' });

  const public_id = actor.avatar?.public_id;

  if (public_id && file) {
    const { result } = await destroyImageFromCloud(public_id);

    if (result !== 'ok')
      return res
        .status(401)
        .json({ error: 'Could not remove image from cloud!' });
  }

  if (file) {
    const newAvatar = await uploadImageToCloud(file);

    console.log(newAvatar);

    actor.avatar = { ...newAvatar };
  }
  actor.name = name;
  actor.about = about;
  actor.gender = gender;

  await actor.save();

  res.status(201).json({
    id: actor._id,
    name,
    about,
    gender,
    avatar: actor.avatar?.url,
  });
};

exports.removeActor = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) res.status(401).json({ error: 'Invalid request!' });

  const actor = await Actor.findById(id);
  if (!actor) return res.status(404).json({ error: 'Actor not found!' });

  const public_id = actor.avatar?.public_id;

  if (public_id) {
    const { result } = await destroyImageFromCloud(public_id);

    if (result !== 'ok')
      return res
        .status(401)
        .json({ error: 'Could not remove image from cloud!' });
  }

  await Actor.findByIdAndDelete(id);

  res.status(200).json({ message: 'Successfully deleted' });
};

exports.searchActor = async (req, res) => {
  const { query } = req;

  const result = await Actor.find({ $text: { $search: `"${query.name}"` } });

  res.json(result);
};

exports.getLatestActors = async (req, res) => {
  const result = await Actor.find({}).sort({ createdAt: '-1' }).limit(12);

  res.status(200).json(result);
};

exports.getSingleActor = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) res.status(401).json({ error: 'Invalid request!' });

  const actor = await Actor.findById(id);
  if (!actor) res.status(404).json({ message: 'Could not retrieve actor!' });

  res.status(200).json(actor);
};

/** 
 * update/:id
 * 
 * Needs testing, but may only want to provide specific values for upating and dynamically keeping the rest the same.
 * 
 *   const update = {
    name: req.body?.name,
    about: req.body?.about,
    gender: req.body?.gender,
  };

  if (!isValidObjectId(id)) res.status(401).json({ error: 'Invalid request!' });

  const updatedActor = await Actor.findOneAndUpdate({ _id: id }, update);
  if (!updatedActor) return res.status(404).json({ error: 'Actor not found!' });

  const public_id = updatedActor.avatar?.public_id;

  if (public_id && file) {
    const { result } = await cloudinary.uploader.destroy(public_id);

    if (result !== 'ok')
      return res
        .status(401)
        .json({ error: 'Could not remove image from cloud!' });
  }

  if (file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path
    );
    updatedActor.avatar = { url: secure_url, public_id };
  }
  await updatedActor.save();

  const { _id, name, gender, about } = updatedActor;

  res.status(201).json({ _id, name, gender, about, ...update });
*/
