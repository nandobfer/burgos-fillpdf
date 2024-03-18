
export interface PdfFormOptions {
    template_path: string
    output_path: string
    font?: {
        regular: string
        bold: string
    }
    fields: object
}

export interface PdfField {
    name: string
    value: string | number
    bold?: boolean
}
