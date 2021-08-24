import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';
// import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
// import logo from '../../images/logo.JPG';
// import MenuItem from '@material-ui/core/MenuItem';
// import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
// import SaveIcon from '@material-ui/icons/Save';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import Pagination from '@material-ui/lab/Pagination';
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import EditIcon from '@material-ui/icons/Edit';
import axios from "axios";
import DeleteIcon from '@material-ui/icons/Delete';
// import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';
import BlockIcon from '@material-ui/icons/Block';
import Box from '@material-ui/core/Box';
import Header from '../layouts/appBar';
import Title from '../layouts/title';
// import InputBase from '@material-ui/core/InputBase';
import { useHistory } from 'react-router-dom';
// import { useParams } from "react-router-dom";
// import { positions } from '@material-ui/system';
import AddUser from './add';
import SimpleBackdrop from '../layouts/backdrop'
import ConfirmationDialog from '../layouts/confirmation'
import SimpleAlerts from '../layouts/alert'

import '../styles/table.css';



const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    logo: {
        width: '100%'
    },
    formControl: {
        // margin: theme.spacing(1),
        minWidth: 120,
    },
    borderInput: {
        border: 1,
        borderRadius: 5,
        paddingLeft: 5,
        paddingRight: 5,
        borderColor: '#000',
        borderStyle: 'solid',
    },
    select: {
        font: 'inherit',
        padding: 5,
        fontSize: 'inherit',
        borderRadius: 5,
    },
    flexItem: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        flexWrap: 'wrap',
        marginRight: '5%',
        display: 'flex',
        flexDirection: 'column',
    },
    selectPadding: {
        padding: 2,
    }
}));




