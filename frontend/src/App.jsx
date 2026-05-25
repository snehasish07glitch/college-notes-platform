import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);
  
  const [isAdmin, setIsAdmin] = useState(false);
 
  const [file, setFile] = useState(null);

  const [notes, setNotes] = useState([]);

  const [subject, setSubject] = useState("");

const [branch, setBranch] = useState("");

const [semester, setSemester] = useState("");

const [username, setUsername] = useState("");

const [search, setSearch] = useState("");


  // ================= REGISTER =================

 

 const register = async () => {

  try {

    const res = await axios.post(
      "https://college-notes-backend-ouen.onrender.com/register",
      {
        email,
        password,
      }
    );

    alert("Registration Successful ✅");

    // Clear input fields
    setEmail("");
    setPassword("");

  } catch (error) {

    alert(error.response.data.message);

  }

};
  // ================= LOGIN =================

const login = async () => {

  try {

    // ADMIN LOGIN

    if (
      email === "admin@gmail.com" &&
      password === "admin123"
    ) {

      setLoggedIn(true);

      setIsAdmin(true);

      alert("Admin Login Successful");

      return;

    }

    // NORMAL USER LOGIN

    const res = await axios.post(
      "https://college-notes-backend-ouen.onrender.com/login",
      {
        email,
        password,
      }
    );

    localStorage.setItem(
      "token",
      res.data.token
    );

    setLoggedIn(true);

    setIsAdmin(false);

    alert(res.data.message);

  } catch (error) {

    alert(error.response.data.message);

  }

};

// ================= FORGOT PASSWORD =================

const forgotPassword = async () => {

  if (!email) {

    return alert("Enter Email First");

  }

  const newPassword = prompt(
    "Enter New Password"
  );

  if (!newPassword) {

    return alert("Password Required");

  }

  try {

    const res = await axios.put(
      "https://college-notes-backend-ouen.onrender.com/forgot-password",
      {
        email,
        newPassword,
      }
    );

    alert(res.data.message);

  } catch (error) {

    alert(error.response.data.message);

  }

};
  // ================= GET NOTES =================

  const getNotes = async () => {

    const res = await axios.get(
      "https://college-notes-backend-ouen.onrender.com/notes"
    );

    setNotes(res.data);

  };


  // ================= UPLOAD =================

  const uploadFile = async () => {

  if (!file) {

    return alert("Choose File");

  }

  const allowedTypes = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

  if (!allowedTypes.includes(file.type)) {

    return alert(
      "Only PDF, JPEG and DOCX files allowed"
    );

  }

  const formData = new FormData();

    formData.append("subject", subject);

formData.append("branch", branch);

formData.append("semester", semester);

formData.append("username", username);

formData.append("file", file);

    try {

      const res = await axios.post(
        "https://college-notes-backend-ouen.onrender.com/upload",
        formData
      );

      alert(res.data.message);

      getNotes();

    } catch (error) {

      console.log(error);

    }

  };


  // ================= DELETE =================

  const deleteNote = async (id) => {

    await axios.delete(
      `https://college-notes-backend-ouen.onrender.com/delete/${id}`        
    );

    getNotes();

  };

const logout = () => {

  localStorage.removeItem("token");

  setLoggedIn(false);

  setIsAdmin(false);

};
  // ================= USE EFFECT =================

  useEffect(() => {

    getNotes();

    const token = localStorage.getItem("token");

    if (token) {

      setLoggedIn(true);

    }

  }, []);


  return (

    <div className="container">

      <h1>College Notes Platform</h1>


      {/* ================= LOGIN BOX ================= */}

      {!loggedIn && (

        <div className="authBox">
<input
  type="email"
  placeholder="Email"
  value={email}
  onChange={(e) =>
    setEmail(e.target.value)
  }
/>

<input
  type="password"
  placeholder="Password"
  value={password}
  onChange={(e) =>
    setPassword(e.target.value)
  }
/>

          <div className="btns">

            <button onClick={register}>
              Register
            </button>

            <button onClick={login}>
              Login
            </button>
           
            <button onClick={forgotPassword}>
              Forgot Password
            </button>

          </div>

        </div>

      )}


      {/* ================= AFTER LOGIN ================= */}

      {loggedIn && (

        <>

          {isAdmin && (

  <h2>
    Admin Panel
  </h2>

)}  
          <button onClick={logout}>
            Logout
          </button>


          {/* ================= UPLOAD ================= */}

          <div className="uploadBox">

  <input
    type="text"
    placeholder="Subject"
    onChange={(e) =>
      setSubject(e.target.value)
    }
  />

  <input
    type="text"
    placeholder="Branch"
    onChange={(e) =>
      setBranch(e.target.value)
    }
  />

  <input
    type="text"
    placeholder="Semester"
    onChange={(e) =>
      setSemester(e.target.value)
    }
  />

  <input
    type="text"
    placeholder="Username"
    onChange={(e) =>
      setUsername(e.target.value)
    }
  />

  <input
    type="file"
    onChange={(e) =>
      setFile(e.target.files[0])
    }
  />

  <button onClick={uploadFile}>
    Upload File
  </button>

</div>


          {/* ================= NOTES ================= */}

          <input
  type="text"
  placeholder="Search by Subject / Branch / Semester"
  className="searchBar"
  onChange={(e) =>
    setSearch(e.target.value)
  }
/>

          <div className="notes">

  {notes
    .filter((note) => {

      return (

        note.subject
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||

        note.branch
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||

        note.semester
          ?.toLowerCase()
          .includes(search.toLowerCase())

      );

    })

    .map((note) => (

      <div className="card" key={note._id}>

        
        <p>
          <b>Subject:</b> {note.subject}
        </p>

        <p>
          <b>Branch:</b> {note.branch}
        </p>

        <p>
          <b>Semester:</b> {note.semester}
        </p>

        <p>
          <b>Uploaded By:</b> {note.username}
        </p>
        {isAdmin && (

  <p style={{ color: "red" }}>

    Admin Access

  </p>

)}

        <a
  href={`https://college-notes-backend-ouen.onrender.com/uploads/${note.file}`}
  download
  className="downloadBtn"
>
  Download
</a>

        <br />
        <br />

        <button
          onClick={() =>
            deleteNote(note._id)
          }
        >
          Delete
        </button>

      </div>

    ))}

</div>
        </>

      )}

    </div>

  );
}

export default App;