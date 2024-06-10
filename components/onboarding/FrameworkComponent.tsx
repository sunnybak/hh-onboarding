import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { CopyBlock, dracula } from "react-code-blocks";

export default function FrameworkComponent({ onValueChange }: { onValueChange: (value: string) => void }) {
    return (
        <Tabs defaultValue="python" className="w-[400px] my-3" onValueChange={onValueChange}>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="typescript">Typescript</TabsTrigger>
            </TabsList>
            <TabsContent value="python">
                <CopyBlock language='bash' theme={dracula} text='pip install honeyhive' />
            </TabsContent>
            <TabsContent value="typescript">
                <CopyBlock language='bash' theme={dracula} text='npm install honeyhive' />
            </TabsContent>
        </Tabs>
    )
}