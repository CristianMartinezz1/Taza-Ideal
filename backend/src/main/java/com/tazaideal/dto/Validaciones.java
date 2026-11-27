package com.tazaideal.dto;

/** Expresiones regulares y mensajes que se repiten en varios DTOs. */
public final class Validaciones {

    /** Minimo 8 caracteres, una mayuscula, un numero y un caracter especial. */
    public static final String CONTRASENA = "^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,64}$";
    public static final String CONTRASENA_MSG =
            "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial";

    /** Telefono de 10 digitos (Mexico), opcionalmente con +52 al inicio. */
    public static final String TELEFONO = "^(\\+52)?\\d{10}$";
    public static final String TELEFONO_MSG = "El teléfono debe tener 10 dígitos";

    private Validaciones() {
    }
}
