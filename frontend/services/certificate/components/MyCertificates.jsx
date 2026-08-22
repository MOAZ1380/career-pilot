"use cleint"

import React, { useEffect, useState } from 'react'
import {getCertificates} from '../api/certificate.service'


export default function MyCertificates() {
 const [dataCertificate,setDataCertificate]=useState([])
  const [loading,setLoading]=useState(false)

useEffect(()=>{
  const fetchCertificate=async ()=>{
      setLoading(true)
      try{
       const response= await getCertificates();
      
      setDataCertificate(response)
      
      }
      catch(error) {
          console.error('error:',error)
      
  }finally{
      setLoading(false)
  }
}
  fetchCertificate();
 },[])



  return (

    loading? <div> </div>:
    <>
    
    
    </>
  )
}
