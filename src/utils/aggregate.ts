const auctionCarAggregate = [
  {
    $lookup: {
      from: 'cars',
      localField: 'car',
      foreignField: '_id',
      as: 'car',
    },
  },
  {
    $unwind: {
      path: '$car',
    },
  },
  {
    $lookup: {
      from: 'carmakes',
      localField: 'car.make',
      foreignField: '_id',
      as: 'car.make',
    },
  },
  {
    $unwind: {
      path: '$car.make',
    },
  },
  {
    $lookup: {
      from: 'carmodels',
      localField: 'car.model',
      foreignField: '_id',
      as: 'car.model',
    },
  },
  {
    $unwind: {
      path: '$car.model',
    },
  },
  {
    $lookup: {
      from: 'cartrims',
      localField: 'car.trim',
      foreignField: '_id',
      as: 'car.trim',
    },
  },
  {
    $unwind: {
      path: '$car.trim',
    },
  },
  {
    $lookup: {
      from: 'carcolors',
      localField: 'car.exteriorColor',
      foreignField: '_id',
      as: 'car.exteriorColor',
    },
  },
  {
    $unwind: {
      path: '$car.exteriorColor',
    },
  },
  {
    $lookup: {
      from: 'carcolors',
      localField: 'car.interiorColor',
      foreignField: '_id',
      as: 'car.interiorColor',
    },
  },
  {
    $unwind: {
      path: '$car.interiorColor',
    },
  },
  {
    $lookup: {
      from: 'fueltypes',
      localField: 'car.fuelType',
      foreignField: '_id',
      as: 'car.fuelType',
    },
  },
  {
    $unwind: {
      path: '$car.fuelType',
    },
  },
  {
    $lookup: {
      from: 'cartransmissions',
      localField: 'car.transmission',
      foreignField: '_id',
      as: 'car.transmission',
    },
  },
  {
    $unwind: {
      path: '$car.transmission',
    },
  },
];

export { auctionCarAggregate };
