import React, { useEffect, useRef, useState } from 'react';

 export default function SVGContainer (props) {

    const { children } = props

    const [containerWidth, setWidth] = useState(0)
    const [containerHeight, setHeight] = useState(0)

    const containerRef = useRef() //memory address containerRef.current 

    useEffect(() => {
        if (containerRef.current) {
            setWidth(containerRef.current.offsetWidth)
            setHeight(containerRef.current.offsetHeight)
        }
    }, [])// if 2 changes call 1 

    const clonedChild = React.cloneElement(children, { width: containerWidth, height: containerHeight })
    return (
        <div
             className={`svgcontainer ${props.styleName}`} ref={containerRef}
        >
            {clonedChild}
            
        </div>
    )
}
