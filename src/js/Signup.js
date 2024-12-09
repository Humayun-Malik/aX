// // src/components/Signup.js
// import React, { useState } from 'react';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../firebaseConfig';

// const Signup = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       setError("Passwords don't match");
//       return;
//     }
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       console.log('Signed up successfully');
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="signup-container">
//       <h2>Sign Up</h2>
//       <form onSubmit={handleSignup}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Confirm Password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Sign Up</button>
//       </form>
//       {error && <p className="error">{error}</p>}
//     </div>
//   );
// };

// export default Signup;


import { auth } from './firebaseConfig.js';
import { query } from './db.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// Select the signup form and button
const signupForm = document.getElementById('signupForm');
const signupButton = document.getElementById('signupButton');

// Handle form submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Get form data
    const name = document.getElementById('name').value;
    const dob = document.getElementById('dob').value;
    const gender = document.getElementById('gender').value;
    const gamertag = document.getElementById('gamertag').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate passwords
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    try {
        // Create user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log('User created successfully:', user);

        // Save user data to PostgreSQL
        const sql = `
            INSERT INTO users (uid, name, dob, gender, gamertag, email)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;

        const values = [user.uid, name, dob, gender, gamertag, email];
        await query(sql, values);

        alert('Account created successfully! You can now log in.');
        window.location.href = 'login.html'; // Redirect to login page
    } catch (error) {
        console.error('Error during signup:', error);
        alert(error.message);
    }
});
