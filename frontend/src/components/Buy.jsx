
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import axios from 'axios'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { BACKEND_URL } from '../utils/utils'

function Buy() {
  const {courseId} =useParams()
  const[loading,setLoading]=useState(false)
  const navigate=useNavigate()

  const[course,setCourses]=useState({})
  const[clientSecret,setClientSecret]=useState("")
  const[error,setError]=useState("")


   const user=JSON.parse(localStorage.getItem('user'))
   const token=user?.token
   const stripe=useStripe()
   const elements=useElements()
   const[cardError,setCardError]=useState("")

   useEffect(()=>{
   const fetchBuyCourseData= async ()=>{
     if(!token){
    setError('Please login to purchase the courses')
    return;
   }
   try{
    const response=await axios.post(`${BACKEND_URL}/course/buy/${courseId}`,{},{
      headers:{
        Authorization:`Bearer ${token}`
      },
       withCredentials:true
    })

     setCourses(response.data.course)
     setClientSecret(response.data.clientSecret)
     setLoading(false)
  
   }catch(error){
     setLoading(false)
     if(error.response?.status===400){
      toast.error('you have already purchase this course')
     navigate('/purchases')
     }else{
      setError(error?.response?.data?.errors)
     }
   }
   }
   fetchBuyCourseData()
   },[courseId])

  const handlePurchase= async (event)=>{
      event.preventDefault();

    if (!stripe || !elements) {
       console.log("Stripe or Element not found")
      return;
    }

    setLoading(true)
    const card = elements.getElement(CardElement);

    if (card == null) {
      console.log("card element not found")
      setLoading(false)
      return;

    }
    // Use your card Element with other Stripe.js APIs
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      console.log('Stripe paymentMethod error', error);
      setLoading(false)
      setCardError(error.message)
    } else {
      console.log('[PaymentMethod Created]', paymentMethod);
    }
    if(!clientSecret){
      console.log("no client secret found")
      setLoading(false)
      return;
    }
  const {paymentIntent, error:confirmError} = await stripe.confirmCardPayment(
    clientSecret,
  {
    payment_method: {
      card:card,            
      billing_details: {
        name:user?.user?.firstName,
        email:user?.user?.email
      },
    },
  },
);
 if(confirmError){ // error show and success show one place
  setCardError(confirmError.message)
 }else if(paymentIntent.status==='succeeded'){
  console.log("Payment successfully",paymentIntent)
  setCardError("Your payment Id:",paymentIntent.id)
  const paymentInfo={
    userId:user?.user?._id ,
    email:user?.user?.email,
    courseId:courseId ,
    paymentId: paymentIntent.id ,
    amount:paymentIntent.amount,
    status:paymentIntent.status
  }
  console.log("payment Info",paymentInfo)
  await axios.post("http://localhost:3000/api/v1/order",paymentInfo,{
    headers:{
      Authorization:`Bearer ${token}` // when uses middleware then pass in body have to header(means token)
    },
    withCredentials:true  // with credintial
  })
  .then(response=>{
    console.log(response.data)
  }).catch((error)=>{
     console.log(error)
     toast.error("Error in making payment")
  })
  toast.success("Payment Successfull")
  navigate("/purchases")
 }
  setLoading(false)
  }
  return( 
     <>
      { error ? (
        <div className=' bg-gradient-to-r from-black  to-blue-950 flex justify-center items-center  h-screen'>
          <div className='bg-red-100 text-red-700 px-6 h-40 py-4 rounded-lg'>
             <p className=' mb-7 text-xl font-bold'>{error}</p>
             <Link to={"/purchases"} className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center">Login</Link>
          </div>
        </div>
      ):(
        <div className='flex flex-col sm:flex-row  my-40 container mx-auto '>
           {/* left part */}
           <div className='max-w-sm md:w-1/2 ms-6 shadow-md p-2'>
              <h1 className='text-xl font-semibold underline'>Order Details</h1>
              <div className='flex text-center items-center space-x-2 mt-4'>
                 <h1 className='text-gray-700 font-bold text-md'>Total Price: &#8377;</h1>
                 <p className='text-red-500  font-bold'>{course.price}</p>
              </div>
              <div className='flex text-center items-center space-x-2 mt-4'>
                 <h1 className='text-gray-700 font-bold text-md'>Course Name:</h1>
                 <p className='text-red-500 font-bold'>{course.title}</p>
              </div>
           </div>
           {/* right part */}
          <div className='w-full md:w-1/2 flex items-center justify-center'>
             <div className='bg-white shadow-md rounded-lg p-6 w-full max-w-sm'>
               <h2 className='text-lg mb-4 font-semibold'>Process Your Payment!</h2>
               <div className='mb-4'>
                  <label htmlFor="card-number" className='block text-gray-700 text-sm mb-2'>
                    Credit | Debit Card
                  </label>
                    <form onSubmit={handlePurchase}>
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: '16px',
                              color: '#424770',
                              '::placeholder': {
                                color: '#aab7c4',
                              },
                            },
                            invalid: {
                              color: '#9e2146',
                            },
                          },
                        }}
                      />
                      {/* disable button when loading */}
                      <button type='sumbit' disabled={!stripe || loading}
                       className='mt-8 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200'> {loading ? "Processing... ":"Pay"}
                      </button>
                    </form>
                    {cardError && (
                       <p className='text-red-500 font-semibold text-xs'>{cardError}</p>
                    )}
               </div>
                 <button className='w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 flex items-center justify-center'>
                    <span className='mr-2 bg-blue-600 px-2 rounded-2xl'>P</span>Other Payments Method
                 </button>
             </div>
          </div>
        </div>
      )}
     </>
  )
}

export default Buy
