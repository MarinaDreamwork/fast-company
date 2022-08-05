const professionMock = require('../mock/professions.json');
const qualityMock = require('../mock/qualities.json');
const Profession = require('../models/Profession');
const Quality = require('../models/Quality');

module.exports = async () => {
  const profession = await Profession.find();
  if(profession.length !== professionMock.length) {
    await createInitialEntity(Profession, professionMock);
  }
  const qualities = await Quality.find();
  if(qualities.length !== qualityMock.length) {
    await createInitialEntity(Quality, qualityMock);
  }
};

async function createInitialEntity(Model, data) {
  await Model.collection.drop();
    return Promise.all(
      data.map(async item => {
        try {
          delete item._id;
          const newItem = new Model(item);
          await newItem.save();
          return newItem;
        } catch (error) {
          return error;
        }
      })
    );
};