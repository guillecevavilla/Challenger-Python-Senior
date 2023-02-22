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

/* component */
import AlertMsg from "../../Alert";
/* api */
import { addPeople, modifyPeople, addOficial, modifyOficial } from "../../../services/user.service";

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
  name: yup.string().required(),
});

const PeopleOficialModal = ({
  open,
  onClose,
  onRefresh,
  onOpenSnackBar,
  account,
  userid,
  title,
  typeModal
}) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState({});

  useEffect(() => {
    resetForm();
    resetElements();
    if (account?.id !== undefined && account?.id !== "") {
      loadData();
    }
  }, [open]);
  

  const loadData = () => {
    formik.setFieldValue("email", account?.email);
    formik.setFieldValue("name", account?.name);
    formik.setFieldValue("id", account?.id);
    formik.setFieldValue("document", account?.document);
  };

  const resetElements = (e) => {
    setIsLoading(false);
    setIsOpenAlert(false);
    setMessageAlert({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const onSubmit = async (values) => {
    setIsOpenAlert(false);
    setIsLoading(true);
    let statusL;
    let dataMsg;

    if (typeModal == 1) {
      if (account?.id !== undefined && account?.id !== "") {
        const { status, data } = await modifyPeople(account?.id, values);
        statusL = status;
        dataMsg = data;
      } else {
        delete values.id;
        const { status, data } = await addPeople(values);
        statusL = status;
        dataMsg = data;
      }
    } else {
      if (account?.id !== undefined && account?.id !== "") {
        const { status, data } = await modifyOficial(account?.id, values);
        statusL = status;
        dataMsg = data;
      } else {
        delete values.id;
        values.username = values.document.toString();
        values.rol = 1;
        const { status, data } = await addOficial(values);
        statusL = status;
        dataMsg = data;
      }
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
      setMessageAlert({
        severity: "warning",
        msg: JSON.stringify(dataMsg),
      });
      setIsOpenAlert(true);
      setIsLoading(false);
    }
  };

  const resetForm = async () => {
    formik.handleReset();
  };

  const formik = useFormik({
    initialValues: {
      id: "",
      name: "",
      document: 0,
      email: "",
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
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Nombres"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helpertext={formik.touched.name && formik.errors.name}
                />
              </Grid>
              {typeModal == 1 && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Emaii"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helpertext={formik.touched.email && formik.errors.email}
                  />
                </Grid>
              )}

              {typeModal == 2 && (
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="document"
                    name="document"
                    label="Document"
                    value={formik.values.document}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.document && Boolean(formik.errors.document)
                    }
                    helpertext={
                      formik.touched.document && formik.errors.document
                    }
                  />
                </Grid>
              )}
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

export default PeopleOficialModal;
