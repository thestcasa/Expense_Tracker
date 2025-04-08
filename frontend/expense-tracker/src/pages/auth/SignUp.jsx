import React, { useContext } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/inputs/Input'
import { Link } from 'react-router-dom'
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector'
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from '../../utils/apiPaths'
import {UserContext} from '../../context/UserContext'
import uploadImage from '../../utils/uploadImage'
import {validateEmail} from "../../utils/helper"


const SignUp = () => {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [profilePic, setProfilePic] = React.useState(null);
  const [error, setError] = React.useState(null);

  const{updateUser} = useContext(UserContext)

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profiloImageUrl = "";
    
    if (!fullName) {
      setError('Full name is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Invalid email address');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    setError("");

    // Call the API to sign up the user
    
    try{

      if (profilePic){
        const imgUploadRes = await uploadImage(profilePic);
        profiloImageUrl = imgUploadRes.imageUrl || "";
        }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        fullName,
        email,
        password,
        profiloImageUrl
      })

      const {token, user} = response.data;

      if (token){
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/");
      }

    }catch(error){
      if (error.response && error.response.data.message){
        setError(error.response.data.message);
      }else{
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
          <p className='text-xs text-slate-700 mt-[5px] mb-6'>
            Join us today by entering yout details below
          </p>

          <form onSubmit={handleSignUp}>

            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
            <div className='grid grid-cols-1 md-grid-cols-2 gap-4'>
              <Input
                value={fullName}
                onChange={({target}) => setFullName(target.value)}
                label='Full Name'
                placeholder='Enter your full name'
                type='text'
              />
              <Input
                value={email}
                onChange={({target}) => setEmail(target.value)}
                label='Email Address'
                placeholder='Enter your email address'
                type='text'
              />
              <div className='col-span-2'>
                <Input
                  value={password}
                  onChange={({target}) => setPassword(target.value)}
                  label='Password'
                  placeholder='Enter your password'
                  type='password'
                />
              </div>
            </div>
            
              {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
            
              <button type="submit" className="btn-primary">SIGN UP</button>
              <p className="text-[13px] text-slate-800 mt-3">Already have an account?{' '}
              <Link className="font-medium text-primary underline" to="/login">Log in</Link>
              </p>
          </form>
      </div>
    </AuthLayout>

  )
};

export default SignUp