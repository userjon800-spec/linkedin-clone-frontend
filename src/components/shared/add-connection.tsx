'use client'
import { api } from "@/lib/https";
import { useEffect } from "react";

export default function AddConnection() {
  useEffect(() => {
    api.get('/users/all').then(res => console.log(res.data)).catch(err => console.log(err))
  }, [])
  return (
    <div className='w-[24%] border border-white'>
      
    </div>
  )
}
