import React, { useContext } from "react";
import { txOutputContext } from "./FooterContext";

interface Props {}

export const Footer: React.FC<Props> = () => {
    const { txOutput } = useContext( txOutputContext )
    return (
        <p>{ txOutput }</p>
    )
}