import { User } from "lucide-react";


function AuthBackground({title, children}) {


    return (

        <div className="auth-container">


            <div className="blue-shape">


                <div className="login-box">


                    <div className="user-icon">

                        <User size={45}/>

                    </div>


                    <h2>
                        {title}
                    </h2>


                    {children}


                </div>


            </div>


        </div>

    );

}


export default AuthBackground;
