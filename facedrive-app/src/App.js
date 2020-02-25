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
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import fetch from 'node-fetch';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';


function App() {
  const[max,setMax]=React.useState('')
const[min,setMin]=React.useState('')
fetch('http://localhost:8080/minDate').then(res=>{
  res.json().then(data=>{
  //  console.log(data.data)
     setMin(data.data)
  })
}).catch(err=>{console.error(err.message)})

fetch('http://localhost:8080/maxDate').then(res=>{
  res.json().then(data=>{
    //console.log(data.data)
     setMax(data.data)
  })
}).catch(err=>{console.error(err.message)})
  document.title = "Facedrive App"
  return (
    <div className="App">
      <div className = "AppContent">
        <DbApp></DbApp>
      </div>
    </div>
  );

  function DbApp(){
 

    const[currentDate, setCurrentDate] = React.useState(max)
    const[endDate, setEndDate] = React.useState(visibleDate(max))
    const[startDate, setStartDate] = React.useState(visibleDate(min))
    const[rows,setRows]= React.useState([{}]) 
    const[status,setStatus]=React.useState('new')
    
   
  
      /* fetch('http://localhost:8080/dt1',{
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({"startDate": '2020-02-12T05:00:00.000Z', "endDate": '2020-02-13T05:00:00.000Z'})
      }).then(res=>{
        res.json().then(data=>{
          console.log(data)
          setRows(data.data)
        }).catch(err=>{console.error(err.message)})
      }).catch(err=>{console.error(err.message)}) */
    
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
      fetch('http://localhost:8080/dt1',{
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({"startDate": '2020-02-12T05:00:00.000Z', "endDate": '2020-02-13T05:00:00.000Z'})
      }).then(res=>{
        res.json().then(data=>{
         // console.log(data)
          //setRows([{}])
          setRows(data.data)
        }).catch(err=>{console.error(err.message)})
      }).catch(err=>{console.error(err.message)})
    
    },[startDate,endDate,status])

    //React.useEffect(()=>{},[status])
  
   
  
    function MenuPopupState(dt) {
      const changeStatus= (event)=>{
       
        if(event.nativeEvent.target.outerText=='Reconcile'){
          fetch('http://localhost:8080/updateStatus',{
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({"id": dt.dt , "status": 'reconciled'})
      }).then(res=>{
        res.json().then(data=>{
          console.log(data)
        }).catch(err=>{console.error(err.message)})
      }).catch(err=>{console.error(err.message)})
          setStatus('reconciled')
          console.log('Status: reconciled')
        }
        else if(event.nativeEvent.target.outerText=='Reject'){
      
          fetch('http://localhost:8080/updateStatus',{
            method: 'POST',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({"id": dt.dt , "status": 'rejected'})
          }).then(res=>{
            res.json().then(data=>{
              console.log(data)
            }).catch(err=>{console.error(err.message)})
          }).catch(err=>{console.error(err.message)})
          setStatus('rejected')
          console.log('Status: rejected')
        }
        else{
          setStatus('new')
          console.log('Status: new')
        }
        console.log(dt)
   
       }
    
      return (
        <PopupState variant="popover" popupId="demo-popup-menu">
          {popupState => (
            <React.Fragment>
              <Button variant="contained" color="primary" {...bindTrigger(popupState)} >
                action
              </Button>
              <Menu {...bindMenu(popupState)}>
                <MenuItem onClick={popupState.close,changeStatus} defaultValue='Reconciled'>Reconcile</MenuItem>
                <MenuItem onClick={popupState.close,changeStatus} defaultValue='Rejected'>Reject</MenuItem>
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
        <TextField  id="start-datetime" label="Start Date" type="datetime-local" defaultValue={startDate} onChange={onChangeSetStart} > </TextField>
        <box m={1}>
        <TextField  id="end-datetime" label="End Date" type="datetime-local" defaultValue={endDate} onChange={onChangeSetEnd}> </TextField> 
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
                <TableCell align="center" >{row.status} <MenuPopupState dt={row.discrepency_id} ></MenuPopupState></TableCell>
                <TableCell align="center">{row.description}</TableCell>
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
      </Grid>
  
      </div>
     )
  }
  
}

// e.g: dt={{id: "1", notes: "My notes" }}
export function SimplePopover(dt) {
  const useStyles = makeStyles(theme => ({
    typography: {
      padding: theme.spacing(2)
    }
  }));
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Button
        aria-describedby={id}
        variant="contained"
        color="primary"
        onClick={handleClick}
      >
        {dt.dt.id}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      >
        <MultilineTextFields dt={dt.dt} />
      </Popover>
    </div>
  );
}

export function MultilineTextFields(dt) {
  const [notes, setNotes] = React.useState(dt.dt.notes);
  const useStyles = makeStyles(theme => ({
    root: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: 200
      }
    }
  }));
  const updateNotes = event => {
    setNotes(event.target.value);
    fetch('http://localhost:8080/updateNotes',{
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({"id": dt.dt.id , "notes": dt.dt.notes})
      }).then(res=>{
        res.json().then(data=>{
          console.log(data)
        }).catch(err=>{console.error(err.message)})
      }).catch(err=>{console.error(err.message)})
  };
  const classes = useStyles();
  const [value, setValue] = React.useState("Controlled");

  const handleChange = event => {
    setValue(event.target.value);
  };

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <div>
        <TextField
          id="outlined-multiline-static"
          label="Notes"
          multiline
          rows="4"
          value={notes}
          variant="outlined"
          onChange={updateNotes}
        />
      </div>
    </form>
  );
}

export default App;
