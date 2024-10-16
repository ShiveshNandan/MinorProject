"use client"
import Link from 'next/link'
import React, { useState } from 'react'

const Page = () => {
  const [name, setname] = useState("")
  return (
    <div>
      Room
      <input type="text" onChange={(e) => setname(e.target.value)} />
      <Link href={`Room/?name=${name}`}>
      <button className=''>Join</button>
      </Link>
    </div>
  )
}

export default Page
