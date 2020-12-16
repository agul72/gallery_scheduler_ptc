import React, {useContext, useEffect, useState, useCallback} from "react";
import {useHttp} from "../hooks/http.hook";
import {Loader} from "../components/Loader";
import {Gallery} from "../components/Gallery";
import {useMessage} from "../hooks/message.hook";

import s from "./createPage.module.css";
import {AuthContext} from "../context/AuthContext";


export const CreatePage = () => {
    const storageName = 'galleryAppUserGalleries';
    const {request, loading} = useHttp();
    const message = useMessage();
    const auth = useContext(AuthContext);
    const [images, setImages] = useState([]);
    const formInit = {
        categoryId: 0,
        time: 5
    }
    const [form, setForm] = useState({...formInit});

    const initGalleries = useCallback(() => {
        const data = JSON.parse(localStorage.getItem(storageName));
        console.log('initGalleries, data:', data);
        return data ? data.galleries || [] : []
    }, []);

    const [galleries, setGalleries] = useState(initGalleries);

    const getCategories = async () => {
        return await request(
            '/api/gallery/category/all',
            'GET');
    };

    useEffect(() => {
        getCategories().then(res => setImages(res));
    }, []);

    useEffect(() => {
        window.M.updateTextFields()
    }, []);

    useEffect(() => {
        if (auth.userId !== null) {
            localStorage.setItem(storageName, JSON.stringify({
                userId: auth.userId, galleries
            }))
        }
    }, [galleries]);

    useEffect(() => {
        window.M.updateTextFields()
    }, []);


    if (loading) {
        return <Loader/>
    }

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    };

    async function onBtnStartClickHandler() {
        if (form.categoryId !== 0) {
            try {
                const data = await request('/api/gallery/category/id/' + form.categoryId, 'GET');
                await setGalleries([...galleries, {images: data, time: parseInt(form.time)}]);
                setForm({...formInit});
            } catch (e) {
                message(e.message);
            }
        }
    }

    function onBtnRemoveClickHandler(index) {
        setGalleries(galleries =>
            galleries.filter((gallery, i) => i !== index));
    }

    function getGallery(gallery, index) {
        return (
            <div className={s.galleryWrapper}>
                <div className={s.gallery} key={index}>
                    <Gallery gallery={gallery}/>
                </div>
                <button
                    className={"btn"}
                    onClick={() => onBtnRemoveClickHandler(index)}>
                    Remove
                </button>
            </div>
        );
    };

    return (
        <div className={'row'}>
            <h4>Select category and interval</h4>
            <select className="browser-default"
                    name={'categoryId'}
                    value={form.categoryId}
                    onChange={changeHandler}
            >
                <option value="0" disabled>Choose your option...</option>
                {images && images.map(image =>
                    <option value={image._id} key={image._id}>{image.category}</option>)}
            </select>
            <input className="input-field "
                   type={'number'}
                   min={5} max={30}
                   name={'time'}
                   value={form.time}
                   onChange={changeHandler}
            />
            <button className="btn waves-effect waves-light"
                    type="submit" name="action"
                    onClick={onBtnStartClickHandler}>
                Start
            </button>
            <div className={s.container}>
                {galleries && galleries.map((gallery, index) =>
                    getGallery(gallery, index)
                )}
            </div>
        </div>
    )
}
