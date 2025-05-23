export const validateData = (data: string, field: "username" | "email" | "phone" | "password" | "number" | "city"): boolean => {
    enum getRegExp {
        //@ts-ignore
        username = /^[a-zA-Zа-яА-ЯёЁ0-9_-]{3,20}$/,
        //@ts-ignore
        email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        //@ts-ignore
        phone = /^\+[0-9]{10,15}$/,
        //@ts-ignore
        password = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
        //@ts-ignore
        number = /^[0,9]{1,}$/,
        //@ts-ignore
        city = /^[А-ЯA-Z]{1}[a-zA-Zа-яА-Я]{1,}$/,
    }

    //@ts-ignore
    const curRegExp = new RegExp(getRegExp[field])
    return curRegExp.test(data);
}