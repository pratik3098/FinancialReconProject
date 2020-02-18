import React from 'react';
import 'date-fns';
import './App.css';
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import  {makeStyles} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
//import getDataFromDisrepencyTable from './db.js';

function App() {
  return (
    <div className="App">
      <div className = "AppContent">
        <DbApp></DbApp>
      </div>
    </div>
  );
}


function DbApp(){
  const[currentDate, setCurrentDate] = React.useState(moment(Date.now()).format())
  const[startDate, setStartDate] =React.useState(moment(Date.now() - 1).format())
  const[endDate, setEndDate] = React.useState(moment(Date.now()).format())
  const getDataFromDb= ()=>{
  }

  const onClickSetStart=(event)=>{
      setStartDate(event.target.value)
  }
  
  const onClickSetEnd=(event)=>{
   setEndDate(event.target.value)
  }

  React.useEffect(()=>{},[startDate, endDate])
   return(
     <div>
   
    <Grid container direction="column" justify="center" alignItems="center">
    <Box m={1} />
      <Typography>FaceDrive: App vs. Stripe Reconciliation</Typography>
      <box m={3}></box>
      <Box m={1} border= {3}>
      <Typography>Disrepency Table has been updated to: {currentDate}</Typography>
      </Box>
      <box m={3}>
      <Typography>Identify Desrepencies: </Typography> 
      </box>
      <div>
      <TextField  id="start-datetime" label="Start Date" type="datetime-local" defaultValue={startDate} onClick={setStartDate}> </TextField>
      <box m={1}>
      <TextField  id="end-datetime" label="End Date" type="datetime-local" defaultValue={endDate} onClick={setEndDate}> </TextField> 
      </box>
      </div>

    </Grid>
    </div>
   )
}

export default App;
