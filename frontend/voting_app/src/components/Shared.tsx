import { FC } from "react"

type TextProps = {
    text: string,
    isError?: boolean
    centered?: boolean
}

export const EcText: FC<TextProps> = ({text, isError, centered}) => {
    let textColor = isError ? "text-red-500" : "text-gray-500";
    let centeredClass = centered ? "text-center" : "";
    return <div className={`${centeredClass} ${textColor}`}>{text}</div>
}