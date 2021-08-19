import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import logo from '../../images/logo.JPG';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import SaveIcon from '@material-ui/icons/Save';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import Pagination from '@material-ui/lab/Pagination';
import { DataGrid } from '@material-ui/data-grid';
import EditIcon from '@material-ui/icons/Edit';
import axios from "axios";
import DeleteIcon from '@material-ui/icons/Delete';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';
import BlockIcon from '@material-ui/icons/Block';
import Box from '@material-ui/core/Box';
import Header from '../layouts/appBar';
import Title from '../layouts/title';
import InputBase from '@material-ui/core/InputBase';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch
} from "react-router-dom";

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



export default function User() {
    const classes = useStyles();
    const [data, setData] = React.useState([]);
    const [pageSize, setPageSize] = React.useState(10);
    const [page, setPage] = React.useState(0);
    const [pagePagination, setPagePagination] = React.useState(1);
    const [recorView, setRecorView] = React.useState(1);
    const [totalPagination, setTotalPagination] = React.useState(1);

    const handleChange = (event, value) => {
        setPage(value - 1);
        setPagePagination(value);
        setRecorView(1 + ((value * pageSize) - pageSize))
    };

    useEffect(() => {
        const tokenStorage = JSON.parse(sessionStorage.getItem('token'));
        const API_URL = 'http://localhost:8000/api/users';
        const headers = {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + tokenStorage.token,
        };



        const callAPI = async () => {
            try {
                axios.get(API_URL, { headers })
                    .then((data) => {
                        setData(data.data.data);
                        let lengthData = data.data.data.length;
                        let totalPagination = Math.ceil(lengthData / pageSize)
                        setTotalPagination(totalPagination)
                    });
            } catch (e) {
                console.log(e);
            }
        };
        callAPI();
    }, []);

    const columsData = [{ field: 'id', headerName: '#' },
    { field: 'name', headerName: 'Họ tên', flex: 1, },
    { field: 'email', headerName: 'Email', flex: 1, },
    { field: 'group_role', headerName: 'Nhóm', flex: 1, },
    {
        field: 'is_active', headerName: 'Trạng thái', flex: 1,
        renderCell: (params) => (
            <label style={{ color: params.value == '1' ? 'green' : 'red' }} >
                {params.value == '1' ? 'Đang hoạt động' : 'Tạm khóa'}
            </label>
        )
    },
    {
        field: '', headerName: '', flex: 1, renderCell: (params) => (
            <strong>
                <EditIcon
                    id={params.id}
                    color='primary'

                />
                <DeleteIcon color='error' />
                <BlockIcon color='' />
            </strong>
        ),
    }];
    const rowsData = data;

    // console.log(totalPagination);

    return (
        <div className={classes.root}  >
            <Header />

            <Grid container spacing={0} style={{ padding: 20 }} >
                <Title name='Users' />

                <Grid item md={12}>
                    <Box display='flex'>
                        {/* <InputBase
                        className={classes.borderInput}
                        placeholder="Nhập họ tên"
                        name="name"
                    /> */}
                        <Box className={classes.flexItem} >
                            <b>Tên</b>
                            <input type='text' placeholder='Nhập họ tên'></input>
                        </Box>
                        <Box className={classes.flexItem}>
                            <b>Email</b>
                            <input type='text' placeholder='Nhập email'></input>
                        </Box>
                        <Box className={classes.flexItem}>
                            <b>Nhóm</b>
                            <select className={classes.selectPadding}  >
                                <option>Chọn nhóm</option>
                                <option>Admin</option>
                                <option>Editor</option>
                                <option>Reviewer</option>
                            </select>
                        </Box>
                        <Box className={classes.flexItem}>
                            <b>Trạng thái</b>
                            <select className={classes.selectPadding} >
                                <option>Chọn trạng thái</option>
                                <option>Đang hoạt động</option>
                                <option>Tạm khóa</option>
                            </select>
                        </Box>
                    </Box>
                </Grid>
                <Grid container style={{marginTop:10}} ></Grid>
                <Grid container>
                    <Grid item md={9}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            className={classes.button}
                            startIcon={<PersonAddIcon />}
                        >
                            Thêm mới
                        </Button>
                    </Grid>
                    <Grid item md={1} >
                        <Button
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
                        >
                            Xóa tìm
                        </Button>
                    </Grid>
                </Grid>
                <Grid container style={{marginTop:10}} ></Grid>
                <Grid item md={12} >
                    <Pagination count={totalPagination} page={pagePagination} onChange={handleChange} color="primary" showFirstButton showLastButton />
                    <label> Hiển thị từ {recorView} ~ {pagePagination * pageSize > data.length ? data.length : (pagePagination * pageSize)} trong tổng số <b>{data.length}</b>  user</label>
                </Grid>
                <Grid item xs={12} md={12} >
                    <div style={{ height: 650, width: '100%' }}>
                        <div style={{ display: 'flex', height: '100%' }}>
                            <div style={{ flexGrow: 1 }}>
                                <DataGrid
                                    page={page}
                                    // pagination
                                    // loading={true}
                                    columns={columsData}
                                    rows={rowsData}
                                    pageSize={pageSize}
                                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                    rowsPerPageOptions={[10, 20, 50]}
                                    hideFooterPagination={true}
                                />
                            </div>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

