# burgos-fillpdf
#### a simple pdf filler

##### fillPdf
executes an async function to fill a pdf form with values from an object
the script will get a form from the inputed pdf (it must have a form) and will get all field names from that form
then, for each field, it will try to extract the corresponding value from the object with the key matching the field name

field name: ['fields']['name']

value: fields.name

OR 

field name: ['fields']['languages']['python']

value: fields.languages.python

if the field name is "-", it will be filled with an empty string

after filling every field that found a corresponding key in the fields object, it will generate and save a new pdf file on the output_path.

```tsx
import { fillPdf } from 'burgos-fillpdf'

export const App = () => {
    const fields = {
        name: "Fernando Burgos",
        languages: {
            python: "x",
            javascript: "x"
        }
    }

    await pdf_handler.fillPdf({
        template_path: "src/templates/template.pdf",
        output_path: "static/reports/2.pdf",
        fields,
    })
}
```