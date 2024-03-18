import { PDFDocument, PDFForm } from "pdf-lib"
import fs from "fs"
import { PdfFormOptions } from "./types/pdf_handler"

function getValueFromPath(obj: any, path: string): any {
    // Primeiro, removemos a referência inicial ao objeto, se presente.
    const cleanPath = path.startsWith("fields.") ? path.slice(7) : path

    // Dividimos o caminho em partes, tratando tanto pontos quanto colchetes.
    const parts = cleanPath.match(/[^.\[\]']+|\d+/g)
    parts?.shift()

    if (!parts) return undefined

    return parts.reduce((accumulator, currentPart) => {
        if (accumulator === undefined) return undefined
        // Convertendo para número se for um índice de array.
        const key = /^\d+$/.test(currentPart) ? Number(currentPart) : currentPart
        return accumulator[key]
    }, obj)
}

const writeFieldValue = (form: PDFForm, key: string, value: string) => {
    form.getTextField(key)?.setText(value.toString())
}

export const fillPdf = async (options: PdfFormOptions) => {
    // carregar o documento do pdf
    const pdfBuffer = await fs.promises.readFile(options.template_path)
    const pdfDoc = await PDFDocument.load(pdfBuffer)

    // carregar fontes

    const form = pdfDoc.getForm()

    // options.report.call.talhao.tillage.

    const fields = form.getFields()
    fields.forEach((_field) => {
        let skip = false
        try {
            const key = _field.getName()

            if (key == "-") {
                writeFieldValue(form, key, "")
                skip = true
            }

            if (!skip) {
                const value = getValueFromPath(options.fields, key)
                if (value) {
                    writeFieldValue(form, key, value)
                } else {
                    // console.log("chave não encontrada:")
                    // console.log(key)
                }
            }
        } catch (error) {
            console.log("error filling a pdf form field")
            console.log(error)
        }
    })

    const filledPdf = await pdfDoc.save()
    await fs.promises.writeFile(options.output_path, filledPdf)
}
