import React, { use } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

const Login = () => {
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const user = { name:"demo name", email:"test@gmail.com", password: "12345678" };

    const onSubmit = async (data) => {
        console.log("Form Data:", data);

        try{
            if(data.email === user.email && data.password === user.password) {
                const token = uuidv4();
                console.log('Generated Token', token);
                
            console.log("Login successful");

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token",token);
            

            toast.success("Login successful");
            navigate("/"); 
        } else {
            setError("Invalid email or password");
            toast.error("Invalid email or password");
            console.log("Login failed");
        }

        }
        catch(err){
            console.error("Error during login:", err);
            toast.error("An error occurred during login. Please try again.");
            setError("An error occurred during login. Please try again.");
            return;
        }
        
    }

    return(
        <div className="container mt-5">
            <h2>Login</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        id="email"
                        {...register("email", { required: "Email is required" })}
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                </div>
                <div className="mb-3">
                   <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        id="password"
                        {...register("password", { required: "Password is required" })}
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
         
    )
}

export default Login;