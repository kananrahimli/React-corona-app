import axios from 'axios'
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from 'react';

const List = () => {
    const [listCountry,setListCountry]=useState([]);
    const [selectedCountry,setSelectedCountry]=useState('');
    const [allData,setAllData]=useState([]);
    const [currentData,setCurrentData]=useState([]);
    const  [searching,setSearching]=useState(false)
    const [findsCountry,setCountries]=useState([])
    // const [global,setGlobal]=useState([])
    const inputRef=useRef()
   
    useEffect(()=>{
       /*Get Country*/  
       axios.get('https://api.covid19api.com/countries').then((res)=>setListCountry(res.data));

       /* Get Summary*/
       axios.get('https://api.covid19api.com/summary').then((res)=>{setAllData(res.data);setCurrentData(res.data.Global)})
       
    //    setGlobal(allData.Global)
    },[]);

   

    const selectCountry=(value)=>{
        // console.log(value,allData);
        const current=allData.Countries.filter(data=>data.Slug===value)
        console.log(current);
        if(current.length>0){
            setCurrentData(current[0])
            inputRef.current.value=''
            
        }else{
            setCurrentData(allData.Global)
            setSelectedCountry('Global')
        }
        
      
    }

    const search=(val)=>{

        const current =allData.Countries.filter(data=>data.Slug.trim().includes(val))
        if(current.length>0 && val!==''){
            setCountries(current)
            setSearching(true)
        }else{
            setCountries(null)
            setSearching(false)
        }
        
        
        // if(foundCountry.length>0){
        //     setCurrentData(foundCountry[0])
        // }else{
        //     setCurrentData(allData.Global)
        //     setSelectedCountry('Global')
        // }
    }

    const searchedCountry=(val)=>{
        setSearching(false)
        inputRef.current.value=val
        const current =allData.Countries.filter(country=>country.Slug===val)
        setCurrentData(current[0])

    }

    return ( 
        <div className="list d-flex flex-column ">
            <div className="row justify-content-between">
                <select name="select-country" id="" value={selectedCountry} className="form-control col-md-8" onChange={(e)=>{setSelectedCountry(e.target.value); selectCountry(e.target.value)}}>
                    <option defaultValue="all" selected >Global</option>
                {listCountry.map((country)=>(
                    <option value={country.Slug} key={country.Slug}>{country.Country}</option >
                ))}
                </select>
                <div className="col-md-3 px-0 mx-0 postion-relative">
                    <input  type="text" ref={inputRef} className="form-control " placeholder="Search.." onInput={(e)=>search(e.target.value)} />

                    {searching &&  <div className="w-100 search-results">
                        <ul className="list-unstyled px-2">
                            {findsCountry && findsCountry.map((country)=>(
                                <li key={country.Slug} value={country.Slug} onClick={(e)=>searchedCountry(e.target.innerText)}>{country.Slug}</li>
                            ))}
                            
                        </ul>
                    </div>}
                   
                </div>
               
            </div>
           
            <div className="boxes d-flex row justify-content-between my-5">
                <div className="confirmed col-md-3 my-4 bg-primary d-flex justify-content-center align-items-center">{currentData.TotalConfirmed}</div>
                <div className="deaths bg-danger col-md-3 my-4 d-flex justify-content-center align-items-center">{currentData.TotalDeaths}</div>
                <div className="recovered bg-success col-md-3 my-4 d-flex justify-content-center align-items-center">{currentData.TotalRecovered}</div>
            </div>
            <table className="table table-bordered table-responsive-md table-dark mt-5 ">
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Country</th>
                    <th>Confirmed</th>
                    <th>Deaths</th>
                    <th>Recovered</th>
                    <th>New Confirmed</th>
                    <th>New Deaths</th>
                    <th>New Recovered</th>
                    </tr>
                </thead>
                <tbody>


                    {allData.Countries && allData.Countries.map((country,index)=>(
                     <tr key={index}>
                         <th>{index+1 }</th>
                         <td>{ country.Country }</td>
                         <td>{ country.TotalConfirmed }</td>
                         <td>{ country.TotalDeaths }</td>
                         <td>{ country.TotalRecovered }</td>
                         <td>{ country.NewConfirmed }</td>
                         <td>{ country.NewDeaths }</td>
                         <td>{ country.NewRecovered }</td>
                     </tr>
                    ))}
                   
                </tbody>
            </table>

        </div>
     );
}
 
export default List;