import React, { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import { useMutation, useLazyQuery } from "@apollo/client";
import { toast } from "react-toastify";
import Time from "react-time-format";
import {
    ADD_USER,
    UPDATE_USER,
    DELETE_USER,
    getAllUsers,
} from "./graphql/user";

function App() {
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [addUser] = useMutation(ADD_USER);
    const [updateUser] = useMutation(UPDATE_USER);
    const [deleteUser] = useMutation(DELETE_USER);
    const [getUsers] = useLazyQuery(getAllUsers);
    const [userdata, setUserData] = useState([]);
    const [preData, setPreData] = useState([]);
    const cancelButton = useRef(null);

    useEffect(() => {
        getUserData();
    }, []);

    useEffect(() => {
        if (preData.length !== 0) {
            update_formik.setFieldValue("update_name", preData[0].name);
            update_formik.setFieldValue("update_gender", preData[0].gender);
            update_formik.setFieldValue(
                "update_birthday",
                new Date(preData[0].birthday)
            );
        }
    }, [preData]);

    const formik = useFormik({
        initialValues: {
            name: "",
            gender: "1",
            birthday: "",
        },
        validationSchema: Yup.object().shape({
            name: Yup.string()
                .min(3, "name is too short.")
                .required("fill the name"),
            birthday: Yup.string().required("fill the birthday"),
        }),
        onSubmit: async (values, { resetForm }) => {
            setLoading(true);
            try {
                const result = await addUser({
                    variables: {
                        name: values.name,
                        gender: Number(values.gender),
                        birthday: values.birthday,
                    },
                });

                setLoading(false);

                if (!result.data.addUser) {
                    toast.error("Name already exist");
                } else {
                    toast.success("Add Success");
                    getUserData();
                }

                resetForm({ values: "" });
            } catch (err) {
                console.log(err.message);
                setLoading(false);
                toast.error("Failed Add");
            }
        },
    });

    const update_formik = useFormik({
        initialValues: {
            update_name: "",
            update_gender: "1",
            update_birthday: "",
        },
        validationSchema: Yup.object().shape({
            update_name: Yup.string()
                .min(3, "name is too short.")
                .required("fill the name"),
            update_birthday: Yup.string().required("fill the birthday"),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const result = await updateUser({
                    variables: {
                        id: preData[0].id,
                        name: values.update_name,
                        gender: Number(values.update_gender),
                        birthday: values.update_birthday,
                    },
                });
                if (!result.data.updateUser) {
                    toast.error("Name already exist");
                } else {
                    toast.success("Update Success");
                    cancelButton.current.click();
                    getUserData();
                    resetForm({ values: "" });
                }
            } catch (err) {
                console.log(err.message);
                cancelButton.current.click();
                toast.error("Failed Update");
            }
        },
    });

    const getUserData = async () => {
        setTableLoading(true);
        try {
            const result = await getUsers();
            setUserData(result.data.getUsers);
            setTableLoading(false);
        } catch (err) {
            console.log(err.message);
            setTableLoading(false);
        }
    };

    const updateModal = async (param) => {
        const result = userdata.filter((item) => item.id === param);
        setPreData(result);
    };

    const removeUser = async (param) => {
        try {
            const result = await deleteUser({
                variables: {
                    id: param,
                },
            });

            if (result.data.deleteUser.name) {
                toast.error("Server Error");
            } else {
                toast.success("Delete Success");
                getUserData();
            }
        } catch (err) {
            console.log(err.message);
            toast.error("Failed Delete");
        }
    };

    return (
        <>
            <div className="container">
                <form onSubmit={formik.handleSubmit}>
                    <div className="row header">
                        <div className="col-12 col-sm-6 col-md-3">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.name}
                            />
                            {formik.touched.name && formik.errors.name ? (
                                <span className="error">
                                    {formik.errors.name}
                                </span>
                            ) : null}
                        </div>
                        <div className="col-12 col-sm-6 col-md-3">
                            <label className="form-label">Gender</label>
                            <select
                                className="form-select"
                                name="gender"
                                onChange={formik.handleChange}
                                value={formik.values.gender}
                            >
                                <option value="1">MALE</option>
                                <option value="0">FEMALE</option>
                            </select>
                        </div>
                        <div className="col-12 col-sm-6 col-md-3">
                            <label className="form-label">Birthday</label>
                            <DatePicker
                                name="birthday"
                                className="form-control"
                                dateFormat="MM/dd/yyyy"
                                selected={formik.values.birthday}
                                onChange={(val) => {
                                    formik.setFieldValue("birthday", val);
                                }}
                                minDate={new Date("01/01/1900")}
                                maxDate={new Date()}
                                onBlur={formik.handleBlur}
                                autoComplete="off"
                            />
                            {formik.touched.birthday &&
                            formik.errors.birthday ? (
                                <span className="error">
                                    {formik.errors.birthday}
                                    <br />
                                    <br />
                                </span>
                            ) : null}
                        </div>
                        <div className="col-12 col-sm-6 col-md-3">
                            <div className="d-grid gap-2">
                                <br />
                                {loading ? (
                                    <button className="btn btn-primary">
                                        Loading...
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-primary"
                                        type="submit"
                                    >
                                        Add User
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
                {tableLoading ? (
                    <div className="table_load">
                        <div className="spinner-border text-success"></div>
                    </div>
                ) : (
                    <table className="table table-primary table-hover text-center userlist">
                        <tbody>
                            <tr>
                                <th>No</th>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Birthday</th>
                                <th>Action</th>
                            </tr>
                        </tbody>
                        <tbody>
                            {userdata.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.name}</td>
                                        <td>
                                            {item.gender === 1
                                                ? "Male"
                                                : "Female"}
                                        </td>
                                        <td>
                                            <Time
                                                value={item.birthday}
                                                format="MM/DD/YYYY"
                                            />
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-outline-success btn-sm"
                                                data-bs-toggle="modal"
                                                data-bs-target="#exampleModal"
                                                onClick={() =>
                                                    updateModal(item.id)
                                                }
                                            >
                                                Edit
                                            </button>
                                            &nbsp;&nbsp;&nbsp;
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() =>
                                                    removeUser(item.id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Edit Modal */}
            <div
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <form
                        onSubmit={update_formik.handleSubmit}
                        autoComplete="off"
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5
                                    className="modal-title"
                                    id="exampleModalLabel"
                                >
                                    Edit User
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row gap-3">
                                    <div className="col-12">
                                        <input
                                            type="text"
                                            name="update_name"
                                            className="form-control"
                                            onChange={
                                                update_formik.handleChange
                                            }
                                            onBlur={update_formik.handleBlur}
                                            value={
                                                update_formik.values.update_name
                                            }
                                        />
                                        {update_formik.touched.update_name &&
                                        update_formik.errors.update_name ? (
                                            <span className="error">
                                                {
                                                    update_formik.errors
                                                        .update_name
                                                }
                                            </span>
                                        ) : null}
                                    </div>
                                    <div className="col-12">
                                        <select
                                            className="form-select"
                                            name="update_gender"
                                            onChange={
                                                update_formik.handleChange
                                            }
                                            value={
                                                update_formik.values
                                                    .update_gender
                                            }
                                        >
                                            <option value="1">MALE</option>
                                            <option value="0">FEMALE</option>
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <DatePicker
                                            name="update_birthday"
                                            className="form-control"
                                            dateFormat="MM/dd/yyyy"
                                            selected={
                                                update_formik.values
                                                    .update_birthday
                                            }
                                            onChange={(val) => {
                                                update_formik.setFieldValue(
                                                    "update_birthday",
                                                    val
                                                );
                                            }}
                                            minDate={new Date("01/01/1900")}
                                            maxDate={new Date()}
                                            onBlur={update_formik.handleBlur}
                                        />
                                        {update_formik.touched
                                            .update_birthday &&
                                        update_formik.errors.update_birthday ? (
                                            <span className="error">
                                                {
                                                    update_formik.errors
                                                        .update_birthday
                                                }
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    ref={cancelButton}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Save changes
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default App;
