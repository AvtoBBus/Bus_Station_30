import { NewAnimalType } from "../DataTypes";
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
        // const data = JSON.parse(JSON.stringify(newAnimal));
        // Object.assign(data, { file: file });

        const data = new FormData();
        Object.keys(newAnimal).forEach((k: any) => {
            //@ts-ignore
            data.append(k, newAnimal[k]);
        })

        data.append("file", file);

        return this.sendRequest('POST', `/pets/addNewAnimal?animalType=${animalType}`, data, true)
            .then(r => { return r; })
    }
}