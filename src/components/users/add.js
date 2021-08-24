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
			setErrorMessagesPass(['Mật khẩu hơn 5 ký tự', 'Mật khẩu có chữ hoa, thường, và số '])
			
		} else {
			setValidatorPass(['required', 'minLenght', 'mediumPass']);
			setErrorMessagesPass(['Mật khẩu không được trống.', 'Mật khẩu hơn 5 ký tự', 'Mật khẩu có chữ hoa, thường, và số '])
		}
		
	}

	const repeatPasswordValidation = () => {
		if (props.action == 'edit') { 
			setValidatorRepeatPass(['isPasswordMatch']);
			setErrorMessagesRepeatPass(['Nhập xác nhận không đúng'])
		} else {
			setValidatorRepeatPass(['required', 'isPasswordMatch']);
			setErrorMessagesRepeatPass(['Nhập xác nhận mật khẩu', 'Nhập xác nhận không đúng'])
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
						{props.action == 'add' ? 'Thêm' : 'Chỉnh sửa'} User
					</DialogTitle>
					<DialogContent dividers>

						<Grid container alignItems="center" >
							<Grid item md={3}  >
								Tên
							</Grid>
							<Grid item md={9}>
								<TextValidator
									variant="outlined"
									margin="dense"
									type="text"
									required
									fullWidth
									id="name"
									label="Họ và tên"
									name="name"
									autoFocus
									value={state.name}
									validators={['required']}
									errorMessages={['Vui lòng nhập tên người sử dụng']}
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
									errorMessages={['Email không được trống', 'Email không đúng định dạng', 'Email đã được đăng ký']}
									onChange={handleChange}
								/>
							</Grid>
							<Grid item md={3}  >
								Mật khẩu
							</Grid>
							<Grid item md={9}>
								<TextValidator
									variant="outlined"
									margin="dense"

									fullWidth
									name="password"
									label="Mật khẩu"
									type="password"
									id="password"
									value={state.password}
									validators={validatorPass}
									errorMessages={errorMessagesPass}
									onChange={handleChange}
								/>
							</Grid>
							<Grid item md={3}  >
								Xác nhận
							</Grid>
							<Grid item md={9}>
								<TextValidator
									variant="outlined"
									margin="dense"
									required
									fullWidth
									name="repeatPassword"
									label="Xác nhận mật khẩu"
									type="password"
									id="repeatPassword"
									value={state.repeatPassword}
									onChange={handleChange}
									validators={validatorRepeatPass}
									errorMessages={errorMessagesRepeatPass}
								/>

							</Grid>
							<Grid item md={3}  >
								Nhóm
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
										label="Chọn nhóm" 
										variant="outlined"
										validators={['required']}
										errorMessages={['Chọn lựa nhóm chỉ định [Admin, Reviewer , Editor]']}
									>
										<option aria-label="None" value=""> Chọn nhóm </option>
										<option value='admin' >Admin</option>
										<option value='editor' >Editor</option>
										<option value='reviewer'>Reviewer</option>
									</TextValidator>
								</FormControl>

							</Grid>
							<Grid item md={3}   >
								Trạng thái
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
							Hủy
						</Button>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							Lưu
						</Button>
					</DialogActions>
				</ValidatorForm>
			</Dialog>
			<SimpleBackdrop backDropOpen={backDropOpen} />
		</React.Fragment>
	);
}
