"use client"
import React, { useEffect, useState } from 'react'

const Page = () => {
  const [name, setname] = useState("")
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const naming = urlParams.get("name")
      setname(naming!);
    }
    
  }, [])
  

  return (
    <div>
      {`hi, ${name}`}
    </div>
  )
}

export default Page
