exports.adoptActionModel = {
    name: 1,
    phone: 1,
    email: 1,
    animalType: 1,
    comment: 1
}

exports.donateActionModel = {
    name: 1,
    phone: 1,
    email: 1,
    donateSize: 1
}

exports.volunteerActionModel = {
    name: 1,
    phone: 1,
    email: 1,
    comment: 1
}

exports.getUserActionsModel = {
    _id: 0,
    action: 1,
    animalType: 1,
    donateSize: 1,
    comment: 1,
    status: 1
}

exports.getUserActionsModelAdmin = {
    _id: 1,
    name: 1,
    action: 1,
    animalType: 1,
    donateSize: 1,
    comment: 1,
    status: 1
}