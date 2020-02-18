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
  const[endDate, setEndDate] = React.useState(visibleDate(moment(Date.now()).format()))
  //currentDate.substring(0,10)+"T" + currentDate.substring(11,16)
  const[startDate, setStartDate] = React.useState(visibleDate(moment(Date.now()).format()))
  
  function visibleDate(dt){
     return (dt.substring(0,10)+"T" + dt.substring(11,16))
  }
  const getDataFromDb= ()=>{

  }

  const onClickSetStart=(event)=>{
      setStartDate(event.target.value)
  }
  
  const onClickSetEnd=(event)=>{
   setEndDate(event.target.value)
  }

  React.useEffect(()=>{

  },[startDate, endDate])
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
      <Typography>Start Date: {currentDate} </Typography> 
      </box>
      <div>
      <TextField  id="start-datetime" label="Start Date" type="datetime-local" defaultValue={startDate} onClick={setStartDate}> </TextField>
      <box m={1}>
      <TextField  id="end-datetime" label="End Date" type="datetime-local" defaultValue={endDate} onClick={setEndDate}> </TextField> 
      </box>
      </div>
      <div>
      <TableOutput> </TableOutput>
      </div>
    </Grid>
    </div>
    
   )
}

function TableOutput(){
  const useStyles = makeStyles(theme => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: 200,
      },
    },
  }));
  function visibleDate(dt){
    return (dt.substring(0,10)+"T" + dt.substring(11,16))
 }

      const[rows,setRows]= React.useState([{
      Discrepency_ID : "0xoof", 
      Stripe_ID: "txb_999",
      Status : 'new', 
      disrepencyStatus: 'amount mis-match', 
      Stripe_Amount : 100,
      FD_Amount: 95,
      Desrepency_Amount: 5,
       Date:   visibleDate(moment(Date.now()).format())    }])
      /* db.dataWithDiscrepency().then(res=>{
        setRows(res)
      })
      */
  const classes = useStyles();
 return (<TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Discrepency ID</TableCell>
            <TableCell align="right">Stripe Charge ID</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Description</TableCell>
            <TableCell align="right">Amount Stripe</TableCell>
            <TableCell align="right">Amount FD</TableCell>
            <TableCell align="right">Amount Discrepency</TableCell>
            <TableCell align="right">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.Discrepency_ID}>
              <TableCell component="th" scope="row">
                {row.Discrepency_ID}
              </TableCell>
              <TableCell align="right">{row.Stripe_ID}</TableCell>
              <TableCell align="right">{row.Status}</TableCell>
              <TableCell align="right">{row.disrepencyStatus}</TableCell>
              <TableCell align="right">{row.Stripe_Amount}</TableCell>
              <TableCell align="right">{row.FD_Amount}</TableCell>
              <TableCell align="right">{row.Desrepency_Amount}</TableCell>
              <TableCell align="right">{row.Date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>)
}
export default App;
