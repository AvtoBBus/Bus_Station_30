import { AnimalType, NewAnimalType } from "../DataTypes";
import { BaseApi } from "./BaseApi";

export class PetsApi extends BaseApi {
    getPetsList() {
        return this.sendRequest('GET', '/pets/getPetsList', null)
            .then(r => { return r.json(); })
    }

    getPetImg(id: string) {
        return this.sendRequest('GET', `/pets/getPetImg?id=${id}`, null)
            .then(r => { return r; })
    }

    addNewAnimal(animalType: string, newAnimal: NewAnimalType, file: File) {
        const data = new FormData();
        Object.keys(newAnimal).forEach((k: any) => {
            //@ts-ignore
            data.append(k, newAnimal[k]);
        })

        data.append("file", file);

        return this.sendRequest('POST', `/pets/addNewAnimal?animalType=${animalType}`, data, true)
            .then(r => { return r; })
    }

    editAnimal(animal: AnimalType) {
        const data = JSON.parse(JSON.stringify(animal));
        delete data._id;
        delete data.animalType;

        return this.sendRequest('POST', `/pets/editAnimal?id=${animal._id}`, data, false)
            .then(r => { return r; })
    }

    deleteAnimal(animalId: string) {
        return this.sendRequest('POST', `/pets/deleteAnimal?id=${animalId}`, null, false)
            .then(r => { return r; })
    }
}