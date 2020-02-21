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
import Popover from '@material-ui/core/Popover';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import {connectToDb, getMaxDate,getMinDate,
  dataWithInconsistency, updateNotes, updateStatus, getdetailByID, condateFormat
} from'./db.js';

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
  connectToDb().catch(err=>{console.error(err.message)})
  const[currentDate, setCurrentDate] = React.useState(moment(Date.now()).format())
  const[endDate, setEndDate] = React.useState(visibleDate(moment(Date.now()).format()))
  const[startDate, setStartDate] = React.useState(visibleDate(moment(Date.now()).format()))
  const[rows,setRows]= React.useState([{
    discrepency_id : "0xoof", 
    stripe_charge_id: "txb_999",
    status : 'new', 
    notes: 'Hello World!',
    description: 'amount mis-match', 
    stripe_amount : 100,
    fd_amount: 95,
    desrepency_amount: 5,
    date:   visibleDate(moment(Date.now()).format())    }]) 
    rowf().catch(err=>{console.error(err.message)})
  async function rowf(){
   let r =await dataWithInconsistency('2020-02-12T05:00:00.000Z','2020-02-13T05:00:00.000Z').catch(err=>{console.error(err.message)})
   r = Array.from(r)
   console.log(r)
   setRows(r)
  }
  
  getMaxDate().then(res=>{setCurrentDate(res); setEndDate(res)}).catch(err=>{console.error(err)})
  getMinDate().then(res=>{setStartDate(res)}).catch(err=>{console.error(err)})
  dataWithInconsistency(startDate,endDate).then(res=>{setRows(res)}).catch(err=>{console.error(err)})
  
 
  
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
 

     
      
  const classes = useStyles();
  React.useEffect(()=>{

      dataWithInconsistency(startDate,endDate).then(res=>{setRows(res)}).catch(err=>{console.error(err)})
      console.log(rows)

  },[startDate, endDate])



  function MenuPopupState() {
  
    return (
      <PopupState variant="popover" popupId="demo-popup-menu">
        {popupState => (
          <React.Fragment>
            <Button variant="contained" color="primary" {...bindTrigger(popupState)}>
              action
            </Button>
            <Menu {...bindMenu(popupState)}>
              <MenuItem onClick={popupState.close}>Reconciled</MenuItem>
              <MenuItem onClick={popupState.close}>Rejected</MenuItem>
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
            <TableRow key={row.discrepency_id}>
              <TableCell component="th" scope="row">{row.discrepency_id}</TableCell>
              <TableCell align="center">{row.stripe_charge_id}</TableCell>
              <TableCell align="center" >{row.status} <MenuPopupState></MenuPopupState></TableCell>
              <TableCell align="center">{row.description}  </TableCell>
              <TableCell align="center">{row.stripe_amount}</TableCell>
              <TableCell align="center">{row.fd_amount}</TableCell>
              <TableCell align="center">{row.desrepency_amount}</TableCell>
              <TableCell align="center">{row.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      </div>
      <DataPoper dt={rows[0]}/>
    </Grid>

    </div>
   )
}


export function DataPoper(dt){
  const useStyles = makeStyles(theme => ({
    popover: {
      pointerEvents: 'none',
    },
    paper: {
      padding: theme.spacing(1),
    },
  }));
  
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
  
    const handlePopoverOpen = event => {
      setAnchorEl(event.currentTarget);
    };
  
    const handlePopoverClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    return (
      <div>
        <Typography
          aria-owns={open ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        >
          {dt.discrepency_id}
        </Typography>
        <Popover
          id="mouse-over-popover"
          className={classes.popover}
          classes={{
            paper: classes.paper,
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <Typography>{dt.notes}</Typography>
        </Popover>
      </div>
    );
}
export default App;
