import React, { useContext, useState } from 'react' 
import { userDataContext } from '../store/UserContext';

const forms = ["DP on Index", "DP on Subsequences", "Bitmask DP", "Range DP", "Digit DP", "Game DP", "DP on Grids", "Re-rooting Tree DP", "DP on Trie", "Backtrack & Print"];

const NewProblem = () => {
    const {token} = useContext(userDataContext);   
    const [Problem, setProblem] = useState({
        form: "",
        name: "",
        practiceLink: "",
        platform: "",
        resourceLink: "",
        videoLink: "",
        difficulty: "",
    });

    const handleChange = (e)=> {
        setProblem({...Problem, [e.target.name]: e.target.value})
    }

    const handleSubmit = async(e)=> { 
        e.preventDefault();
        console.log('submitted problem is ', Problem)
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/problem/create-problem`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "Authorization": token
        },
        body: JSON.stringify(Problem)
        })
        const data = await response.json();
        if(response.ok) alert('problem created')
        console.log('new problem is ', data)
    }


  return (
    <>
        {/* Problem Form Section */}
      <section id="add-problem" className='py-16 bg-yellow-400'>
        <div className='w-[80%] mx-auto'>
          <h2 className='text-3xl font-bold text-center mb-12 text-black'>Add New DP Problem</h2>

          <form onSubmit={handleSubmit} className='flex flex-col gap-6 max-w-2xl mx-auto'>
            <div className='flex flex-col'>
              <label htmlFor="form" className='font-bold text-black mb-2'>Form</label>
              <select 
                onChange={handleChange} 
                name="form" 
                className='border-black border-2 rounded-lg p-3 bg-white text-black focus:ring-2 focus:ring-yellow-500'
                required
              > 
                <option value="" disabled selected>Select the DP Form</option>
                {forms.map((form, idx) => (
                  <option key={idx} value={form}>{form}</option>
                ))}
              </select>
            </div>

            <div className='flex flex-col'>
              <label htmlFor="name" className='font-bold text-black mb-2'>Problem Name</label>
              <input 
                onChange={handleChange} 
                className='border-black border-2 rounded-lg p-3 bg-white text-black focus:ring-2 focus:ring-yellow-500' 
                type="text" 
                name='name' 
                placeholder='Problem name'
                required
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor="practiceLink" className='font-bold text-black mb-2'>Problem URL</label>
              <input 
                onChange={handleChange} 
                className='border-black border-2 rounded-lg p-3 bg-white text-black focus:ring-2 focus:ring-yellow-500' 
                type="url" 
                name='practiceLink' 
                placeholder='https://example.com/problem'
                required
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor="platform" className='font-bold text-black mb-2'>Platform</label>
              <select
                  name='platform'
                  onChange={handleChange}
                  defaultValue=""
                  className='border-black border-2 rounded-lg p-3 bg-white text-black focus:ring-2 focus:ring-yellow-500'
                  required 
              >
                 <option value="" selected disabled>Select the coding platform</option>
                 <option value="LeetCode">LeetCode</option>
                 <option value="GeeksForGeeks">GeeksForGeeks</option>
              </select> 
            </div>

            <div className='flex flex-col'>
              <label htmlFor="resourceLink" className='font-bold text-black mb-2'>Resource Link</label>
              <input 
                onChange={handleChange} 
                className='border-black border-2 rounded-lg p-3 bg-white text-black focus:ring-2 focus:ring-yellow-500' 
                type="url" 
                name='resourceLink' 
                placeholder='https://example.com/solution'
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor="videoLink" className='font-bold text-black mb-2'>Youtube Link</label>
              <input 
                onChange={handleChange} 
                className='border-black border-2 rounded-lg p-3 bg-white text-black focus:ring-2 focus:ring-yellow-500' 
                type="url" 
                name='videoLink' 
                placeholder='youtube-link'
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor="difficulty" className='font-bold text-black mb-2'>Difficulty Level</label>
              <select 
                onChange={handleChange} 
                name="difficulty" 
                className='border-black border-2 rounded-lg p-3 bg-white text-black focus:ring-2 focus:ring-yellow-500'
                required
              >  
                <option value="" disabled selected>Select difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option> 
              </select>
            </div>

            <button 
              type="submit"
              className='bg-black text-yellow-400 py-3 px-6 rounded-lg hover:bg-gray-900 transition font-bold text-lg mt-4 border-2 border-black hover:border-yellow-400'
            >
              Submit Problem
            </button>
          </form>
        </div>
      </section>
    </>
  )
}

export default NewProblem