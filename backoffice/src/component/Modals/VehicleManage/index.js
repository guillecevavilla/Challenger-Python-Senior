import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  Grid,
  TextField,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useFormik } from "formik";
import * as yup from "yup";
import CircularProgress from "@material-ui/core/CircularProgress";
import Autocomplete from "@material-ui/lab/Autocomplete";

/* component */

import AlertMsg from "../../Alert";
/* api */
import { addVehicle, modifyVehicle } from "../../../services/car.service";
import { takePeople } from "../../../services/user.service";

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: "100%",
  },
  btnActions: {
    margin: "10px",
  },
  buttonProgress: {
    marginLeft: "10px",
  },
}));

const validationSchema = yup.object({
  placa: yup.string().required(),
  color: yup.string().required(),
  branch: yup.string().required(),
  people: yup.string().required(),
});

const VehicleManageModal = ({
  open,
  onClose,
  onRefresh,
  onOpenSnackBar,
  vehicle,
}) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();

  useEffect(() => {
    resetForm();
    if (vehicle?.id !== undefined && vehicle?.id !== "") {
      loadData();
    }
  }, [open]);

  const loadData = () => {
    formik.setFieldValue("placa", vehicle?.placa);
    formik.setFieldValue("id", vehicle?.id);
    formik.setFieldValue("color", vehicle?.color);
    formik.setFieldValue("branch", vehicle?.branch);
    formik.setFieldValue("people", vehicle?.people_data?.id);
    setUsers([vehicle?.people_data]);
    setSelectedUser(vehicle?.people_data);
  };

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async (values) => {
    setIsOpenAlert(false);
    setIsLoading(true);

    let dataL;
    let statusL;
    if (vehicle?.id !== undefined && vehicle?.id !== "") {
      const { status, data } = await modifyVehicle(vehicle?.id, values);
      dataL = data;
      statusL = status;
    } else {
      delete values.id;
      const { status, data } = await addVehicle(values);
      dataL = data;
      statusL = status;
    }
    if (statusL === 200) {
      onOpenSnackBar({
        severity: "success",
        msg: "Actualizado correctamente.",
      });
      setIsLoading(false);
      onRefresh();
      handleClose();
      resetForm();
    } else if (statusL === 201) {
      onOpenSnackBar({ severity: "success", msg: "Agregado correctamente." });
      setIsLoading(false);
      onRefresh();
      handleClose();
      resetForm();
    } else {
      setMessageAlert({ severity: "warning", msg: JSON.stringify(dataL) });
      setIsOpenAlert(true);
      setIsLoading(false);
    }
  };

  const resetForm = async () => {
    formik.handleReset();
  };

  const handleKeyPress = async (value) => {
    const { status, data } = await takePeople("", {
      page_size: 10,
      page: 1,
      search: value,
    });
    if (status == 200) {
      setUsers(data.results);
    }
  };

  const refreshUserFilter = (user) => {
    if (user) {
        setSelectedUser(user);
        formik.setFieldValue("people", user.id);
    }
  };

  const formik = useFormik({
    initialValues: {
      placa: "",
      color: "",
      branch: "",
      people: 0,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth="sm"
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Vehículo</DialogTitle>
        <form encType="multipart/form-data" onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Autocomplete
                  options={users}
                  getOptionLabel={(option) =>
                    `${option.name || ""} ${option.email || ""}`
                  }
                  onChange={(e, v) => {
                    refreshUserFilter(v);
                  }}
                  value={selectedUser}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Buscar persona"
                      placeholder="Buscar persona"
                      margin="normal"
                      fullWidth
                      onChange={(e) => handleKeyPress(e.target.value)}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="placa"
                  name="placa"
                  label="Placa"
                  value={formik.values.placa}
                  onChange={formik.handleChange}
                  error={formik.touched.placa && Boolean(formik.errors.placa)}
                  helpertext={formik.touched.placa && formik.errors.placa}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="color"
                  name="color"
                  label="Color"
                  value={formik.values.color}
                  onChange={formik.handleChange}
                  error={formik.touched.color && Boolean(formik.errors.color)}
                  helpertext={formik.touched.color && formik.errors.color}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="branch"
                  name="branch"
                  label="Marca"
                  value={formik.values.branch}
                  onChange={formik.handleChange}
                  error={formik.touched.branch && Boolean(formik.errors.branch)}
                  helpertext={formik.touched.branch && formik.errors.branch}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions className={classes.btnActions}>
            <Button type="button" onClick={handleClose} color="secondary">
              Cerrar
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Guardar
              {isLoading && (
                <CircularProgress
                  color="secondary"
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </Button>
          </DialogActions>

          {isOpenAlert && (
            <Grid item xs={12}>
              <AlertMsg
                severity={messageAlert.severity}
                msg={messageAlert.msg}
              />
            </Grid>
          )}
          <Divider />
        </form>
      </Dialog>
    </>
  );
};

export default VehicleManageModal;
