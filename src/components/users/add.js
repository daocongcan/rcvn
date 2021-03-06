import React, { useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';

// import Modal from '@material-ui/core/Modal';
// import Backdrop from '@material-ui/core/Backdrop';
// import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
// import AccountCircle from '@material-ui/icons/AccountCircle';
// import InputAdornment from '@material-ui/core/InputAdornment';
// import LockIcon from '@material-ui/icons/Lock';
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import axios from "axios";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../styles/table.css'
import SimpleBackdrop from '../layouts/backdrop'

const useStyles = makeStyles((theme) => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	  },
}));

const styles = (theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(2),
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
	},
});

const DialogTitle = withStyles(styles)((props) => {
	const { children, classes, onClose, ...other } = props;
	return (
		<MuiDialogTitle disableTypography className={classes.root} {...other}>
			<Typography variant="h6">{children}</Typography>
			{onClose ? (
				<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
					<CloseIcon />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	);
});

const DialogContent = withStyles((theme) => ({
	root: {
		padding: theme.spacing(2),
	},
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(1),
	},
}))(MuiDialogActions);


export default function AddUser(props) {
	const classes = useStyles();
	const [state, setState] = React.useState({
		name: "",
		email: "",
		password: "",
		is_active: 0,
		repeatPassword: "",
		group_role: ""
	});
	const [backDropOpen, setBackDropOpen] = React.useState(false);
	const [error, setError] = React.useState('');
	const [loggedIn, setLoggedInr] = React.useState(false);

	const [validatorPass, setValidatorPass ] = React.useState([]);
	const [validatorRepeatPass, setValidatorRepeatPass ] = React.useState([]);

	const [errorMessagesRepeatPass, setErrorMessagesRepeatPass ] = React.useState([]);
	const [errorMessagesPass, setErrorMessagesPass ] = React.useState([]);
	

	let storageToken = JSON.parse(sessionStorage.getItem('token'))
	const API_URL = 'http://localhost:8000/api';
	const headers = {
		"Content-Type": "application/json",
		'Authorization': 'Bearer ' + storageToken.token,
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (props.action == 'add') {
			setBackDropOpen(true)
			axios.post(`${API_URL}/users`, state, { headers })
				.then(response => {
					props.handleSubmit(response.data.data);
					props.handleClose();
				});
		} else {
			setBackDropOpen(true)
			axios.put(`${API_URL}/users/${props.userId.row.id}`, state, { headers })
				.then(response => {
					props.handleSubmit(response.data.data);
					props.handleClose();
				});
		}

	}



	function handleChange(event) {
		const value = event.target.value;

		setError('');
		setState({
			...state,
			[event.target.name]: value
		});

		if (event.target.name == 'repeatPassword') {
			handleRepeatPassword();
			repeatPasswordValidation();
		}
		if (event.target.name == 'name') {
			minLenght();
		}
		if (event.target.name == 'password') {
			mediumPass();
			minLenght();
			passwordValidation();
		}
		if (event.target.name == 'email') {
			checkUniqueEmail();
		}
	}

	function handleInputChange() {

	}

	function handleChecked(event) {
		const value = event.target.checked;
		setState({
			...state,
			[event.target.name]: value
		});
	}


	function checkUniqueEmail() {
		let data = props.data;
		// let checkEmail = data.includes(state.email) 

		ValidatorForm.addValidationRule('uniqueEmail', (value) => {
			for (let i = 0; i < data.length; i++) {
				if (data[i].email == value && data[i].id != props.userId.row.id) {
					return false;
				}
			}
			return true;
		});



	}

	function handleRepeatPassword() {

		ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
			if (value !== state.password) {
				return false;
			}
			return true;
		});

	}

	function minLenght() {

		ValidatorForm.addValidationRule('minLenght', (value) => {

			if (value && value.length < 6) {
				return false;
			}
			return true;

		});

	}

	function mediumPass() {
		ValidatorForm.addValidationRule('mediumPass', (value) => {
			var mediumRegex = new RegExp("^((?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]))(?=.{6,})");
			if (value && mediumRegex.test(value)) {
				return true;
			}
			return false;
		});
	}

	function getUserById() {
		
		setState(props.userId.row); 

		// const res = axios({
		// 	url: `${API_URL}/users/${props.userId}`,
		// 	method: 'get',
		// 	headers: headers,
		// }).then(response => {
		// 	let data = response.data.data
		// 	setState(data[0]);
		// })
	}

	function closeForm() {
		props.handleClose(true);
	}

	const passwordValidation = () => {
		if (props.action == 'edit') { 
			setValidatorPass(['minLenght', 'mediumPass']);
			setErrorMessagesPass(['M???t kh???u h??n 5 k?? t???', 'M???t kh???u c?? ch??? hoa, th?????ng, v?? s??? '])
			
		} else {
			setValidatorPass(['required', 'minLenght', 'mediumPass']);
			setErrorMessagesPass(['M???t kh???u kh??ng ???????c tr???ng.', 'M???t kh???u h??n 5 k?? t???', 'M???t kh???u c?? ch??? hoa, th?????ng, v?? s??? '])
		}
		
	}

	const repeatPasswordValidation = () => {
		if (props.action == 'edit') { 
			setValidatorRepeatPass(['isPasswordMatch']);
			setErrorMessagesRepeatPass(['Nh???p x??c nh???n kh??ng ????ng'])
		} else {
			setValidatorRepeatPass(['required', 'isPasswordMatch']);
			setErrorMessagesRepeatPass(['Nh???p x??c nh???n m???t kh???u', 'Nh???p x??c nh???n kh??ng ????ng'])
		}
	}

	useEffect(() => {

		
			handleRepeatPassword();
			minLenght();
			mediumPass();
			checkUniqueEmail();
		

		
		if (props.action == 'edit') {
			// ValidatorForm.removeValidationRule('required');
			// ValidatorForm.removeValidationRule('isPasswordMatch');
			// ValidatorForm.removeValidationRule('mediumPass');
			getUserById();
		} else {
			passwordValidation();
			repeatPasswordValidation();
		}

	}, []);

	// const handleClose = (props) => {
	//   setOpen(false);
	// };

	return (
		<React.Fragment>

			<Dialog onClose={props.handleClose} aria-labelledby="customized-dialog-title" open={props.open}>
				<ValidatorForm
					onSubmit={handleSubmit}
					noValidate
					className={classes.form}
				>
					<DialogTitle id="customized-dialog-title" onClose={props.handleClose}>
						{props.action == 'add' ? 'Th??m' : 'Ch???nh s???a'} User
					</DialogTitle>
					<DialogContent dividers>

						<Grid container alignItems="center" >
							<Grid item md={3}  >
								T??n
							</Grid>
							<Grid item md={9}>
								<TextValidator
									variant="outlined"
									margin="dense"
									type="text"
									required
									fullWidth
									id="name"
									label="H??? v?? t??n"
									name="name"
									autoFocus
									value={state.name}
									validators={['required']}
									errorMessages={['Vui l??ng nh???p t??n ng?????i s??? d???ng']}
									onChange={handleChange}
								/>
							</Grid>
							<Grid item md={3} >
								Email
							</Grid>
							<Grid item md={9}>
								<TextValidator
									variant="outlined"
									margin="dense"
									type="email"
									required
									fullWidth
									id="email"
									label="Email"
									name="email"
									value={state.email}
									validators={['required', 'isEmail', 'uniqueEmail']}
									errorMessages={['Email kh??ng ???????c tr???ng', 'Email kh??ng ????ng ?????nh d???ng', 'Email ???? ???????c ????ng k??']}
									onChange={handleChange}
								/>
							</Grid>
							<Grid item md={3}  >
								M???t kh???u
							</Grid>
							<Grid item md={9}>
								<TextValidator
									variant="outlined"
									margin="dense"

									fullWidth
									name="password"
									label="M???t kh???u"
									type="password"
									id="password"
									value={state.password}
									validators={validatorPass}
									errorMessages={errorMessagesPass}
									onChange={handleChange}
								/>
							</Grid>
							<Grid item md={3}  >
								X??c nh???n
							</Grid>
							<Grid item md={9}>
								<TextValidator
									variant="outlined"
									margin="dense"
									required
									fullWidth
									name="repeatPassword"
									label="X??c nh???n m???t kh???u"
									type="password"
									id="repeatPassword"
									value={state.repeatPassword}
									onChange={handleChange}
									validators={validatorRepeatPass}
									errorMessages={errorMessagesRepeatPass}
								/>

							</Grid>
							<Grid item md={3}  >
								Nh??m
							</Grid>
							<Grid item md={9}>
								<FormControl variant="outlined" error={state.group_role == "" ? true : false} fullWidth  >
									<TextValidator
										style={{ marginTop: 8 }}
										name='group_role'
										select
										
										margin="dense"
										value={state.group_role}
										onChange={handleChange}
										fullWidth
										id="outlined-basic" 
										label="Ch???n nh??m" 
										variant="outlined"
										validators={['required']}
										errorMessages={['Ch???n l???a nh??m ch??? ?????nh [Admin, Reviewer , Editor]']}
									>
										<option aria-label="None" value=""> Ch???n nh??m </option>
										<option value='admin' >Admin</option>
										<option value='editor' >Editor</option>
										<option value='reviewer'>Reviewer</option>
									</TextValidator>
								</FormControl>

							</Grid>
							<Grid item md={3}   >
								Tr???ng th??i
							</Grid>
							<Grid item md={9}>
								<FormControl variant="outlined" className={classes.formControl}   >
									<FormControlLabel
										control={<Checkbox checked={state.is_active == 1 ? true : false} value={state.is_active} name="is_active" color="primary" onChange={handleChecked} />}
									/>
								</FormControl>
							</Grid>

						</Grid>

					</DialogContent>
					<DialogActions>
						<Button
							variant="contained"
							color="secondary"
							className={classes.submit}
							onClick={props.handleClose}
						>
							H???y
						</Button>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							L??u
						</Button>
					</DialogActions>
				</ValidatorForm>
			</Dialog>
			<SimpleBackdrop backDropOpen={backDropOpen} />
		</React.Fragment>
	);
}
