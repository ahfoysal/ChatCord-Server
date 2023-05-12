import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import "./Chat.css"

import ChatField from '../ChatField/ChatField';

import Conversation from '../Conversation/Conversation';

import { getUserDetails } from '../../helpers/SessionHelper';
// const socket = useRef("http://localhost:5001")
const socket = io.connect("http://localhost:5001");
import axios from "axios";
import {BsFillPlusCircleFill } from "react-icons/bs";

import { AiOutlineSend ,AiOutlineSearch} from "react-icons/ai";

import Navbar from '../Navbar/Navbar';


export default function Home() {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentChat, setCurrentChat] = useState(null);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [toggle, setToggle] = useState(true);
  const user = getUserDetails();
  const scrollRef = useRef();

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/conversation/${user?.data._id}`);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user?.data._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/messages/${currentChat?._id}`);
        setMessages(res.data);   
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  useEffect(() => {
    const socket = io.connect('http://localhost:5001');
    socket.emit('addUser', user?.data._id);

    socket.on('getMessage', (data) => {
      const newMessage = {
        senderId: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      };
      console.log(data)
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socket.on('getUsers', (users) => {
      // console.log(users);
      // setOnlineUsers(
      //   user.followings.filter((f) => users.some((u) => u.userId === f))
      // );
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.senderId) &&
      setMessages((prevMessages) => [...prevMessages, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const message = {
      senderId: user?.data._id,
      text: newMessage,
      conversationId: currentChat?._id,
    };

    const receiverId = currentChat?.members.find((member) => member !== user?._id);

    socket.emit('sendMessage', { senderId: user?.data._id, receiverId, text: newMessage });

    try {
      const res = await axios.post('http://localhost:5000/api/v1/message', message);
      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  return (
    <>


    <section className='py-16 shadow-xl'>
      <div className="container mx-auto flex flex-wrap  w-full justify-start items-start ">
        <div className={' bg-slate-500 pt-4 flex flex-col items-start justify-start  w-[20%] duration-700 gap-5  h-[calc(100vh-135px)] px-4'} >
          {/* <div className='h-15 w-full  p-2 flex items-center justify-between relative'>
          <img className='w-10 h-10  rounded-full object-cover' src="https://as1.ftcdn.net/v2/jpg/02/22/85/16/1000_F_222851624_jfoMGbJxwRi5AWGdPgXKSABMnzCQo9RN.jpg" alt="" />
            {
              toggle ?<RxDoubleArrowRight className='cursor-pointer absolute left-16 text-white font-bold' onClick={()=>setToggle(!toggle)} size={25} />:<RxDoubleArrowLeft className='cursor-pointer' onClick={()=>setToggle(!toggle)}  size={25} />
            }
          </div> */}
          {/* {
            toggle?<AiOutlineSearch size={25} />:<input placeholder='Search...' className='w-full py-2 px-3 border border-gray-400 focus:outline-0 rounded-xl' /> 

          }
           */}
           <div className="relative w-full">
  <input type="text" className="py-2 pl-8 pr-4 block w-full rounded-md bg-gray-100 border-transparent focus:bg-white focus:border-gray-300 focus:outline-none" placeholder="Search" />
  <div className="absolute inset-y-0 left-0 flex items-center pl-2">
  <AiOutlineSearch size={25} />
  </div>
</div>
            {conversations?.map((c, i) => (
      <div className='w-full' key={i} onClick={() => setCurrentChat(c)}>
        <Conversation toggle={toggle} conversation={c} currentUser={user?.data} />
      </div>
    ))}
        </div>



        <div className='w-[80%] h-[calc(100vh-135px)] bg-gray-400 '>

      
       <Navbar />

           {
  currentChat? <><div className="messages ">
  {messages?.map((m, i)=>{
return  <div key={i} ref={scrollRef}>
              <ChatField message={m} own={m.senderId === user?.data._id}  />
            </div>
})}
  </div>
  <div className='w-full px-4 flex justify-center items-center gap-2 text-gray-800  ' >
            <BsFillPlusCircleFill className=' cursor-pointer' size={30} />
              <input type="text" value={newMessage} placeholder='Send message...' onChange={(e)=>setNewMessage(e.target.value)} className='w-full p-3 border border-gray-400 focus:outline-0 rounded-xl' />
              <AiOutlineSend className=' cursor-pointer'  size={30} onClick={
    (e)=>handleSubmit(e)} />
           </div>
 
</>: <>
<div className='w-full h-[100%] flex justify-center items-center'>
<h1 className='text-4xl'>Please select a conversation!!</h1>
</div>
</>
 }


          
        </div>
      </div>
    </section>




    </>
  );
}
