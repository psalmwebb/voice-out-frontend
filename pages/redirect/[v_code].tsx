import { useRouter } from "next/router";
import {useEffect} from "react"

export default function AuthRedirect(){

    const router = useRouter();

    useEffect(()=>{

      
      if(router.query.v_code){

         let token:any = router.query.v_code
         
         token = token.split("__")[1];

         window.localStorage.setItem("v-o-u",token)

         router.push("/dashboard")
      }
       
    })

    return (
        <>
          
        </>
    )

}