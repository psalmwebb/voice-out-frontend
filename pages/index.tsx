import type { NextPage } from 'next'
import {NextRouter, useRouter} from "next/router";
import Head from "next/head";
import {useEffect,useState} from "react";
import { useDispatch } from 'react-redux';
import {findUser,findRoom} from "../utils";
import { addRoomDetailsObj } from '../actions';

const URL:any = "https://voice-out-backend.herokuapp.com";

// const URL:any = "http://localhost:5000";

const Home: NextPage = () => {

  const router:NextRouter = useRouter();

  const [showForm,setShowForm] = useState<boolean>(false);

  const [inputValue,setInputValue] = useState<string>("");

  const [errorDiv,setErrorDiv] = useState<string>("");

  const dispatch = useDispatch();

  useEffect(()=>{

    (async ()=>{

      const user = await findUser();

      if(!user.error){
          router.push("/dashboard");
      }

    })();

  },[])

  function handleClick(e:any)
  {
    console.log(e.target.id);
    window.location.assign(e.target.id);
  }

  function handleChange(e:any)
  {
     setErrorDiv("");
     setInputValue(e.target.value);
  }

  async function handleQuickJoin(e:any)
  {
    e.preventDefault();

    const roomDetails = await findRoom(inputValue.trim());

    if(roomDetails.error){
       setErrorDiv(roomDetails.error);
    }
    else{
      dispatch(addRoomDetailsObj(roomDetails))
       
      router.push("/room");
    }

  }

  return (
    <div>
      <Head>
        <title>VOICE OUT</title>
      </Head>

      <main className="d-flex justify-content-md-around align-items-center flex-wrap index">
         <nav>
           <span>Voice Out</span>
         </nav>

          <div className="col-md-6 welcomeDiv d-none d-md-block">
            <h1 className="text-center">VOICE OUT YOUR OPINION</h1>
          </div>
          
          <div className="p-3 col-md-4 social-links-div rounded">
                <div id={`${URL}/auth/google`} className="border border-info p-3 text-center rounded social-links" onClick={handleClick}>
                  <span><i className="fab fa-google-plus-g"></i></span> Log in with Google
                </div>

                <div className="border border-info p-3 text-center mt-3 rounded social-links">
                  <span><i className="fab fa-facebook"></i></span> Log in with Facebook
                </div>

                <div className="or p-2 d-flex justify-content-center">
                  <span className="border rounded-circle p-2">OR</span>
                </div>

                <span className="text-center d-block mt-3 join-quick" onClick={()=> setShowForm(true)}>Join a meeting</span>
          </div>

        { showForm && 
          <>
            <div className="cover"></div>

            <form onSubmit={handleQuickJoin} className='col-12 col-md-4 col-md-4 border bg-light p-3'>
              <span className="text-dark" onClick={()=> setShowForm(false)}>close</span>
              <div className="form-group">
                <label className="text-dark mb-1">Meeting Id</label>
                <input type="text" className="form-control" onChange={handleChange}/>
                <button className='mt-3 btn btn-primary col-12 btn-sm'>JOIN</button>
              </div>
              <small className="mt-2 d-block text-center text-danger">{errorDiv}</small>
            </form>
          </>
       } 
       
      </main>

      <footer>

      </footer>
    </div>
  )
}

export default Home
