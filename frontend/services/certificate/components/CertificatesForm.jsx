"use client"

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import {createCertificate} from '../api/certificate.service'
import SkillForm from '@/services/skill/components/SkillForm';






export default function Form() {

//  const [dataCertificate,setDataCertificate]=useState({name:"",organization:"",issueDate:"",expirationdate:"",url:""})
// console.log(dataCertificate);
const [cer , setcer]=useState()
const [loading,setLoading]=useState(false)
// const [dataCertificate,setDataCertificate]=useState([{name:"Front-End",issuer:"NTI",issueData:"20/6/2025",expirationDate:"323",credentialId:"qwfdsd"}])
const {register, handleSubmit,formState:{errors},reset}=useForm()
const [dialog,setdialog]=useState({edit:false,delete:false})

console.log(dialog);

// add certificate >>>>>>
const onSubmit=async (data)=>{
    
    setLoading(true)
    try{
    const response = await createCertificate(data)
    console.log(response)
    setcer(response.data)
    }
    catch(error) {
        console.error('error:',error)
    
}finally{
    setLoading(false)
}

}



 
// get certificate >>>>>

useEffect(()=>{
  const fetchCertificate=async ()=>{
      setLoading(true)
      try{
       const response= await getCertificates();
      
      setcer(response)
      
      }
      catch(error) {
          console.error('error:',error)
      
  }finally{
      setLoading(false)
  }
}
  fetchCertificate();
 },[])

// const  handleView=(id)=>{

// }

// const  handleEdit=(certificate)=>{
// reset({
//     name:certificate.name,
//     issuer:certificate.issuer,

// })

// }

// const  handleDelete=(id)=>{
//         const prev =dataCertificate.filter((e)=>{return e.credentialId!=id}) 
//         setDataCertificate(prev)
// }


  return (
loading ?<div className='flex justify-center  items-center bg-amber-300'>Loading......</div>:
<>
    <div className='p-10 flex gap-10'>
        {/* <div className='p-6 w-70'>
            <div>
                <p className='text-[12px]  font-bold'> RESUME PROFILE</p>
                <p className='  font-bold'>{} % Complete</p>

            </div>
            <hr />
            <div>
            <Link href=""></Link>
            </div>
        </div> */}




        <div className='p-10 w-[50%]'>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <p className='text-[22px] font-extrabold'>Add Certificate</p>
                    <p className='text-[14px]'>List your academic degrees, certifications, or major self-learning milestones</p>
                </div>

                <div className='flex flex-col gap-2 pt-4'>
                    
                    <label htmlFor="Name">Name Certificate</label>
                    <input id='Name' type="text" {...register("name",{required:"name is required" ,minLength:{value:3,message:"Username mudt be at least 3 characters"}})}className='border border-gray-300 rounded p-1'/>
                    {errors.name&& <p className='text-red-600 pt-0 mt-0'>{errors.name.message}</p>}
                    <label htmlFor="">Issuing Organization </label>
                    <input type="text" {...register("issuer" ,{required:true})} className='border border-gray-300 rounded  p-1'/>
                    {errors.issuer && <p className='text-red-600'>issuer is required</p>}
                    <div className='flex  justify-between'>
                        <div className=''>
                    <label htmlFor="">Issue Date</label><br />
                    <input type="date" {...register("issueData" ,{required:true})} className='border border-gray-300 rounded p-1 w-full'/></div>
                    {errors.issueData&& <p className='text-red-600'>issue Data is required</p>}
                    <div className=''>
                    <label htmlFor="">Expiration Date</label><br />
                    <input type="date" {...register("expirationData" ,{required:true})} className='border border-gray-300 rounded p-1 w-full'/>
                    {errors.expirationDate&& <p className='text-red-600'>expiration date is required</p>}
                    </div></div>

                    <label htmlFor="">Credential ID</label>
                    <input type="text" {...register("credentialId" ,{})} className='border border-gray-300 rounded p-1'/>
                 
                    <label htmlFor="">Credential URL</label>
                    <input type="url" {...register("credentialUrl" ,{required:true})} className='border border-gray-300 rounded p-1'/>
                    {errors.url&& <p className='text-red-600'>URL is required</p>}
                </div>
                <div className='flex justify-center pt-8'>
                <button className='bg-gray-500 p-3   rounded-md'>save</button></div>
            </form>


        </div>

        <div className='p-10 w-3xl'>
            <div className='pb-4'>
                <p className='text-[22px] font-extrabold'>
                    Your Certificate ({dataCertificate.length})
                </p>
            </div>

            {cer.length>0?
                cer.map((e)=>(
                    <div key={e.credentialId} className='border rounded-md border-gray-300 flex items-center mt-4 p-2'>
                        <div className='h-28 w-28 flex-1'></div>
                        <div className='flex-4 '>
                            <p className='text-xl font-bold'>{e.name}</p>
                            <p><span></span>{e.issuer}</p>
                            <p><span></span>{e.issueData}</p>
                            {e.credentialId&&<p><span></span>{e.credentialId}</p>}
                            
                        </div>
                        <div className='flex flex-1 gap-1 flex-col'>
                            <button className='p-1 border rounded-md border-gray-300 text-[14px] font-bold' onClick={()=>handleView()}>View</button>
                            <button className='p-1 border rounded-md border-gray-300 text-[14px] font-bold' onClick={()=>handleEdit(e)}>Edit</button>
                            <button className='p-1 border rounded-md border-gray-300 text-[14px] font-bold' onClick={()=>handleEdit(e)}>Delete</button>
                        </div>


                    </div>)):<>not certificate</>}
                    
                    
            
        </div>

       
    </div>
     {/* {dialog.edit&&<div className='fixed w-full h-full bg-amber-200 z-50 flex' style={{backgroundColor:"rgba(0,0,0,.4)"}}>
                        <dialog open={dialog.edit} onClose={dialog.edit} className='h-200 w-200 bg-amber-50 m-auto  self-center  shadow-2xl rounded-2xl' >
                            <div className='h-20 flex justify-center items-center font-extrabold text-3xl '>Edit Certificate</div>
                            <div className='p-5'>
                             <div className='flex flex-col gap-2 pt-4'>
                    
                    <label htmlFor="Name">Name Certificate</label>
                    <input id='Name' type="text" {...register("name",{required:"name is required" ,minLength:{value:3,message:"Username mudt be at least 3 characters"}})}className='border border-gray-300 rounded p-1'/>
                    {errors.name&& <p className='text-red-600 pt-0 mt-0'>{errors.name.message}</p>}
                    <label htmlFor="">Issuing Organization </label>
                    <input type="text" {...register("issuer" ,{required:true})} className='border border-gray-300 rounded  p-1'/>
                    {errors.issuer && <p className='text-red-600'>issuer is required</p>}
                    <div className='flex  justify-between'>
                        <div className=''>
                    <label htmlFor="">Issue Date</label><br />
                    <input type="date" {...register("issueData" ,{required:true})} className='border border-gray-300 rounded p-1 w-full'/></div>
                    {errors.issueData&& <p className='text-red-600'>issue Data is required</p>}
                    <div className=''>
                    <label htmlFor="">Expiration Date</label><br />
                    <input type="date" {...register("expirationData" ,{required:true})} className='border border-gray-300 rounded p-1 w-full'/>
                    {errors.expirationDate&& <p className='text-red-600'>expiration date is required</p>}
                    </div></div>

                    <label htmlFor="">Credential ID</label>
                    <input type="text" {...register("credentialId" ,{})} className='border border-gray-300 rounded p-1'/>
                 
                    <label htmlFor="">Credential URL</label>
                    <input type="url" {...register("credentialUrl" ,{required:true})} className='border border-gray-300 rounded p-1'/>
                    {errors.url&& <p className='text-red-600'>URL is required</p>}
                </div>
                            </div>
                            <button onClick={()=>setdialog({...dialog,edit:false})}>cancel</button>
                            <button type='submit'>Save change</button>
                        </dialog></div>} */}
                    </>
)
}
