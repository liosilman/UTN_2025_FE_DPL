import { useState } from "react";
export const useForm = (formInitialState) => {

        const [formState, setFormState] = useState(formInitialState);
        const handleChangeInput = (event) => {
            const { name, value } = event.target;
            setFormState((prevFormState) => {
                return { ...prevFormState, [name]: value };
            });
        };
        return {formState, handleChangeInput};
    }
