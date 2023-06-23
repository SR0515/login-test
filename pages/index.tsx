import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { User } from '@prisma/client';
import { signIn, signOut, useSession } from "next-auth/react";


export default function Home() {
        const router = useRouter();
        // const [userList, setUserList] = useState([]);
        const {register, handleSubmit, reset, formState:{errors} } = useForm<User>({ mode : 'onSubmit' });
        const {data: session} = useSession()

        const onValid : SubmitHandler<User> = async (formData) => {
          const { username, password} = formData;

          const res = await signIn('username-password-credential' , {    //username과 password값을 signIn 함수 이용해서 res값 얻기
            username,                                                    //signIn 함수 첫번째 인자 값: username-password-credential   두번째인자 값: 객체(필요한 정보)
            password,
            redirect : false,  //에러 발생 시 새로고침x
          });

          res?.status === 401 && alert('로그인 정보가 일치하지않습니다.');
          if(res?.status === 200){
            await Promise.all([router.replace('/main'), reset()]);       //res 값에 에러가 없으면 /main페이지로 이동
          }
        }


        useEffect(() => {
          router.prefetch('/');
        }, []);


        // async function fn() {
        //   const { data } = await axios.get("/api/user");
        //   setUserList(data);
        // }
        
        if(session){
          return (
            <>
              Signed in as {session.user?.email} <br />
              <button onClick={() => signOut()}>
                로그아웃
              </button>
            </>
          );
        }   

        return (
          <>
            <form onSubmit={handleSubmit(onValid)}>
              <input
                {...register("username", {
                  required: {
                    value: true,
                    message: "이메일은 필수 입력 사항입니다.",
                  },
                  maxLength: {
                    value: 40,
                    message: "이메일은 40자리 이하로 입력해주세요.",
                  },
                  pattern: {
                    value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                    message: "이메일 형식을 확인해주세요.",
                  },
                })}
                type="text"
                name="username"
                id="username"
                placeholder="name@email.com"
              />
              <br />
              <span>{errors?.username?.message}</span>
              <br />

              <input
                {...register("password", {
                  required: {
                    value: true,
                    message: "패스워드는 필수 입력 사항입니다.",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{7,14}\S$/g,
                    message:
                      "공백을 제외한 영문 숫자 특수기호 조합 8자리 이상.",
                  },
                })}
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
              />
              <br />

              <span>{errors?.password?.message}</span>
              <br />

              <button type="submit">로그인</button>
            </form>
          </>
        );

}
      

      // <input 
      //   {...register('username',{
      //     required:{ 
      //       value: true,
      //       message: '이메일은 필수 입력 사항입니다.',
      //     },
      //     maxLength:{
      //       value:40,
      //       message:'이메일은 40자리 이하로 입력해주세요.',
      //     },
      //     pattern: {
      //         value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      //         message:
      //              '이메일 형식을 확인해주세요.',
      //     },
      //   })}
      //   type="text" name="username" id="email" placeholder="name@email.com" />

     
   
 


 // <form
      //   onSubmit={async (e) => {
      //     e.preventDefault();
      //     const username = e.target.username.value;
      //     const password = e.target.password.value;
      //     const data = {
      //       username: username,
      //       password: password,
      //     };
      //     console.log(data);
      //     await axios.post("/api/user", data);
      //     router.reload();
      //   }}
      // >
      //   <input name="username" type="text" placeholder="ID" required /> <br />
      //   <input
      //     name="password"
      //     type="password"
      //     placeholder="Password"
      //     required
      //   />
      //   <br />
      //   <button>로그인</button>
      // </form>