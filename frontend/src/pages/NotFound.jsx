import AuthLayout from "../components/AuthLayout";
import {Link} from "react-router-dom";


function NotFound(){

return(

<AuthLayout>

<h2>
404
</h2>


<p>
Page Not Found
</p>


<Link to="/login">
Go Home
</Link>


</AuthLayout>

);

}


export default NotFound;