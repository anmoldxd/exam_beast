"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [notes, setNotes] = useState("");
  const [quiz, setQuiz] = useState("");
  const [loading, setLoading] = useState(false);

  const [seconds, setSeconds] = useState(1500);
  const [running, setRunning] = useState(false);

  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("exam_streak");
    if(saved) setStreak(Number(saved));
  }, []);

  useEffect(() => {
    let interval;

    if(running && seconds > 0){
      interval = setInterval(() => {
        setSeconds(prev => prev - 1);
      },1000);
    }

    return () => clearInterval(interval);

  }, [running, seconds]);

  async function generateQuiz(){

    if(!notes){
      alert("Enter notes first");
      return;
    }

    setLoading(true);

    try{

      const res = await fetch("/api/generate",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({ notes })
      });

      const data = await res.json();

      if(data.error){
        setQuiz("Error: " + data.error);
      } else {
        setQuiz(data.quiz);
      }

      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem("exam_streak", newStreak);

    }catch(err){
      setQuiz("Something went wrong");
    }

    setLoading(false);
  }

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <main style={{
      padding:"20px",
      maxWidth:"900px",
      margin:"auto"
    }}>

      <motion.h1
        initial={{opacity:0,y:-20}}
        animate={{opacity:1,y:0}}
        style={{
          textAlign:"center",
          fontSize:"3rem"
        }}
      >
        Exam Beast
      </motion.h1>

      <p style={{
        textAlign:"center",
        opacity:0.7
      }}>
        AI Study + Focus App
      </p>

      <div style={{
        display:"grid",
        gap:"20px",
        marginTop:"30px"
      }}>

        <motion.div
          whileHover={{scale:1.02}}
          style={{
            background:"#1e293b",
            padding:"20px",
            borderRadius:"20px"
          }}
        >

          <h2>📚 Notes → Quiz</h2>

          <textarea
            value={notes}
            onChange={(e)=>setNotes(e.target.value)}
            placeholder="Paste your notes here..."
            style={{
              width:"100%",
              height:"180px",
              padding:"12px",
              borderRadius:"12px",
              marginTop:"10px"
            }}
          />

          <button
            onClick={generateQuiz}
            style={{
              marginTop:"15px",
              padding:"12px 20px",
              borderRadius:"12px",
              border:"none",
              cursor:"pointer",
              fontWeight:"bold"
            }}
          >
            {loading ? "Generating..." : "Generate Quiz"}
          </button>

          {quiz && (
            <div style={{
              marginTop:"20px",
              whiteSpace:"pre-wrap",
              background:"#0f172a",
              padding:"15px",
              borderRadius:"12px"
            }}>
              {quiz}
            </div>
          )}

        </motion.div>

        <motion.div
          whileHover={{scale:1.02}}
          style={{
            background:"#1e293b",
            padding:"20px",
            borderRadius:"20px"
          }}
        >

          <h2>⏳ Focus Timer</h2>

          <h1 style={{
            fontSize:"4rem"
          }}>
            {mins}:{secs.toString().padStart(2,"0")}
          </h1>

          <div style={{
            display:"flex",
            gap:"10px"
          }}>
            <button onClick={()=>setRunning(true)}>Start</button>
            <button onClick={()=>setRunning(false)}>Pause</button>
            <button onClick={()=>{
              setRunning(false);
              setSeconds(1500);
            }}>
              Reset
            </button>
          </div>

        </motion.div>

        <motion.div
          whileHover={{scale:1.02}}
          style={{
            background:"#1e293b",
            padding:"20px",
            borderRadius:"20px"
          }}
        >

          <h2>🔥 Study Streak</h2>
          <h1>{streak} Days</h1>
          <p>Study daily and level up.</p>

        </motion.div>

      </div>

    </main>
  );
}