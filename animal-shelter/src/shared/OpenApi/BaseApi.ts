export class BaseApi {

    private basePath = `http://localhost:5000/`;

    constructor(basePath?: string) {
        if (basePath) this.basePath = basePath
    }

    protected sendRequest(
        method: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT',
        url: string,
        data?: any,
        isFormData: boolean = false
    ): Promise<any> {

        const headers = isFormData ? { "Accept": "*/*" } : {
            "Content-Type": "application/json",
            "Accept": "*/*"
        }

        const requestBody: RequestInit = {
            method: method,
            headers: headers as HeadersInit,
            credentials: "include"
        }

        if (isFormData) {
            Object.assign(requestBody, { body: data })
        }
        else data && Object.assign(requestBody, { body: JSON.stringify(data) })

        if (url.startsWith('/')) url = url.slice(1);

        return fetch(this.basePath + url, requestBody)
            .then(r => { return r; })
    }
}