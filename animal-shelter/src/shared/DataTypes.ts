export interface AnimalType {
    _id: string,
    animalName: string,
    animalType: 'cat' | 'dog',
    breed: string,
    age: number,
    features: string,
    illness: string,
    status: string
}

export interface User {
    userId: string,
    userName: string,
    userRole: "anonim" | "user" | "admin",
    userActions: Array<{
        action: string,
        animalType?: string,
        donateSize?: number,
        comment?: string,
    }>
}

interface UsetsActionsType {
    name: string,
    phone: string,
    email: string,
}

export interface UserWantAdoptType extends UsetsActionsType {
    animalType: "dog" | "cat" | "any",
    comment: string
}

export interface UserWantDonateType extends UsetsActionsType {
    donateSize: number
}

export interface UserWantVolunteerType extends UsetsActionsType {
    comment: string
}

export interface NewAnimalType {
    animalName: string,
    animalType: 'cat' | 'dog',
    breed: string,
    age: number,
    features: string,
    illness: string,
    status: string
}