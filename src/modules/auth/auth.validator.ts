import * as yup from "yup";

export const registerValidationSchema = yup.object({
    email: yup
        .string()
        .email("please enter a valid email")
        .required("please enter your email"),

    fulName: yup
        .string()
        .required("please enter your fulName"),

    universityId: yup
        .string()
        .required("please enter your universityId")
        .max(50, "name must be 50 carter"),

    password: yup
        .string()
        .required("please enter your password")
        .min(8, "password must be 8 carter"),
});

export const loginValidationSchema = yup.object({
    email: yup
        .string()
        .email("please enter a valid email")
        .required("please enter your email"),

    password: yup
        .string()
        .required("please enter your password")
        .min(8, "password must be 8 carter"),
});