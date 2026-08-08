import { TextFieldTypes } from "../enums/text-field-types"

export type TextFieldType = TextFieldTypes | 'text' | 'email' | 'number' | 'tel' | 'password' | 'url' | string;