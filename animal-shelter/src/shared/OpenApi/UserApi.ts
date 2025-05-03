import { UserWantAdoptType, UserWantDonateType, UserWantVolunteerType } from "../DataTypes";
import { BaseApi } from "./BaseApi";

export class UserApi extends BaseApi {
    sendAdoptForm(data: UserWantAdoptType) {
        return this.sendRequest('POST', '/usersActions/userWantAdopt', data)
            .then(r => { return r; })
    }

    sendDonateForm(data: UserWantDonateType) {
        return this.sendRequest('POST', '/usersActions/userWantDonate', data)
            .then(r => { return r; })
    }

    sendVolunteerForm(data: UserWantVolunteerType) {
        return this.sendRequest('POST', '/usersActions/userWantVolunteer', data)
            .then(r => { return r; })
    }


    userInfo() {
        return this.sendRequest("GET", "/login/userinfo")
            .then(r => {
                if (r.status > 400) return null;
                return r.json();
            })
    }

    userAuth(data: { username: string, password: string }) {
        return this.sendRequest("POST", "/login/auth", data)
            .then(r => { return r; })
    }

    userLogout() {
        return this.sendRequest("GET", "/login/logout")
            .then(r => { return r; })
    }
}