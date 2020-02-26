import React from 'react';
import 'date-fns';
import './App.css';
import 'moment';
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Paper from '@material-ui/core/Paper';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import fetch, { Request } from 'node-fetch';
import { DropzoneDialog } from "material-ui-dropzone";
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";



export default function App() {  

  document.title = "Facedrive App"
  return (
    <div className="App">
      <div className = "AppContent">
        <DbApp></DbApp>
      </div>
    </div>
  );
}
  

function DbApp(){
    const[currentDate, setCurrentDate] = React.useState(' ')
    const[endDate, setEndDate] = React.useState(visibleDate(' '))
    const[startDate, setStartDate] = React.useState(visibleDate(' '))
    const[rows,setRows]= React.useState([{}]) 
    const[status,setStatus]=React.useState('new')
     
  
    function visibleDate(dt){
       return (dt.substring(0,10)+"T" + dt.substring(11,16))
    }
    
    fetch(new Request('http://localhost:8080/maxDate')).then(res=>{
      res.json().then(data=>{
        console.log("Current date: "+data.data)
         setCurrentDate(visibleDate(data.data))
        
      })
    }).catch(err=>{console.error(err.message)})
  
  
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
      fetch(new Request('http://localhost:8080/minDate')).then(res=>{
        res.json().then(data=>{
          console.log("Min date: " +data.data)
           setStartDate(visibleDate(data.data))
        })
      }).catch(err=>{console.error(err.message)})
      
      fetch(new Request('http://localhost:8080/maxDate')).then(res=>{
        res.json().then(data=>{
          console.log("Max date: "+data.data)
           setCurrentDate(visibleDate(data.data))
           setEndDate(visibleDate(data.data))
          
        })
      }).catch(err=>{console.error(err.message)})

     },[])


    React.useEffect(()=>{
      fetch('http://localhost:8080/dt1',{
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json'}),
        //body: JSON.stringify({"startDate": startDate, "endDate": endDate})
        body: JSON.stringify({"startDate": '2020-02-10T05:00:00.000Z', "endDate": '2020-02-13T05:00:00.000Z'})
      }).then(res=>{
        res.json().then(data=>{

            console.log("Dt1 : "+ data)
            //  setRows(data.data)
          
           
        }).catch(err=>{console.error(err.message)})
      }).catch(err=>{console.error(err.message)}) 
    
    },[startDate,endDate,status])

    function MenuPopupState(dt) {
      const changeStatus= (event)=>{
       
        if(event.nativeEvent.target.outerText=='Reconcile'){
          fetch('http://localhost:8080/updateStatus',{
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({"id": dt.dt.id , "status": 'reconciled'})
      }).then(res=>{
        setStatus('reconciled')
        dt.dt.status= 'reconciled'
        res.json().then(data=>{
          console.log("Status: "+data)
        }).catch(err=>{console.error(err.message)})
      }).catch(err=>{console.error(err.message)})
          
          console.log('Status: reconciled')
        }
        else if(event.nativeEvent.target.outerText=='Reject'){
      
          fetch('http://localhost:8080/updateStatus',{
            method: 'POST',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({"id": dt.dt.id , "status": 'rejected'})
          }).then(res=>{
            res.json().then(data=>{
              setStatus('rejected')
              dt.dt.status= 'rejected'
              console.log("Status: " +data)
            }).catch(err=>{console.error(err.message)})
          }).catch(err=>{console.error(err.message)})
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
              <Button variant="contained" color="default" {...bindTrigger(popupState)} >
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
        <Box m={1}>
        <Typography>Disrepency Table has been updated to: {currentDate}</Typography>
        </Box>
        <Box  m={3}  > 
        <Grid container direction="row" justify="center" alignItems="center">
        <Typography>Upload Stripe Sheet: </Typography>
        <Box m={1}></Box>
         <DropzoneFileUpload></DropzoneFileUpload> 
         </Grid></Box>
        <box m={3}>
        <Typography>Identify Desrepencies: </Typography> 
        </box>
        <div>
        <TextField  id="start-datetime" label="Start Date" type="datetime-local" value={startDate} onChange={onChangeSetStart} > </TextField>
        <box m={1}>
        <TextField  id="end-datetime" label="End Date" type="datetime-local" value={endDate} onChange={onChangeSetEnd}> </TextField> 
        </box>
        </div>
        <div>
        <EnhancedTable dt={[{}]}></EnhancedTable>
        </div>
      </Grid>
  
      </div>
     )
  }
  

  function DropzoneFileUpload() {
    const initialState = {
      open: false,
      files: []
    };
    const [state, setState] = React.useState(initialState);
    const [result, setResult]=React.useState(true)
    const [accepted, setAccepted]=React.useState(0)
    const [notAccepted, setNotAccepted]= React.useState(0)
  
    const handleOpen = () => {
      setState({
        ...state,
        open: true
      });
    };
  
    const handleClose = () => {
      setState({
        ...state,
        open: false
      });
    };
  
    const handleSave = files => {
      setState({
        ...state,
        files: files,
        open: false
      });

      console.log(files[0])
     
      fetch(new Request('http://localhost:8080/newData',{
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({file: files[0]})
      })).then(res=>{
        res.json().then(data=>{
      //  console.log("File upload: "+data.data)
         setResult(false)
        }).catch(err=>{console.error("File upload failed" + err.message)})
      }).catch(err=>{console.error("File upload failed" +err.message)})

  
  }

    
    
  
    return (
      <div>
        <Grid container direction="row" justify="center" alignItems="center">
        <Box m={3}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleOpen}
        >
          Add Data
        </Button>
        <DropzoneDialog
          open={state.open}
          onSave={handleSave}
          accept=".xlsx"
          showPreviews={true}
          maxFileSize={5000000}
          onClose={handleClose}
          cancelButtonText={"Cancel"}
          submitButtonText={"Upload"}
          showFileNamesInPreview={true}
          dialogTitle={"stripe data sheet"}
          dropzoneText={"Upload"}
        />
        </Box>
        <box m={3}> 
      <Typography hidden={result}> Entries updated: {accepted}</Typography> 
      <Typography hidden={result}> Entries rejected: {notAccepted}</Typography>
        </box>
        </Grid>
      </div>
    );
  }
  
