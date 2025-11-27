
import { TEMPLATES } from '@/lib/templates'


export function TemplatePreview({ template }: { template: string }) {

    console.log(template)
    return (
        <>
            {TEMPLATES.find((t) => t.id === template)?.previewComponent}
        </>
    )
}