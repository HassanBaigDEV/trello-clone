import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { createProject } from '../../../redux/actions/projectActions';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Loader from '../../Loader';
import { PROJECT_CREATE_RESET } from '../../../redux/constants/projectConstants';

const NewProjectModal = ({ open, handleClose }) => {
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();
  const { loading, project, error } = useSelector(
    (state) => state.projectCreate
  );

  const createProjectHandle = () => {
    if (title === '') setTitleError('Cannot be empty');
    else {
      dispatch(createProject(title));
    }
  };

  useEffect(() => {
    if (project) {
      history.push(`/projects/${project._id}`);
      dispatch({ type: PROJECT_CREATE_RESET });
      setTitle('');
      handleClose();
    }
  }, [history, dispatch, setTitle, handleClose, project]);

  const changeHandle = (e) => {
    setTitle(e.target.value);
    setTitleError(false);
  };

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={!loading ? handleClose : undefined}
    >
      <div style={{ width: 600 }}>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <TextField
            name='title'
            type='text'
            label='Title'
            variant='outlined'
            value={title}
            onChange={changeHandle}
            style={{ marginBottom: 10 }}
            fullWidth
            error={Boolean(titleError)}
            helperText={titleError}
          />
        </DialogContent>
        {error && <Alert severity='error'>{error}</Alert>}
        <DialogActions>
          <Button
            onClick={!loading ? handleClose : undefined}
            color='secondary'
          >
            Cancel
          </Button>
          <Button
            onClick={createProjectHandle}
            color='primary'
            disabled={loading}
          >
            Create
            {loading && <Loader button />}
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default NewProjectModal;