// e.g: dt={{id: "1", data: "ll" }}
function SimplePopover(dt) {
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
        <MultilineTextViews dt={dt.dt}></MultilineTextViews>
      </Popover>
    </div>
  );
}

// e.g: dt={{id: "1", data: "ll" }}
function SimplePopoverForNotes(dt) {
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
        color="default"
        onClick={handleClick}
      >
        Update
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
        <MultilineTextFields dt={dt.dt}></MultilineTextFields>
      </Popover>
    </div>
  );
}

function MultilineTextFields(dt) {
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
    dt.dt.notes=notes
    fetch('http://localhost:8080/updateNotes',{
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({"id": dt.dt.id , "notes": notes})
      }).then(res=>{
        res.json().then(data=>{
          console.log("Notes: " + data)
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

function MultilineTextViews(dt) {
  const [notes, setNotes] = React.useState(dt.dt.data);
  const [ ride_id ,setRideId]= React.useState('xxxxx-xxxx-xxxx')
  const [ride_created, setRideCreated]= React.useState('2020-02-12T05:00:00.000Z')
  const useStyles = makeStyles(theme => ({
    root: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: 200
      }
    }
  }));
   
    fetch('http://localhost:8080/mindate',{
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({"id": dt.dt.id , "notes": notes})
      }).then(res=>{
        res.json().then(data=>{
          console.log("Notes: " + data)
        }).catch(err=>{console.error(err.message)})
      }).catch(err=>{console.error(err.message)})
  
  const classes = useStyles();
  const [value, setValue] = React.useState("Controlled");

  const handleChange = event => {
    setValue(event.target.value);
  };

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <div>
        <Typography>User Name:    John Snow</Typography>
        <Typography>User email:   abc@xyz.com</Typography>
        <Typography>Ride Created: {ride_created}</Typography>
        <Typography>Ride Id:      {ride_id}</Typography>
      </div>
    </form>
  );
}


 function EnhancedTable() {
   
  const [rows, setRows] = React.useState([{}]);
  const [status,setStatus]=React.useState('new')
  React.useState(()=>{
    fetch(new Request('http://localhost:8080/getAll')).then(res=>{
        res.json().then(data=>{
        console.log("Rows: "+data.data)
         setRows(data.data)
         
        }).catch(err=>{console.error(err.message)})
      }).catch(err=>{console.error(err.message)}) 
  },[])
  React.useState(()=>{
    fetch(new Request('http://localhost:8080/getAll')).then(res=>{
        res.json().then(data=>{
        console.log("Rows: "+data.data)
         setRows(data.data)
         
        }).catch(err=>{console.error(err.message)})
      }).catch(err=>{console.error(err.message)}) 
  },[status])
  
  function MenuPopupState(dt) {
    const changeStatus = event => {
      if (event.nativeEvent.target.outerText == "Reconcile") {
        fetch("http://localhost:8080/updateStatus", {
          method: "POST",
          headers: new Headers({ "Content-Type": "application/json" }),
          body: JSON.stringify({ id: dt.dt.id, status: "reconciled" })
        })
          .then(res => {
            setStatus("reconciled");
            dt.dt.status = "reconciled";
            res
              .json()
              .then(data => {
                console.log("Status: " + data);
              })
              .catch(err => {
                console.error(err.message);
              });
          })
          .catch(err => {
            console.error(err.message);
          });

        console.log("Status: reconciled");
      } else if (event.nativeEvent.target.outerText == "Reject") {
        fetch("http://localhost:8080/updateStatus", {
          method: "POST",
          headers: new Headers({ "Content-Type": "application/json" }),
          body: JSON.stringify({ id: dt.dt.id, status: "rejected" })
        })
          .then(res => {
            res
              .json()
              .then(data => {
                setStatus("rejected");
                dt.dt.status = "rejected";
                console.log("Status: " + data);
              })
              .catch(err => {
                console.error(err.message);
              });
          })
          .catch(err => {
            console.error(err.message);
          });
        console.log("Status: rejected");
      } else {
        setStatus("new");
        console.log("Status: new");
      }
      console.log(dt);
    };
    return (
      <PopupState variant="popover" popupId="demo-popup-menu">
        {popupState => (
          <React.Fragment>
            <Button
              variant="contained"
              color="default"
              {...bindTrigger(popupState)}
            >
              action
            </Button>
            <Menu {...bindMenu(popupState)}>
              <MenuItem
                onClick={(popupState.close, changeStatus)}
                defaultValue="Reconciled"
              >
                Reconcile
              </MenuItem>
              <MenuItem
                onClick={(popupState.close, changeStatus)}
                defaultValue="Rejected"
              >
                Reject
              </MenuItem>
            </Menu>
          </React.Fragment>
        )}
      </PopupState>
    );
  }


  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
  }

  const headCells = [
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "Discrepency ID"
    },
    {
      id: "stripe_id",
      numeric: true,
      disablePadding: false,
      label: "Stripe Charge Id"
    },
    { id: "status", numeric: true, disablePadding: false, label: "Status" },
    { id: "notes", numeric: true, disablePadding: false, label: "Notes" },
    {
      id: "description",
      numeric: true,
      disablePadding: false,
      label: "Description"
    },
    {
      id: "amount_stripe",
      numeric: true,
      disablePadding: false,
      label: "Amount Stripe"
    },
    {
      id: "amount_fd",
      numeric: true,
      disablePadding: false,
      label: "Amount FD"
    },
    {
      id: "amount_dis",
      numeric: true,
      disablePadding: false,
      label: "Amount Discrepency"
    },
    { id: "date", numeric: true, disablePadding: false, label: "Date" }
  ];

  function EnhancedTableHead(props) {
    const {
      classes,
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      onRequestSort
    } = props;
    const createSortHandler = property => event => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="" />
          {headCells.map(headCell => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "default"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
          <TableCell padding="" />
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
  };

  const useToolbarStyles = makeStyles(theme => ({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1)
    },
    highlight:
      theme.palette.type === "light"
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85)
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark
          },
    title: {
      flex: "1 1 100%"
    }
  }));

  const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { numSelected } = props;

    return (
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0
        })}
      >
        {numSelected > 0 ? (
          <Typography
            className={classes.title}
            color="inherit"
            variant="subtitle1"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            className={classes.title}
            variant="h6"
            id="tableTitle"
            align="center"
          >
            Facedrive Vs Stripe Disrepency
          </Typography>
        )}
      </Toolbar>
    );
  };

  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
  };

  const useStyles = makeStyles(theme => ({
    root: {
      width: "100%"
    },
    paper: {
      width: "100%",
      marginBottom: theme.spacing(2)
    },
    table: {
      minWidth: 750
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1
    }
  }));
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = event => {
    setDense(event.target.checked);
  };

  const isSelected = name => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell padding="" />

                      <TableCell component="th" scope="row">
                        <SimplePopover
                          dt={{ id: row.discrepency_id, notes: row.notes }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {row.stripe_charge_id}
                      </TableCell>
                      <TableCell align="center">
                        {row.status}{" "}
                        <MenuPopupState
                          dt={{ id: row.discrepency_id, status: row.status }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <SimplePopoverForNotes
                          dt={{ id: row.discrepency_id, notes: row.notes }}
                        />
                      </TableCell>
                      <TableCell align="center">{row.description}</TableCell>
                      <TableCell align="center">{row.stripe_amount}</TableCell>
                      <TableCell align="center">{row.fd_amount}</TableCell>
                      <TableCell align="center">
                        {row.desrepency_amount}
                      </TableCell>
                      <TableCell padding="" />
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[100, 150, 200]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </div>
  );
}

