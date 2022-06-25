import React, { useState } from "react";


export const Footer: React.FC = () => {
    const[ txOutput, setTxOutput ] = useState()
    return (
        <p>{ txOutput }</p>
    )
}