export default function User(token) {
    const wrapper = React.createRef();
    const classes = useStyles();
    const [stt, setSTT] = React.useState(1);

    const [idDelete, setIdDelete] = React.useState('');

    const [backDropOpen, setBackDropOpen] = React.useState(true);
    const [data, setData] = React.useState([]);
    const [userId, setUserId] = React.useState('');
    const [action, setAction] = React.useState('');
    const [dataBackup, setDataBackup] = React.useState([]);
    const [pageSize, setPageSize] = React.useState(10);
    const [page, setPage] = React.useState(0);
    const [pagePagination, setPagePagination] = React.useState(1);
    const [recorView, setRecorView] = React.useState(1);
    const [totalPagination, setTotalPagination] = React.useState(1);
    const [popupAdd, setPopupAdd] = React.useState(false);
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [nameDelete, setNameDelete] = React.useState('');
    const [contentDelete, setContentDelete] = React.useState('');
    const [alertOpen, SetAlertOpen] = React.useState(false);

    
    const history = useHistory();

    const [state, setState] = React.useState({
        name: "",
        email: "",
        group_role: "",
        is_active: "",
    });

    const API_URL = 'http://localhost:8000/api/users';
    const headers = {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token.token.token,
    };

    const handleChange = (event, value) => {
        setPage(value - 1);
        setPagePagination(value);
        setRecorView(1 + ((value * pageSize) - pageSize))
    };

    const keyCodeEnter = (event) => {
        if (event.keyCode == 13) {
            handleSubmit(event);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let urlSearch = `?name=${state.name}&email=${state.email}&group_role=${state.group_role}&is_active=${state.is_active}`
        history.push(urlSearch);
        if (state.name == '' && state.email == '' && state.group_role == '' && state.is_active == '') {
            return false
        }

        axios.post(`${API_URL}/search`, { state }, { headers }).then((response) => {
            setData(response.data.data);
            let lengthData = response.data.data.length;
            let totalPagination = Math.ceil(lengthData / pageSize)
            setTotalPagination(totalPagination)
        });
    }

    const reloadData = (data) => {
        if (data == 1) {
            setPopupAdd(false)
            setBackDropOpen(false);
            callAPI();
        } else if (typeof data === 'object') {
            callAPI();
            setBackDropOpen(false);
            setPopupAdd(false)
        }
    }

    function handleClear() {
        setState({
            name: "",
            email: "",
            group_role: "",
            is_active: "",
        })
        setData(dataBackup);
        let lengthData = dataBackup.length;
        let totalPagination = Math.ceil(lengthData / pageSize)
        setTotalPagination(totalPagination)
        // console.log(dataBackup);
    }
    function handleInputChange(event) {
        const value = event.target.value;
        setState({
            ...state,
            [event.target.name]: value
        });
    }

    function handleAdd() {
        setPopupAdd(true);
        setAction('add');
    }

    function handleEdit(id) {
        setPopupAdd(true);
        setAction('edit');
        setUserId(id);
    }

    function handleDelete(id, action) {
        // delete and block user
        setIdDelete(id);
        setAction(action);
        setConfirmOpen(true)

    }

    const handleClose = () => {
        setPopupAdd(false);
        setConfirmOpen(false);
    };

    const handleOK = () => {

        setConfirmOpen(true);
        setBackDropOpen(true);

        axios.post(`${API_URL}/${idDelete}`, { action }, { headers }).then((response) => {
            if (response.data.data) {
                callAPI();
                setBackDropOpen(true);
                setConfirmOpen(false);
            }
        });

    }

    const callAPI = async () => {
        try {
            axios.get(API_URL, { headers })
                .then((data) => {
                    setData(data.data.data);
                    setDataBackup(data.data.data);
                    let lengthData = data.data.data.length;
                    let totalPagination = Math.ceil(lengthData / pageSize)
                    setTotalPagination(totalPagination)
                    setBackDropOpen(false)
                });
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {

        const params = new URLSearchParams(window.location.search)

        // let name = params.get('name')
        // console.log(name)
        callAPI();

    }, []);

    const columsData = [
        {
            field: '#', headerName: '#', renderCell: (params, rows) => (
                <div>
                    {
                        params.id
                    }
                </div>
            )
        },
        { field: 'name', headerName: 'Họ tên', flex: 1, },
        { field: 'email', headerName: 'Email', flex: 1, },
        { field: 'group_role', headerName: 'Nhóm', flex: 1, },
        {
            field: 'is_active', headerName: 'Trạng thái', flex: 1,
            renderCell: (params) => (
                <label style={{ color: params.value == 1 ? 'green' : 'red' }} >
                    {params.value == 1 ? 'Đang hoạt động' : 'Tạm khóa'}
                </label>
            )
        },
        {
            field: '', headerName: null, flex: 1, sortable: false,
            disableColumnMenu: true, renderCell: (params) => {
                const onClickDelete = async () => {
                    // return alert(JSON.stringify(params.row, null, 4));
                    handleDelete(params.id, { id_delete: true })
                    setNameDelete(params.row.name);
                    setContentDelete('Bạn muốn xóa tài khoản');
                };
                const onClickEdit = async () => {
                    // return alert(JSON.stringify(params.row, null, 4));
                    handleEdit(params);
                };
                const onClickBlock = async () => {
                    // return alert(JSON.stringify(params.row, null, 4));
                    handleDelete(params.id, { id_active: true })
                    setNameDelete(params.row.name);
                    setContentDelete('Bạn muốn khóa tài khoản');
                };
                return (
                    <Box display='flex'>
                        <EditIcon
                            id={params.id}
                            color='primary'
                            onClick={onClickEdit}
                        />
                        <DeleteIcon color='error' onClick={onClickDelete} />
                        <BlockIcon onClick={onClickBlock} />
                    </Box>
                )
            },
        }];

    const NoRow = () => {
        return (
            <label>Khong co du lieu</label>
        )
    }
    const rowsData = data;

    // const apiRef = React.useRef<GridApi>(null);
    return (
        <React.Fragment  >
            <Header />
            <Box position='relative' >
                <form onSubmit={handleSubmit} >
                    <Grid container spacing={0} style={{ padding: 20 }} >
                        <Title name='Users' />

                        <Grid item md={12}>

                            <Box display='flex'>
                                <Box className={classes.flexItem} >
                                    <b>Tên</b>
                                    <TextField name='name' margin="dense" placeholder="Nhập họ tên" label="" variant="outlined" value={state.name} onKeyDown={(e) => keyCodeEnter(e)} onChange={handleInputChange} />
                                </Box>
                                <Box className={classes.flexItem}>
                                    <b>Email</b>
                                    <TextField name='email' margin="dense" placeholder="Nhập email" label="" variant="outlined" value={state.email} onKeyDown={(e) => keyCodeEnter(e)} onChange={handleInputChange} />
                                </Box>
                                <Box className={classes.flexItem}>
                                    <b>Nhóm</b>

                                    <FormControl variant="outlined" className={classes.formControl}   >
                                        <Select
                                            style={{ marginTop: 8 }}
                                            name='group_role'
                                            native
                                            margin="dense"
                                            value={state.group_role}
                                            onChange={handleInputChange}
                                        >
                                            <option aria-label="None" value=""> Chọn nhóm </option>
                                            <option value='admin' >Admin</option>
                                            <option value='editor' >Editor</option>
                                            <option value='reviewer'>Reviewer</option>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box className={classes.flexItem}>
                                    <FormControl variant="outlined" className={classes.formControl}   >
                                        <b>Trạng thái</b>
                                        <Select
                                            native
                                            style={{ marginTop: 8 }}
                                            margin="dense"
                                            name='is_active'
                                            value={state.is_active}
                                            onChange={handleInputChange}
                                        >
                                            <option value='' >Chọn trạng thái</option>
                                            <option value='1' >Đang hoạt động</option>
                                            <option value='0' >Tạm khóa</option>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid container style={{ marginTop: 10 }} >
                        </Grid>
                        <Grid container>
                            <Grid item md={9}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    className={classes.button}
                                    startIcon={<PersonAddIcon />}
                                    onClick={handleAdd}
                                >
                                    Thêm mới
                                </Button>
                            </Grid>
                            <Grid item md={1} >
                                <Button
                                    type='submit'
                                    variant="contained"
                                    color="primary"
                                    size='small'
                                    className={classes.button}
                                    startIcon={<SearchIcon />}
                                >
                                    Tìm kiếm
                                </Button>

                            </Grid>
                            <Grid item md={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size='small'
                                    className={classes.button}
                                    startIcon={<ClearIcon />}
                                    onClick={handleClear}
                                >
                                    Xóa tìm
                                </Button>
                            </Grid>

                        </Grid>

                        <Grid container style={{ marginTop: 10 }} ></Grid>
                        <SimpleAlerts alertOpen = {alertOpen} handleClose={handleClose} />
                        <Grid item md={12}  >
                            <Box position="relative" style={{ height: 40 }}  >
                                <Box display="flex" justifyContent="center"  >
                                    {data.length > 10 ?
                                        <Pagination count={totalPagination} page={pagePagination} onChange={handleChange} color="primary" showFirstButton showLastButton />
                                        : " "
                                    }
                                </Box>
                                <Box position="absolute" right={0} top={0} > Hiển thị từ {data.length > 0 ? recorView : 0} ~ {pagePagination * pageSize > data.length ? data.length : (pagePagination * pageSize)} trong tổng số <b>{data.length}</b>  user</Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={12} >
                            <div style={{ height: '100%', width: '100%' }}>
                                <div style={{ display: 'flex', height: '100%' }}>
                                    <div style={{ flexGrow: 1 }}>
                                        <DataGrid
                                            autoHeight
                                            page={page}
                                            // pagination
                                            // loading={true}
                                            columns={columsData}
                                            rows={rowsData}
                                            pageSize={pageSize}
                                            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                            rowsPerPageOptions={[10, 20, 50]}
                                            hideFooterPagination={true}
                                            disableSelectionOnClick
                                            hideFooter
                                            disableColumnFilter={true}
                                            disableColumnMenu={true}
                                            disableColumnSelector={true}
                                            ColumnUnsortedIcon={true}
                                        // components={{
                                        //     noRowsOverlay: NoRow,
                                        // }}
                                        // noRowsOverlay={'fdasfdsafds'}
                                        // components={{
                                        //     noRowsOverlay: (params) => {
                                        //       if (!apiRef.current) {
                                        //         apiRef.current = params.api.current;
                                        //       }
                                        //       return <div>Không có dữ li</div>;
                                        //     }
                                        //   }}

                                        />
                                    </div>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </form>
                {popupAdd == true ? <AddUser data={dataBackup} userId={userId} action={action} open={popupAdd} handleClose={handleClose} handleSubmit={reloadData} /> : null}

                <SimpleBackdrop backDropOpen={backDropOpen} />
                <ConfirmationDialog confimOpen={confirmOpen} content={contentDelete} nameDelete={nameDelete} handleClose={handleClose} handleOK={handleOK} />

            </Box>
        </React.Fragment>
    );
}



