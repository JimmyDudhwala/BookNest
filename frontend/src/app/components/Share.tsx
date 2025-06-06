import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'
import {RWebShare} from 'react-web-share'

interface RWebShareProp {
    url:string,
    title:string,
    text:string
}

export const ShareButton :React.FC<RWebShareProp> = ({url, title, text}) => {
    return(
        <RWebShare
            data={{
                text: text,
                url: url,
                title: title
            }}
            onClick={() => console.log("Shared Successfully")}
        >
            <Button size="sm" variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                share
            </Button>
        </RWebShare>
)
}