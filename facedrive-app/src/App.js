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
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
//import {connectToDb, dataWithInconsistency, getMaxDate} from'./db.js';

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
  document.title = "Facedrive App"
  //connectDb()
  async function connectDb(){
   //await connectToDb()
    
  }
  const[currentDate, setCurrentDate] = React.useState(moment(Date.now()).format())
  const[endDate, setEndDate] = React.useState(visibleDate(moment(Date.now()).format()))
  const[startDate, setStartDate] = React.useState(visibleDate(moment(Date.now()).format()))
  
  function visibleDate(dt){
     return (dt.substring(0,10)+"T" + dt.substring(11,16))
  }

  const onChangeSetStart=(event)=>{
      setStartDate(event.target.value)
  }
  
  const onChangeSetEnd=(event)=>{
   setEndDate(event.target.value)
  }
  
  const useStyles = makeStyles(theme => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: 200,
      },
    },
  }));
 
      const[rows,setRows]= React.useState([{
      Discrepency_ID : "0xoof", 
      Stripe_ID: "txb_999",
      Status : 'new', 
      Description: 'amount mis-match', 
      Stripe_Amount : 100,
      FD_Amount: 95,
      Desrepency_Amount: 5,
      Date:   visibleDate(moment(Date.now()).format())    }])
      
  const classes = useStyles();
  React.useEffect(()=>{
    /* dataWithInconsistency().then(res=>{
         setRows(res)
      }) */
  },[startDate, endDate])

  function MenuPopupState() {
    const[action, setAction]=React.useState('');
    const onClickSetStatus=(event)=>{

    }
    return (
      <PopupState variant="popover" popupId="demo-popup-menu">
        {popupState => (
          <React.Fragment>
            <Button variant="contained" color="primary" {...bindTrigger(popupState)}>
              action
            </Button>
            <Menu {...bindMenu(popupState)}>
              <MenuItem onClick={popupState.close}>Reconciled</MenuItem>
              <MenuItem onClick={popupState.close }>Rejected</MenuItem>
            </Menu>
          </React.Fragment>
        )}
      </PopupState>
    );
  }
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
      <TextField  id="start-datetime" label="Start Date" type="datetime-local" defaultValue={startDate} onChange={onChangeSetEnd}> </TextField>
      <box m={1}>
      <TextField  id="end-datetime" label="End Date" type="datetime-local" defaultValue={endDate} onChange={onChangeSetStart}> </TextField> 
      </box>
      </div>
      <div>
      <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Discrepency ID</TableCell>
            <TableCell align="center">Stripe Charge ID</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Description </TableCell>
            <TableCell align="center">Amount Stripe</TableCell>
            <TableCell align="center">Amount FD</TableCell>
            <TableCell align="center">Amount Discrepency</TableCell>
            <TableCell align="center">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.Discrepency_ID}>
              <TableCell component="th" scope="row">  {row.Discrepency_ID} </TableCell>
              <TableCell align="center">{row.Stripe_ID}</TableCell>
              <TableCell align="center">{row.Status}</TableCell>
              <TableCell align="center">{row.Description}  <MenuPopupState></MenuPopupState></TableCell>
              <TableCell align="center">{row.Stripe_Amount}</TableCell>
              <TableCell align="center">{row.FD_Amount}</TableCell>
              <TableCell align="center">{row.Desrepency_Amount}</TableCell>
              <TableCell align="center">{row.Date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      </div>
      <statusInput></statusInput>
    </Grid>
    </div>
   // <Typography>new start date: {startDate}</Typography>
   )
}




export default App;
