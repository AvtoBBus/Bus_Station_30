import { useEffect, useState } from "react"
//@ts-ignore
import NoPhoto from "../../shared/assets/noPhoto.svg"
import { PetsApi } from "../../shared/OpenApi/PetsApi";

import './style.css'

export const CardImg = (props: { id: string, needLoad: boolean }) => {
    const [loaded, setLoaded] = useState(false);
    const [curImage, setCurImage] = useState(NoPhoto);
    const petsApi = new PetsApi();

    useEffect(() => {
        if (props.id) {
            !props.needLoad && petsApi.getPetImg(props.id)
                .then((r: Response) => {
                    r.blob().then((b: any) => {
                        const objectURL = URL.createObjectURL(b);
                        setCurImage(objectURL);
                    })
                })
        }
    }, [props])

    const handleError = () => {
        if (!loaded) {
            setLoaded(true);
            setCurImage(NoPhoto);
        }
    }

    return <>
        <img
            src={curImage}
            onError={handleError}
            alt="img"
            className="card__img" />
    </>
}